<script lang="ts">
	import '$routes/fuz.css';
	import '@fuzdev/fuz_code/theme.css';

	import type {Snippet} from 'svelte';

	import ThemeRoot from '$lib/ThemeRoot.svelte';
	import ContextmenuRoot from '$lib/ContextmenuRoot.svelte';
	import {library_context, Library} from '$lib/library.svelte.js';
	import {library_json} from '$routes/library.js';
	import Spiders from '$lib/Spiders.svelte';

	const {
		children,
	}: {
		children: Snippet;
	} = $props();

	library_context.set(new Library(library_json));
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
