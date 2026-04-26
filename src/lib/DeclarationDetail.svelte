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

	import type {Declaration} from './declaration.svelte.js';
	import TypeLink from './TypeLink.svelte';
	import ModuleLink from './ModuleLink.svelte';
	import Mdz from './Mdz.svelte';
	import {tsdoc_see_to_mdz} from './tsdoc_mdz.js';

	const {declaration}: {declaration: Declaration} = $props();
</script>

<!-- Metadata -->
<p class="row justify-content:space-between">
	<ModuleLink module_path={declaration.module_path} />
	{#if declaration.url_github}
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a class="chip" href={declaration.url_github} target="_blank" rel="noopener">view source</a>
	{/if}
</p>

<!-- chips -->
<div class="row gap_md">
	<!-- eslint-disable-next-line @typescript-eslint/no-deprecated -->
	{#if declaration.is_deprecated}
		<span class="chip">⚠️ deprecated</span>
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
</div>

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

<!-- documentation -->
{#if declaration.has_documentation}
	<Mdz content={declaration.doc_comment!} />
{/if}

<!-- parameters -->
{#if declaration.parameters?.length}
	<section>
		{#each declaration.parameters as param (param)}
			<section>
				<h4>
					<code
						>{param.name}{#if param.optional}<strong>?</strong>{/if}</code
					>
				</h4>
				{#if param.description}
					<Mdz content={param.description} />
				{/if}
				<div class="row gap_md">
					<strong>type</strong>
					<TypeLink type={param.type} />
				</div>
				{#if param.optional || param.defaultValue}
					<div class="row gap_md">
						{#if param.optional}
							<span class="chip">optional</span>
						{/if}
						{#if param.defaultValue}
							<strong>default</strong>
							<Code lang="ts" content={param.defaultValue} />
						{/if}
					</div>
				{/if}
			</section>
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
					<Mdz content={prop.description} />
				{/if}
				<div class="row gap_md mb_lg">
					<strong>type</strong>
					<TypeLink type={prop.type} />
				</div>
				{#if prop.optional || prop.bindable || prop.defaultValue}
					<div class="row gap_md">
						{#if prop.optional}
							<span class="chip">optional</span>
						{/if}
						{#if prop.bindable}
							<span class="chip">bindable</span>
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
							<div class="row gap_md">
								<code
									>{param.name}{#if param.optional}?{/if}</code
								>
								<TypeLink type={param.type} />
							</div>
						{/each}
					</section>
				{/if}
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
					<Mdz content={overload.docComment} />
				{/if}
				{#if overload.parameters?.length}
					{#each overload.parameters as param (param)}
						<div class="row gap_md">
							<code
								>{param.name}{#if param.optional}?{/if}</code
							>
							<TypeLink type={param.type} />
						</div>
					{/each}
				{/if}
				{#if overload.returnType}
					<div class="row gap_md">
						<strong>returns</strong>
						<TypeLink type={overload.returnType} />
					</div>
					{#if overload.returnDescription}
						<Mdz content={overload.returnDescription} />
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
		<ul>
			{#each declaration.intersects as type (type)}
				<li><TypeLink {type} /></li>
			{/each}
		</ul>
	</section>
{/if}

<!-- returns -->
{#if declaration.return_type}
	<section>
		<h4>returns</h4>
		<Code lang="ts" content={declaration.return_type} />
		{#if declaration.return_description}
			<Mdz content={declaration.return_description} />
		{/if}
	</section>
{/if}

<!-- generics -->
{#if declaration.generic_params?.length}
	<section>
		<h4>generics</h4>
		{#each declaration.generic_params as generic (generic)}
			<section>
				<h4><code>{generic.name}</code></h4>
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
			<div>
				<strong>extends:</strong>
				{#if Array.isArray(declaration.extends_type)}
					<ul>
						{#each declaration.extends_type as ext (ext)}
							<li><TypeLink type={ext} /></li>
						{/each}
					</ul>
				{:else}
					<TypeLink type={declaration.extends_type} />
				{/if}
			</div>
		{/if}
		{#if declaration.implements_types?.length}
			<div>
				<strong>implements:</strong>
				<ul>
					{#each declaration.implements_types as impl (impl)}
						<li><TypeLink type={impl} /></li>
					{/each}
				</ul>
			</div>
		{/if}
	</section>
{/if}

<!-- throws -->
{#if declaration.throws?.length}
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
{#if declaration.examples?.length}
	<section>
		<h4>examples</h4>
		{#each declaration.examples as example (example)}
			<Mdz content={example} />
		{/each}
	</section>
{/if}

<!-- see also -->
{#if declaration.see_also?.length}
	<section>
		<h4>see also</h4>
		<ul>
			{#each declaration.see_also as ref (ref)}
				<li>
					<Mdz content={tsdoc_see_to_mdz(ref)} />
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
				<h4><code>{member.name}</code></h4>
				{#if member.docComment}
					<Mdz content={member.docComment} />
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
				{#if member.modifiers?.length}
					<div class="row gap_md">
						{#each member.modifiers as modifier (modifier)}
							<span class="chip">{modifier}</span>
						{/each}
					</div>
				{/if}
				<!-- parameters for methods and constructors -->
				{#if (member.kind === 'function' || member.kind === 'constructor') && member.parameters?.length}
					<section>
						{#each member.parameters as param (param)}
							<section>
								<h5>
									<code
										>{param.name}{#if param.optional}<strong>?</strong>{/if}</code
									>
								</h5>
								{#if param.description}
									<Mdz content={param.description} />
								{/if}
								<div class="row gap_md">
									<strong>type</strong>
									<TypeLink type={param.type} />
								</div>
								{#if param.optional || param.defaultValue}
									<div class="row gap_md">
										{#if param.optional}
											<span class="chip">optional</span>
										{/if}
										{#if param.defaultValue}
											<strong>default</strong>
											<Code lang="ts" content={param.defaultValue} />
										{/if}
									</div>
								{/if}
							</section>
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
						<Mdz content={member.returnDescription} />
					{/if}
				{/if}
				<!-- throws for methods and constructors -->
				{#if member.throws?.length}
					<div>
						<strong>throws</strong>
						<ul>
							{#each member.throws as thrown (thrown)}
								<li>
									{#if thrown.type}
										<code>{thrown.type}</code> - {thrown.description}
									{:else}
										{thrown.description}
									{/if}
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</section>
		{/each}
	</section>
{/if}
