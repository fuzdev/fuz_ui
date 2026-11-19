<!--
@component

Renders the full detail view for an exported declaration.
Handles all svelte-docinfo declaration kinds (function, class, interface,
type, variable, enum, component, snippet) and their kind-specific fields
including parameters, props, CSS custom properties, members, overloads,
external types, and more.

Each field (member, prop, parameter) is headed by its signature in the form
TypeScript declares it, `readonly name?: Type = default`, composed from the
structured data so every type links on its own (see `declaration_detail.ts`).
A function's signature is composed the same way, and a parameter gets a row
of its own only when it has more to say than that signature shows. Where
composing would lose something the data doesn't carry as a field (a type
predicate with no `returnPredicate`, a destructured parameter with no
`pattern`), the flat signature stays. Each rendered field carries its `Declaration.field`
fragment as an `id`.

@see `declaration.svelte.ts` for the `Declaration` wrapper class
@see [svelte-docinfo](https://github.com/fuzdev/svelte-docinfo) for the analysis library
-->
<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';
	import Mdz from '@fuzdev/mdz/Mdz.svelte';
	import { mdz_from_tsdoc } from '@fuzdev/mdz/tsdoc_mdz.ts';
	import {
		mdz_code_context,
		mdz_codeblock_context,
		mdz_set_context_with_fallback
	} from '@fuzdev/mdz/mdz_contexts.ts';
	import type { OverloadJsonInput, ParameterJsonInput, TypeJson } from 'svelte-docinfo/types.js';

	import type { Declaration } from './declaration.svelte.ts';
	import TypeLink from './TypeLink.svelte';
	import TypeJsonView from './TypeJsonView.svelte';
	import ModuleLink from './ModuleLink.svelte';
	import DocsLink from './DocsLink.svelte';
	import Hashlink from './Hashlink.svelte';
	import { section_depth_context } from './TomeSection.svelte';
	import { dedent_continuation_lines } from './helpers.ts';
	import {
		parameter_has_detail,
		prop_is_composable,
		signature_is_composable,
		to_declaration_field_fragment,
		to_default_block,
		to_function_signature_tokens,
		to_member_chip_modifiers,
		to_member_signature_tokens,
		to_parameter_signature_tokens,
		to_prop_signature_tokens,
		type SignatureCallable,
		type SignatureGenericParam,
		type SignatureToken
	} from './declaration_detail.ts';

	const { declaration }: { declaration: Declaration } = $props();

	// headings render through `svelte:element`, so declare the tags for
	// fuz_css extraction
	// @fuz-elements h3 h4 h5 h6 strong

	type HeadingTag = 'h3' | 'h4' | 'h5' | 'h6';

	const to_heading_tag = (level: number): HeadingTag => `h${Math.min(level, 6)}` as HeadingTag;

	// heading levels follow the enclosing `TomeSection`, whose header is the
	// declaration's own heading (`h2` at depth 1, `h3` at 2, `h4` deeper, as
	// `TomeSectionHeader` picks); outside any section they match a module page
	const section_depth = section_depth_context.get();
	const declaration_level = section_depth === 0 ? 3 : Math.min(section_depth + 1, 4);
	/** A section label (`parameters`, `members`). */
	const label_tag = to_heading_tag(declaration_level + 1);
	/** A field's name. */
	const field_tag = to_heading_tag(declaration_level + 2);
	/** A parameter of a field. */
	const nested_tag = to_heading_tag(declaration_level + 3);

	// typed for the `constraintInfo` and `defaultTypeInfo` trees, where the data has them
	const generic_params: Array<SignatureGenericParam> = $derived(declaration.generic_params);

	// functions and snippets get their signature composed from the structured
	// fields, linking each type; a failed extraction, and a signature those
	// fields can't fully express, keep the flat one
	const signature_tokens = $derived.by(() => {
		const { kind } = declaration;
		if ((kind !== 'function' && kind !== 'snippet') || declaration.declaration_json.partial) {
			return undefined;
		}
		const callable: SignatureCallable = {
			typeSignature: declaration.type_signature,
			genericParams: declaration.generic_params,
			parameters: declaration.parameters,
			returnType: declaration.return_type,
			returnTypeInfo: declaration.return_type_info,
			returnPredicate: declaration.return_predicate,
			thisType: declaration.this_type,
			thisTypeInfo: declaration.this_type_info
		};
		return signature_is_composable(callable)
			? to_function_signature_tokens(declaration.name, callable)
			: undefined;
	});

	// the flat signature, where it says something the heading and a composed
	// signature don't — an interface's or enum's is only its own name
	const type_signature_shown = $derived.by(() => {
		const { type_signature } = declaration;
		if (!type_signature || signature_tokens) return undefined;
		if (type_signature === declaration.name || type_signature === declaration.display_name) {
			return undefined;
		}
		return type_signature;
	});

	// a composed signature already shows each parameter's name and type, so
	// only the ones with more to say get a row
	const parameters_shown = $derived(
		signature_tokens ? declaration.parameters?.filter(parameter_has_detail) : declaration.parameters
	);

	// external types not already shown in the inheritance section — on direct
	// heritage (`interface Props extends HTMLButtonAttributes`) the producer
	// deliberately records the same name in both fields, so the external-types
	// section keeps only what heritage doesn't already display
	const external_types_not_inherited = $derived.by(() => {
		const external_types = declaration.external_types;
		if (!external_types?.length) return undefined;
		const heritage = (declaration.extends_types ?? []).concat(declaration.implements_types ?? []);
		const filtered = external_types.filter((t) => !heritage.includes(t));
		return filtered.length ? filtered : undefined;
	});

	// the "inferred" chip marks entries found by a `var()` fallback or an
	// `@property` rule, which only distinguishes anything when the list also
	// has `@cssprop`-documented ones
	const css_property_chips_shown = $derived.by(() => {
		const css_properties = declaration.css_custom_properties;
		if (!css_properties) return false;
		return css_properties.some((p) => p.documented) && css_properties.some((p) => !p.documented);
	});

	// a documented `default` (the tag's claim) and the style's `fallback` are
	// shown as one row when they agree, as the analyzer compares them
	const css_values_agree = (a: string, b: string): boolean =>
		a.replace(/\s+/g, ' ').trim() === b.replace(/\s+/g, ' ').trim();

	// render mdz inline `code` as API-linking `DocsLink` and fenced blocks as syntax-highlighted
	// `Code`, matching the rest of the docs — the injection mdz core leaves open
	mdz_set_context_with_fallback(mdz_code_context, () => DocsLink);
	mdz_set_context_with_fallback(mdz_codeblock_context, () => Code);

	// Optional prose metadata shared by component props and nested members,
	// rendered in a compact form (the top-level declaration uses prominent
	// sections for the same fields instead).
	interface DocExtras {
		deprecatedMessage?: string;
		internalMessage?: string;
		since?: string;
		examples?: Array<string>;
		seeAlso?: Array<string>;
		throws?: Array<{ type?: string; typeInfo?: TypeJson; description: string }>;
		mutates?: Record<string, string>;
	}
</script>

<!-- A signature's tokens, adjacent: spacing lives in the token text, and Svelte
	trims the block-boundary whitespace here (locked by the `DeclarationDetail`
	render tests, where `textContent` equality would catch a stray space). -->
{#snippet signature(tokens: Array<SignatureToken>, name_tag: HeadingTag | 'strong')}
	{#each tokens as token, i (i)}
		{#if token.kind === 'keyword'}
			<span class="text_70">{token.text}</span>
		{:else if token.kind === 'name'}
			<svelte:element this={name_tag} class="signature-name">{token.text}</svelte:element>
		{:else if token.kind === 'type'}
			<TypeLink type={token.type} type_info={token.type_info} />
		{:else if token.kind === 'value'}
			<Code lang="ts" content={token.text} inline />
		{:else}
			{token.text}
		{/if}
	{/each}
{/snippet}

<!-- A function's or overload's signature as a block; `title` keeps the checker's flat rendering reachable on hover. -->
{#snippet signature_block(tokens: Array<SignatureToken>, title: string | undefined)}
	<code class="declaration-signature signature-block" {title}>
		{@render signature(tokens, 'strong')}
	</code>
{/snippet}

<!-- A field's heading line: its signature, any chips, and the hashlink to its `id`. -->
{#snippet field_header(
	tokens: Array<SignatureToken>,
	tag: HeadingTag,
	fragment: string | undefined,
	chips?: Array<string>,
	title?: string
)}
	<div class="field-header mb_sm">
		<div class="flex:1 min-width:0">
			<div class="declaration-signature field-signature" {title}>
				{@render signature(tokens, tag)}
			</div>
			{#if chips}
				{#each chips as chip (chip)}
					<span class="chip ml_sm">{chip}</span>
				{/each}
			{/if}
		</div>
		{#if fragment}
			<Hashlink {fragment} aria-label="link to {fragment}" />
		{/if}
	</div>
{/snippet}

<!-- A default that spans lines, which the signature line leaves out. -->
{#snippet default_block(default_value: string | undefined)}
	{@const block = to_default_block(default_value)}
	{#if block !== undefined}
		<div class="row gap_md mb_md">
			<strong>default</strong>
			<Code lang="ts" content={block} />
		</div>
	{/if}
{/snippet}

<!-- A parameter's own row: signature, description, and documented properties. -->
{#snippet param_field(param: ParameterJsonInput, tag: HeadingTag, fragment: string | undefined)}
	<section>
		{@render field_header(to_parameter_signature_tokens(param), tag, fragment)}
		{@render default_block(param.defaultValue)}
		{#if param.description}
			<Mdz content={param.description} class="mb_md" />
		{/if}
		{#if param.propertyDescriptions}
			<ul>
				{#each Object.entries(param.propertyDescriptions) as [path, description] (path)}
					<li>
						<code>{param.name}{path.startsWith('[') ? '' : '.'}{path}</code
						>{#if description}{' '}— <Mdz content={description} inline />{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</section>
{/snippet}

<!-- What a callable field (method, constructor, callback prop, overload) adds
	beneath its signature: the parameters with more to say, and the `@returns` prose. -->
{#snippet callable_detail(
	parameters: Array<ParameterJsonInput> | undefined,
	return_description: string | undefined,
	tag: HeadingTag,
	fragment_path?: Array<string>
)}
	{@const parameters_with_detail = parameters?.filter(parameter_has_detail)}
	{#if parameters_with_detail?.length}
		<div class="pl_lg my_md">
			{#each parameters_with_detail as param (param)}
				{@render param_field(
					param,
					tag,
					fragment_path &&
						to_declaration_field_fragment(declaration.name, ...fragment_path, param.name)
				)}
			{/each}
		</div>
	{/if}
	{#if return_description}
		<!-- a `div`: the prose can hold block content, which a `p` can't -->
		<div class="mb_md"><strong>returns</strong> <Mdz content={return_description} inline /></div>
	{/if}
{/snippet}

{#snippet throws_list(throws: NonNullable<DocExtras['throws']>)}
	<ul>
		{#each throws as thrown (thrown)}
			<li>
				{#if thrown.type}
					<TypeLink type={thrown.type} type_info={thrown.typeInfo} /> -
					<Mdz content={thrown.description} inline />
				{:else}
					<Mdz content={thrown.description} inline />
				{/if}
			</li>
		{/each}
	</ul>
{/snippet}

{#snippet mutates_list(mutates: Record<string, string>)}
	<ul>
		{#each Object.entries(mutates) as [target, description] (target)}
			<li>
				<code>{target}</code>{#if description}{' '}— <Mdz content={description} inline />{/if}
			</li>
		{/each}
	</ul>
{/snippet}

{#snippet see_also_list(see_also: Array<string>)}
	<ul>
		{#each see_also as ref (ref)}
			<li><Mdz content={mdz_from_tsdoc(ref)} /></li>
		{/each}
	</ul>
{/snippet}

<!-- Every signature of an overloaded function or method, each with its own prose. -->
{#snippet overloads_list(name: string, overloads: Array<OverloadJsonInput>, tag: HeadingTag)}
	{#each overloads as overload, i (i)}
		<section>
			{#if signature_is_composable(overload)}
				{@render signature_block(
					to_function_signature_tokens(name, overload),
					overload.typeSignature
				)}
			{:else}
				<Code lang="ts" content={overload.typeSignature} />
			{/if}
			{#if overload.docComment}
				<Mdz content={overload.docComment} class="mb_md" />
			{/if}
			{@render callable_detail(overload.parameters, overload.returnDescription, tag)}
		</section>
	{/each}
{/snippet}

<!-- Compact prose metadata for props and members (deprecated, internal, since, examples, see also, throws, mutates). -->
{#snippet doc_extras(item: DocExtras)}
	<!-- eslint-disable-next-line @typescript-eslint/no-deprecated -->
	{#if item.deprecatedMessage !== undefined}
		<p class="row gap_md">
			<span class="chip">⚠️ deprecated</span>
			<!-- eslint-disable-next-line @typescript-eslint/no-deprecated -->
			{#if item.deprecatedMessage}{item.deprecatedMessage}{/if}
		</p>
	{/if}
	{#if item.internalMessage !== undefined}
		<p class="row gap_md">
			<span class="chip">internal</span>
			{#if item.internalMessage}{item.internalMessage}{/if}
		</p>
	{/if}
	{#if item.since}
		<p><strong>since</strong> {item.since}</p>
	{/if}
	{#if item.examples?.length}
		{#each item.examples as example (example)}
			<Mdz content={example} />
		{/each}
	{/if}
	{#if item.seeAlso?.length}
		<p><strong>see also</strong></p>
		{@render see_also_list(item.seeAlso)}
	{/if}
	{#if item.throws?.length}
		<p><strong>throws</strong></p>
		{@render throws_list(item.throws)}
	{/if}
	{#if item.mutates && Object.keys(item.mutates).length}
		<p><strong>mutates</strong></p>
		{@render mutates_list(item.mutates)}
	{/if}
{/snippet}

<!-- A comma-separated inline list of type links (extends, implements, external types are rarely more than one).
	`types_info` holds each entry's tree at the same index, where the data has them. -->
{#snippet type_list(types: Array<string>, types_info?: Array<TypeJson>)}
	{#each types as type, i (type)}
		{#if i > 0}
			,
		{/if}<TypeLink {type} type_info={types_info?.[i]} />
	{/each}
{/snippet}

<!-- Metadata -->
<p class="row justify-content:space-between">
	<ModuleLink module_path={declaration.module_path} />
	{#if declaration.url_github}
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a class="chip" href={declaration.url_github} target="_blank" rel="noopener">view source</a>
	{/if}
</p>

<!-- chips -->
<!-- eslint-disable-next-line @typescript-eslint/no-deprecated -->
{#if declaration.is_deprecated ||
	declaration.is_internal ||
	declaration.reactivity ||
	declaration.accepts_children ||
	declaration.merged_value ||
	declaration.alias_of
}
	<p class="row_wrap gap_md">
		<!-- eslint-disable-next-line @typescript-eslint/no-deprecated -->
		{#if declaration.is_deprecated}
			<span class="chip">⚠️ deprecated</span>
		{/if}
		{#if declaration.is_internal}
			<span class="chip">internal</span>
		{/if}
		{#if declaration.reactivity}
			<span class="chip">{declaration.reactivity}</span>
		{/if}
		{#if declaration.accepts_children}
			<span class="chip">accepts children</span>
		{/if}
		{#if declaration.merged_value}
			<span class="chip">value + type</span>
		{/if}
		{#if declaration.alias_of}
			<span class="chip">
				alias of {declaration.alias_of.name}{#if declaration.alias_of.module}
					in {declaration.alias_of.module}
				{/if}
			</span>
		{/if}
	</p>
{/if}

<!-- also exported from -->
{#if declaration.also_exported_from?.length}
	<p class="row_wrap gap_md">
		<strong>also exported from</strong>
		{#each declaration.also_exported_from as module_path (module_path)}
			<ModuleLink {module_path} />
		{/each}
	</p>
{/if}

<!-- eslint-disable-next-line @typescript-eslint/no-deprecated -->
{#if declaration.deprecated_message}
	<p>
		<!-- eslint-disable-next-line @typescript-eslint/no-deprecated -->
		{declaration.deprecated_message}
	</p>
{/if}

{#if declaration.internal_message}
	<p>{declaration.internal_message}</p>
{/if}

<!-- signature: composed for functions and snippets, else the flat one -->
{#if signature_tokens}
	{@render signature_block(signature_tokens, declaration.type_signature)}
{:else if type_signature_shown}
	<Code lang="ts" content={type_signature_shown} />
{/if}

<!-- structured type (variables and type aliases; carries what the flat
	signature lost — union members, recovered alias names — with links);
	`type_info_expanded` strips a self-aliased root so a union alias expands
	into its members here instead of linking circularly to itself -->
{#if declaration.type_info_expanded}
	<p class="row gap_md">
		<strong>type</strong>
		<TypeJsonView type_info={declaration.type_info_expanded} title={declaration.type_signature} />
	</p>
{/if}

<!-- default (top-level variables; params, props, and members carry theirs in their signature) -->
{#if declaration.default_value}
	<p class="row gap_md">
		<strong>default</strong>
		<Code lang="ts" content={declaration.default_value} />
	</p>
{/if}

<!-- documentation -->
{#if declaration.has_documentation}
	<Mdz content={declaration.doc_comment!} class="mb_lg" />
{/if}

<!-- import statement -->
<Code lang="ts" content={declaration.import_statement} />

<!-- parameters -->
{#if parameters_shown?.length}
	<section>
		<svelte:element this={label_tag}>parameters</svelte:element>
		{#each parameters_shown as param (param)}
			{@render param_field(
				param,
				field_tag,
				to_declaration_field_fragment(declaration.name, param.name)
			)}
		{/each}
	</section>
{/if}

<!-- returns: the type is in the signature, so only the `@returns` prose -->
{#if declaration.return_description}
	<section>
		<svelte:element this={label_tag}>returns</svelte:element>
		<Mdz content={declaration.return_description} />
	</section>
{/if}

<!-- component props (for Svelte components) -->
{#if declaration.props?.length}
	<section>
		<svelte:element this={label_tag}>props</svelte:element>
		{#each declaration.props as prop (prop)}
			<section>
				{@render field_header(
					to_prop_signature_tokens(prop),
					field_tag,
					to_declaration_field_fragment(declaration.name, prop.name),
					prop.bindable ? ['bindable'] : undefined,
					// the checker's flat type, where the composed callback replaced it
					prop_is_composable(prop) ? prop.type : undefined
				)}
				{@render default_block(prop.defaultValue)}
				{#if prop.description}
					<Mdz content={prop.description} class="mb_md" />
				{/if}
				<!-- a snippet's or callback's parameters -->
				{@render callable_detail(prop.parameters, undefined, nested_tag, [prop.name])}
				{@render doc_extras(prop)}
			</section>
		{/each}
	</section>
{/if}

<!-- CSS custom properties (for Svelte components): the styling API a
	consumer sets on the component or an ancestor; `documented` entries come
	from `@cssprop` tags and arrive first, the rest are inferred from `var()`
	fallbacks and `@property` rules in the component's styles, marked only when
	the list mixes both -->
{#if declaration.css_custom_properties?.length}
	<section>
		<svelte:element this={label_tag}>CSS custom properties</svelte:element>
		{#if css_property_chips_shown}
			<p>
				Properties marked <span class="chip">inferred</span> are found by their <code>var()</code>
				fallback or <code>@property</code> rule, not documented with <code>@cssprop</code>.
			</p>
		{/if}
		{#each declaration.css_custom_properties as css_property (css_property.name)}
			<section>
				{@render field_header(
					[{ kind: 'name', text: css_property.name }],
					field_tag,
					to_declaration_field_fragment(declaration.name, css_property.name),
					css_property_chips_shown && !css_property.documented ? ['inferred'] : undefined
				)}
				{#if css_property.description}
					<Mdz content={css_property.description} />
				{/if}
				{#if css_property.syntax}
					<div class="row gap_md mb_sm">
						<strong>syntax</strong>
						<code>{css_property.syntax}</code>
					</div>
				{/if}
				{#if css_property.default !== undefined}
					<div class="row gap_md">
						<strong>default</strong>
						<Code lang="css" content={dedent_continuation_lines(css_property.default)} wrap />
					</div>
				{/if}
				{#if css_property.fallback !== undefined &&
					(css_property.default === undefined ||
						!css_values_agree(css_property.default, css_property.fallback))
				}
					<div class="row gap_md">
						<strong>fallback</strong>
						{#if css_property.fallback}
							<Code lang="css" content={dedent_continuation_lines(css_property.fallback)} wrap />
						{:else}
							<!-- `var(--a,)`, a fallback of nothing -->
							<span>empty</span>
						{/if}
					</div>
				{/if}
			</section>
		{/each}
	</section>
{/if}

<!-- overloads -->
{#if declaration.overloads?.length}
	<section>
		<svelte:element this={label_tag}>overloads</svelte:element>
		<!-- an overload's parameters sit directly under the `overloads` label -->
		{@render overloads_list(declaration.name, declaration.overloads, field_tag)}
	</section>
{/if}

<!-- external types whose contributions are filtered out of (or, on
	interfaces/classes, never enumerated in) props/members; a component prop
	its `$props()` destructuring names is documented anyway -->
{#if external_types_not_inherited}
	<section>
		<svelte:element this={label_tag}>external types</svelte:element>
		<div class="row_wrap gap_md">
			{@render type_list(external_types_not_inherited)}
		</div>
	</section>
{/if}

<!-- generics, unless a composed signature already states them with their
	constraints and defaults -->
{#if declaration.generic_params.length && !signature_tokens}
	<section>
		<div class="row gap_md">
			<svelte:element this={label_tag}>generics</svelte:element>
			<!-- plain code: `TypeLink` would link the declaration to itself -->
			<Code lang="ts" content={declaration.display_name} inline />
		</div>
		{#each generic_params as generic (generic)}
			<section>
				<svelte:element this={field_tag}><code>{generic.name}</code></svelte:element>
				{#if generic.constraint}
					<div class="row gap_md">
						<strong>constraint</strong>
						<TypeLink type={generic.constraint} type_info={generic.constraintInfo} />
					</div>
				{/if}
				{#if generic.defaultType}
					<div class="row gap_md">
						<strong>default</strong>
						<TypeLink type={generic.defaultType} type_info={generic.defaultTypeInfo} />
					</div>
				{/if}
			</section>
		{/each}
	</section>
{/if}

<!-- Extends/Implements -->
{#if declaration.extends_types?.length || declaration.implements_types?.length}
	<section>
		<svelte:element this={label_tag}>inheritance</svelte:element>
		{#if declaration.extends_types?.length}
			<div class="row_wrap gap_md">
				<strong>extends:</strong>
				{@render type_list(declaration.extends_types, declaration.extends_types_info)}
			</div>
		{/if}
		{#if declaration.implements_types?.length}
			<div class="row_wrap gap_md">
				<strong>implements:</strong>
				{@render type_list(declaration.implements_types, declaration.implements_types_info)}
			</div>
		{/if}
	</section>
{/if}

<!-- throws -->
{#if declaration.throws.length}
	<section>
		<svelte:element this={label_tag}>throws</svelte:element>
		{@render throws_list(declaration.throws)}
	</section>
{/if}

<!-- mutates -->
{#if declaration.mutates && Object.keys(declaration.mutates).length}
	<section>
		<svelte:element this={label_tag}>mutates</svelte:element>
		{@render mutates_list(declaration.mutates)}
	</section>
{/if}

<!-- since -->
{#if declaration.since}
	<section>
		<svelte:element this={label_tag}>since</svelte:element>
		<p>{declaration.since}</p>
	</section>
{/if}

<!-- members (classes, interfaces, types, enums) -->
{#if declaration.members?.length}
	<section>
		<svelte:element this={label_tag}>members</svelte:element>
		{#each declaration.members as member (member)}
			{@const chip_modifiers = to_member_chip_modifiers(member)}
			<section>
				{@render field_header(
					to_member_signature_tokens(member, { omit_type: declaration.kind === 'enum' }),
					field_tag,
					to_declaration_field_fragment(declaration.name, member.name),
					member.kind === 'variable' && member.reactivity
						? chip_modifiers.concat(member.reactivity)
						: chip_modifiers,
					// the checker's flat signature, where the composed one replaced it
					member.kind === 'variable' ? undefined : member.typeSignature
				)}
				{#if member.kind !== 'constructor'}
					{@render default_block(member.defaultValue)}
				{/if}
				{#if member.docComment}
					<Mdz content={member.docComment} class="mb_md" />
				{/if}
				{#if member.kind !== 'variable'}
					{#if member.overloads?.length}
						<!-- the header shows the first signature; each overload carries
							its own parameters and returns prose -->
						<p><strong>overloads</strong></p>
						<div class="pl_lg my_md">
							{@render overloads_list(member.name, member.overloads, nested_tag)}
						</div>
					{:else}
						{@render callable_detail(
							member.parameters,
							member.kind === 'function' ? member.returnDescription : undefined,
							nested_tag,
							[member.name]
						)}
					{/if}
				{/if}
				{@render doc_extras(member)}
			</section>
		{/each}
	</section>
{/if}

<!-- examples -->
{#if declaration.examples.length}
	<section>
		<svelte:element this={label_tag}>examples</svelte:element>
		{#each declaration.examples as example (example)}
			<Mdz content={example} />
		{/each}
	</section>
{/if}

<!-- see also -->
{#if declaration.see_also.length}
	<section>
		<svelte:element this={label_tag}>see also</svelte:element>
		{@render see_also_list(declaration.see_also)}
	</section>
{/if}

<style>
	section section:not(:last-child) {
		margin-bottom: var(--space_xl2);
	}

	/* the hashlink sits at the row's end, as in a section header, so it never
	   wraps under a long signature */
	.field-header {
		/* anchors the hashlink's scroll target */
		position: relative;
		display: flex;
		align-items: flex-start;
	}
	.field-header:hover :global(.hashlink) {
		opacity: 1;
	}
	/* sized with the row, so a row with one is no taller than a row without */
	.field-header :global(.hashlink) {
		flex-shrink: 0;
		font-size: inherit;
	}
	/* a field reached by its fragment: the tint spreads past the text without
	   moving it */
	.field-header:has(:global(:target)) {
		background-color: var(--ink_05);
		box-shadow: 0 0 0 var(--space_xs) var(--ink_05);
		border-radius: var(--border_radius_xs);
	}
	/* flows inline with the chips after it */
	.field-signature {
		display: inline;
	}

	/* a signature reads as one line of code: the types inside it contribute
	   syntax coloring and links, not pills of their own */
	.declaration-signature {
		font-family: var(--font_family_mono);
	}
	.declaration-signature :global(code) {
		display: inline;
		background: transparent;
		padding: 0;
	}
	/* a linked type is a plain link here, not a chip, so the line keeps
	   TypeScript's own spacing */
	.declaration-signature :global(a.chip) {
		padding: 0;
		background: transparent;
		font-weight: inherit;
	}
	.signature-block {
		display: block;
		padding: var(--space_xs3) var(--space_xs);
	}
	.signature-block:not(:last-child) {
		margin-bottom: var(--space_lg);
	}

	/* the name is the field's heading, set inline in its signature */
	.signature-name {
		display: inline;
		margin: 0;
		font: inherit;
		font-weight: 700;
		letter-spacing: normal;
		text-transform: none;
	}
</style>
