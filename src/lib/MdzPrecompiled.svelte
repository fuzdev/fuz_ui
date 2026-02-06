<!--
@component

Used by `svelte_preprocess_mdz`. Not intended for direct use.

@module
-->
<script lang="ts">
	import type {Snippet} from 'svelte';
	import type {SvelteHTMLElements} from 'svelte/elements';

	const {
		inline = false,
		nowrap = false,
		children,
		...rest
	}: (SvelteHTMLElements['div'] | SvelteHTMLElements['span']) & {
		inline?: boolean;
		nowrap?: boolean;
		children: Snippet;
	} = $props();
</script>

<svelte:element
	this={inline ? 'span' : 'div'}
	{...rest}
	class="{rest.class} {nowrap ? 'white-space:pre' : 'white-space:pre-wrap'}"
>
	{@render children()}
</svelte:element>
