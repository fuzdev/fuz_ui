<script lang="ts">
	import ContextmenuEntry from '$lib/ContextmenuEntry.svelte';
	import ContextmenuLinkEntry from '$lib/ContextmenuLinkEntry.svelte';
	import ContextmenuSeparator from '$lib/ContextmenuSeparator.svelte';
	import Svg from '$lib/Svg.svelte';
	import {logo_github} from '$lib/logos.js';

	const {
		toggle_about_dialog,
	}: {
		toggle_about_dialog: () => void;
	} = $props();
</script>

<ContextmenuLinkEntry href="https://github.com/fuzdev/fuz_ui">
	{#snippet icon()}<Svg data={logo_github} size="var(--icon_size_xs)" />{/snippet}
	Source code
</ContextmenuLinkEntry>
<ContextmenuSeparator />
<ContextmenuEntry run={toggle_about_dialog}>
	{#snippet icon()}?{/snippet}
	About
</ContextmenuEntry>
