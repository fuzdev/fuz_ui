<script lang="ts">
	import '$routes/fuz.css';
	import '@fuzdev/fuz_code/theme.css';

	import type {Snippet} from 'svelte';

	import ThemeRoot from '$lib/ThemeRoot.svelte';
	import ContextmenuRoot from '$lib/ContextmenuRoot.svelte';
	import {library_context, Library} from '$lib/library.svelte.js';
	import {library_json_from_modules} from '@fuzdev/fuz_util/library_json.js';
	import {modules} from 'virtual:svelte-docinfo';
	import Spiders from '$lib/Spiders.svelte';

	import package_json from '../../package.json' with {type: 'json'};

	const {
		children,
	}: {
		children: Snippet;
	} = $props();

	const library_json = library_json_from_modules(package_json, modules);

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
