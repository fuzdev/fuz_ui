<!--
@component

Test harness: sets `library_context` around `DeclarationDetail` so its
`ModuleLink` can resolve against a caller-supplied (typically fake) `Library`,
and optionally the section depth its heading levels follow.
-->
<script lang="ts">
	import DeclarationDetail from '#lib/DeclarationDetail.svelte';
	import type { Declaration } from '#lib/declaration.svelte.ts';
	import { library_context, type Library } from '#lib/library.svelte.ts';
	import { section_depth_context } from '#lib/TomeSection.svelte';

	const {
		declaration,
		library,
		depth
	}: { declaration: Declaration; library: Library; depth?: number } = $props();

	library_context.set(() => library);
	// svelte-ignore state_referenced_locally
	if (depth !== undefined) section_depth_context.set(depth);
</script>

<DeclarationDetail {declaration} />
