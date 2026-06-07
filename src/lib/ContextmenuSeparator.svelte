<script lang="ts">
	import type {SvelteHTMLElements} from 'svelte/elements';

	const {...rest}: SvelteHTMLElements['li'] = $props();
</script>

<li role="separator" aria-orientation="vertical" {...rest} class:contextmenu-separator={true}></li>

<style>
	.contextmenu-separator {
		height: var(--border_width);
		margin: var(--space_xs) var(--space_sm);
		background-color: var(--border_color_10);
		list-style: none;
	}
</style>
