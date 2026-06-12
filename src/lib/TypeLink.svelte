<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';
	import type {HTMLAttributes, SvelteHTMLElements} from 'svelte/elements';

	import DeclarationLink from './DeclarationLink.svelte';
	import {library_context} from './library.svelte.js';

	const {
		type,
		hash,
		a_attrs,
		code_attrs,
		...rest
	}: // generic element attrs, the common denominator of the rendered roots -
	// assignable to the anchor rest of `DeclarationLink` and the code rest of `Code`
	HTMLAttributes<HTMLElement> & {
		type: string;
		/** URL fragment to append, with or without the `#`. */
		hash?: string;
		/** Anchor attributes, applied only when the type resolves to a declaration link. */
		a_attrs?: SvelteHTMLElements['a'];
		/** Code attributes, applied only to the fallback `Code` when the type doesn't resolve. */
		code_attrs?: SvelteHTMLElements['code'];
	} = $props();

	const get_library = library_context.get();
	const library = $derived(get_library());

	// TODO maybe better name?
</script>

{#if library.declaration_by_name.has(type)}
	<DeclarationLink {...rest} {...a_attrs} name={type} {hash} />
{:else}
	<Code {...rest} {...code_attrs} lang="ts" content={type} inline />
{/if}
