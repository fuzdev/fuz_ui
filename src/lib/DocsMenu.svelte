<script lang="ts">
	import {page} from '$app/state';
	import {slide} from 'svelte/transition';
	import type {Snippet} from 'svelte';
	import type {SvelteHTMLElements} from 'svelte/elements';

	import DocsList from './DocsList.svelte';
	import {to_tome_pathname, type Tome} from './tome.js';
	import DocsMenuHeader from './DocsMenuHeader.svelte';

	const {
		tomes,
		children,
		expand_width = false,
		...rest
	}: SvelteHTMLElements['div'] & {
		tomes: Array<Tome>;
		children?: Snippet<[category: string]>;
		expand_width?: boolean;
	} = $props();

	const tomes_by_category = $derived(
		tomes.reduce<Record<string, Array<Tome>>>((result, c) => {
			(result[c.category] ??= []).push(c);
			return result;
		}, {}),
	);
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->

<DocsList {...rest} {expand_width} margin={false} class="docs_menu">
	<ul class="unstyled">
		{#each Object.entries(tomes_by_category) as [category, tomes] (category)}
			<li class="category">
				{#if children}{@render children(category)}{:else}<DocsMenuHeader>{category}</DocsMenuHeader
					>{/if}
				<ul class="unstyled">
					{#each tomes as item (item)}
						{@const pathname = to_tome_pathname(item)}
						<li role="none" transition:slide>
							<a class="menu_item" href={pathname} class:selected={pathname === page.url.pathname}
								><div class="ellipsis">{item.name}</div></a
							>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
</DocsList>

<style>
	.category {
		margin: var(--space_xl6) 0;
	}
</style>
