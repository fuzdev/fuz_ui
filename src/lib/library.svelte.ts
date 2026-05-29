import type {LibraryJson} from '@fuzdev/fuz_util/library_json.js';
import {ensure_start, strip_end} from '@fuzdev/fuz_util/string.js';

import {create_context} from './context_helpers.js';
import {Declaration} from './declaration.svelte.js';
import {Module} from './module.svelte.js';

export const library_context = create_context<Library>();

/**
 * Normalizes a URL prefix: ensures leading `/`, strips trailing `/`, returns `''` for falsy and non-string values.
 */
export const parse_library_url_prefix = (value: unknown): string => {
	if (!value || typeof value !== 'string') return '';
	return ensure_start(strip_end(value, '/'), '/');
};

/**
 * Rich runtime representation of a library.
 *
 * Wraps `LibraryJson` with computed properties and provides the root
 * of the API documentation hierarchy: `Library` → `Module` → `Declaration`.
 *
 * @see `module.svelte.ts` for `Module` class
 * @see `declaration.svelte.ts` for `Declaration` class
 */
export class Library {
	readonly library_json: LibraryJson = $state.raw()!;

	/**
	 * URL path prefix for multi-package documentation sites.
	 * Prepended to `/docs/api/` paths in `Module.url_api` and `Declaration.url_api`.
	 * Default `''` preserves single-package behavior.
	 */
	readonly url_prefix: string;

	readonly package_json = $derived(this.library_json.package_json);
	readonly source_json = $derived(this.library_json.source_json);

	readonly name = $derived(this.library_json.name);
	readonly repo_name = $derived(this.library_json.repo_name);
	readonly repo_url = $derived(this.library_json.repo_url);
	readonly owner_name = $derived(this.library_json.owner_name);
	readonly homepage_url = $derived(this.library_json.homepage_url);
	readonly logo_url = $derived(this.library_json.logo_url);
	readonly logo_alt = $derived(this.library_json.logo_alt);
	readonly npm_url = $derived(this.library_json.npm_url);
	readonly changelog_url = $derived(this.library_json.changelog_url);
	readonly published = $derived(this.library_json.published);

	/**
	 * Organization URL (e.g., 'https://github.com/ryanatkn').
	 */
	readonly org_url = $derived(
		this.repo_url && this.repo_name
			? this.repo_url.endsWith('/' + this.repo_name)
				? this.repo_url.slice(0, -this.repo_name.length - 1)
				: null
			: null,
	);

	/**
	 * All modules as rich `Module` instances.
	 */
	readonly modules = $derived(
		this.source_json.modules
			? this.source_json.modules.map((module_json) => new Module(this, module_json))
			: [],
	);

	/**
	 * All modules sorted alphabetically by path.
	 */
	readonly modules_sorted = $derived(
		[...this.modules].sort((a, b) => a.path.localeCompare(b.path)),
	);

	/**
	 * All declarations across all modules as a flat array.
	 */
	readonly declarations = $derived(this.modules.flatMap((module) => module.declarations));

	/**
	 * Module lookup map by path. Provides O(1) lookup.
	 */
	readonly module_by_path = $derived(new Map(this.modules.map((m) => [m.path, m])));

	/**
	 * Declaration lookup map by name. Provides O(1) lookup.
	 */
	readonly declaration_by_name = $derived(new Map(this.declarations.map((d) => [d.name, d])));

	constructor(library_json: LibraryJson, url_prefix = '') {
		this.library_json = library_json;
		this.url_prefix = parse_library_url_prefix(url_prefix);
	}

	/**
	 * Look up modules within a directory prefix.
	 * Returns modules whose paths start with `path + "/"`, or `null` if none match.
	 */
	lookup_directory_modules(path: string): Array<Module> | null {
		const prefix = path + '/';
		let result: Array<Module> | null = null;
		for (const m of this.modules_sorted) {
			if (m.path.startsWith(prefix)) {
				(result ??= []).push(m);
			}
		}
		return result;
	}

	/**
	 * Search declarations by query string with multi-term AND logic.
	 */
	search_declarations(query: string): Array<Declaration> {
		return library_search_declarations(this.declarations, query);
	}
}

/**
 * Search declarations by query string with multi-term AND logic.
 */
const library_search_declarations = (
	declarations: Array<Declaration>,
	query: string,
): Array<Declaration> => {
	if (!query.trim()) return [];

	const terms = query.trim().toLowerCase().split(/\s+/);

	const results = declarations
		.map((declaration) => {
			let total_score = 0;

			for (const term of terms) {
				const name_score = library_score_match(declaration.name, term);
				const kind_score = library_score_match(declaration.kind, term);
				const module_score = library_score_match(declaration.module_path, term);

				const term_best = Math.max(name_score, kind_score, module_score);

				if (term_best === 0) {
					return null;
				}

				total_score += term_best;
			}

			return {declaration, score: total_score};
		})
		.filter((r) => r !== null)
		.sort((a, b) => b.score - a.score || a.declaration.name.localeCompare(b.declaration.name))
		.map((r) => r.declaration);

	return results;
};

/**
 * Score a search term match against a field value.
 */
const library_score_match = (field_value: string, term: string): number => {
	const field_lower = field_value.toLowerCase();

	if (field_lower === term) return 100;
	if (field_lower.startsWith(term)) return 80;
	if (field_lower.includes(term)) return 60;

	let term_idx = 0;
	for (const char of field_lower) {
		if (char === term[term_idx]) {
			term_idx++;
			if (term_idx === term.length) {
				return 40;
			}
		}
	}

	return 0;
};
