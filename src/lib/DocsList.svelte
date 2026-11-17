<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	const {
		margin = true,
		children,
		...rest
	}: SvelteHTMLElements['div'] & {
		margin?: boolean;
		children: Snippet;
	} = $props();
</script>

<div {...rest} class={['docs-list', rest.class, { margin }]}>
	{@render children()}
</div>

<style>
	.docs-list {
		width: 100%;
		max-width: var(--distance_md);
	}
	.docs-list.margin {
		margin: var(--space_xl6) 0;
	}

	/* TODO should be fixed upstream in fuz_css */
	.docs-list :global(a.highlighted) {
		background-color: var(--ink_10);
	}
	.docs-list :global(a:hover) {
		background-color: var(--ink_10);
	}
	.docs-list :global(a:is(:active, .selected)) {
		background-color: var(--ink_20);
	}
</style>
