import type {
	DeclarationJson,
	DeclarationJsonInput,
	MemberJsonInput,
	ParameterJsonInput,
	ComponentPropJsonInput,
	OverloadJsonInput,
	Reactivity
} from 'svelte-docinfo/types.js';
import { generateImport, getDisplayName } from 'svelte-docinfo/declaration-helpers.js';

import type { Module } from './module.svelte.ts';
import { url_github_file } from '@fuzdev/fuz_util/package_helpers.ts';

// The `virtual:svelte-docinfo` module is serialized with svelte-docinfo's
// `compactReplacer`, which strips empty default arrays — so the runtime data
// is the `*Input` shape (defaulted arrays optional), not the parsed `*Json`
// shape. Typing it as input makes TypeScript force a guard on every
// defaulted-array read.
//
// Helper to access kind-specific fields on the discriminated union.
// At runtime the field is present or undefined; TypeScript needs the cast.
const field = <T>(decl: DeclarationJsonInput, key: string): T | undefined =>
	(decl as Record<string, unknown>)[key] as T | undefined;

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
	readonly declaration_json: DeclarationJsonInput = $state.raw()!;

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
					this.declaration_json.sourceLine
				)
			: undefined
	);

	/**
	 * API documentation URL.
	 */
	url_api = $derived(`/docs/api${this.library.url_prefix}/${this.module_path}#${this.name}`);

	/**
	 * Generated TypeScript import statement.
	 */
	import_statement = $derived(
		// `generateImport` reads only `name`/`kind`/path, none of the defaulted
		// arrays, so asserting the parsed shape here is sound.
		generateImport(
			this.declaration_json as DeclarationJson,
			this.module_path,
			this.library.pkg_json.name
		)
	);

	/**
	 * Public documentation link (if homepage_url is available).
	 */
	url_api_full = $derived(
		this.library.homepage_url
			? `${this.library.homepage_url.replace(/\/$/, '')}/docs/api/${this.module_path}#${this.name}`
			: undefined
	);

	/**
	 * Display name with generic parameters.
	 */
	// `getDisplayName` reads `genericParams` unguarded, so feed it the defaulted
	// value rather than the raw (possibly-absent) input field.
	display_name = $derived(
		getDisplayName({
			...this.declaration_json,
			genericParams: this.declaration_json.genericParams ?? []
		} as DeclarationJson)
	);

	type_signature = $derived(this.declaration_json.typeSignature);
	doc_comment = $derived(this.declaration_json.docComment);
	deprecated_message = $derived(this.declaration_json.deprecatedMessage);
	parameters = $derived(field<Array<ParameterJsonInput>>(this.declaration_json, 'parameters'));
	props = $derived(field<Array<ComponentPropJsonInput>>(this.declaration_json, 'props'));
	return_type = $derived(field<string>(this.declaration_json, 'returnType'));
	return_description = $derived(field<string>(this.declaration_json, 'returnDescription'));
	generic_params = $derived(this.declaration_json.genericParams ?? []);
	extends_type = $derived(field<string | Array<string>>(this.declaration_json, 'extends'));
	implements_types = $derived(field<Array<string>>(this.declaration_json, 'implements'));
	throws = $derived(this.declaration_json.throws ?? []);
	since = $derived(this.declaration_json.since);
	examples = $derived(this.declaration_json.examples ?? []);
	see_also = $derived(this.declaration_json.seeAlso ?? []);
	/**
	 * Nested members for classes, interfaces, types, and enums.
	 */
	members = $derived(field<Array<MemberJsonInput>>(this.declaration_json, 'members'));

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
	overloads = $derived(field<Array<OverloadJsonInput>>(this.declaration_json, 'overloads'));

	/**
	 * Re-export alias info when this declaration is a renamed re-export.
	 */
	alias_of = $derived(this.declaration_json.aliasOf);

	/**
	 * Other modules that also export this declaration (re-export paths
	 * relative to src/lib). Absent when only exported from its defining module.
	 * The back-link of those modules' `Module.re_exports` edges.
	 */
	also_exported_from = $derived(this.declaration_json.alsoExportedFrom);

	/**
	 * Mutation documentation from `@mutates` tags, mapping parameter names to descriptions.
	 */
	mutates = $derived(this.declaration_json.mutates);

	/**
	 * Svelte reactivity flavor (`$state`, `$state.raw`, `$derived`, `$derived.by`)
	 * when this variable is initialized with a value-producing rune.
	 * Present on `variable` kind only.
	 */
	reactivity = $derived(field<Reactivity>(this.declaration_json, 'reactivity'));

	has_examples = $derived(this.examples.length > 0);
	// presence, not truthiness — a bare `@deprecated` (no message text) arrives as `''`
	is_deprecated = $derived(this.deprecated_message !== undefined);
	has_documentation = $derived(!!this.doc_comment);
	has_parameters = $derived(!!(this.parameters && this.parameters.length > 0));
	has_props = $derived(!!(this.props && this.props.length > 0));
	has_generics = $derived(this.generic_params.length > 0);

	constructor(module: Module, declaration_json: DeclarationJsonInput) {
		this.module = module;
		this.declaration_json = declaration_json;
	}
}
