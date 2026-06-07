<script lang="ts">
	import ContextmenuEntry from '$lib/ContextmenuEntry.svelte';
	import ContextmenuSubmenu from '$lib/ContextmenuSubmenu.svelte';
	import ContextmenuSeparator from '$lib/ContextmenuSeparator.svelte';
	import {type HistoryItem, type Cat, to_cats_label} from '$routes/docs/Contextmenu/helpers.js';
	import CatContextmenu from '$routes/docs/Contextmenu/CatContextmenu.svelte';

	const {
		home_cats,
		adventure_cats,
		act,
	}: {
		home_cats: Array<Cat>;
		adventure_cats: Array<Cat>;
		act: (item: HistoryItem) => void;
	} = $props();

	const cat_to_call_to_adventure = $derived(to_cats_label(home_cats));
</script>

<ContextmenuSubmenu>
	{#snippet icon()}🌄{/snippet}
	adventure
	{#snippet menu()}
		{#if cat_to_call_to_adventure}
			<ContextmenuEntry run={() => act({type: 'call_cats_adventure'})}>
				{#snippet icon()}🦋{/snippet}
				call
			</ContextmenuEntry>
			<ContextmenuSeparator />
		{/if}
		{#each adventure_cats as cat (cat.name)}
			<CatContextmenu name={cat.name} icon={cat.icon} position={cat.position} {act} />
		{/each}
		{#if !cat_to_call_to_adventure}
			<ContextmenuEntry run={() => act({type: 'cat_be_or_do', name: null, position: 'adventure'})}>
				{#snippet icon()}🌄{/snippet}
				do
			</ContextmenuEntry>
			<ContextmenuEntry run={() => act({type: 'call_cats_home'})}>
				{#snippet icon()}🐈‍⬛{/snippet}
				leave
			</ContextmenuEntry>
		{/if}
	{/snippet}
</ContextmenuSubmenu>
