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
		contextmenu_open,
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
		contextmenu_calculate_constrained_x,
		contextmenu_calculate_constrained_y,
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
		/**
		 * The `contextmenu` prop is not reactive because that's a rare corner case and
		 * it's easier to put the `contextmenu` directly in the context
		 * rather than wrapping with a store or other reactivity.
		 * If you need to change the contextmenu prop for some reason, use a `{#key contextmenu}` block:
		 * https://svelte.dev/docs#template-syntax-key
		 * @nonreactive
		 */
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

	contextmenu_context.set(contextmenu);

	if (DEV) contextmenu_check_global_root(() => scoped); // TODO @many is this import tree-shaken?

	let el: HTMLElement | undefined = $state();

	const {layout} = $derived(contextmenu);

	const dimensions = contextmenu_dimensions_context.set();

	const x = $derived(
		contextmenu_calculate_constrained_x(contextmenu.x, dimensions.width, layout.width),
	);
	const y = $derived(
		contextmenu_calculate_constrained_y(contextmenu.y, dimensions.height, layout.height),
	);

	// State for tap-then-longpress bypass detection.
	// These values are `undefined` when unused, and `null` after being reset.
	let touch_x: number | undefined | null = $state();
	let touch_y: number | undefined | null = $state();
	let first_tap_time: number | undefined | null = $state();
	let longpress_bypass: boolean | undefined = $state();
	let tap_tracking_timeout: NodeJS.Timeout | undefined | null = $state();

	const on_window_contextmenu = (e: MouseEvent) => {
		// Handle the tap-then-longpress bypass gesture
		if (longpress_bypass) {
			// Clear all tap tracking state after consuming the bypass
			longpress_bypass = false;
			first_tap_time = null;
			touch_x = null;
			touch_y = null;
			if (tap_tracking_timeout != null) {
				clearTimeout(tap_tracking_timeout);
				tap_tracking_timeout = null;
			}
			return;
		}
		const {target} = e;
		if (!contextmenu_is_valid_target(target, e.shiftKey)) {
			return;
		}
		// Don't open contextmenu when clicking on the menu itself
		if (el?.contains(target)) {
			return;
		}
		if (
			contextmenu_open(target, e.clientX + open_offset_x, e.clientY + open_offset_y, contextmenu, {
				link_enabled: link_entry !== null,
				text_enabled: text_entry !== null,
				separator_enabled: separator_entry !== null,
			})
		) {
			swallow(e);
		}
	};

	/**
	 * Touch event handler for tap-then-longpress bypass detection.
	 *
	 * This allows users to access the native context menu by performing a tap
	 * followed by a longpress/rightclick within a specified time window.
	 * The bypass gesture is useful for accessing browser features like text selection
	 * or the native context menu when the Fuz contextmenu would normally override it.
	 *
	 * Note: preventDefault is not called as we're only observing touch patterns,
	 * not intercepting them. The actual bypass happens in on_window_contextmenu.
	 */
	const touchstart = (e: TouchEvent): void => {
		if (!bypass_with_tap_then_longpress) return;

		const {touches, target} = e;
		if (
			contextmenu.opened ||
			touches.length !== 1 ||
			!contextmenu_is_valid_target(target, e.shiftKey)
		) {
			// Reset all state if conditions aren't met
			first_tap_time = null;
			touch_x = null;
			touch_y = null;
			longpress_bypass = false;
			if (tap_tracking_timeout != null) {
				clearTimeout(tap_tracking_timeout);
				tap_tracking_timeout = null;
			}
			return;
		}

		const {clientX, clientY} = touches[0]!;

		// Check if this is a tap-then-longpress gesture
		if (
			first_tap_time != null &&
			performance.now() - first_tap_time < bypass_window &&
			Math.hypot(clientX - touch_x!, clientY - touch_y!) < bypass_move_tolerance
		) {
			// This is a tap-then-longpress - set bypass flag and clear tap tracking
			longpress_bypass = true;
			first_tap_time = null;
			touch_x = null;
			touch_y = null;
			if (tap_tracking_timeout != null) {
				clearTimeout(tap_tracking_timeout);
				tap_tracking_timeout = null;
			}
			return;
		}

		// Record this tap for potential future bypass detection
		first_tap_time = performance.now();
		touch_x = clientX;
		touch_y = clientY;

		// Set timeout to clear stale tap tracking after the detection window expires
		if (tap_tracking_timeout != null) {
			clearTimeout(tap_tracking_timeout);
		}
		tap_tracking_timeout = setTimeout(() => {
			first_tap_time = null;
			touch_x = null;
			touch_y = null;
			tap_tracking_timeout = null;
		}, bypass_window);
	};

	/**
	 * Reset state when touch is cancelled (e.g., when scrolling starts).
	 */
	const touchcancel = (): void => {
		// Reset all bypass detection state
		first_tap_time = null;
		touch_x = null;
		touch_y = null;
		longpress_bypass = false;
		if (tap_tracking_timeout != null) {
			clearTimeout(tap_tracking_timeout);
			tap_tracking_timeout = null;
		}
	};

	// Passive listener that runs during the event's `capture` phase
	// so that things like the Dialog don't eat the events and prevent the contextmenu from closing.
	const mousedown = (e: MouseEvent) => {
		if (el && !el.contains(e.target as any)) {
			contextmenu.close();
		}
	};

	const keyboard_handlers = contextmenu_create_keyboard_handlers(contextmenu);
	const keydown = contextmenu_create_keydown_handler(keyboard_handlers);
</script>

<svelte:window
	oncontextmenu={scoped ? undefined : on_window_contextmenu}
	onmousedown={!contextmenu.opened ? undefined : mousedown}
	onkeydown={!contextmenu.opened ? undefined : keydown}
	ontouchstartcapture={scoped || !bypass_with_tap_then_longpress ? undefined : touchstart}
	ontouchcancelcapture={scoped || !bypass_with_tap_then_longpress ? undefined : touchcancel}
/>

{#if scoped}
	<div
		class="contextmenu_root"
		role="region"
		oncontextmenu={on_window_contextmenu}
		ontouchstartcapture={!bypass_with_tap_then_longpress ? undefined : touchstart}
		ontouchcancelcapture={!bypass_with_tap_then_longpress ? undefined : touchcancel}
	>
		{@render children()}
	</div>
{:else}
	{@render children()}
{/if}

{#if !contextmenu.has_custom_layout}
	<div
		class="contextmenu_layout"
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
		bind:this={el}
		bind:offsetWidth={dimensions.width}
		bind:offsetHeight={dimensions.height}
		style:transform="translate3d({x}px, {y}px, 0)"
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

{#snippet link_entry_default(props: ComponentProps)}
	<ContextmenuLinkEntry {...props} />
{/snippet}

{#snippet text_entry_default(props: ComponentProps)}
	<ContextmenuTextEntry {...props} />
{/snippet}

{#snippet separator_entry_default(props: ComponentProps)}
	<ContextmenuSeparator {...props} />
{/snippet}

<style>
	.contextmenu_root {
		display: contents;
	}
	.contextmenu {
		--icon_size: var(--icon_size_xs);
		--contextmenu_width: 320px;
		position: fixed;
		left: 0;
		top: 0;
		z-index: var(--contextmenu_z_index, 200);
		max-width: var(--contextmenu_width);
		width: 100%;
	}
	.contextmenu,
	.contextmenu :global(menu.pane) {
		border: var(--contextmenu_border_width, var(--border_width))
			var(--contextmenu_border_style, var(--border_style))
			var(--contextmenu_border_color, var(--border_color));
		border-radius: var(--contextmenu_border_radius, var(--border_radius_xs));
	}

	.contextmenu_layout {
		z-index: -200;
		position: fixed;
		inset: 0;
	}
</style>
