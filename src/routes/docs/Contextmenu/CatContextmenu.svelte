<script lang="ts">
	import ContextmenuEntry from '$lib/ContextmenuEntry.svelte';
	import ContextmenuSubmenu from '$lib/ContextmenuSubmenu.svelte';
	import type {CatPosition, HistoryItem} from '$routes/docs/Contextmenu/helpers.js';

	const {
		name = 'Cat',
		icon: icon_text = '😺',
		position,
		act,
	}: {
		name?: string;
		icon?: string | null;
		position: CatPosition;
		act: (item: HistoryItem) => void;
	} = $props();
</script>

<ContextmenuSubmenu>
	{#snippet icon()}{icon_text}{/snippet}
	{name}
	{#snippet menu()}
		<ContextmenuEntry
			run={() => act({type: position === 'adventure' ? 'cat_go_home' : 'cat_go_adventure', name})}
		>
			{#snippet icon()}{#if position === 'adventure'}🏠{:else}🌄{/if}{/snippet}
			{#if position === 'adventure'}go home{:else}go adventure{/if}
		</ContextmenuEntry>
		<ContextmenuEntry run={() => act({type: 'cat_be_or_do', name, position})}>
			{#snippet icon()}{#if position === 'adventure'}🌄{:else}🏠{/if}{/snippet}
			{#if position === 'adventure'}do adventure{:else}be home{/if}
		</ContextmenuEntry>
	{/snippet}
</ContextmenuSubmenu>
