<script lang="ts">
	import {page} from '$app/state';
	import type {SvelteHTMLElements} from 'svelte/elements';

	import DocsModulesList from './DocsModulesList.svelte';
	import DocsPageLinks from './DocsPageLinks.svelte';
	import {to_tome_pathname, Tome} from './tome.js';
	import {docs_links_context, DOCS_API_PATH} from './docs_helpers.svelte.js';
	import {library_context} from './library.svelte.js';
	import TomeLink from './TomeLink.svelte';
	import ModuleLink from './ModuleLink.svelte';
	import DeclarationLink from './DeclarationLink.svelte';

	const {
		tomes,
		tomes_by_name,
		sidebar = true,
		...rest
	}: SvelteHTMLElements['aside'] & {
		tomes: Array<Tome>;
		tomes_by_name: Map<string, Tome>;
		sidebar?: boolean; // TODO @many dialog navs (this shouldn't exist)
	} = $props();

	const selected_tome = $derived(tomes.find((t) => to_tome_pathname(t) === page.url.pathname));

	const tomes_related_to_selected = $derived(
		selected_tome?.related_tomes
			.map((name) => tomes_by_name.get(name))
			.filter((t) => t !== undefined) ?? [],
	);

	const library = library_context.get();

	const modules_related_to_selected = $derived(
		selected_tome?.related_modules
			.map((path) => library.lookup_module(path))
			.filter((m) => m !== undefined) ?? [],
	);

	const declarations_related_to_selected = $derived(
		selected_tome?.related_declarations
			.map((name) => library.lookup_declaration(name))
			.filter((d) => d !== undefined) ?? [],
	);

	const docs_links = docs_links_context.get();

	const should_show_page_links = $derived(docs_links.docs_links.length > 0);

	const at_api_root = $derived(page.url.pathname === DOCS_API_PATH);
	const at_module = $derived(page.url.pathname.startsWith(DOCS_API_PATH + '/'));
</script>

<!-- TODO probably add a `nav` wrapper? around which? -->
<aside {...rest} class="docs_tertiary_nav unstyled {rest.class}">
	{#if should_show_page_links}
		<DocsPageLinks {sidebar} expand_width />
	{/if}
	{#if at_api_root || at_module}
		<DocsModulesList expand_width />
	{/if}
	{#if tomes_related_to_selected.length}
		<section class="related_section">
			<h4 class="mb_sm">related tomes</h4>
			<ul class="unstyled">
				{#each tomes_related_to_selected as tome (tome.name)}
					<li><TomeLink name={tome.name} class="menu_item" /></li>
				{/each}
			</ul>
		</section>
	{/if}
	{#if modules_related_to_selected.length}
		<section class="related_section">
			<h4 class="mb_sm">related modules</h4>
			<ul class="unstyled">
				{#each modules_related_to_selected as module (module.path)}
					<li><ModuleLink module_path={module.path} class="menu_item" /></li>
				{/each}
			</ul>
		</section>
	{/if}
	{#if declarations_related_to_selected.length}
		<section class="related_section">
			<h4 class="mb_sm">related declarations</h4>
			<ul class="unstyled">
				{#each declarations_related_to_selected as declaration (declaration.name)}
					<li><DeclarationLink name={declaration.name} class="menu_item" /></li>
				{/each}
			</ul>
		</section>
	{/if}
</aside>

<style>
	.docs_tertiary_nav {
		/* TODO @many lots of duplicate code between `DocsSecondaryNav` and `DocsTertiaryNav` */
		position: fixed;
		right: 0;
		top: var(--docs_primary_nav_height);
		z-index: 1;
		width: var(--docs_sidebar_width);
		height: calc(100% - var(--docs_primary_nav_height));
		padding: var(
			--docs_secondary_nav_padding
		); /* needed with `overflow: auto` to avoid cutting off outline */
		overflow: auto;
		scrollbar-width: thin;
		background-color: var(--shade_10);
	}

	/* sync this breakpoint with `/docs/+layout` */
	@media (max-width: 1000px) {
		.docs_tertiary_nav {
			position: static;
			background-color: initial;
			overflow: initial;
		}
	}
</style>
