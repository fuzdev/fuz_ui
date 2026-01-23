<script lang="ts">
	import type {SvelteHTMLElements} from 'svelte/elements';

	const {...rest}: SvelteHTMLElements['li'] = $props();
</script>

<li role="separator" aria-orientation="vertical" {...rest} class:contextmenu_separator={true}></li>

<style>
	.contextmenu_separator {
		height: var(--border_width);
		margin: var(--spacing_xs) var(--spacing_sm);
		background-color: var(--shade_10);
		list-style: none;
	}
</style>
