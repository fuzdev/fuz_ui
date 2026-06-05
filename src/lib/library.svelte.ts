import type {LibraryJson} from '@fuzdev/fuz_util/library_json.js';
import {ensure_start, strip_end} from '@fuzdev/fuz_util/string.js';
import type {Url} from '@fuzdev/fuz_util/url.js';

import {create_context} from './context_helpers.js';
import {Declaration} from './declaration.svelte.js';
import {Module} from './module.svelte.js';
import {
	package_is_published,
	repo_name_parse,
	repo_url_github_owner,
	repo_url_parse,
	url_github_file,
	url_logo,
	url_npm_package,
} from '@fuzdev/fuz_util/package_helpers.js';

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

	readonly pkg_json = $derived(this.library_json.pkg_json);
	readonly source_json = $derived(this.library_json.source_json);

	// Everything below is derived from `pkg_json` — `LibraryJson` stores only the
	// raw `pkg_json`/`source_json` pair, so derivation lives in exactly one place.
	readonly name = $derived(this.pkg_json.name);
	readonly repo_name = $derived(repo_name_parse(this.pkg_json.name));
	/** Non-null — the constructor rejects a `pkg_json` without a parseable `repository`. */
	readonly repo_url: Url = $derived(repo_url_parse(this.pkg_json.repository)!);
	readonly owner_name = $derived(repo_url_github_owner(this.repo_url));
	readonly homepage_url: Url | null = $derived(this.pkg_json.homepage ?? null);
	readonly logo_url: Url | null = $derived(url_logo(this.homepage_url, this.pkg_json.logo));
	readonly logo_alt = $derived(this.pkg_json.logo_alt ?? `logo for ${this.repo_name}`);
	readonly published = $derived(package_is_published(this.pkg_json));
	readonly npm_url: Url | null = $derived(this.published ? url_npm_package(this.name) : null);
	readonly changelog_url: Url | null = $derived(
		this.published ? url_github_file(this.repo_url, 'CHANGELOG.md') : null,
	);

	/**
	 * Organization URL (e.g., 'https://github.com/ryanatkn'), built from `owner_name`.
	 */
	readonly org_url = $derived(this.owner_name ? 'https://github.com/' + this.owner_name : null);

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
		// `repo_url` is exposed non-null and several derived URLs depend on it, so
		// fail loud here rather than letting a missing/unparseable repository surface
		// as a downstream `null`.
		if (repo_url_parse(library_json.pkg_json.repository) === null) {
			throw Error(
				`failed to construct Library - pkg_json for "${library_json.pkg_json.name}" has no parseable \`repository\``,
			);
		}
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
