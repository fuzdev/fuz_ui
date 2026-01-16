<script lang="ts">
	/**
	 * This alternative to `ContextmenuRoot`
	 * implements custom touch event handlers and "longpress" detection to work
	 * around iOS Safari not firing the standard `contextmenu` event -- see
	 * https://bugs.webkit.org/show_bug.cgi?id=213953.
	 *
	 * Prefer `ContextmenuRoot.svelte` unless you specifically need iOS Safari support.
	 *
	 * This is a complex implementation with many iOS-specific hacks and edge cases:
	 *
	 * - Custom touch event handlers (touchstart, touchmove, touchend)
	 * - Longpress detection with configurable timing and movement tolerance
	 * - Tap-then-longpress bypass gesture for accessing system contextmenu
	 * - Calls navigator.vibrate() for haptic feedback, but browsers block it due to longpress timeout workaround
	 *
	 * Otherwise, use the default `ContextmenuRoot.svelte` which is much simpler
	 * and relies on the standard `contextmenu` event.
	 */
	import {swallow} from '@fuzdev/fuz_util/dom.js';
	import {DEV} from 'esm-env';
	import {on} from 'svelte/events';
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
		CONTEXTMENU_DEFAULT_LONGPRESS_DURATION,
		CONTEXTMENU_DEFAULT_LONGPRESS_MOVE_TOLERANCE,
		contextmenu_is_valid_target,
		contextmenu_create_keyboard_handlers,
		contextmenu_create_keydown_handler,
		contextmenu_calculate_constrained_x,
		contextmenu_calculate_constrained_y,
	} from './contextmenu_helpers.js';

	const {
		contextmenu = new ContextmenuState(),
		longpress_move_tolerance = CONTEXTMENU_DEFAULT_LONGPRESS_MOVE_TOLERANCE,
		longpress_duration = CONTEXTMENU_DEFAULT_LONGPRESS_DURATION,
		bypass_with_tap_then_longpress = true,
		bypass_window = CONTEXTMENU_DEFAULT_BYPASS_WINDOW,
		bypass_move_tolerance = CONTEXTMENU_DEFAULT_BYPASS_MOVE_TOLERANCE,
		open_offset_x = CONTEXTMENU_DEFAULT_OPEN_OFFSET_X,
		open_offset_y = CONTEXTMENU_DEFAULT_OPEN_OFFSET_Y,
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
		 * The number of pixels the pointer can be moved without canceling `longpress`.
		 */
		longpress_move_tolerance?: number;
		/**
		 * The number of milliseconds after a touch starts before opening the Fuz contextmenu.
		 */
		longpress_duration?: number;
		/**
		 * Whether to detect tap-then-longpress to bypass the Fuz contextmenu.
		 * This allows access to the system contextmenu by tapping once then long-pressing.
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

	// TODO maybe show an indicator fade in at these coordinates

	// State for tap-then-longpress bypass detection.
	// These values are `undefined` when unused, and `null` after being reset.
	let touch_x: number | undefined | null = $state();
	let touch_y: number | undefined | null = $state();
	let first_tap_time: number | undefined | null = $state();
	let longpress_timeout: NodeJS.Timeout | undefined | null = $state();
	let longpress_opened: boolean | undefined = $state();
	let longpress_bypass: boolean | undefined = $state();
	let tap_tracking_timeout: NodeJS.Timeout | undefined | null = $state();

	/**
	 * Blocks the next click event. Set to true when a longpress completes to prevent
	 * iOS's synthesized click from activating the first menu item.
	 */
	let block_next_click = $state(false);

	/**
	 * Adds contextmenu_pending class to body during longpress tracking.
	 * This applies aggressive user-select/touch-callout blocking via CSS
	 * to give iOS the earliest possible signal to not show selection UI.
	 */
	const add_contextmenu_pending_class = (): void => {
		document.body.classList.add('contextmenu_pending');
	};

	/**
	 * Removes contextmenu_pending class from body when tracking ends.
	 */
	const remove_contextmenu_pending_class = (): void => {
		document.body.classList.remove('contextmenu_pending');
	};

	/**
	 * Resets only the longpress timeout state, preserving tap tracking for bypass detection.
	 * This is called when a touch ends before longpress completes.
	 */
	const reset_longpress_timeout = (): void => {
		longpress_opened = false;
		if (longpress_timeout != null) {
			clearTimeout(longpress_timeout);
			longpress_timeout = null;
		}
		remove_contextmenu_pending_class();
		// Don't clear tap tracking state here - we need it for tap-then-longpress detection
	};

	/**
	 * Clears tap tracking state and bypass flag used for bypass detection.
	 */
	const reset_tap_tracking = (): void => {
		first_tap_time = null;
		touch_x = null;
		touch_y = null;
		longpress_bypass = false;
		if (tap_tracking_timeout != null) {
			clearTimeout(tap_tracking_timeout);
			tap_tracking_timeout = null;
		}
	};

	/**
	 * Resets all state - both longpress and tap tracking.
	 */
	const reset_all = (): void => {
		reset_longpress_timeout(); // Also removes contextmenu_pending class
		reset_tap_tracking();
	};

	const on_window_contextmenu = (e: MouseEvent) => {
		// handle the tap-then-longpress bypass gesture
		if (longpress_bypass) {
			reset_tap_tracking(); // Clear bypass state after using it
			return;
		}
		const {target} = e;
		// handle touch devices that trigger `'contextmenu'` slower than our longpress
		if (longpress_opened) {
			// Don't prevent contextmenu events on elements inside our own contextmenu
			// This allows the browser's native contextmenu (useful for dev tools, inspecting elements, etc.)
			if (el?.contains(target as Node)) {
				return; // Let the event pass through
			}
			reset_all();
			swallow(e);
			return;
		}
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
			reset_all(); // handle touch devices that trigger `'contextmenu'` faster than our longpress
		}
	};

	// Needed for the iOS workaround. Registered with { passive: false } via $effect (window) or attachment (scoped).
	const touchstart = (e: TouchEvent): void => {
		longpress_opened = false;
		block_next_click = false; // Clear any stale click blocking flag
		const {touches, target} = e;
		if (
			contextmenu.opened ||
			touches.length !== 1 ||
			!contextmenu_is_valid_target(target, e.shiftKey)
		) {
			// Reset all state when conditions aren't met
			reset_all();
			return;
		}

		const {clientX, clientY} = touches[0]!;

		// Bypass the contextmenu behavior in certain conditions including a tap-and-longpress gesture.
		// To handle tap-then-longpress we need to see if `first_tap_time`
		// is less than `bypass_window`, and also allow a small amount
		// of pointer movement, `bypass_move_tolerance`.
		// The builtin `'contextmenu'` event will still fire for non-iOS browsers,
		// so `longpress_bypass` is used to tell the handler `on_window_contextmenu` to exit early.
		if (bypass_with_tap_then_longpress) {
			if (
				first_tap_time != null &&
				performance.now() - first_tap_time < bypass_window &&
				Math.hypot(clientX - touch_x!, clientY - touch_y!) < bypass_move_tolerance
			) {
				// Tap-then-longpress detected! Set bypass and clear tap tracking state.
				// Must manually clear state (not call reset_tap_tracking) to preserve bypass flag.
				longpress_bypass = true;
				first_tap_time = null;
				touch_x = null;
				touch_y = null;
				if (tap_tracking_timeout != null) {
					clearTimeout(tap_tracking_timeout); // Prevent timeout from clearing bypass
					tap_tracking_timeout = null;
				}
				return;
			}
			// Record this tap for potential future bypass detection
			first_tap_time = performance.now();
			// Set timeout to clear stale tap tracking after the detection window expires
			if (tap_tracking_timeout != null) {
				clearTimeout(tap_tracking_timeout);
			}
			tap_tracking_timeout = setTimeout(() => {
				reset_tap_tracking();
			}, bypass_window);
		}

		touch_x = clientX;
		touch_y = clientY;

		// Add pending class to enable aggressive iOS blocking via CSS during tracking
		add_contextmenu_pending_class();

		if (longpress_timeout != null) reset_longpress_timeout();
		longpress_timeout = setTimeout(() => {
			longpress_opened = true;
			remove_contextmenu_pending_class(); // Tracking complete, menu opening
			contextmenu_open(target, touch_x! + open_offset_x, touch_y! + open_offset_y, contextmenu, {
				link_enabled: link_entry !== null,
				text_enabled: text_entry !== null,
				separator_enabled: separator_entry !== null,
			});
		}, longpress_duration);
	};

	// Needed for the iOS workaround. Registered with { passive: false } via $effect (window) or attachment (scoped).
	const touchmove = (e: TouchEvent): void => {
		// Exit early if no pending longpress or menu is already open
		if (longpress_timeout == null || contextmenu.opened) return;
		const {touches} = e;
		if (touches.length !== 1) return;
		const {clientX, clientY} = touches[0]!;
		const distance = Math.hypot(clientX - touch_x!, clientY - touch_y!);
		if (distance > longpress_move_tolerance) {
			// User is scrolling - cancel longpress but DON'T preventDefault
			reset_longpress_timeout();
			return;
		}
		// Still within threshold - this is a longpress
		// CRITICAL: Prevent iOS from showing magnifier, text selection, and link callouts
		e.preventDefault();
	};
	// Needed for the iOS workaround. Registered with { passive: false } via $effect.
	const touchend = (e: TouchEvent): void => {
		// Clear longpress timeout if it exists
		if (longpress_timeout != null) {
			if (longpress_opened) {
				swallow(e);
				// Block the next click to prevent iOS's synthesized click from activating the first menu item
				block_next_click = true;
			}
			reset_longpress_timeout();
		}
		// Clear bypass flag if it was set but the contextmenu event hasn't fired yet
		// This handles the case where bypass is detected but user lifts finger before native menu opens
		if (longpress_bypass) {
			reset_tap_tracking();
		}
		// Note: We don't clear tap tracking state here - we preserve it for tap-then-longpress detection
	};

	/**
	 * Handle touchcancel - this should reset all state since the gesture was interrupted.
	 */
	const touchcancel = (): void => {
		reset_all();
	};

	// Passive listener that runs during the event's `capture` phase
	// so that things like the Dialog don't eat the events and prevent the contextmenu from closing.
	const mousedown = (e: MouseEvent) => {
		if (el && !el.contains(e.target as any)) {
			contextmenu.close();
		}
	};

	const keyboard_handlers = $derived(contextmenu_create_keyboard_handlers(contextmenu));
	const keydown = $derived(contextmenu_create_keydown_handler(keyboard_handlers));

	/**
	 * Creates an attachment that registers touch event listeners with { passive: false }
	 * to enable preventDefault() on iOS Safari. Works for both window (non-scoped mode) and
	 * HTMLElement (scoped mode). Svelte's declarative touch handlers create passive listeners
	 * by default, which prevents blocking iOS's default longpress behaviors (magnifier, text
	 * selection, callouts). Using `on()` from svelte/events ensures proper event ordering
	 * with Svelte's event delegation system.
	 *
	 * The critical fix is calling preventDefault() in the touchmove handler when tracking
	 * a longpress with movement below threshold.
	 *
	 * @param el The Window or HTMLElement to attach touch listeners to
	 * @returns Cleanup function to remove all event listeners
	 */
	const touch_event_attachment = (el: HTMLElement | Window) => {
		// touchstart and touchcancel don't call preventDefault, so they can be passive for better performance
		const passive_options: AddEventListenerOptions = {passive: true, capture: true};
		// touchmove and touchend need to call preventDefault to block iOS behaviors, so they must be non-passive
		const nonpassive_options: AddEventListenerOptions = {passive: false, capture: true};

		const cleanup_touchstart = on(el, 'touchstart', touchstart as EventListener, passive_options);
		const cleanup_touchmove = on(el, 'touchmove', touchmove as EventListener, nonpassive_options);
		const cleanup_touchend = on(el, 'touchend', touchend as EventListener, nonpassive_options);
		const cleanup_touchcancel = on(
			el,
			'touchcancel',
			touchcancel as EventListener,
			passive_options,
		);

		return () => {
			cleanup_touchstart();
			cleanup_touchmove();
			cleanup_touchend();
			cleanup_touchcancel();
		};
	};
</script>

<svelte:window
	oncontextmenu={scoped ? undefined : on_window_contextmenu}
	onmousedown={!contextmenu.opened ? undefined : mousedown}
	onkeydown={!contextmenu.opened ? undefined : keydown}
	{@attach scoped ? undefined : touch_event_attachment}
/>

{#if scoped}
	<div
		class="contextmenu_root"
		role="region"
		oncontextmenu={on_window_contextmenu}
		{@attach touch_event_attachment}
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

<!-- TODO Maybe animate a subtle highlight around the contextmenu as it appears? -->
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
		onclickcapture={block_next_click
			? (e) => {
					// iOS synthesizes a click after touchend which
					// can unintentionally activate the first menu item. This blocks it.
					block_next_click = false;
					swallow(e);
				}
			: undefined}
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
	:global(body.contextmenu_pending) {
		/* Applied during active longpress tracking.
		   Aggressive blocking to give iOS earliest possible signal to not show selection UI.
		   Combined with preventDefault() in touchmove for defense in depth. */
		-webkit-user-select: none !important;
		user-select: none !important;
		-webkit-touch-callout: none !important;
	}

	.contextmenu_root {
		display: contents;
	}
	.contextmenu {
		--icon_size: var(--icon_size_xs);
		/* TODO maybe make this responsive or a max of the page width
		minus some space to tap items covered by the menu on the side,
		or consider a totally different design for small screens (more dialog-like)  */
		--contextmenu_width: 320px;
		position: fixed;
		left: 0;
		top: 0;
		z-index: var(--contextmenu_z_index, 200);
		max-width: var(--contextmenu_width);
		width: 100%;
		/* Re-enable callouts on the menu itself to allow native contextmenu (for dev tools).
		   Resets the global body blocking. Prevents the menu from being selected. */
		-webkit-touch-callout: initial !important;
	}
	/* TODO hacky */
	.contextmenu,
	.contextmenu :global(menu.pane) {
		border: var(--contextmenu_border_width, var(--border_width))
			var(--contextmenu_border_style, var(--border_style))
			var(--contextmenu_border_color, var(--border_color));
		border-radius: var(--contextmenu_border_radius, var(--border_radius_xs));
	}

	/* TODO better way to do this? */
	.contextmenu_layout {
		z-index: -200;
		position: fixed;
		inset: 0;
	}
</style>
