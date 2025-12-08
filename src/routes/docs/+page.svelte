<script lang="ts">
	import DocsContent from '$lib/DocsContent.svelte';
	import {tomes_context} from '$lib/tome.js';
	import {library_context} from '$lib/library.svelte.js';

	const tomes_by_name = tomes_context.get();

	const tomes = Array.from(tomes_by_name.values());

	const library = library_context.get();
</script>

<DocsContent {tomes} {library}>
	{#snippet repo_name()}
		<h1 class="mb_sm">fuz_ui</h1>
	{/snippet}
</DocsContent>
