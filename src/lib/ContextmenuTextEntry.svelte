<script lang="ts">
	import type {SvgData} from './svg.js';
	import Svg from './Svg.svelte';
	import ContextmenuEntry from './ContextmenuEntry.svelte';
	import type {ContextmenuRun} from './contextmenu_state.svelte.js';

	const {
		run,
		content,
		icon: icon_value,
	}: {
		run: ContextmenuRun;
		content: string; // TODO @many rethink this API
		icon: SvgData | string;
	} = $props();

	// TODO consider making this the implicit default entry, so consumers can simply declare `{run, content}`
</script>

<ContextmenuEntry {run}>
	{#snippet icon()}{#if typeof icon_value === 'string'}{icon_value}{:else}<Svg
				data={icon_value}
			/>{/if}{/snippet}
	{content}
</ContextmenuEntry>
