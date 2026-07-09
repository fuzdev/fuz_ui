import type {
	ModuleJsonInput,
	ReExportJsonInput,
	ExternalReExportJsonInput,
} from 'svelte-docinfo/types.js';

import {Declaration, field_nodes} from './declaration.svelte.ts';
import type {Library} from './library.svelte.ts';
import {url_github_file} from '@fuzdev/fuz_util/package_helpers.ts';

/**
 * Groups entries by a string key, with groups sorted by key. Entries within
 * each group keep their input order.
 */
const group_sorted = <T>(
	entries: Array<T>,
	get_key: (entry: T) => string,
): Map<string, Array<T>> => {
	const by_key: Map<string, Array<T>> = new Map();
	for (const entry of entries) {
		const key = get_key(entry);
		let group = by_key.get(key);
		if (!group) {
			group = [];
			by_key.set(key, group);
		}
		group.push(entry);
	}
	return new Map([...by_key].sort(([a], [b]) => a.localeCompare(b)));
};

/**
 * Rich runtime representation of a module with computed properties.
 *
 * Wraps svelte-docinfo's `ModuleJson` with reactive derivations,
 * URL generation, and `Declaration` instances.
 *
 * @see {@link https://github.com/ryanatkn/svelte-docinfo svelte-docinfo} for the analysis library
 * @see `declaration.svelte.ts` for the `Declaration` wrapper class
 */
export class Module {
	readonly library: Library = $state.raw()!;
	// The `virtual:svelte-docinfo` module is compacted (svelte-docinfo's
	// `compactReplacer` strips empty default arrays), so the runtime data is the
	// `*Input` shape. Typing it as input makes TypeScript force guards on
	// defaulted-array reads.
	readonly module_json: ModuleJsonInput = $state.raw()!;

	/**
	 * Canonical module path — `src/lib/`-relative, with source extension
	 * (`.ts`, `.svelte`, etc.). Examples: `'Alert.ts'`, `'helpers/foo.ts'`,
	 * `'actions/composables.ts'`.
	 *
	 * This is the key `Library.module_by_path` indexes, so it's also the
	 * exact string TSDoc backtick references must use to auto-link to a
	 * module via `DocsLink.svelte` (e.g., `` `actions/composables.ts` ``).
	 * A leading `./` or a `.js` runtime extension will not match. Top-level
	 * files match by bare filename; nested files require the full sub-path.
	 */
	path = $derived(this.module_json.path);

	/**
	 * Import-style path with ./ prefix.
	 */
	path_import = $derived('./' + this.path);

	module_comment = $derived(this.module_json.moduleComment);

	// Build-time pre-parsed tree for `module_comment` (the `moduleCommentNodes`
	// sibling from `vite_plugin_docs_mdz`); `undefined` when the plugin didn't run
	// or the comment was empty, so `DocMdz` falls back to the raw string.
	module_comment_nodes = $derived(field_nodes(this.module_json, 'moduleComment'));

	/**
	 * Array of `Declaration` instances. Filters out default exports.
	 */
	declarations = $derived(
		(this.module_json.declarations ?? [])
			.filter((declaration_json) => declaration_json.name !== 'default')
			.map((declaration_json) => new Declaration(this, declaration_json)),
	);

	/**
	 * API documentation URL for this module.
	 */
	url_api = $derived(`/docs/api${this.library.url_prefix}/${this.path}`);

	/**
	 * Public documentation link (if `homepage_url` is available).
	 *
	 * Absolute URL into the library's own deployed docs, for rendering a
	 * foreign library's modules on a different site (e.g. an aggregator).
	 */
	url_api_full = $derived(
		this.library.homepage_url
			? `${this.library.homepage_url.replace(/\/$/, '')}/docs/api/${this.path}`
			: undefined,
	);

	/**
	 * GitHub source URL.
	 */
	url_github = $derived(
		this.library.repo_url
			? url_github_file(this.library.repo_url, `src/lib/${this.path}`)
			: undefined,
	);

	/**
	 * Whether the module has renderable declarations (after the default-export
	 * filter in `declarations`).
	 */
	has_declarations: boolean = $derived(this.declarations.length > 0);

	has_module_comment: boolean = $derived(!!this.module_comment);

	/**
	 * Modules this imports (paths relative to src/lib).
	 */
	dependencies = $derived(this.module_json.dependencies ?? []);

	/**
	 * Modules that import this (paths relative to src/lib).
	 */
	dependents = $derived(this.module_json.dependents ?? []);

	has_dependencies: boolean = $derived(this.dependencies.length > 0);

	has_dependents: boolean = $derived(this.dependents.length > 0);

	/**
	 * Same-name re-export edges in this module's source (`ModuleJson.reExports`)
	 * — the forward view of declarations' `alsoExportedFrom`, sorted by name
	 * then module. Renamed re-exports appear as declarations with `aliasOf`
	 * instead, and star exports in `star_exports`.
	 */
	re_exports = $derived(this.module_json.reExports ?? []);

	has_re_exports: boolean = $derived(this.re_exports.length > 0);

	/**
	 * Modules fully re-exported via `export * from './module'`
	 * (`ModuleJson.starExports`), in source order. Star-projected symbols are
	 * not materialized as declarations or `re_exports` edges — this is their
	 * sole encoding.
	 */
	star_exports = $derived(this.module_json.starExports ?? []);

	has_star_exports: boolean = $derived(this.star_exports.length > 0);

	/**
	 * Re-export edges grouped by canonical module path, groups sorted by path.
	 * Entries within each group keep their name-sorted serialized order.
	 */
	re_exports_by_module: Map<string, Array<ReExportJsonInput>> = $derived(
		group_sorted(this.re_exports, (entry) => entry.module),
	);

	/**
	 * Re-exports whose immediate target is an external package
	 * (`ModuleJson.externalReExports`) — `export {x} from 'pkg'` and
	 * `export * as ns from 'pkg'` forms, sorted by name then specifier.
	 */
	external_re_exports = $derived(this.module_json.externalReExports ?? []);

	has_external_re_exports: boolean = $derived(this.external_re_exports.length > 0);

	/**
	 * External re-exports grouped by package specifier, groups sorted by
	 * specifier. Entries within each group keep their name-sorted serialized
	 * order.
	 */
	external_re_exports_by_specifier: Map<string, Array<ExternalReExportJsonInput>> = $derived(
		group_sorted(this.external_re_exports, (entry) => entry.specifier),
	);

	/**
	 * External packages fully re-exported via `export * from 'pkg'`
	 * (`ModuleJson.externalStarExports`), in source order. The projected
	 * names are unknown — the package isn't analyzed.
	 */
	external_star_exports = $derived(this.module_json.externalStarExports ?? []);

	has_external_star_exports: boolean = $derived(this.external_star_exports.length > 0);

	/**
	 * Whether the module re-exports anything in any form — same-name edges,
	 * star exports, or the external variants of both.
	 */
	has_any_re_exports: boolean = $derived(
		this.has_re_exports ||
			this.has_star_exports ||
			this.has_external_re_exports ||
			this.has_external_star_exports,
	);

	constructor(library: Library, module_json: ModuleJsonInput) {
		this.library = library;
		this.module_json = module_json;
	}

	/**
	 * Look up a declaration by name within this module.
	 */
	get_declaration_by_name(name: string): Declaration | undefined {
		return this.declarations.find((d) => d.name === name);
	}
}
