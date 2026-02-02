<script lang="ts">
	import type {Snippet} from 'svelte';

	const {
		name = 'Cat',
		icon = '😺',
		show_name = true,
		show_icon = true,
		children,
	}: {
		name?: string;
		icon?: string | null;
		show_name?: boolean;
		show_icon?: boolean;
		children?: Snippet;
	} = $props();
</script>

<!-- TODO add link option? -->

<span class="cat" class:has-icon={show_icon}>
	{#if show_icon}<span class="icon">{icon}</span>{/if}{#if show_name}<span class="name"
			>{@render children?.()}{name}</span
		>{/if}
</span>

<style>
	.cat {
		display: flex;
		align-items: center;
		background-color: var(--shade_10);
		border-radius: var(--border_radius_md);
		border: transparent var(--border_width_4) double;
	}
	.cat:hover {
		border-color: var(--border_color_20);
	}
	.name {
		font-weight: 700;
	}
	.cat.has-icon .name {
		padding: 0 var(--space_xs3);
	}
	.icon {
		font-size: var(--icon_size_md);
	}
</style>
