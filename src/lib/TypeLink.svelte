<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import DeclarationLink from './DeclarationLink.svelte';
	import {library_context} from './library.svelte.js';

	const {
		type,
		hash,
	}: {
		type: string;
		/** URL fragment to append, with or without the `#`. */
		hash?: string;
	} = $props();

	const library = library_context.get();

	// TODO is not extensible
	// TODO maybe better name?
</script>

{#if library.lookup_declaration(type)}
	<DeclarationLink name={type} {hash} />
{:else}
	<Code lang="ts" content={type} inline />
{/if}
