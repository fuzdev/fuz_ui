<script lang="ts">
	import type {SvelteHTMLElements} from 'svelte/elements';

	import {mdz_parse} from './mdz.js';
	import MdzNodeView from './MdzNodeView.svelte';
	import {mdz_base_context, set_mdz_context_with_fallback} from './mdz_components.js';

	const {
		content,
		inline = false,
		nowrap = false,
		base,
		...rest
	}: (SvelteHTMLElements['div'] | SvelteHTMLElements['span']) & {
		content: string;
		inline?: boolean;
		nowrap?: boolean;
		base?: string;
	} = $props();

	set_mdz_context_with_fallback(mdz_base_context, () => base);

	const nodes = $derived(mdz_parse(content));
</script>

<svelte:element
	this={inline ? 'span' : 'div'}
	{...rest}
	style:white-space={nowrap ? 'pre' : 'pre-wrap'}
>
	{#each nodes as node (node)}
		<MdzNodeView {node} />
	{/each}
</svelte:element>
