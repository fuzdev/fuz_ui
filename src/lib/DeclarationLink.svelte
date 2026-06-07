<script lang="ts">
	import type {SvelteHTMLElements} from 'svelte/elements';
	import {ensure_start} from '@fuzdev/fuz_util/string.js';

	import {library_context} from './library.svelte.js';
	import {contextmenu_attachment} from './contextmenu_state.svelte.js';
	import {create_declaration_contextmenu} from './declaration_contextmenu.js';

	const {
		name,
		hash,
		full = false,
		children,
		class: class_prop = 'chip',
		...rest
	}: SvelteHTMLElements['a'] & {
		name: string;
		/** URL fragment to append, with or without the `#`. */
		hash?: string;
		/**
		 * Link to the library's own deployed docs (`url_api_full`) instead of a
		 * site-local path (`url_api`). Use when rendering a foreign library on a
		 * different site, e.g. an aggregator, so links don't dangle locally.
		 */
		full?: boolean;
	} = $props();

	const library = library_context.get();

	const declaration = $derived(library.declaration_by_name.get(name));

	// When linking a foreign library's docs, prefer its full URL; fall back to
	// the site-local path if `homepage_url` is unavailable.
	const url_api = $derived((full && declaration?.url_api_full) || declaration?.url_api);

	const contextmenu_entries = $derived(
		declaration ? create_declaration_contextmenu(declaration) : undefined,
	);
</script>

{#if declaration}
	<!-- TODO maybe colors per declaration.kind? -->
	<!-- eslint-disable svelte/no-navigation-without-resolve -->
	<a
		{...rest}
		class="declaration-link {class_prop}"
		href={url_api + (hash ? ensure_start(hash, '#') : '')}
		{@attach contextmenu_attachment(contextmenu_entries)}
	>
		{#if children}
			{@render children()}
		{:else}
			{name}
		{/if}
	</a>
{:else}
	<!-- Fallback to plain text if not found -->
	{#if children}
		{@render children()}
	{:else}
		{name}
	{/if}
{/if}
