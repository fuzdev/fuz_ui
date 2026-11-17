<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	import DocsMenu from './DocsMenu.svelte';
	import type { Tome } from './tome.ts';

	const {
		tomes,
		header,
		footer,
		...rest
	}: SvelteHTMLElements['nav'] & {
		tomes: Array<Tome>;
		/** Rendered above the menu, e.g. links to the site's other sections. */
		header?: Snippet;
		/** Rendered below the menu. */
		footer?: Snippet;
	} = $props();
</script>

<nav aria-label="Secondary nav" {...rest} class={['docs-secondary-nav p_md', rest.class]}>
	{@render header?.()}
	<DocsMenu {tomes} />
	{@render footer?.()}
</nav>
