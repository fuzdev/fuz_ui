<script lang="ts">
	/**
	 * Navigation link marked `selected` while its `href` is the current page
	 * or, unless `exact`, a page beneath it (`/admin` for `/admin/repos/foo`).
	 * The current page itself also carries `aria-current="page"`, so CSS and
	 * assistive tech can tell "this page" from "this section". A relative
	 * `href` resolves against the current url, so the server render matches
	 * the client's.
	 *
	 * The `highlighted` name is left free for orthogonal emphasis (recent
	 * activity, unread badges, search matches), as `DocsPageLinks` uses it.
	 *
	 * @module
	 */

	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import { page } from '$app/state';
	import type { OmitStrict } from '@fuzdev/fuz_util/types.ts';

	import { href_contains_current_page, href_is_current_page } from './page_helpers.ts';

	const {
		href,
		exact = false,
		selected: selected_prop,
		children,
		...rest
	}: OmitStrict<SvelteHTMLElements['a'], 'href' | 'children'> & {
		/** The link's `href`, already resolved (e.g. with `resolve` from `$app/paths`). */
		href: string;
		/**
		 * Whether only the page itself selects the link, not pages beneath it. A link
		 * to the site root (or the base path) contains every page, so it wants `exact`.
		 * @default false
		 */
		exact?: boolean;
		/** Overrides the derived `selected` state, e.g. for a link that owns several routes. */
		selected?: boolean;
		children?: Snippet;
	} = $props();

	const current = $derived(href_is_current_page(href, page.url));
	const selected = $derived(
		selected_prop ?? (exact ? current : href_contains_current_page(href, page.url))
	);
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a {...rest} {href} class={[rest.class, { selected }]} aria-current={current ? 'page' : undefined}>
	{@render children?.()}
</a>
