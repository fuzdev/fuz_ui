<script lang="ts">
	import {strip_start} from '@fuzdev/fuz_util/string.js';
	import {swallow} from '@fuzdev/fuz_util/dom.js';
	import type {Snippet} from 'svelte';
	import {page} from '$app/state';

	import {contextmenu_context} from './contextmenu_state.svelte.js';

	const {
		href,
		icon,
		children,
		disabled: disabled_prop = false,
		external_rel = 'noreferrer', // TODO smarter defaults
	}: {
		href: string;
		icon?: string | Snippet; // TODO @many rethink this API, add svg icon fallback
		children?: Snippet; // TODO @many rethink this API
		disabled?: boolean;
		external_rel?: string;
	} = $props();

	const contextmenu = contextmenu_context.get();

	let anchor_el: HTMLAnchorElement | undefined = $state();

	// Register with state management for keyboard navigation
	// When activated via keyboard, programmatically click the anchor to trigger navigation
	const entry = contextmenu.add_entry(
		() => () => {
			if (anchor_el) anchor_el.click();
		},
		() => disabled_prop,
	);

	const disabled = $derived(entry.disabled());

	// TODO move or upstream? rename? `print_url`?
	const format_url = (url: string, host: string = location.host): string => {
		const formatted = strip_start(strip_start(url, 'https://'), 'http://');
		return formatted.startsWith(host + '/') ? strip_start(formatted, host) : formatted;
	};

	const text = $derived(format_url(href));
	const external = $derived(!(text[0] === '.' || (text[0] === '/' && text[1] !== '/')));
	const rel = $derived(external ? external_rel : undefined);

	const selected = $derived(page.url.pathname === href);
</script>

<li role="none">
	<!-- TODO -next-line doesnt work? -->
	<!-- eslint-disable svelte/no-navigation-without-resolve -->
	<a
		bind:this={anchor_el}
		class="menu_item plain"
		class:selected
		class:disabled
		role="menuitem"
		aria-disabled={disabled}
		tabindex="-1"
		{href}
		{rel}
		onclick={disabled ? undefined : () => contextmenu.close()}
		oncontextmenu={(e) => {
			// Stop propagation to prevent the window handler from opening another Fuz contextmenu.
			// Without this, the event would bubble to the window handler, which calls
			// `contextmenu_query_params` (contextmenu_state.svelte.ts:410), which auto-detects
			// `<a>` tags and reopens the Fuz contextmenu instead of showing the browser's native menu.
			// Allow default behavior to show the browser's native contextmenu for the link.
			e.stopPropagation();
		}}
		onmouseenter={disabled
			? undefined
			: (e) => {
					swallow(e);
					contextmenu.select(entry);
				}}
	>
		<div class="content">
			<div class="icon">
				{#if typeof icon === 'string'}
					{icon}
				{:else if icon}
					{@render icon()}
				{/if}
			</div>
			<div class="title">
				<span class="text"
					>{#if children}{@render children()}{:else}{text}{/if}</span
				>
			</div>
		</div>
	</a>
</li>

<style>
	li {
		display: flex;
	}
	/* Underline only the link text, not the icon. */
	a:hover {
		text-decoration: none;
	}
	a:hover .text {
		text-decoration: underline;
	}
	/* TODO hacky, needed because the base `.menu_item` added z-index */
	.menu_item {
		z-index: unset;
	}
</style>
