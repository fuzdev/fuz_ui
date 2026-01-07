<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import DeclarationLink from './DeclarationLink.svelte';
	import {library_context} from './library.svelte.js';

	const {type}: {type: string} = $props();

	const library = library_context.get();

	// TODO is not extensible
	// TODO maybe better name?
</script>

{#if library.lookup_declaration(type)}
	<DeclarationLink name={type} />
{:else}
	<Code lang="ts" content={type} inline />
{/if}
