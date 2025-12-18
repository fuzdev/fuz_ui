<script lang="ts">
	import {page} from '$app/state';
	import type {Snippet} from 'svelte';
	import type {SvelteHTMLElements} from 'svelte/elements';

	// TODO think through Alert+Card APIs together, one can be a button and the other a link atm

	const {
		href,
		tag,
		align = 'left',
		icon,
		children,
		...rest
	}: SvelteHTMLElements['div'] &
		SvelteHTMLElements['a'] & {
			tag?: string | undefined;
			align?: 'left' | 'right' | 'above' | 'below';
			icon?: string | Snippet;
			children: Snippet;
		} = $props();

	const link = $derived(!!href);
	const selected = $derived(link && page.url.pathname === href);
	const final_tag = $derived(tag ?? (link ? 'a' : 'div'));
	const inferred_attrs = $derived(link ? {href} : undefined);

	const left = $derived(align === 'left');
	const right = $derived(align === 'right');
	const above = $derived(align === 'above');
	const below = $derived(align === 'below');

	const final_icon: string | Snippet = $derived(icon ?? (link ? '🔗' : '🪧'));
</script>

<svelte:element
	this={final_tag}
	{...rest}
	{...inferred_attrs}
	class="card {rest.class}"
	class:link
	class:selected
	class:left
	class:right
	class:above
	class:below
>
	{#if align === 'left' || align === 'above'}
		{@render icon_snippet()}
	{/if}
	<div class="content">
		{@render children()}
	</div>
	{#if align === 'right' || align === 'below'}
		{@render icon_snippet()}
	{/if}
</svelte:element>

<!-- TODO name? -->
{#snippet icon_snippet()}
	<div class="icon">
		{#if typeof final_icon === 'string'}
			{final_icon}
		{:else}
			{@render final_icon()}
		{/if}
	</div>
{/snippet}

<style>
	.card {
		--icon_size: var(--icon_size_lg);
		--icon_margin: var(--space_lg);
		display: flex;
		font-size: var(--font_size_xl2);
		align-items: center;
		padding: var(--space_lg);
		width: var(--card_width);
		background-color: var(--fg_1);
		border-radius: var(--border_radius, var(--border_radius_md));
		text-decoration: none;
		text-align: left;
	}
	.right {
		justify-content: flex-end;
	}
	.above,
	.below {
		flex-direction: column;
		text-align: center;
	}
	.link {
		box-shadow: var(
			--shadow,
			var(--shadow_inset_bottom_sm)
				color-mix(in hsl, var(--shadow_color) var(--shadow_alpha_2), transparent)
		);
	}
	.link:active {
		box-shadow: var(
			--shadow,
			var(--shadow_inset_top_sm)
				color-mix(in hsl, var(--shadow_color) var(--shadow_alpha_2), transparent)
		);
	}
	.link.selected .content,
	.link:hover .content {
		text-decoration: underline;
	}
	.left .content {
		padding-right: var(--space_sm);
	}
	.right .content {
		text-align: right;
		padding-left: var(--space_sm);
	}
	.icon {
		font-size: var(--icon_size, var(--icon_size_md));
		text-align: center;
		display: flex;
		justify-content: center;
	}
	/* TODO @many remove all :global usage after https://github.com/sveltejs/svelte/issues/10143 */
	.left :global(.icon) {
		margin-right: var(--icon_margin);
	}
	.right :global(.icon) {
		margin-left: var(--icon_margin);
	}
	.above :global(.icon) {
		margin-bottom: var(--icon_margin);
	}
	.below :global(.icon) {
		margin-top: var(--icon_margin);
	}
	@media (max-width: 460px) {
		.card {
			font-size: var(--font_size_xl);
		}
	}
	@media (max-width: 380px) {
		.card {
			--icon_size: var(--icon_size_md);
			--icon_margin: var(--space_sm);
			font-size: var(--font_size_lg);
		}
		.icon {
			font-size: var(--icon_size_md);
			margin-right: var(--space_sm);
		}
		.right :global(.icon) {
			margin-right: 0;
			margin-left: var(--space_sm);
		}
	}
</style>
