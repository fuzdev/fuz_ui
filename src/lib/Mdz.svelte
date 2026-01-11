<script lang="ts">
	import type {SvelteHTMLElements} from 'svelte/elements';

	import {mdz_parse} from './mdz.js';
	import MdzNodeView from './MdzNodeView.svelte';

	const {
		content,
		inline = false,
		nowrap = false,
		...rest
	}: (SvelteHTMLElements['div'] | SvelteHTMLElements['span']) & {
		content: string;
		inline?: boolean;
		nowrap?: boolean;
	} = $props();

	const nodes = $derived(mdz_parse(content));
</script>

<svelte:element
	this={inline ? 'span' : 'div'}
	{...rest}
	class="{rest.class} {nowrap ? 'white-space:pre' : 'white-space:pre-wrap'}"
>
	{#each nodes as node (node)}
		<MdzNodeView {node} />
	{/each}
</svelte:element>
