<script lang="ts">
	import { page } from '$app/state';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import DocsPageLinks from './DocsPageLinks.svelte';
	import { tome_to_pathname, type Tome } from './tome.ts';
	import { docs_links_context } from './docs_helpers.svelte.ts';
	import { library_context } from './library.svelte.ts';
	import TomeLink from './TomeLink.svelte';
	import ModuleLink from './ModuleLink.svelte';
	import DeclarationLink from './DeclarationLink.svelte';

	const {
		tomes,
		tomes_by_slug,
		...rest
	}: SvelteHTMLElements['aside'] & {
		tomes: Array<Tome>;
		tomes_by_slug: Map<string, Tome>;
	} = $props();

	const selected_tome = $derived(tomes.find((t) => tome_to_pathname(t) === page.url.pathname));

	const tomes_related_to_selected = $derived(
		selected_tome?.related_tomes
			.map((slug) => tomes_by_slug.get(slug))
			.filter((t) => t !== undefined) ?? []
	);

	const get_library = library_context.get();
	const library = $derived(get_library());

	const modules_related_to_selected = $derived(
		selected_tome?.related_modules
			.map((path) => library.module_by_path.get(path))
			.filter((m) => m !== undefined) ?? []
	);

	const declarations_related_to_selected = $derived(
		selected_tome?.related_declarations
			.map((name) => library.declaration_by_name.get(name))
			.filter((d) => d !== undefined) ?? []
	);

	const docs_links = docs_links_context.get();

	const should_show_page_links = $derived(docs_links.docs_links.length > 0);
</script>

<!-- TODO probably add a `nav` wrapper? around which? -->
<aside {...rest} class="docs-tertiary-nav unstyled {rest.class}">
	{#if should_show_page_links}
		<DocsPageLinks expand_width />
	{/if}
	{#if tomes_related_to_selected.length}
		<section class="related-section">
			<h4 class="mb_sm">related tomes</h4>
			<ul class="unstyled">
				{#each tomes_related_to_selected as tome (tome.slug)}
					<li><TomeLink slug={tome.slug} class="menuitem" /></li>
				{/each}
			</ul>
		</section>
	{/if}
	{#if modules_related_to_selected.length}
		<section class="related-section">
			<h4 class="mb_sm">related modules</h4>
			<ul class="unstyled">
				{#each modules_related_to_selected as module (module.path)}
					<li><ModuleLink module_path={module.path} class="menuitem" /></li>
				{/each}
			</ul>
		</section>
	{/if}
	{#if declarations_related_to_selected.length}
		<section class="related-section">
			<h4 class="mb_sm">related declarations</h4>
			<ul class="unstyled">
				{#each declarations_related_to_selected as declaration (declaration.name)}
					<li><DeclarationLink name={declaration.name} class="menuitem" /></li>
				{/each}
			</ul>
		</section>
	{/if}
</aside>
