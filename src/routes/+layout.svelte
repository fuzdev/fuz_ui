<script lang="ts">
	import 'virtual:fuz.css';
	import '@fuzdev/fuz_code/theme.css';

	import type {Snippet} from 'svelte';

	import ThemeRoot from '$lib/ThemeRoot.svelte';
	import ContextmenuRoot from '$lib/ContextmenuRoot.svelte';
	import Spiders from '$lib/Spiders.svelte';
	import {SiteState, site_context} from '$lib/site.svelte.js';
	import {logo_fuz_ui} from '$lib/logos.js';

	const {
		children,
	}: {
		children: Snippet;
	} = $props();

	site_context.set(
		new SiteState({
			icon: logo_fuz_ui,
			glyph: '🧶',
			repo_url: 'https://github.com/fuzdev/fuz_ui',
		}),
	);
</script>

<svelte:head>
	<title>Fuz - friendly user zystem</title>
</svelte:head>

<ThemeRoot>
	<ContextmenuRoot>
		{@render children()}
		<Spiders />
	</ContextmenuRoot>
</ThemeRoot>
