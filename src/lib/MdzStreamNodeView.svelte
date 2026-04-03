<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';
	import {resolve} from '$app/paths';

	import {resolve_relative_path} from './mdz_helpers.js';
	import DocsLink from './DocsLink.svelte';
	import MdzStreamNodeView from './MdzStreamNodeView.svelte';
	import {
		mdz_components_context,
		mdz_elements_context,
		mdz_base_context,
	} from './mdz_components.js';
	import type {MdzStreamNode} from './mdz_stream_state.svelte.js';

	const {
		node,
	}: {
		node: MdzStreamNode;
	} = $props();

	const components = mdz_components_context.get_maybe();
	const elements = mdz_elements_context.get_maybe();
	const get_mdz_base = mdz_base_context.get_maybe();
</script>

{#if node.type === 'Element'}
	{@const element_config = elements?.get(node.name ?? '')}
	{#if element_config !== undefined}
		<svelte:element this={node.name}>
			{#if node.children.length > 0}
				{@render render_children(node.children)}
			{/if}
		</svelte:element>
	{:else}
		{@render render_unregistered_tag(node.name ?? '', node.children)}
	{/if}
{:else if node.type === 'Component'}
	{@const Component = components?.get(node.name ?? '')}
	{#if Component}
		<Component>
			{#if node.children.length > 0}
				{@render render_children(node.children)}
			{/if}
		</Component>
	{:else}
		{@render render_unregistered_tag(node.name ?? '', node.children)}
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
	{@const reference = node.reference ?? ''}
	{#if node.link_type === 'internal'}
		{@const skip_resolve = reference.startsWith('#') || reference.startsWith('?')}
		{@const mdz_base = get_mdz_base?.()}
		{#if reference.startsWith('.') && mdz_base}
			{@const resolved = resolve_relative_path(reference, mdz_base)}
			<a href={resolve(resolved as any)}>{@render render_children(node.children)}</a>
		{:else if skip_resolve || reference.startsWith('.')}
			<a href={reference}>{@render render_children(node.children)}</a>
		{:else}
			<a href={resolve(reference as any)}>{@render render_children(node.children)}</a>
		{/if}
	{:else}
		<a href={reference} target="_blank" rel="noopener">{@render render_children(node.children)}</a>
	{/if}
{:else if node.type === 'Paragraph'}
	<p>{@render render_children(node.children)}</p>
{:else if node.type === 'Hr'}
	<hr />
{:else if node.type === 'Heading'}
	<svelte:element this={`h${node.level}`} id={node.heading_id}>
		{@render render_children(node.children)}
	</svelte:element>
{:else if node.type === 'Codeblock'}
	<Code lang={node.lang} content={node.content} />
{/if}

{#snippet render_children(nodes: Array<MdzStreamNode>)}
	{#each nodes as node (node.id)}
		<MdzStreamNodeView {node} />
	{/each}
{/snippet}

{#snippet render_unregistered_tag(name: string, children: Array<MdzStreamNode>)}
	{#if children.length > 0}
		<code class="color_c_50">&lt;{name}&gt;</code>{@render render_children(children)}<code
			class="color_c_50">&lt;/{name}&gt;</code
		>
	{:else}
		<code class="color_c_50">&lt;{name} /&gt;</code>
	{/if}
{/snippet}
