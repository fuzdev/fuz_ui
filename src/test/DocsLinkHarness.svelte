<!--
@component

Test harness: sets `library_context` around `DocsLink` so the component can
resolve references against a caller-supplied (typically fake) `Library`.
-->
<script lang="ts">
	import DocsLink from '#lib/DocsLink.svelte';
	import { library_context, type Library } from '#lib/library.svelte.ts';

	const { reference, library }: { reference: string; library: Library } = $props();

	library_context.set(() => library);
</script>

<DocsLink {reference} />
