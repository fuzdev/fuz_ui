<!--
@component

@cssprop --hashlink_opacity - opacity at rest, `0` by default; a parent reveals the link on its own hover with `.parent:hover { --hashlink_opacity: 1; }` (it shows on focus and narrow screens regardless), and the parent should be `position: relative` to anchor the scroll target
@cssprop --hashlink_font_size - font size, `--font_size_lg` by default; `1em` sizes it with its row
-->
<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	const { fragment, children, ...rest }: SvelteHTMLElements['a'] & { fragment: string } = $props();
</script>

<a aria-label="hashlink" {...rest} class="hashlink {rest.class}" href="#{fragment}">
	{#if children}{@render children()}{:else}#{/if}
</a>
<span class="hashlink-scroll-target" id={fragment} aria-hidden="true"></span>

<style>
	.hashlink {
		flex-shrink: 0;
		font-size: var(--hashlink_font_size, var(--font_size_lg));
		padding: 0 var(--space_sm);
		margin-left: var(--space_sm);
		opacity: var(--hashlink_opacity, 0);
		transition: opacity var(--duration_2);
	}

	/* a keyboard user reaches it without hovering, so focus reveals it */
	.hashlink:focus-visible {
		opacity: 1;
	}

	.hashlink-scroll-target {
		position: absolute;
		top: calc(var(--font_size, var(--font_size_md)) * -4);
		left: 0;
	}

	/* sync this breakpoint with `Docs` */
	@media (max-width: 800px) {
		.hashlink {
			opacity: 1;
		}
	}
</style>
