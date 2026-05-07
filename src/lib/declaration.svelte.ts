import type {
	DeclarationJson,
	MemberJson,
	ParameterInfo,
	ComponentPropInfo,
	OverloadInfo,
} from 'svelte-docinfo/types.js';
import {generateImport, getDisplayName} from 'svelte-docinfo/declaration-helpers.js';

import type {Module} from './module.svelte.js';
import {url_github_file} from './package_helpers.js';

// Helper to access kind-specific fields on the discriminated union.
// At runtime the field is present or undefined; TypeScript needs the cast.
const field = <T>(decl: DeclarationJson, key: string): T | undefined =>
	(decl as Record<string, unknown>)[key] as T | undefined;

/* eslint-disable @typescript-eslint/no-deprecated */

/**
 * Rich runtime representation of an exported declaration.
 *
 * Wraps svelte-docinfo's `DeclarationJson` discriminated union (on `kind`)
 * with Svelte 5 reactive derivations and computed URLs.
 * Kind-specific fields are accessed via the `field()` helper since
 * not all fields exist on all variants.
 *
 * @see {@link https://github.com/ryanatkn/svelte-docinfo svelte-docinfo} for the analysis library
 * @see `DeclarationDetail.svelte` for the rendering component
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
		this.library.repo_url && this.declaration_json.sourceLine
			? url_github_file(
					this.library.repo_url,
					`src/lib/${this.module_path}`,
					this.declaration_json.sourceLine,
				)
			: undefined,
	);

	/**
	 * API documentation URL.
	 */
	url_api = $derived(`/docs/api${this.library.url_prefix}/${this.module_path}#${this.name}`);

	/**
	 * Generated TypeScript import statement.
	 */
	import_statement = $derived(
		generateImport(this.declaration_json, this.module_path, this.library.package_json.name),
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
	display_name = $derived(getDisplayName(this.declaration_json));

	type_signature = $derived(this.declaration_json.typeSignature);
	doc_comment = $derived(this.declaration_json.docComment);
	deprecated_message = $derived(this.declaration_json.deprecatedMessage);
	parameters = $derived(field<Array<ParameterInfo>>(this.declaration_json, 'parameters'));
	props = $derived(field<Array<ComponentPropInfo>>(this.declaration_json, 'props'));
	return_type = $derived(field<string>(this.declaration_json, 'returnType'));
	return_description = $derived(field<string>(this.declaration_json, 'returnDescription'));
	generic_params = $derived(this.declaration_json.genericParams);
	extends_type = $derived(field<string | Array<string>>(this.declaration_json, 'extends'));
	implements_types = $derived(field<Array<string>>(this.declaration_json, 'implements'));
	throws = $derived(this.declaration_json.throws);
	since = $derived(this.declaration_json.since);
	examples = $derived(this.declaration_json.examples);
	see_also = $derived(this.declaration_json.seeAlso);
	/**
	 * Nested members for classes, interfaces, types, and enums.
	 */
	members = $derived(field<Array<MemberJson>>(this.declaration_json, 'members'));

	/**
	 * Intersection types whose properties are external (filtered out of props/members).
	 * Present on `component` and `type` kinds.
	 */
	intersects = $derived(field<Array<string>>(this.declaration_json, 'intersects'));

	/**
	 * Whether a component accepts children via props or template usage.
	 * Present on `component` kind only.
	 */
	accepts_children = $derived(field<boolean>(this.declaration_json, 'acceptsChildren'));

	/**
	 * Function overload signatures when multiple public overloads exist.
	 * Present on `function` and `snippet` kinds, and on function/constructor members.
	 */
	overloads = $derived(field<Array<OverloadInfo>>(this.declaration_json, 'overloads'));

	/**
	 * Re-export alias info when this declaration is a renamed re-export.
	 */
	alias_of = $derived(this.declaration_json.aliasOf);

	/**
	 * Mutation documentation from `@mutates` tags, mapping parameter names to descriptions.
	 */
	mutates = $derived(this.declaration_json.mutates);

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
