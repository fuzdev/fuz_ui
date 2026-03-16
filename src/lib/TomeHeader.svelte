<script lang="ts">
	import {page} from '$app/state';
	import {DEV} from 'esm-env';
	import type {SvelteHTMLElements} from 'svelte/elements';

	import {tome_context} from './tome.js';
	import Hashlink from './Hashlink.svelte';
	import {docs_links_context, docs_slugify, to_docs_path_info} from './docs_helpers.svelte.js';

	// eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
	const props: SvelteHTMLElements['h1'] | SvelteHTMLElements['h2'] = $props();

	const get_tome = tome_context.get();
	if (DEV && !get_tome) throw Error('TomeHeader expects a tome in context'); // eslint-disable-line @typescript-eslint/no-unnecessary-condition
	const tome = $derived(get_tome());

	const docs_links = docs_links_context.get();

	const fragment = $derived(docs_slugify(tome.name));
	const path_slug = $derived(docs_slugify(tome.name));
	$effect(() => {
		const id = docs_links.add(fragment, tome.name, page.url.pathname);
		return () => docs_links.remove(id);
	});

	const {path, path_is_selected} = $derived(to_docs_path_info(path_slug, page.url.pathname));
</script>

<svelte:element this={path_is_selected ? 'h1' : 'h2'} {...props} class="tome_header">
	{#if path_is_selected}
		{@render content(tome.name)}
	{:else}
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a href={path}>{@render content(tome.name)}</a>
	{/if}
	<Hashlink {fragment} />
</svelte:element>

{#snippet content(name: string)}
	{name}
{/snippet}

<style>
	.tome_header {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: var(--space_xl4);
	}
	/* TODO @many how can this be done composably? currently using `:global` at usage site - ideally we'd continue to use :hover instead of JS */
	.tome_header:hover :global(.hashlink) {
		opacity: 1;
	}
</style>
