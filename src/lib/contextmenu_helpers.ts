import {is_editable, swallow, inside_editable} from '@fuzdev/fuz_util/dom.js';
import {EMPTY_OBJECT} from '@fuzdev/fuz_util/object.js';

import {
	contextmenu_open,
	type ContextmenuOpenOptions,
	type ContextmenuState,
} from './contextmenu_state.svelte.js';

// Constants for default prop values
export const CONTEXTMENU_DEFAULT_OPEN_OFFSET_X = -2;
export const CONTEXTMENU_DEFAULT_OPEN_OFFSET_Y = -2;
export const CONTEXTMENU_DEFAULT_BYPASS_WINDOW = 750;
export const CONTEXTMENU_DEFAULT_BYPASS_MOVE_TOLERANCE = 11;
export const CONTEXTMENU_DEFAULT_LONGPRESS_DURATION = 633;
export const CONTEXTMENU_DEFAULT_LONGPRESS_MOVE_TOLERANCE = 21;

/**
 * Returns true if valid and narrows the type to HTMLElement | SVGElement.
 */
export const contextmenu_is_valid_target = (
	target: EventTarget | null,
	shiftKey: boolean,
): target is HTMLElement | SVGElement =>
	!shiftKey &&
	(target instanceof HTMLElement || target instanceof SVGElement) &&
	!is_editable(target) &&
	!inside_editable(target);

// TODO maybe bind these to the contextmenu instance instead of including the function wrapper
// TODO customize
export const contextmenu_create_keyboard_handlers = (
	contextmenu: ContextmenuState,
): Map<string, () => void> =>
	new Map([
		['Escape', () => contextmenu.close()],
		['ArrowLeft', () => contextmenu.collapse_selected()],
		['ArrowRight', () => contextmenu.expand_selected()],
		['ArrowDown', () => contextmenu.select_next()],
		['ArrowUp', () => contextmenu.select_previous()],
		['Home', () => contextmenu.select_first()],
		['End', () => contextmenu.select_last()],
		[' ', () => contextmenu.activate_selected()],
		['Enter', () => contextmenu.activate_selected()],
	]);

export const contextmenu_create_keydown_handler =
	(keyboard_handlers: Map<string, () => void>): ((e: KeyboardEvent) => void) =>
	(e: KeyboardEvent): void => {
		const handler = keyboard_handlers.get(e.key);
		if (!handler || is_editable(e.target)) return;
		swallow(e);
		handler();
	};

export const contextmenu_calculate_constrained_x = (
	menu_x: number,
	menu_width: number,
	layout_width: number,
): number => menu_x + Math.min(0, layout_width - (menu_x + menu_width));

export const contextmenu_calculate_constrained_y = (
	menu_y: number,
	menu_height: number,
	layout_height: number,
): number => menu_y + Math.min(0, layout_height - (menu_y + menu_height));

export interface ContextmenuOpenFromEventOptions extends ContextmenuOpenOptions {
	/**
	 * The number of pixels to offset from the pointer X position when opened.
	 */
	open_offset_x?: number;
	/**
	 * The number of pixels to offset from the pointer Y position when opened.
	 */
	open_offset_y?: number;
}

/**
 * Handles a `contextmenu` event by opening the contextmenu from the event target,
 * unless the target is invalid or inside the open menu element.
 * Swallows the event when the menu opens.
 *
 * @param e - the `contextmenu` event
 * @param contextmenu - the contextmenu store
 * @param menu_el - the open menu element, if any, so events inside it are ignored
 * @param options - offsets and entry filtering forwarded to `contextmenu_open`
 * @returns whether the contextmenu was opened
 */
export const contextmenu_open_from_event = (
	e: MouseEvent,
	contextmenu: ContextmenuState,
	menu_el: HTMLElement | undefined,
	options?: ContextmenuOpenFromEventOptions,
): boolean => {
	const {
		open_offset_x = CONTEXTMENU_DEFAULT_OPEN_OFFSET_X,
		open_offset_y = CONTEXTMENU_DEFAULT_OPEN_OFFSET_Y,
	} = options ?? EMPTY_OBJECT;
	const {target} = e;
	if (!contextmenu_is_valid_target(target, e.shiftKey)) return false;
	// don't open the contextmenu when clicking on the menu itself
	if (menu_el?.contains(target)) return false;
	if (
		!contextmenu_open(
			target,
			e.clientX + open_offset_x,
			e.clientY + open_offset_y,
			contextmenu,
			options,
		)
	) {
		return false;
	}
	swallow(e);
	return true;
};

/**
 * Creates a `mousedown` handler that closes the contextmenu
 * when pressing outside of the menu element.
 *
 * @param contextmenu - the contextmenu store
 * @param get_menu_el - getter for the open menu element, if any
 */
export const contextmenu_create_mousedown_handler =
	(contextmenu: ContextmenuState, get_menu_el: () => HTMLElement | undefined) =>
	(e: MouseEvent): void => {
		const menu_el = get_menu_el();
		if (menu_el && !menu_el.contains(e.target as Node | null)) {
			contextmenu.close();
		}
	};

/**
 * Tracks the tap-then-longpress gesture that bypasses the Fuz contextmenu,
 * letting users reach the system contextmenu by tapping once
 * then longpressing/rightclicking within a time window.
 *
 * Plain DOM-event bookkeeping with no reactive state - used only inside event handlers
 * by `ContextmenuRoot.svelte` and `ContextmenuRootForSafariCompatibility.svelte`.
 */
export class ContextmenuBypassTracker {
	#first_tap_time: number | null = null;
	#touch_x = 0;
	#touch_y = 0;
	#timeout: NodeJS.Timeout | null = null;

	/**
	 * Set when a tap-then-longpress is detected,
	 * telling the next `contextmenu` event handler to let the system contextmenu through.
	 */
	bypassed = false;

	/**
	 * Records a single-touch `touchstart` at the given coordinates.
	 * Detects a tap-then-longpress when the previous tap happened within `bypass_window`
	 * milliseconds and moved less than `bypass_move_tolerance` pixels,
	 * setting `bypassed` and returning `true`.
	 * Otherwise records the tap for future detection and returns `false`.
	 */
	track(x: number, y: number, bypass_window: number, bypass_move_tolerance: number): boolean {
		if (
			this.#first_tap_time !== null &&
			performance.now() - this.#first_tap_time < bypass_window &&
			Math.hypot(x - this.#touch_x, y - this.#touch_y) < bypass_move_tolerance
		) {
			this.bypassed = true;
			this.#clear_tap_tracking();
			return true;
		}
		this.#first_tap_time = performance.now();
		this.#touch_x = x;
		this.#touch_y = y;
		// clear stale tap tracking after the detection window expires
		if (this.#timeout !== null) clearTimeout(this.#timeout);
		this.#timeout = setTimeout(() => {
			this.reset();
		}, bypass_window);
		return false;
	}

	/**
	 * Consumes a pending bypass, returning `true` and resetting all state if `bypassed` was set,
	 * otherwise returning `false` with no effect so tap tracking is preserved.
	 */
	consume(): boolean {
		if (!this.bypassed) return false;
		this.reset();
		return true;
	}

	/**
	 * Clears all tracking state including any pending bypass.
	 */
	reset(): void {
		this.bypassed = false;
		this.#clear_tap_tracking();
	}

	#clear_tap_tracking(): void {
		this.#first_tap_time = null;
		if (this.#timeout !== null) {
			clearTimeout(this.#timeout);
			this.#timeout = null;
		}
	}
}
