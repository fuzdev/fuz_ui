<script lang="ts">
	import ContextmenuEntry from './ContextmenuEntry.svelte';
	import type {ContextmenuRun} from './contextmenu_state.svelte.js';

	const {
		run,
		content,
		icon: icon_text,
	}: {
		run: ContextmenuRun;
		content: string; // TODO @many rethink this API
		icon: string; // TODO @many rethink this API
	} = $props();

	// TODO consider making this the implicit default entry, so consumers can simply declare `{run, content}`
</script>

<ContextmenuEntry {run}>
	{#snippet icon()}{icon_text}{/snippet}
	{content}
</ContextmenuEntry>
