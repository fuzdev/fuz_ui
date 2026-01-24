import type {Declaration} from './declaration.svelte.js';
import type {Library} from './library.svelte.js';
import type {Module} from './module.svelte.js';

export interface DeclarationSearchState {
	query: string;
	all: Array<Declaration>;
	filtered: Array<Declaration>;
}

export interface ApiSearchState {
	query: string;
	modules: {
		all: Array<Module>;
		filtered: Array<Module>;
	};
	declarations: {
		all: Array<Declaration>;
		filtered: Array<Declaration>;
	};
}

/**
 * Creates unified search state for the API index page (modules and declarations).
 */
export const create_api_search = (library: Library): ApiSearchState => {
	let query = $state('');

	// Module filtering
	const all_modules = $derived(library.modules_sorted);
	const filtered_modules = $derived.by(() => {
		if (!query.trim()) return all_modules;
		const terms = query.trim().toLowerCase().split(/\s+/);
		return all_modules.filter((m) => {
			const path_lower = m.path.toLowerCase();
			const comment_lower = m.module_comment?.toLowerCase() ?? '';
			return terms.every((term) => path_lower.includes(term) || comment_lower.includes(term));
		});
	});

	// Declaration filtering
	const all_declarations = $derived(library.declarations);
	const filtered_declarations = $derived.by(() => {
		const items = query.trim() ? library.search_declarations(query) : all_declarations;
		return items.sort((a, b) => a.name.localeCompare(b.name));
	});

	return {
		get query() {
			return query;
		},
		set query(v: string) {
			query = v;
		},
		modules: {
			get all() {
				return all_modules;
			},
			get filtered() {
				return filtered_modules;
			},
		},
		declarations: {
			get all() {
				return all_declarations;
			},
			get filtered() {
				return filtered_declarations;
			},
		},
	};
};

/**
 * Creates search state for module-specific declaration lists.
 */
export const create_module_declaration_search = (
	declarations: Array<Declaration>,
): DeclarationSearchState => {
	let query = $state('');

	const all = $derived(declarations);

	const filtered = $derived.by(() => {
		const trimmed_query = query.trim();
		if (!trimmed_query) return all.sort((a, b) => a.name.localeCompare(b.name));

		const terms = trimmed_query.toLowerCase().split(/\s+/);

		const items = all.filter((d) => {
			const name_lower = d.name.toLowerCase();
			const kind_lower = d.kind.toLowerCase();
			const module_path_lower = d.module_path.toLowerCase();

			return terms.every(
				(term) =>
					name_lower.includes(term) ||
					kind_lower.includes(term) ||
					module_path_lower.includes(term),
			);
		});

		return items.sort((a, b) => a.name.localeCompare(b.name));
	});

	return {
		get query() {
			return query;
		},
		set query(v: string) {
			query = v;
		},
		get all() {
			return all;
		},
		get filtered() {
			return filtered;
		},
	};
};
