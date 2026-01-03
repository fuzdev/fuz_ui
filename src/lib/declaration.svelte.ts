import {
	type DeclarationJson,
	declaration_generate_import,
	declaration_get_display_name,
} from '@fuzdev/svelte-docinfo';

import type {Module} from './module.svelte.js';
import {url_github_file} from './package_helpers.js';

/**
 * Rich runtime representation of an exported declaration.
 */
export class Declaration {
	readonly module: Module = $state.raw()!;
	readonly declaration_json: DeclarationJson = $state.raw()!;

	library = $derived(this.module.library);

	/**
	 * Module path where this declaration is defined.
	 */
	module_path = $derived(this.module.path);

	name = $derived(this.declaration_json.name);
	kind = $derived(this.declaration_json.kind);

	/**
	 * GitHub source URL with line number.
	 */
	url_github = $derived(
		this.library.repo_url && this.declaration_json.source_line
			? url_github_file(
					this.library.repo_url,
					`src/lib/${this.module_path}`,
					this.declaration_json.source_line,
				)
			: undefined,
	);

	/**
	 * API documentation URL.
	 */
	url_api = $derived(`/docs/api/${this.module_path}#${this.name}`);

	/**
	 * Generated TypeScript import statement.
	 */
	import_statement = $derived(
		declaration_generate_import(
			this.declaration_json,
			this.module_path,
			this.library.package_json.name,
		),
	);

	/**
	 * Public documentation link (if homepage_url is available).
	 */
	url_api_full = $derived(
		this.library.homepage_url
			? `${this.library.homepage_url.replace(/\/$/, '')}/docs/api/${this.module_path}#${this.name}`
			: undefined,
	);

	/**
	 * Display name with generic parameters.
	 */
	display_name = $derived(declaration_get_display_name(this.declaration_json));

	type_signature = $derived(this.declaration_json.type_signature);
	doc_comment = $derived(this.declaration_json.doc_comment);
	deprecated_message = $derived(this.declaration_json.deprecated_message);
	parameters = $derived(this.declaration_json.parameters);
	props = $derived(this.declaration_json.props);
	return_type = $derived(this.declaration_json.return_type);
	return_description = $derived(this.declaration_json.return_description);
	generic_params = $derived(this.declaration_json.generic_params);
	extends = $derived(this.declaration_json.extends);
	implements = $derived(this.declaration_json.implements);
	throws = $derived(this.declaration_json.throws);
	since = $derived(this.declaration_json.since);
	examples = $derived(this.declaration_json.examples);
	see_also = $derived(this.declaration_json.see_also);
	members: Array<DeclarationJson> | undefined = $derived(
		this.declaration_json.members as Array<DeclarationJson> | undefined,
	);
	properties: Array<DeclarationJson> | undefined = $derived(
		this.declaration_json.properties as Array<DeclarationJson> | undefined,
	);

	has_examples = $derived(!!(this.examples && this.examples.length > 0));
	is_deprecated = $derived(!!this.deprecated_message);
	has_documentation = $derived(!!this.doc_comment);
	has_parameters = $derived(!!(this.parameters && this.parameters.length > 0));
	has_props = $derived(!!(this.props && this.props.length > 0));
	has_generics = $derived(!!(this.generic_params && this.generic_params.length > 0));

	constructor(module: Module, declaration_json: DeclarationJson) {
		this.module = module;
		this.declaration_json = declaration_json;
	}
}
