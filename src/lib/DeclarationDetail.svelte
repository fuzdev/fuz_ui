<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import type {Declaration} from './declaration.svelte.js';
	import Details from './Details.svelte';
	import TypeLink from './TypeLink.svelte';
	import ModuleLink from './ModuleLink.svelte';
	import Mdz from './Mdz.svelte';
	import {tsdoc_see_to_mdz} from './tsdoc_mdz.js';

	const {declaration}: {declaration: Declaration} = $props();
</script>

<!-- Metadata -->
<p class="row justify_content_space_between">
	<ModuleLink module_path={declaration.module_path} />
	{#if declaration.url_github}
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a class="chip" href={declaration.url_github} target="_blank" rel="noopener">view source</a>
	{/if}
</p>

<!-- eslint-disable-next-line @typescript-eslint/no-deprecated -->
{#if declaration.is_deprecated}
	<p>
		<strong>⚠️ deprecated:</strong>
		<!-- eslint-disable-next-line @typescript-eslint/no-deprecated -->
		{declaration.deprecated_message}
	</p>
{/if}

<!-- type signature -->
{#if declaration.type_signature}
	<Code content={declaration.type_signature} lang="ts" class="mb_lg" />
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
				{#if param.optional || param.default_value}
					<div class="row gap_md">
						{#if param.optional}
							<span class="chip">optional</span>
						{/if}
						{#if param.default_value}
							<strong>default</strong>
							<Code content={param.default_value} lang="ts" />
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
				{#if prop.optional || prop.bindable || prop.default_value}
					<div class="row gap_md">
						{#if prop.optional}
							<span class="chip">optional</span>
						{/if}
						{#if prop.bindable}
							<span class="chip">bindable</span>
						{/if}
						{#if prop.default_value}
							<strong>default</strong>
							<Code content={prop.default_value} lang="ts" />
						{/if}
					</div>
				{/if}
			</section>
		{/each}
	</section>
{/if}

<!-- returns -->
{#if declaration.return_type}
	<section>
		<h4>returns</h4>
		<Code content={declaration.return_type} lang="ts" />
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
				{#if generic.default_type}
					<div class="row gap_md">
						<strong>default</strong>
						<TypeLink type={generic.default_type} />
					</div>
				{/if}
			</section>
		{/each}
	</section>
{/if}

<!-- Extends/Implements -->
{#if declaration.extends?.length || declaration.implements?.length}
	<section>
		<h4>inheritance</h4>
		{#if declaration.extends?.length}
			<div>
				<strong>extends:</strong>
				<ul>
					{#each declaration.extends as ext (ext)}
						<li><TypeLink type={ext} /></li>
					{/each}
				</ul>
			</div>
		{/if}
		{#if declaration.implements?.length}
			<div>
				<strong>implements:</strong>
				<ul>
					{#each declaration.implements as impl (impl)}
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
		{#each declaration.examples as example, i (example)}
			<Details>
				{#snippet summary()}Example {i + 1}{/snippet}
				<Code content={example} lang="ts" />
			</Details>
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

<!-- members (for classes) -->
{#if declaration.members?.length}
	<section>
		{#each declaration.members as member (member)}
			<section>
				<h4><code>{member.name}</code></h4>
				{#if member.doc_comment}
					<Mdz content={member.doc_comment} />
				{/if}
				{#if member.type_signature}
					<p class="row gap_md">
						<strong>type</strong>
						<TypeLink
							type={member.kind === 'constructor'
								? `new ${member.type_signature}`
								: member.type_signature}
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
				{#if member.parameters?.length}
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
								{#if param.optional || param.default_value}
									<div class="row gap_md">
										{#if param.optional}
											<span class="chip">optional</span>
										{/if}
										{#if param.default_value}
											<strong>default</strong>
											<Code content={param.default_value} lang="ts" />
										{/if}
									</div>
								{/if}
							</section>
						{/each}
					</section>
				{/if}
				<!-- return type for methods -->
				{#if member.return_type}
					<div class="row gap_md">
						<strong>returns</strong>
						<TypeLink type={member.return_type} />
					</div>
					{#if member.return_description}
						<Mdz content={member.return_description} />
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

<!-- properties (for types/interfaces) -->
{#if declaration.properties?.length}
	<section>
		{#each declaration.properties as prop (prop)}
			<section>
				<h4><code>{prop.name}</code></h4>
				{#if prop.doc_comment}
					<Mdz content={prop.doc_comment} />
				{/if}
				{#if prop.type_signature}
					<div class="row gap_md">
						<strong>type</strong>
						<TypeLink type={prop.type_signature} />
					</div>
				{/if}
				{#if prop.modifiers?.length}
					<div class="row gap_md">
						{#each prop.modifiers as modifier (modifier)}
							<span class="chip">{modifier}</span>
						{/each}
					</div>
				{/if}
			</section>
		{/each}
	</section>
{/if}
