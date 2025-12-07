<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';
	import {resolve} from '$app/paths';

	import type {MdzNode} from './mdz.js';
	import DocsLink from './DocsLink.svelte';
	import MdzNodeView from './MdzNodeView.svelte';
	import {mdz_components_context, mdz_elements_context} from './mdz_components.js';

	const {
		node,
	}: {
		node: MdzNode;
	} = $props();

	const components = mdz_components_context.get_maybe();
	const elements = mdz_elements_context.get_maybe();
	// TODO make `Code` customizable via context, maybe registered as component Codeblock?
</script>

{#if node.type === 'Element'}
	{@const element_config = elements?.get(node.name)}
	{#if element_config !== undefined}
		<svelte:element this={node.name}>
			{#if node.children.length > 0}
				{@render render_children(node.children)}
			{/if}
		</svelte:element>
	{:else}
		{@render render_unregistered_tag(node.name, node.children)}
	{/if}
{:else if node.type === 'Component'}
	{@const Component = components?.get(node.name)}
	{#if Component}
		<Component>
			{#if node.children.length > 0}
				{@render render_children(node.children)}
			{/if}
		</Component>
	{:else}
		{@render render_unregistered_tag(node.name, node.children)}
	{/if}
{:else if node.type === 'Text'}
	{node.content}
{:else if node.type === 'Code'}
	<DocsLink reference={node.content} />
{:else if node.type === 'Bold'}
	<strong>{@render render_children(node.children)}</strong>
{:else if node.type === 'Italic'}
	<em>{@render render_children(node.children)}</em>
{:else if node.type === 'Strikethrough'}
	<s>{@render render_children(node.children)}</s>
{:else if node.type === 'Link'}
	{@const {reference} = node}
	{#if node.link_type === 'internal'}
		{@const is_fragment_or_query_only = reference.startsWith('#') || reference.startsWith('?')}
		<!-- Fragment/query-only links skip resolve() to avoid unwanted `/` prefix -->
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a href={is_fragment_or_query_only ? reference : resolve(reference as any)}
			>{@render render_children(node.children)}</a
		>
	{:else}
		<!-- external link -->
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a href={reference} target="_blank" rel="noopener">{@render render_children(node.children)}</a>
	{/if}
{:else if node.type === 'Paragraph'}
	<p>{@render render_children(node.children)}</p>
{:else if node.type === 'Hr'}
	<hr />
{:else if node.type === 'Heading'}
	<svelte:element this={`h${node.level}`}>
		{@render render_children(node.children)}
	</svelte:element>
{:else if node.type === 'Codeblock'}
	<Code lang={node.lang} content={node.content} />
{/if}

{#snippet render_children(nodes: Array)}
	{#each nodes as node (node)}
		<MdzNodeView {node} />
	{/each}
{/snippet}

{#snippet render_unregistered_tag(name: string, children: Array)}
	{#if children.length > 0}
		<code class="color_c_5">&lt;{name}&gt;</code>{@render render_children(children)}<code
			class="color_c_5">&lt;/{name}&gt;</code
		>
	{:else}
		<code class="color_c_5">&lt;{name} /&gt;</code>
	{/if}
{/snippet}
