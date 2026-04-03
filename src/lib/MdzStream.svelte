<script lang="ts">
	import type {SvelteHTMLElements} from 'svelte/elements';

	import MdzStreamNodeView from './MdzStreamNodeView.svelte';
	import {mdz_base_context} from './mdz_components.js';
	import type {MdzStreamState} from './mdz_stream_state.svelte.js';

	const {
		state,
		inline = false,
		nowrap = false,
		base,
		...rest
	}: (SvelteHTMLElements['div'] | SvelteHTMLElements['span']) & {
		state: MdzStreamState;
		inline?: boolean;
		nowrap?: boolean;
		base?: string;
	} = $props();

	mdz_base_context.set(() => base);
</script>

<svelte:element
	this={inline ? 'span' : 'div'}
	{...rest}
	style:white-space={nowrap ? 'pre' : 'pre-wrap'}
>
	{#each state.root as node (node.id)}
		<MdzStreamNodeView {node} />
	{/each}
</svelte:element>
