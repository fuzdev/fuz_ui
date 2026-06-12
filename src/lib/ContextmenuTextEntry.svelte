<script lang="ts">
	import type {Snippet} from 'svelte';

	import type {SvgData} from './svg.js';
	import ContextmenuEntry from './ContextmenuEntry.svelte';
	import type {ContextmenuRun} from './contextmenu_state.svelte.js';

	const {
		run,
		content,
		icon,
	}: {
		run: ContextmenuRun;
		content: string; // TODO @many rethink this API
		icon?: SvgData | string | Snippet;
	} = $props();

	// TODO consider making this the implicit default entry, so consumers can simply declare `{run, content}`
</script>

<ContextmenuEntry {run} {icon}>
	{content}
</ContextmenuEntry>
