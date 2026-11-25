<!--
@component

@cssprop --card_width - width of the card
@cssprop --border_radius - corner radius of the card
@cssprop --shadow - box shadow of a linked card in every state, replacing its default inset shadows
@cssprop --icon_size - size of the icon
@cssprop --icon_gap_inline - space between the icon and the content for `start` and `end`
@cssprop --icon_gap_block - space between the icon and the content for `top` and `bottom`
-->
<script lang="ts">
	import { page } from '$app/state';
	import { DEV } from 'esm-env';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes, SvelteHTMLElements } from 'svelte/elements';

	import { href_is_current_page } from './page_helpers.ts';

	// TODO think through Alert+Card APIs together, one can be a button and the other a link atm

	const {
		href,
		tag,
		align = 'start',
		icon,
		a_attrs,
		children,
		...rest
	}: // generic element attrs, the common denominator of the rendered roots;
		// branch-specific attributes go in `a_attrs`
		HTMLAttributes<HTMLElement> & {
			/**
			 * Renders the card as an `<a>`, marked `selected` while it leads to the current
			 * page, ignoring a trailing slash, the query, and the hash.
			 */
			href?: string | undefined;
			/** The element to render, defaulting to `a` with an `href` and `div` without. */
			tag?: keyof HTMLElementTagNameMap | undefined;
			/**
			 * The card's layout: where the icon sits, at the inline start or end beside the
			 * content or above or below it, and how the content aligns, toward the end for
			 * `end` and centered for `top` and `bottom`.
			 * @default 'start'
			 */
			align?: 'start' | 'end' | 'top' | 'bottom';
			/**
			 * A decorative icon, hidden from assistive tech: a string like an emoji or a glyph,
			 * or a snippet for anything else. None when absent, null, or empty.
			 */
			icon?: string | Snippet | null;
			/** Anchor attributes, applied only when `href` renders the card as an `<a>`. */
			a_attrs?: SvelteHTMLElements['a'];
			children: Snippet;
		} = $props();

	const link = $derived(!!href);
	const selected = $derived(!!href && href_is_current_page(href, page.url));
	// the tag renders through `svelte:element`, so declare the styled one for fuz_css extraction
	// @fuz-elements a
	const final_tag = $derived(tag ?? (link ? 'a' : 'div'));
	const inferred_attrs = $derived(link ? { ...a_attrs, href } : undefined);

	if (DEV) {
		$effect(() => {
			if (href && final_tag !== 'a') {
				// eslint-disable-next-line no-console
				console.error(
					`Card received href "${href}" with tag "${final_tag}" - href renders only on an anchor`
				);
			}
		});
	}
</script>

<!-- a button that isn't told otherwise doesn't submit a form around it -->
<svelte:element
	this={final_tag}
	type={final_tag === 'button' ? 'button' : undefined}
	{...rest}
	{...inferred_attrs}
	class={['card', align, rest.class, inferred_attrs?.class, { link, selected }]}
>
	{#if align === 'start' || align === 'top'}
		{@render icon_snippet()}
	{/if}
	<div class="content">
		{@render children()}
	</div>
	{#if align === 'end' || align === 'bottom'}
		{@render icon_snippet()}
	{/if}
</svelte:element>

<!-- an empty string is no icon, so no empty element takes the icon's margin -->
{#snippet icon_snippet()}
	{#if icon}
		<div class="icon" aria-hidden="true">
			{#if typeof icon === 'string'}
				{icon}
			{:else}
				{@render icon()}
			{/if}
		</div>
	{/if}
{/snippet}

<style>
	.card {
		--icon_size: var(--icon_size_lg);
		--icon_gap_inline: var(--space_xl2);
		--icon_gap_block: var(--space_lg);
		display: flex;
		/* only one axis applies per layout: column-gap for `start`/`end`, row-gap for `top`/`bottom` */
		gap: var(--icon_gap_block) var(--icon_gap_inline);
		font-size: var(--font_size_xl2);
		align-items: center;
		padding: var(--space_lg) var(--space_xl2);
		width: var(--card_width);
		background-color: var(--ink_10);
		border-radius: var(--border_radius, var(--border_radius_md));
		text-decoration: none;
		text-align: start;
	}
	.end {
		justify-content: flex-end;
	}
	.top,
	.bottom {
		flex-direction: column;
		text-align: center;
	}
	.link {
		box-shadow: var(
			--shadow,
			var(--shadow_inset_bottom_sm)
				color-mix(
					in oklab,
					var(--shadow_color, var(--shadow_color_umbra)) var(--shadow_alpha_40),
					transparent
				)
		);
	}
	.link:active {
		box-shadow: var(
			--shadow,
			var(--shadow_inset_top_sm)
				color-mix(
					in oklab,
					var(--shadow_color, var(--shadow_color_umbra)) var(--shadow_alpha_40),
					transparent
				)
		);
	}
	.link.selected .content,
	.link:hover .content {
		text-decoration: underline;
	}
	.end .content {
		text-align: end;
	}
	/* a little room on the side away from the icon */
	.start:has(> .icon) .content {
		padding-inline-end: var(--space_sm);
	}
	.end:has(> .icon) .content {
		padding-inline-start: var(--space_sm);
	}
	/* `line-height: 1` keeps a glyph's box as tall as its size, matching a snippet's */
	.icon {
		font-size: var(--icon_size);
		line-height: 1;
		text-align: center;
		display: flex;
		justify-content: center;
	}
	@media (max-width: 460px) {
		.card {
			font-size: var(--font_size_xl);
		}
	}
	/* the icon's size and gaps come from the variables, whichever side it is on */
	@media (max-width: 380px) {
		.card {
			--icon_size: var(--icon_size_md);
			--icon_gap_inline: var(--space_md);
			--icon_gap_block: var(--space_sm);
			padding-inline: var(--space_lg);
			font-size: var(--font_size_lg);
		}
	}
</style>
