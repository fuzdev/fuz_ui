<script lang="ts">
	import {library_context, type Library} from './library.svelte.js';
	import {get_tome_by_name, type Tome} from './tome.js';
	import TomeContent from './TomeContent.svelte';
	import TomeSection from './TomeSection.svelte';
	import TomeLink from './TomeLink.svelte';
	import TomeSectionHeader from './TomeSectionHeader.svelte';
	import DocsSearch from './DocsSearch.svelte';
	import ApiDeclarationList from './ApiDeclarationList.svelte';
	import {create_declaration_search} from './api_search.svelte.js';

	const {
		library = library_context.get(),
		tome = get_tome_by_name('api'),
		minimal = false,
	}: {
		/**
		 * The library instance to render API docs for.
		 * Defaults to getting from library_context.
		 */
		library?: Library;
		/**
		 * The tome for the API docs page.
		 * Defaults to looking up the 'api' tome.
		 */
		tome?: Tome;
		/**
		 * Whether to show minimal content (just a link to full API docs).
		 * Used when the API index is shown on a parent docs page.
		 */
		minimal?: boolean;
	} = $props();

	const search = $derived(create_declaration_search(library));
</script>

<svelte:head>
	<title>API docs - {library.package_json.name}</title>
</svelte:head>

<TomeContent {tome}>
	{#if minimal}
		<section>
			<p>Browse the full <TomeLink name="api" /> docs.</p>
		</section>
	{:else}
		<TomeSection>
			<TomeSectionHeader text="Declarations" />

			<section>
				<p>{library.package_json.description}</p>

				{#if search.all.length > 1}
					<DocsSearch
						total_count={search.all.length}
						result_count={search.filtered.length}
						bind:search_query={search.query}
					/>
				{/if}
			</section>

			<ApiDeclarationList declarations={search.filtered} search_query={search.query} />
		</TomeSection>
	{/if}
</TomeContent>
