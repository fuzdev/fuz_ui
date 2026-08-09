<!--
@component

Renders svelte-docinfo's structured `TypeJson` tree as inline code: `reference`
nodes (and alias-carrying unions/intersections) link to API docs via
`DeclarationLink` when the name resolves in the library, terminal type text is
syntax-highlighted via fuz_code's `Code`, and structural punctuation comes
from svelte-docinfo's `typeJsonToTokens`, which owns spacing and
parenthesization so rendering is whitespace-exact.

The structured sibling of `TypeLink`, which renders flat type strings —
`TypeLink` delegates here when given `type_info`, and svelte-docinfo omits the
tree wherever the flat string is the whole story, so the two compose as
"structured when it says something, flat otherwise". Pass `title` (typically
the flat sibling string) to keep the expansion reachable on hover where the
tree replaced it with a recovered name.
-->
<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';
	import type { TypeJson } from 'svelte-docinfo/types.js';
	import { typeJsonToTokens } from 'svelte-docinfo/declaration-helpers.js';

	import DeclarationLink from './DeclarationLink.svelte';
	import { library_context } from './library.svelte.ts';

	const {
		type_info,
		title
	}: {
		type_info: TypeJson;
		/** Hover text for the root element — pass the flat type string so the checker's expansion stays reachable. */
		title?: string;
	} = $props();

	const get_library = library_context.get();
	const library = $derived(get_library());

	const tokens = $derived(typeJsonToTokens(type_info));

	// a bare name renders without the code wrapper, matching the plain chip
	// link `TypeLink` produces for whole-string matches
	const bare_name = $derived(
		tokens.length === 1 && tokens[0]!.kind === 'name' ? tokens[0]!.name : undefined
	);
</script>

{#snippet name_view(name: string, root_title?: string)}
	{#if library.declaration_by_name.has(name)}
		<DeclarationLink {name} title={root_title} />
	{:else}
		<Code lang="ts" content={name} inline title={root_title} />
	{/if}
{/snippet}

{#if bare_name !== undefined}
	{@render name_view(bare_name, title)}
{:else}
	<!-- token adjacency survives the multi-line template: Svelte trims
		block-boundary whitespace here, locked by the `TypeJsonView` render tests
		(`textContent` equality would catch stray spaces) -->
	<code class="type-json-view" {title}>
		{#each tokens as token, i (i)}
			{#if token.kind === 'text'}
				{token.text}
			{:else if token.kind === 'name'}
				{@render name_view(token.name)}
			{:else}
				<Code lang="ts" content={token.text} inline />
			{/if}
		{/each}
	</code>
{/if}

<style>
	/* the outer element is the one code pill; inner `Code` fragments contribute
	   syntax coloring only */
	.type-json-view :global(code) {
		background: transparent;
		padding: 0;
	}
</style>
