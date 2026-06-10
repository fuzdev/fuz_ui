<script module lang="ts">
	// The default entry snippets are shared with `ContextmenuRootForSafariCompatibility.svelte`.
	export {link_entry_default, text_entry_default, separator_entry_default};
</script>

<script lang="ts">
	/**
	 * This is the default contextmenu root component.
	 * It relies on the standard browser `contextmenu` event
	 * which means it does not work on iOS Safari
	 * because it doesn't fire the `contextmenu` event as of October 2025 --
	 * see https://bugs.webkit.org/show_bug.cgi?id=213953.
	 *
	 * This is the recommended default because
	 * it supports haptic feedback with `navigator.vibrate()`.
	 * The Safari compatibility version uses timeout-based longpress detection,
	 * which causes browsers to block `navigator.vibrate()` since it's not
	 * triggered directly by a user event.
	 *
	 * If you need iOS Safari support, use `ContextmenuRootForSafariCompatibility.svelte`
	 * instead. That version implements custom touch handlers and longpress detection at the
	 * cost of significantly more complexity and no vibrate support.
	 */
	import {swallow} from '@fuzdev/fuz_util/dom.js';
	import {DEV} from 'esm-env';
	import type {ComponentProps, Snippet} from 'svelte';

	import {
		contextmenu_context,
		contextmenu_dimensions_context,
		ContextmenuState,
		contextmenu_check_global_root,
	} from './contextmenu_state.svelte.js';
	import ContextmenuLinkEntry from './ContextmenuLinkEntry.svelte';
	import ContextmenuTextEntry from './ContextmenuTextEntry.svelte';
	import ContextmenuSeparator from './ContextmenuSeparator.svelte';
	import {
		CONTEXTMENU_DEFAULT_OPEN_OFFSET_X,
		CONTEXTMENU_DEFAULT_OPEN_OFFSET_Y,
		CONTEXTMENU_DEFAULT_BYPASS_WINDOW,
		CONTEXTMENU_DEFAULT_BYPASS_MOVE_TOLERANCE,
		contextmenu_is_valid_target,
		contextmenu_create_keyboard_handlers,
		contextmenu_create_keydown_handler,
		contextmenu_create_mousedown_handler,
		contextmenu_calculate_constrained_x,
		contextmenu_calculate_constrained_y,
		contextmenu_popover_attachment,
		contextmenu_resolve_contextmenu_event,
		ContextmenuBypassTracker,
		ContextmenuOpenGuard,
	} from './contextmenu_helpers.js';

	const {
		contextmenu = new ContextmenuState(),
		open_offset_x = CONTEXTMENU_DEFAULT_OPEN_OFFSET_X,
		open_offset_y = CONTEXTMENU_DEFAULT_OPEN_OFFSET_Y,
		bypass_with_tap_then_longpress = true,
		bypass_window = CONTEXTMENU_DEFAULT_BYPASS_WINDOW,
		bypass_move_tolerance = CONTEXTMENU_DEFAULT_BYPASS_MOVE_TOLERANCE,
		scoped = false,
		link_entry = link_entry_default,
		text_entry = text_entry_default,
		separator_entry = separator_entry_default,
		children,
	}: {
		contextmenu?: ContextmenuState;
		/**
		 * The number of pixels to offset from the pointer X position when opened.
		 * Useful to ensure the first menu item is immediately under the pointer.
		 */
		open_offset_x?: number;
		/**
		 * The number of pixels to offset from the pointer Y position when opened.
		 * Useful to ensure the first menu item is immediately under the pointer.
		 */
		open_offset_y?: number;
		/**
		 * Whether to detect tap-then-longpress to bypass the Fuz contextmenu.
		 * This allows access to the system contextmenu by tapping once then rightclicking/long-pressing.
		 * Setting to `false` disables the gesture.
		 */
		bypass_with_tap_then_longpress?: boolean;
		/**
		 * The number of milliseconds between taps to detect a gesture that bypasses the Fuz contextmenu.
		 * Used only when `bypass_with_tap_then_longpress` is true.
		 * If the duration is too long, it'll detect more false positives and interrupt normal usage,
		 * but too short and some people will have difficulty performing the gesture.
		 */
		bypass_window?: number;
		/**
		 * The number of pixels the pointer can be moved between taps to detect a tap-then-longpress.
		 * Used only when `bypass_with_tap_then_longpress` is true.
		 */
		bypass_move_tolerance?: number;
		/**
		 * If `true`, wraps `children` with a div and listens to events on it instead of the window.
		 */
		scoped?: boolean;
		/**
		 * Snippet for rendering link entries.
		 * Set to `null` to disable automatic link detection.
		 * Defaults to `link_entry_default` which renders `ContextmenuLinkEntry`.
		 */
		link_entry?: Snippet<[ComponentProps<typeof ContextmenuLinkEntry>]> | null;
		/**
		 * Snippet for rendering copy text entries.
		 * Set to `null` to disable automatic copy text detection.
		 * Defaults to `text_entry_default` which renders `ContextmenuTextEntry`.
		 */
		text_entry?: Snippet<[ComponentProps<typeof ContextmenuTextEntry>]> | null;
		/**
		 * Snippet for rendering separator entries.
		 * Set to `null` to disable automatic separator rendering.
		 * Defaults to `separator_entry_default` which renders `ContextmenuSeparator`.
		 */
		separator_entry?: Snippet<[ComponentProps<typeof ContextmenuSeparator>]> | null;
		children: Snippet;
	} = $props();

	contextmenu_context.set(() => contextmenu);

	if (DEV) contextmenu_check_global_root(() => scoped); // TODO @many is this import tree-shaken?

	let el: HTMLElement | undefined = $state.raw();

	const {layout} = $derived(contextmenu);

	const dimensions = contextmenu_dimensions_context.set();

	const x = $derived(
		contextmenu_calculate_constrained_x(contextmenu.x, dimensions.width, layout.width),
	);
	const y = $derived(
		contextmenu_calculate_constrained_y(contextmenu.y, dimensions.height, layout.height),
	);

	const bypass_tracker = new ContextmenuBypassTracker();
	const open_guard = new ContextmenuOpenGuard();

	const open_options = $derived({
		open_offset_x,
		open_offset_y,
		link_enabled: link_entry !== null,
		text_enabled: text_entry !== null,
		separator_enabled: separator_entry !== null,
	});

	const on_window_contextmenu = (e: MouseEvent) => {
		// let the system contextmenu through after a tap-then-longpress bypass gesture
		if (bypass_tracker.consume()) return;
		contextmenu_resolve_contextmenu_event(e, contextmenu, el, open_guard, open_options);
	};

	/**
	 * Touch event handler for tap-then-longpress bypass detection
	 * and touch-open release guarding.
	 *
	 * The bypass gesture allows users to access the native context menu by performing
	 * a tap followed by a longpress/rightclick within a specified time window,
	 * useful for browser features like text selection when the Fuz contextmenu
	 * would normally override it.
	 *
	 * Note: preventDefault is not called as we're only observing touch patterns,
	 * not intercepting them. The actual bypass happens in on_window_contextmenu.
	 */
	const touchstart = (e: TouchEvent): void => {
		open_guard.touchstart();

		if (!bypass_with_tap_then_longpress) return;

		const {touches, target} = e;
		if (
			contextmenu.opened ||
			touches.length !== 1 ||
			!contextmenu_is_valid_target(target, e.shiftKey)
		) {
			bypass_tracker.reset();
			return;
		}

		const {clientX, clientY} = touches[0]!;
		bypass_tracker.track(clientX, clientY, bypass_window, bypass_move_tolerance);
	};

	/**
	 * Swallows the release of a gesture that opened the menu,
	 * stopping the browser from synthesizing mouse events at the touch point
	 * (the open offsets place the first menu item there).
	 */
	const touchend = (e: TouchEvent): void => {
		open_guard.touchend(e);
	};

	/**
	 * Reset state when touch is cancelled (e.g., when scrolling starts).
	 */
	const touchcancel = (): void => {
		open_guard.reset();
		bypass_tracker.reset();
	};

	// Closes the contextmenu on presses outside of it.
	const mousedown = $derived(
		contextmenu_create_mousedown_handler(contextmenu, () => el, open_guard),
	);

	const keyboard_handlers = $derived(contextmenu_create_keyboard_handlers(contextmenu));
	const keydown = $derived(contextmenu_create_keydown_handler(keyboard_handlers));
</script>

<svelte:window
	oncontextmenu={scoped ? undefined : on_window_contextmenu}
	onmousedown={!contextmenu.opened ? undefined : mousedown}
	onkeydown={!contextmenu.opened ? undefined : keydown}
	onmouseupcapture={(e) => open_guard.track_mouseup(e)}
	ontouchstartcapture={scoped ? undefined : touchstart}
	ontouchendcapture={scoped ? undefined : touchend}
	ontouchcancelcapture={scoped ? undefined : touchcancel}
/>

{#if scoped}
	<div
		class="contextmenu-root"
		role="region"
		oncontextmenu={on_window_contextmenu}
		ontouchstartcapture={touchstart}
		ontouchendcapture={touchend}
		ontouchcancelcapture={touchcancel}
	>
		{@render children()}
	</div>
{:else}
	{@render children()}
{/if}

{#if !contextmenu.has_custom_layout}
	<div
		class="contextmenu-layout"
		bind:clientWidth={layout.width}
		bind:clientHeight={layout.height}
		aria-hidden="true"
	></div>
{/if}

<!-- TODO animate the contextmenu as it appears somehow -->
<!-- TODO implement focus management per APG: store `document.activeElement` when opening, focus menu on mount, restore focus on close if element `isConnected` -->
{#if contextmenu.opened}
	<ul
		class="contextmenu unstyled pane"
		role="menu"
		aria-label="context menu"
		tabindex="-1"
		popover="manual"
		{@attach contextmenu_popover_attachment(contextmenu)}
		bind:this={el}
		bind:offsetWidth={dimensions.width}
		bind:offsetHeight={dimensions.height}
		style:transform="translate3d({x}px, {y}px, 0)"
		onclickcapture={(e) => {
			// blocks a click synthesized from the touch gesture that opened the menu,
			// which would activate the first item
			if (open_guard.consume_blocked_click()) swallow(e);
		}}
	>
		<!-- TODO maybe this should be generic? -->
		{#each contextmenu.params as p (p)}
			{#if typeof p === 'function'}
				{@render p()}
			{:else if p.snippet === 'link'}
				{@render link_entry?.(p.props)}
			{:else if p.snippet === 'text'}
				{@render text_entry?.(p.props)}
			{:else if p.snippet === 'separator'}
				{@render separator_entry?.(p.props)}
			{/if}
		{/each}
	</ul>
{/if}

{#snippet link_entry_default(props: ComponentProps<typeof ContextmenuLinkEntry>)}
	<ContextmenuLinkEntry {...props} />
{/snippet}

{#snippet text_entry_default(props: ComponentProps<typeof ContextmenuTextEntry>)}
	<ContextmenuTextEntry {...props} />
{/snippet}

{#snippet separator_entry_default(props: ComponentProps<typeof ContextmenuSeparator>)}
	<ContextmenuSeparator {...props} />
{/snippet}

<style>
	.contextmenu-root {
		display: contents;
	}
	.contextmenu {
		--icon_size: var(--icon_size_xs);
		--contextmenu_width: 320px;
		position: fixed;
		left: 0;
		top: 0;
		/* the z-index is the fallback for browsers without the Popover API,
		where the menu can't layer over modal dialogs */
		z-index: var(--contextmenu_z_index, 200);
		max-width: var(--contextmenu_width);
		width: 100%;
		/* reset the UA `[popover]` styles; positioning stays transform-based */
		right: auto;
		bottom: auto;
		margin: 0;
		padding: 0;
		color: inherit;
		/* the UA popover style sets `overflow: auto`, which would clip submenu flyouts */
		overflow: visible;
	}
	.contextmenu,
	.contextmenu :global(menu.pane) {
		border: var(--contextmenu_border_width, var(--border_width))
			var(--contextmenu_border_style, var(--border_style))
			var(--contextmenu_border_color, var(--border_color));
		border-radius: var(--contextmenu_border_radius, var(--border_radius_xs));
	}

	.contextmenu-layout {
		z-index: -200;
		position: fixed;
		inset: 0;
	}
</style>
