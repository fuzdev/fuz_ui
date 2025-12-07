<script lang="ts">
	import '@fuzdev/fuz_css/style.css';
	import '@fuzdev/fuz_css/theme.css';
	import '@fuzdev/fuz_code/theme.css';
	import '$routes/moss.css';

	import type {Snippet} from 'svelte';

	import Themed from '$lib/Themed.svelte';
	import ContextmenuRoot from '$lib/ContextmenuRoot.svelte';
	import {library_context, Library} from '$lib/library.svelte.js';
	import {library_json} from './library.js';
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

<Themed>
	<ContextmenuRoot>
		{@render children()}
		<Spiders />
	</ContextmenuRoot>
</Themed>
