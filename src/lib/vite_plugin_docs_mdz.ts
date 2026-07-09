/**
 * Vite plugin that pre-parses the markdown-bearing fields of
 * `virtual:svelte-docinfo` at build time, so the API-docs pages render
 * pre-parsed `MdzNode` trees instead of calling `mdz_parse` on every `<Mdz>`
 * mount in the client.
 *
 * A docs module page mounts tens–100+ `<Mdz>` instances (one per declaration
 * doc comment, per `@param`/`@returns` description, per `@example`, per
 * `@see`), each of which parses its markdown string on hydration *and* on every
 * client-side navigation (the `virtual:svelte-docinfo` payload is bundled into
 * the client chunk via `library.ts`'s top-level import under `prerender` +
 * `adapter-static`). This plugin moves that parse to build time.
 *
 * It runs as a `transform` on svelte-docinfo's own resolved virtual module —
 * *not* a separate derived module — so HMR needs no extra wiring: when
 * svelte-docinfo invalidates `virtual:svelte-docinfo` on a source change, Vite
 * re-runs its `load` and then this `transform` with the fresh data.
 *
 * **Sibling, not replace.** For each markdown string field (`docComment`,
 * `description`, `returnDescription`, `moduleComment`) it adds a `*Nodes` sibling
 * (`docCommentNodes: MdzNode[]`, …); for the string-array fields it adds
 * `examplesNodes: MdzNode[][]` and `seeAlsoNodes: MdzNode[][]` (the latter via
 * `mdz_from_tsdoc`, matching the runtime `<Mdz content={mdz_from_tsdoc(ref)}>`).
 * The raw strings stay, so nothing that reads them as strings breaks; the trade
 * is payload size (pre-parsed JSON runs ~3–5× the raw string for a typical doc
 * comment, and higher for short one-line fields, where the per-node
 * `type`/`start`/`end` bookkeeping dominates) for client parse CPU.
 * `declaration.svelte.ts` surfaces the `*Nodes` fields and
 * `DeclarationDetail.svelte` passes them to `<Mdz nodes={…}>`.
 *
 * Registered after `svelte_docinfo()` in `vite.config.ts`.
 *
 * @module
 */

import type {Plugin} from 'vite';
import {mdz_parse, type MdzNode} from '@fuzdev/mdz/mdz.js';
import {mdz_from_tsdoc} from '@fuzdev/mdz/tsdoc_mdz.js';

/** svelte-docinfo's resolved virtual id (the `\0` marker is Rollup's "mine"). */
const RESOLVED_DOCINFO_ID = '\0virtual:svelte-docinfo';

/**
 * Markdown string fields — each gains a `${key}Nodes: MdzNode[]` sibling. Must
 * cover every markdown string field rendered through `DocMdz`/`<Mdz>`:
 * `docComment`/`description`/`returnDescription` (declarations, params, props,
 * members, overloads — `DeclarationDetail.svelte`) plus `moduleComment` (module
 * docs — `ApiModule.svelte`). A field rendered but missing here isn't broken —
 * it silently falls back to runtime parsing; a field here but never rendered is
 * wasted payload. `propertyDescriptions` is deliberately absent: nothing renders
 * it as markdown.
 */
const MARKDOWN_STRING_KEYS = new Set([
	'docComment',
	'description',
	'returnDescription',
	'moduleComment',
]);
/** Markdown string-array fields — each gains a `${key}Nodes: MdzNode[][]` sibling. */
const MARKDOWN_LIST_KEYS = new Set(['examples', 'seeAlso']);

/**
 * Recursively copy `value`, adding a pre-parsed `*Nodes` sibling next to every
 * markdown-bearing field. Handles arbitrary nesting (modules → declarations →
 * parameters/props/overloads/members) without hard-coding paths — the field
 * names are the same at every level. Which fields carry markdown is implicitly
 * shared with the reader (`DeclarationDetail.svelte`); a field rendered there
 * but missing here simply falls back to runtime parsing via `DocMdz`.
 */
const augment = (value: unknown): unknown => {
	if (Array.isArray(value)) return value.map(augment);
	if (value === null || typeof value !== 'object') return value;
	const out: Record<string, unknown> = {};
	for (const [key, v] of Object.entries(value)) {
		out[key] = augment(v);
		if (MARKDOWN_STRING_KEYS.has(key) && typeof v === 'string' && v.length > 0) {
			out[`${key}Nodes`] = mdz_parse(v);
		} else if (MARKDOWN_LIST_KEYS.has(key) && Array.isArray(v) && v.length > 0) {
			// `seeAlso` refs go through the `@see` bridge first, matching the
			// runtime `<Mdz content={mdz_from_tsdoc(ref)}>`
			const to_tree =
				key === 'seeAlso'
					? (s: string): Array<MdzNode> => mdz_parse(mdz_from_tsdoc(s))
					: (s: string): Array<MdzNode> => mdz_parse(s);
			out[`${key}Nodes`] = (v as Array<string>).map(to_tree);
		}
	}
	return out;
};

/**
 * Creates the docs-mdz pre-parse plugin. Zero-config; register it *after*
 * `svelte_docinfo()` so this transform sees the loaded virtual module.
 */
export const vite_plugin_docs_mdz = (): Plugin => ({
	name: 'vite-plugin-docs-mdz',
	// run before core JS transforms so we see svelte-docinfo's raw module source
	enforce: 'pre',
	transform(code, id) {
		if (id !== RESOLVED_DOCINFO_ID) return undefined;
		// svelte-docinfo's `load` emits `export const modules = <json>;\nexport
		// const diagnostics = …`. Slice out the `modules` JSON by those anchors —
		// index-based, not a regex, so string values containing `;` are safe. The
		// end anchor carries a real newline, which JSON escapes to `\n` inside
		// string values, so it can only match between the emitted statements —
		// doc-comment content can't spoof it.
		const prefix = 'export const modules = ';
		const json_start = code.indexOf(prefix);
		const value_start = json_start === -1 ? -1 : json_start + prefix.length;
		const value_end =
			value_start === -1 ? -1 : code.indexOf(';\nexport const diagnostics =', value_start);
		if (value_end === -1) {
			// Anchors gone → svelte-docinfo changed its emitted module shape. Warn
			// (don't fail the build) so the drift is visible; the docs still render,
			// parsing markdown at runtime via `DocMdz`'s fallback.
			this.warn(
				'could not locate the `modules` export in virtual:svelte-docinfo; ' +
					'markdown will be parsed at runtime. svelte-docinfo may have changed its module format.',
			);
			return undefined;
		}
		try {
			const modules = JSON.parse(code.slice(value_start, value_end));
			const augmented = JSON.stringify(augment(modules));
			return {code: code.slice(0, value_start) + augmented + code.slice(value_end), map: null};
		} catch (err) {
			// A malformed slice or an unexpected mdz_parse failure degrades to
			// runtime parsing rather than breaking the build.
			this.warn(
				`failed to pre-parse markdown fields (${(err as Error).message}); parsing at runtime.`,
			);
			return undefined;
		}
	},
});
