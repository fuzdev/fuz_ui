<script lang="ts">
	/**
	 * The tome menu, grouped by category, marking the current tome.
	 * `--docs_menu_category_spacing` sets the margin around each category
	 * (default `--space_xl6`), for a site that lists the menu in a denser nav.
	 *
	 * @module
	 */

	import { page } from '$app/state';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import DocsList from './DocsList.svelte';
	import { tome_to_pathname, tome_to_title, type DocsMenuTome } from './tome.ts';
	import { href_is_current_page } from './page_helpers.ts';
	import DocsMenuHeader from './DocsMenuHeader.svelte';

	const {
		tomes,
		children,
		...rest
	}: SvelteHTMLElements['div'] & {
		/**
		 * The tomes to list, grouped by category. Only their slug, title, and
		 * category are read, so a site's own nav can list them without importing
		 * their page components.
		 */
		tomes: Array<DocsMenuTome>;
		children?: Snippet<[category: string]>;
	} = $props();

	const tomes_by_category = $derived(
		tomes.reduce<Record<string, Array<DocsMenuTome>>>((result, c) => {
			(result[c.category] ??= []).push(c);
			return result;
		}, {})
	);
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->

<DocsList {...rest} margin={false} class="docs-menu {rest.class}">
	<ul class="unstyled">
		{#each Object.entries(tomes_by_category) as [category, tomes] (category)}
			<li class="category">
				{#if children}
					{@render children(category)}
				{:else}
					<DocsMenuHeader>{category}</DocsMenuHeader>
				{/if}
				<ul class="unstyled">
					{#each tomes as item (item)}
						{@const pathname = tome_to_pathname(item)}
						{@const current = href_is_current_page(pathname, page.url)}
						<li role="none">
							<a
								class={['menuitem', { selected: current }]}
								href={pathname}
								aria-current={current ? 'page' : undefined}
							>
								<div class="ellipsis">{tome_to_title(item)}</div>
							</a>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
</DocsList>

<style>
	.category {
		margin: var(--docs_menu_category_spacing, var(--space_xl6)) 0;
	}
</style>
