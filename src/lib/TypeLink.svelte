<!--
@component

Renders a type reference, linking the parts that resolve to library declarations.

With `type_info` it delegates to `TypeJsonView`, which renders the structured
tree — reference names become `DeclarationLink`s, as do the names inside its
terminal text, and everything else is syntax-highlighted in place, so
`Map<string, Tome> | null` links `Map` and `Tome` independently, with the flat
`type` as hover text. Without it the
`type` string links whole when it names a declaration outright, and otherwise
by the names found in it (`to_type_text_tokens`), so a function type's
`(a: Options) => Result` still links `Options` and `Result`.
-->
<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';
	import type { HTMLAttributes, SvelteHTMLElements } from 'svelte/elements';
	import type { TypeJson } from 'svelte-docinfo/types.js';

	import DeclarationLink from './DeclarationLink.svelte';
	import TypeJsonView from './TypeJsonView.svelte';
	import { library_context } from './library.svelte.ts';
	import { to_type_text_tokens, type_name_is_keyword } from './type_link.ts';

	const {
		type,
		type_info,
		hash,
		a_attrs,
		code_attrs,
		...rest
	}: // generic element attrs, the common denominator of the rendered roots - // assignable to the anchor rest of `DeclarationLink` and the code rest of `Code`
		HTMLAttributes<HTMLElement> & {
			type: string;
			/**
			 * Structured type tree, when svelte-docinfo emitted one beside the flat
			 * string — rendered via `TypeJsonView` (per-node linkification, with
			 * `type` as hover text) instead of the string matching below. An
			 * absent tree falls through to `type`, so call sites pass both fields
			 * unconditionally. `hash` and the rest/`a_attrs`/`code_attrs`
			 * attributes apply only to the flat branches, not the delegated tree.
			 */
			type_info?: TypeJson;
			/** URL fragment for a whole-string declaration link, with or without the `#`. */
			hash?: string;
			/** Anchor attributes, applied only when the whole type resolves to a declaration link. */
			a_attrs?: SvelteHTMLElements['a'];
			/** Code attributes, applied to the `code` root when the whole type doesn't resolve. */
			code_attrs?: SvelteHTMLElements['code'];
		} = $props();

	const get_library = library_context.get();
	const library = $derived(get_library());

	// a keyword type (`string`) never links, even when the library exports a
	// declaration of that name
	const links_whole = $derived(
		!type_name_is_keyword(type) && library.declaration_by_name.has(type)
	);

	// the flat string's resolvable names; only read when there's no tree and
	// the whole string isn't itself a declaration
	const tokens = $derived(
		to_type_text_tokens(type, (name) => library.declaration_by_name.has(name))
	);
	const tokens_link = $derived(tokens.some((token) => token.kind === 'name'));

	// TODO maybe better name?
</script>

{#if type_info}
	<!-- the flat string rides along as hover text so the checker's expansion
		stays reachable where the tree replaced it with a recovered name -->
	<TypeJsonView {type_info} title={type} />
{:else if links_whole}
	<DeclarationLink {...rest} {...a_attrs} name={type} {hash} />
{:else if tokens_link}
	<!-- token adjacency survives the multi-line template, as in `TypeJsonView` -->
	<code {...rest} {...code_attrs} class={['type-link', rest.class, code_attrs?.class]}>
		{#each tokens as token, i (i)}
			{#if token.kind === 'name'}
				<DeclarationLink name={token.text} />
			{:else}
				<Code lang="ts" content={token.text} inline />
			{/if}
		{/each}
	</code>
{:else}
	<Code {...rest} {...code_attrs} lang="ts" content={type} inline />
{/if}

<style>
	/* the outer element is the one code pill; inner `Code` fragments contribute
	   syntax coloring only */
	.type-link :global(code) {
		background: transparent;
		padding: 0;
	}
</style>
