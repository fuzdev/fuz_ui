<script lang="ts">
	import type {Snippet} from 'svelte';
	import {page} from '$app/state';
	import {resolve} from '$app/paths';

	import TomeHeader from './TomeHeader.svelte';
	import {tome_context, type Tome} from './tome.js';
	import {DOCS_PATH_DEFAULT, docs_links_context, docs_slugify} from './docs_helpers.svelte.js';
	import {intersect} from './intersect.svelte.js';

	const {
		tome,
		docs_path = DOCS_PATH_DEFAULT,
		header,
		children,
	}: {
		tome: Tome;
		docs_path?: string;
		header?: Snippet;
		children: Snippet;
	} = $props();

	const docs_links = docs_links_context.get();

	tome_context.set(tome); // TODO make reactive?

	const fragment = $derived(docs_slugify(tome.name));

	const at_root = $derived(page.url.pathname === resolve(docs_path as any));
</script>

<section
	class="tome_content width_upto_md mb_xl9"
	{@attach intersect(() =>
		at_root
			? ({intersecting}) => {
					if (intersecting) {
						docs_links.fragments_onscreen.add(fragment);
					} else {
						docs_links.fragments_onscreen.delete(fragment);
					}
				}
			: null,
	)}
>
	<header
		class="mb_xl3 position_sticky top_0"
		{@attach intersect(() =>
			at_root
				? null
				: ({intersecting}) => {
						if (intersecting) {
							docs_links.fragments_onscreen.add(fragment);
						} else {
							docs_links.fragments_onscreen.delete(fragment);
						}
					},
		)}
	>
		{#if header}
			{@render header()}
		{:else}
			<TomeHeader />
		{/if}
	</header>
	{@render children()}
</section>
