<script lang="ts">
	import {library_context, type Library} from './library.svelte.js';
	import {get_tome_by_name, type Tome} from './tome.js';
	import TomeContent from './TomeContent.svelte';
	import TomeSection from './TomeSection.svelte';
	import TomeSectionHeader from './TomeSectionHeader.svelte';
	import DocsSearch from './DocsSearch.svelte';
	import ModuleLink from './ModuleLink.svelte';
	import Mdz from './Mdz.svelte';
	import ApiDeclarationList from './ApiDeclarationList.svelte';
	import {create_module_declaration_search} from './api_search.svelte.js';

	const {
		module_path: module_path_param,
		library = library_context.get(),
		tome = get_tome_by_name('api'),
	}: {
		/**
		 * The module path parameter from the route (e.g., "lib/Button.svelte").
		 */
		module_path: string | Array<string>;
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
	} = $props();

	// normalize module_path to string (could be array from [...module_path] route param)
	const module_path = $derived(
		Array.isArray(module_path_param) ? module_path_param.join('/') : module_path_param,
	);

	// find the module using the lookup helper
	const module = $derived(library.lookup_module(module_path));

	// fallback for 404
	const module_name = $derived(module?.path || '[missing module]');

	const search = $derived(create_module_declaration_search(module?.declarations ?? []));

	// GitHub source URL for the module
	const source_url = $derived(module?.url_github);
</script>

<svelte:head>
	<title>{module_name} - API docs - {library.package_json.name}</title>
</svelte:head>

<TomeContent {tome}>
	{#snippet header()}
		<h1 class="mt_xl4">{module_name}</h1>
	{/snippet}

	{#if !module}
		<section>
			<p>Module not found: {module_path}</p>
		</section>
	{:else}
		{#if module.module_comment}
			<section>
				<Mdz content={module.module_comment} />
			</section>
		{/if}
		<!-- Declarations Section -->
		<TomeSection>
			<TomeSectionHeader text="Declarations" />

			<section>
				{#if search.all.length > 1}
					<DocsSearch
						placeholder="search declarations in this module..."
						declaration_count={search.all.length}
						filtered_declaration_count={search.query.trim() ? search.filtered.length : undefined}
						bind:search_query={search.query}
					/>
				{/if}

				{#if source_url}
					<p>
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
						<a href={source_url} class="chip" target="_blank" rel="noopener">view source</a>
					</p>
				{/if}
			</section>

			<ApiDeclarationList declarations={search.filtered} search_query={search.query} />
		</TomeSection>

		<!-- Depends on Section -->
		{#if module.dependencies}
			<TomeSection>
				<TomeSectionHeader text="Depends on" />
				<ul>
					{#each module.dependencies as dep_path (dep_path)}
						<li>
							<ModuleLink module_path={dep_path} />
						</li>
					{/each}
				</ul>
			</TomeSection>
		{/if}

		<!-- Imported by Section -->
		{#if module.dependents}
			<TomeSection>
				<TomeSectionHeader text="Imported by" />
				<ul>
					{#each module.dependents as dependent_path (dependent_path)}
						<li>
							<ModuleLink module_path={dependent_path} />
						</li>
					{/each}
				</ul>
			</TomeSection>
		{/if}
	{/if}
</TomeContent>
