import type {ModuleJson} from '@fuzdev/fuz_util/source_json.js';

import {Declaration} from './declaration.svelte.js';
import type {Library} from './library.svelte.js';
import {url_github_file} from './package_helpers.js';

/**
 * Rich runtime representation of a module with computed properties.
 */
export class Module {
	readonly library: Library = $state.raw()!;
	readonly module_json: ModuleJson = $state.raw()!;

	/**
	 * Canonical module path (e.g., 'Alert.ts', 'helpers/foo.ts').
	 */
	path = $derived(this.module_json.path);

	/**
	 * Import-style path with ./ prefix.
	 */
	path_import = $derived('./' + this.path);

	module_comment = $derived(this.module_json.module_comment);

	/**
	 * Array of Declaration instances. Filters out default exports.
	 */
	declarations = $derived(
		this.module_json.declarations
			? this.module_json.declarations
					.filter((declaration_json) => declaration_json.name !== 'default')
					.map((declaration_json) => new Declaration(this, declaration_json))
			: [],
	);

	/**
	 * API documentation URL for this module.
	 */
	url_api = $derived(`/docs/api/${this.path}`);

	/**
	 * GitHub source URL.
	 */
	url_github = $derived(
		this.library.repo_url
			? url_github_file(this.library.repo_url, `src/lib/${this.path}`)
			: undefined,
	);

	has_declarations: boolean = $derived(
		!!(this.module_json.declarations && this.module_json.declarations.length > 0),
	);

	has_module_comment: boolean = $derived(!!this.module_json.module_comment);

	/**
	 * Modules this imports (paths relative to src/lib).
	 */
	dependencies = $derived(this.module_json.dependencies);

	/**
	 * Modules that import this (paths relative to src/lib).
	 */
	dependents = $derived(this.module_json.dependents);

	constructor(library: Library, module_json: ModuleJson) {
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
