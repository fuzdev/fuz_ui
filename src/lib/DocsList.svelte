<script lang="ts">
	import type {Snippet} from 'svelte';

	const {
		expand_width = false,
		margin = true,
		class: class_prop,
		children,
	}: {
		expand_width?: boolean;
		margin?: boolean;
		class?: string;
		children: Snippet;
	} = $props();
</script>

<div class="docs_list {class_prop}" class:expand_width class:margin>
	{@render children()}
</div>

<style>
	.docs_list {
		width: var(--docs_menu_width);
		min-width: var(--docs_menu_width);
	}
	.docs_list.expand_width {
		width: 100%;
		max-width: var(--distance_md);
	}
	.docs_list.margin {
		margin: var(--space_xl6) 0;
	}

	/* TODO should be fixed upstream in fuz_css */
	.docs_list :global(a.highlighted) {
		background-color: var(--bg_4);
	}
	.docs_list :global(a:hover) {
		background-color: var(--bg_5);
	}
	.docs_list :global(a:is(:active, .selected)) {
		background-color: var(--bg_7);
	}
</style>
