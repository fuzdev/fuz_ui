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
 * `description`, `returnDescription`) it adds a `*Nodes` sibling
 * (`docCommentNodes: MdzNode[]`, …); for the string-array fields it adds
 * `examplesNodes: MdzNode[][]` and `seeAlsoNodes: MdzNode[][]` (the latter via
 * `mdz_from_tsdoc`, matching the runtime `<Mdz content={mdz_from_tsdoc(ref)}>`).
 * The raw strings stay, so nothing that reads them as strings breaks; the trade
 * is payload size (pre-parsed JSON is ~2–5× the raw string) for client parse
 * CPU. `declaration.svelte.ts` surfaces the `*Nodes` fields and
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

/** String fields whose value is markdown — each gains a `${key}Nodes` sibling. */
const MARKDOWN_STRING_KEYS = new Set(['docComment', 'description', 'returnDescription']);

/**
 * Recursively copy `value`, adding pre-parsed `*Nodes` siblings next to every
 * markdown-bearing field. Handles arbitrary nesting (modules → declarations →
 * parameters/props/overloads/members) without hard-coding paths — the field
 * names are the same at every level.
 */
const augment = (value: unknown): unknown => {
	if (Array.isArray(value)) return value.map(augment);
	if (value === null || typeof value !== 'object') return value;
	const obj = value as Record<string, unknown>;
	const out: Record<string, unknown> = {};
	for (const [key, v] of Object.entries(obj)) {
		out[key] = augment(v);
		if (MARKDOWN_STRING_KEYS.has(key) && typeof v === 'string' && v.length > 0) {
			out[`${key}Nodes`] = mdz_parse(v);
		}
	}
	// `examples: string[]` → `examplesNodes: MdzNode[][]`
	if (Array.isArray(obj.examples) && obj.examples.length > 0) {
		out.examplesNodes = (obj.examples as Array<string>).map((s): Array<MdzNode> => mdz_parse(s));
	}
	// `seeAlso: string[]` → `seeAlsoNodes: MdzNode[][]`, via the same `@see`
	// bridge the runtime uses (`<Mdz content={mdz_from_tsdoc(ref)}>`)
	if (Array.isArray(obj.seeAlso) && obj.seeAlso.length > 0) {
		out.seeAlsoNodes = (obj.seeAlso as Array<string>).map((s): Array<MdzNode> =>
			mdz_parse(mdz_from_tsdoc(s)),
		);
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
		// index-based, not a regex, so string values containing `;` are safe.
		const prefix = 'export const modules = ';
		const json_start = code.indexOf(prefix);
		if (json_start === -1) return undefined; // unexpected shape — leave untouched
		const value_start = json_start + prefix.length;
		const value_end = code.indexOf(';\nexport const diagnostics =', value_start);
		if (value_end === -1) return undefined;

		let modules: unknown;
		try {
			modules = JSON.parse(code.slice(value_start, value_end));
		} catch {
			return undefined; // not the JSON shape we expect
		}
		const augmented = JSON.stringify(augment(modules));
		return {
			code: code.slice(0, value_start) + augmented + code.slice(value_end),
			map: null,
		};
	},
});
