import {is_editable, swallow, inside_editable} from '@fuzdev/fuz_util/dom.js';

import type {ContextmenuState} from './contextmenu_state.svelte.js';

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
