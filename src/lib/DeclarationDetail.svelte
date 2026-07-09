<!--
@component

Renders the full detail view for an exported declaration.
Handles all svelte-docinfo declaration kinds (function, class, interface,
type, variable, enum, component, snippet) and their kind-specific fields
including parameters, props, members, overloads, intersects, and more.

@see `declaration.svelte.ts` for the `Declaration` wrapper class
@see {@link https://github.com/ryanatkn/svelte-docinfo svelte-docinfo} for the analysis library
-->
<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';
	import {mdz_from_tsdoc} from '@fuzdev/mdz/tsdoc_mdz.ts';

	import DocMdz from './DocMdz.svelte';
	import {field_nodes, list_nodes} from './declaration.svelte.ts';
	import {
		mdz_code_context,
		mdz_codeblock_context,
		mdz_set_context_with_fallback,
	} from '@fuzdev/mdz/mdz_contexts.ts';
	import type {ParameterJsonInput} from 'svelte-docinfo/types.js';

	import type {Declaration} from './declaration.svelte.ts';
	import TypeLink from './TypeLink.svelte';
	import ModuleLink from './ModuleLink.svelte';
	import DocsLink from './DocsLink.svelte';

	const {declaration}: {declaration: Declaration} = $props();

	// render mdz inline `code` as API-linking `DocsLink` and fenced blocks as syntax-highlighted
	// `Code`, matching the rest of the docs — the injection mdz core leaves open
	mdz_set_context_with_fallback(mdz_code_context, () => DocsLink);
	mdz_set_context_with_fallback(mdz_codeblock_context, () => Code);

	// Optional prose metadata shared by component props and nested members,
	// rendered in a compact form (the top-level declaration uses prominent
	// sections for the same fields instead).
	interface DocExtras {
		deprecatedMessage?: string;
		since?: string;
		examples?: Array<string>;
		seeAlso?: Array<string>;
		throws?: Array<{type?: string; description: string}>;
	}
</script>

<!-- A single function/method parameter: name, description, type, and optional/default. -->
{#snippet param_detail(param: ParameterJsonInput)}
	<section>
		<h4>
			<code
				>{param.name}{#if param.optional}<strong>?</strong>{/if}</code
			>
		</h4>
		{#if param.description}
			<DocMdz content={param.description} nodes={field_nodes(param, 'description')} />
		{/if}
		<div class="row gap_md mb_sm">
			<strong>type</strong>
			<TypeLink type={param.type} />
		</div>
		{#if param.optional || param.defaultValue}
			<div class="row gap_md">
				{#if param.optional}
					<strong>optional</strong>
				{/if}
				{#if param.defaultValue}
					<strong>default</strong>
					<Code lang="ts" content={param.defaultValue} />
				{/if}
			</div>
		{/if}
	</section>
{/snippet}

<!-- A compact parameter row: name (with optional marker) and type, for snippet params and overloads. -->
{#snippet param_row(param: ParameterJsonInput)}
	<div class="row gap_md">
		<code
			>{param.name}{#if param.optional}?{/if}</code
		>
		<TypeLink type={param.type} />
	</div>
{/snippet}

<!-- Compact prose metadata for props and members (deprecated, since, examples, see also, throws). -->
{#snippet doc_extras(item: DocExtras)}
	<!-- eslint-disable-next-line @typescript-eslint/no-deprecated -->
	{#if item.deprecatedMessage !== undefined}
		<p class="row gap_md">
			<span class="chip">⚠️ deprecated</span>
			<!-- eslint-disable-next-line @typescript-eslint/no-deprecated -->
			{#if item.deprecatedMessage}{item.deprecatedMessage}{/if}
		</p>
	{/if}
	{#if item.since}
		<p><strong>since</strong> {item.since}</p>
	{/if}
	{#if item.examples?.length}
		{#each item.examples as example, i (example)}
			<DocMdz content={example} nodes={list_nodes(item, 'examples')?.[i]} />
		{/each}
	{/if}
	{#if item.seeAlso?.length}
		<p><strong>see also</strong></p>
		<ul>
			{#each item.seeAlso as ref, i (ref)}
				<li><DocMdz content={mdz_from_tsdoc(ref)} nodes={list_nodes(item, 'seeAlso')?.[i]} /></li>
			{/each}
		</ul>
	{/if}
	{#if item.throws?.length}
		<p><strong>throws</strong></p>
		<ul>
			{#each item.throws as thrown (thrown)}
				<li>
					{#if thrown.type}
						<code>{thrown.type}</code> - {thrown.description}
					{:else}
						{thrown.description}
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
{/snippet}

<!-- A comma-separated inline list of type links (extends, implements, intersects are rarely more than one). -->
{#snippet type_list(types: Array<string>)}
	{#each types as type, i (type)}{#if i > 0},
		{/if}<TypeLink {type} />{/each}
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
	declaration.reactivity ||
	declaration.accepts_children ||
	declaration.alias_of}
	<p class="row gap_md flex-wrap:wrap">
		<!-- eslint-disable-next-line @typescript-eslint/no-deprecated -->
		{#if declaration.is_deprecated}
			<span class="chip">⚠️ deprecated</span>
		{/if}
		{#if declaration.reactivity}
			<span class="chip">{declaration.reactivity}</span>
		{/if}
		{#if declaration.accepts_children}
			<span class="chip">accepts children</span>
		{/if}
		{#if declaration.alias_of}
			<span class="chip"
				>alias of {declaration.alias_of.name}{#if declaration.alias_of.module}
					in {declaration.alias_of.module}{/if}</span
			>
		{/if}
	</p>
{/if}

<!-- also exported from -->
{#if declaration.also_exported_from?.length}
	<p class="row gap_md flex-wrap:wrap">
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

<!-- type signature -->
{#if declaration.type_signature}
	<Code lang="ts" content={declaration.type_signature} />
{/if}

<!-- import statement -->
<Code lang="ts" content={declaration.import_statement} />

<!-- documentation -->
{#if declaration.has_documentation}
	<DocMdz content={declaration.doc_comment} nodes={declaration.doc_comment_nodes} />
{/if}

<!-- parameters -->
{#if declaration.parameters?.length}
	<section>
		{#each declaration.parameters as param (param)}
			{@render param_detail(param)}
		{/each}
	</section>
{/if}

<!-- component props (for Svelte components) -->
{#if declaration.props?.length}
	<section>
		{#each declaration.props as prop (prop)}
			<section>
				<h4>
					<code
						>{prop.name}{#if prop.optional}<strong>?</strong>{/if}</code
					>
				</h4>
				{#if prop.description}
					<DocMdz content={prop.description} nodes={field_nodes(prop, 'description')} />
				{/if}
				<div class="row gap_md mb_sm">
					<strong>type</strong>
					<TypeLink type={prop.type} />
				</div>
				{#if prop.optional || prop.bindable || prop.defaultValue}
					<div class="row gap_md">
						{#if prop.optional}
							<strong>optional</strong>
						{/if}
						{#if prop.bindable}
							<strong>bindable</strong>
						{/if}
						{#if prop.defaultValue}
							<strong>default</strong>
							<Code lang="ts" content={prop.defaultValue} />
						{/if}
					</div>
				{/if}
				{#if prop.parameters?.length}
					<section>
						<h5>snippet parameters</h5>
						{#each prop.parameters as param (param)}
							{@render param_row(param)}
						{/each}
					</section>
				{/if}
				{@render doc_extras(prop)}
			</section>
		{/each}
	</section>
{/if}

<!-- overloads -->
{#if declaration.overloads?.length}
	<section>
		<h4>overloads</h4>
		{#each declaration.overloads as overload, i (i)}
			<section>
				<Code lang="ts" content={overload.typeSignature} />
				{#if overload.docComment}
					<DocMdz content={overload.docComment} nodes={field_nodes(overload, 'docComment')} />
				{/if}
				{#if overload.parameters?.length}
					{#each overload.parameters as param (param)}
						{@render param_row(param)}
					{/each}
				{/if}
				{#if overload.returnType}
					<div class="row gap_md">
						<strong>returns</strong>
						<TypeLink type={overload.returnType} />
					</div>
					{#if overload.returnDescription}
						<DocMdz
							content={overload.returnDescription}
							nodes={field_nodes(overload, 'returnDescription')}
						/>
					{/if}
				{/if}
			</section>
		{/each}
	</section>
{/if}

<!-- intersects (component/type intersection types) -->
{#if declaration.intersects?.length}
	<section>
		<h4>intersects</h4>
		<div class="row gap_md flex-wrap:wrap">
			{@render type_list(declaration.intersects)}
		</div>
	</section>
{/if}

<!-- returns -->
{#if declaration.return_type}
	<section>
		<h4>returns</h4>
		<Code lang="ts" content={declaration.return_type} />
		{#if declaration.return_description}
			<DocMdz content={declaration.return_description} nodes={declaration.return_description_nodes} />
		{/if}
	</section>
{/if}

<!-- generics -->
{#if declaration.generic_params.length}
	<section>
		<div class="row gap_md">
			<h4>generics</h4>
			<TypeLink type={declaration.display_name} />
		</div>
		{#each declaration.generic_params as generic (generic)}
			<section>
				<h5><code>{generic.name}</code></h5>
				{#if generic.constraint}
					<div class="row gap_md">
						<strong>constraint</strong>
						<TypeLink type={generic.constraint} />
					</div>
				{/if}
				{#if generic.defaultType}
					<div class="row gap_md">
						<strong>default</strong>
						<TypeLink type={generic.defaultType} />
					</div>
				{/if}
			</section>
		{/each}
	</section>
{/if}

<!-- Extends/Implements -->
{#if declaration.extends_type || declaration.implements_types?.length}
	<section>
		<h4>inheritance</h4>
		{#if declaration.extends_type}
			<div class="row gap_md flex-wrap:wrap">
				<strong>extends:</strong>
				{@render type_list(
					Array.isArray(declaration.extends_type)
						? declaration.extends_type
						: [declaration.extends_type],
				)}
			</div>
		{/if}
		{#if declaration.implements_types?.length}
			<div class="row gap_md flex-wrap:wrap">
				<strong>implements:</strong>
				{@render type_list(declaration.implements_types)}
			</div>
		{/if}
	</section>
{/if}

<!-- throws -->
{#if declaration.throws.length}
	<section>
		<h4>throws</h4>
		<ul>
			{#each declaration.throws as thrown (thrown)}
				<li>
					{#if thrown.type}
						<code>{thrown.type}</code> - {thrown.description}
					{:else}
						{thrown.description}
					{/if}
				</li>
			{/each}
		</ul>
	</section>
{/if}

<!-- mutates -->
{#if declaration.mutates && Object.keys(declaration.mutates).length}
	<section>
		<h4>mutates</h4>
		<ul>
			{#each Object.entries(declaration.mutates) as [param, description] (param)}
				<li><code>{param}</code> — {description}</li>
			{/each}
		</ul>
	</section>
{/if}

<!-- since -->
{#if declaration.since}
	<section>
		<h4>since</h4>
		<p>{declaration.since}</p>
	</section>
{/if}

<!-- examples -->
{#if declaration.examples.length}
	<section>
		<h4>examples</h4>
		{#each declaration.examples as example, i (example)}
			<DocMdz content={example} nodes={declaration.examples_nodes?.[i]} />
		{/each}
	</section>
{/if}

<!-- see also -->
{#if declaration.see_also.length}
	<section>
		<h4>see also</h4>
		<ul>
			{#each declaration.see_also as ref, i (ref)}
				<li>
					<DocMdz content={mdz_from_tsdoc(ref)} nodes={declaration.see_also_nodes?.[i]} />
				</li>
			{/each}
		</ul>
	</section>
{/if}

<!-- members (classes, interfaces, types, enums) -->
{#if declaration.members?.length}
	<section>
		{#each declaration.members as member (member)}
			<section>
				<h4>
					<code
						>{member.name}{#if member.kind !== 'constructor' && member.optional}<strong>?</strong
							>{/if}</code
					>
				</h4>
				{#if member.docComment}
					<DocMdz content={member.docComment} nodes={field_nodes(member, 'docComment')} />
				{/if}
				{#if member.typeSignature}
					<p class="row gap_md">
						<strong>type</strong>
						<TypeLink
							type={member.kind === 'constructor'
								? `new ${member.typeSignature}`
								: member.typeSignature}
						/>
					</p>
				{/if}
				{#if member.modifiers?.length || (member.kind === 'variable' && member.reactivity)}
					<div class="row gap_md flex-wrap:wrap">
						{#if member.modifiers?.length}
							{#each member.modifiers as modifier (modifier)}
								<span class="chip">{modifier}</span>
							{/each}
						{/if}
						{#if member.kind === 'variable' && member.reactivity}
							<span class="chip">{member.reactivity}</span>
						{/if}
					</div>
				{/if}
				{#if member.kind === 'variable' && member.defaultValue}
					<div class="row gap_md">
						<strong>default</strong>
						<Code lang="ts" content={member.defaultValue} />
					</div>
				{/if}
				<!-- parameters for methods and constructors -->
				{#if (member.kind === 'function' || member.kind === 'constructor') &&
					member.parameters?.length}
					<section>
						{#each member.parameters as param (param)}
							{@render param_detail(param)}
						{/each}
					</section>
				{/if}
				<!-- return type for methods -->
				{#if member.kind === 'function' && member.returnType}
					<div class="row gap_md">
						<strong>returns</strong>
						<TypeLink type={member.returnType} />
					</div>
					{#if member.returnDescription}
						<DocMdz
							content={member.returnDescription}
							nodes={field_nodes(member, 'returnDescription')}
						/>
					{/if}
				{/if}
				{@render doc_extras(member)}
			</section>
		{/each}
	</section>
{/if}

<style>
	section section:not(:last-child) {
		margin-bottom: var(--space_xl4);
	}
</style>
