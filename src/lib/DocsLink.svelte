<script lang="ts">
	import type {Snippet} from 'svelte';

	import ModuleLink from './ModuleLink.svelte';
	import DeclarationLink from './DeclarationLink.svelte';
	import {library_context} from './library.svelte.js';
	import type {Declaration} from './declaration.svelte.js';
	import type {Module} from './module.svelte.js';

	const {
		reference,
		hash,
		display_text,
		children: children_prop,
	}: {
		reference: string;
		/** URL fragment to append, with or without the `#`. */
		hash?: string;
		display_text?: string | null;
		children?: Snippet<[Declaration | undefined, Module | undefined]>;
	} = $props();
	const library = library_context.get();

	// Try to find as declaration first, then module
	const declaration = $derived(library.lookup_declaration(reference));
	const module = $derived(declaration ? declaration.module : library.lookup_module(reference));
</script>

{#if declaration}
	<DeclarationLink name={reference} {hash}>
		{@render children()}
	</DeclarationLink>
{:else if module}
	<ModuleLink module_path={module.path} {hash}>
		{@render children()}
	</ModuleLink>
{:else}
	<code>{@render children()}</code>
{/if}

{#snippet children()}{#if children_prop}{@render children_prop(
			declaration,
			module,
		)}{:else}{display_text ?? reference}{/if}{/snippet}
