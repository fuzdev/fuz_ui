<script lang="ts">
	import type {SvelteHTMLElements} from 'svelte/elements';
	import {ensure_start} from '@fuzdev/fuz_util/string.js';

	import {library_context} from './library.svelte.js';
	import {contextmenu_attachment} from './contextmenu_state.svelte.js';
	import {create_declaration_contextmenu} from './declaration_contextmenu.js';

	const {
		name,
		hash,
		children,
		class: class_prop = 'chip',
		...rest
	}: SvelteHTMLElements['a'] & {
		name: string;
		/** URL fragment to append, with or without the `#`. */
		hash?: string;
	} = $props();

	const library = library_context.get();

	const declaration = $derived(library.lookup_declaration(name));

	const contextmenu_entries = $derived(
		declaration ? create_declaration_contextmenu(declaration) : undefined,
	);

	// TODO @many support full https:// url variants - automatic detection? library prop?
</script>

{#if declaration}
	<!-- TODO maybe colors per declaration.kind? -->
	<!-- eslint-disable svelte/no-navigation-without-resolve -->
	<a
		{...rest}
		class="declaration_link {class_prop}"
		href={declaration.url_api + (hash ? ensure_start(hash, '#') : '')}
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
