/**
 * @vitest-environment jsdom
 */
import {describe, test, assert, beforeEach, afterEach, vi} from 'vitest';

import {
	ContextmenuBypassTracker,
	ContextmenuTouchOpenGuard,
	contextmenu_calculate_constrained_x,
	contextmenu_calculate_constrained_y,
	contextmenu_create_keyboard_handlers,
	contextmenu_create_keydown_handler,
	contextmenu_create_mousedown_handler,
	contextmenu_is_valid_target,
	contextmenu_open_from_event,
	CONTEXTMENU_DEFAULT_OPEN_OFFSET_X,
	CONTEXTMENU_DEFAULT_OPEN_OFFSET_Y,
} from '$lib/contextmenu_helpers.js';
import {ContextmenuState, contextmenu_attachment} from '$lib/contextmenu_state.svelte.js';
import {
	create_contextmenu_event,
	create_keyboard_event,
	create_mouse_event,
	create_touch_event,
	set_event_target,
} from './test_helpers.js';
import {add_test_entry} from './contextmenu_state_test_helpers.js';

describe('ContextmenuBypassTracker', () => {
	const BYPASS_WINDOW = 750;
	const MOVE_TOLERANCE = 11;

	let tracker: ContextmenuBypassTracker;

	beforeEach(() => {
		vi.useFakeTimers();
		tracker = new ContextmenuBypassTracker();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test('second tap within window and tolerance sets bypassed and returns true', () => {
		assert.strictEqual(tracker.track(100, 200, BYPASS_WINDOW, MOVE_TOLERANCE), false);
		assert.strictEqual(tracker.bypassed, false);

		vi.advanceTimersByTime(300);
		assert.strictEqual(tracker.track(105, 205, BYPASS_WINDOW, MOVE_TOLERANCE), true);
		assert.strictEqual(tracker.bypassed, true);
	});

	test('second tap beyond move tolerance does not bypass', () => {
		assert.strictEqual(tracker.track(100, 200, BYPASS_WINDOW, MOVE_TOLERANCE), false);

		vi.advanceTimersByTime(100);
		// 50px away, beyond the 11px tolerance
		assert.strictEqual(tracker.track(150, 200, BYPASS_WINDOW, MOVE_TOLERANCE), false);
		assert.strictEqual(tracker.bypassed, false);
	});

	test('second tap after the window expires does not bypass', () => {
		assert.strictEqual(tracker.track(100, 200, BYPASS_WINDOW, MOVE_TOLERANCE), false);

		// advancing past the window fires the expiry timeout, clearing tap tracking
		vi.advanceTimersByTime(BYPASS_WINDOW + 100);
		assert.strictEqual(tracker.track(100, 200, BYPASS_WINDOW, MOVE_TOLERANCE), false);
		assert.strictEqual(tracker.bypassed, false);
	});

	test('tracking state is cleared by the expiry timeout', () => {
		assert.strictEqual(tracker.track(100, 200, BYPASS_WINDOW, MOVE_TOLERANCE), false);

		// fire the expiry timeout exactly at the window boundary
		vi.advanceTimersByTime(BYPASS_WINDOW);

		// a quick second tap should NOT bypass - the first tap was forgotten
		assert.strictEqual(tracker.track(100, 200, BYPASS_WINDOW, MOVE_TOLERANCE), false);
		assert.strictEqual(tracker.bypassed, false);

		// but tracking re-arms - a third tap shortly after the second bypasses
		vi.advanceTimersByTime(100);
		assert.strictEqual(tracker.track(100, 200, BYPASS_WINDOW, MOVE_TOLERANCE), true);
		assert.strictEqual(tracker.bypassed, true);
	});

	test('consume() returns true exactly once then false', () => {
		tracker.track(100, 200, BYPASS_WINDOW, MOVE_TOLERANCE);
		vi.advanceTimersByTime(100);
		tracker.track(100, 200, BYPASS_WINDOW, MOVE_TOLERANCE);
		assert.strictEqual(tracker.bypassed, true);

		assert.strictEqual(tracker.consume(), true);
		assert.strictEqual(tracker.bypassed, false);
		assert.strictEqual(tracker.consume(), false);
	});

	test('consume() without a pending bypass returns false and preserves tap tracking', () => {
		tracker.track(100, 200, BYPASS_WINDOW, MOVE_TOLERANCE);

		assert.strictEqual(tracker.consume(), false);

		// tap tracking was preserved, so a quick second tap still bypasses
		vi.advanceTimersByTime(100);
		assert.strictEqual(tracker.track(100, 200, BYPASS_WINDOW, MOVE_TOLERANCE), true);
	});

	test('reset() clears a pending bypass', () => {
		tracker.track(100, 200, BYPASS_WINDOW, MOVE_TOLERANCE);
		vi.advanceTimersByTime(100);
		tracker.track(100, 200, BYPASS_WINDOW, MOVE_TOLERANCE);
		assert.strictEqual(tracker.bypassed, true);

		tracker.reset();

		assert.strictEqual(tracker.bypassed, false);
		assert.strictEqual(tracker.consume(), false);
	});

	test('reset() clears tap tracking', () => {
		tracker.track(100, 200, BYPASS_WINDOW, MOVE_TOLERANCE);
		tracker.reset();

		// the first tap was forgotten, so a quick second tap does not bypass
		vi.advanceTimersByTime(100);
		assert.strictEqual(tracker.track(100, 200, BYPASS_WINDOW, MOVE_TOLERANCE), false);
		assert.strictEqual(tracker.bypassed, false);
	});
});

describe('contextmenu_calculate_constrained_x', () => {
	test('returns the coordinate unchanged when the menu fits', () => {
		assert.strictEqual(contextmenu_calculate_constrained_x(100, 200, 1000), 100);
	});

	test('returns the coordinate unchanged when the menu exactly fits', () => {
		assert.strictEqual(contextmenu_calculate_constrained_x(800, 200, 1000), 800);
	});

	test('shifts left by the overflow when the menu overflows the right edge', () => {
		assert.strictEqual(contextmenu_calculate_constrained_x(900, 200, 1000), 800);
	});

	test('shifts past zero when the menu is larger than the layout', () => {
		// Current behavior: a menu wider than the layout gets a negative coordinate,
		// pinning the right edge of the menu to the right edge of the layout.
		assert.strictEqual(contextmenu_calculate_constrained_x(0, 1200, 1000), -200);
	});
});

describe('contextmenu_calculate_constrained_y', () => {
	test('returns the coordinate unchanged when the menu fits', () => {
		assert.strictEqual(contextmenu_calculate_constrained_y(100, 300, 768), 100);
	});

	test('returns the coordinate unchanged when the menu exactly fits', () => {
		assert.strictEqual(contextmenu_calculate_constrained_y(468, 300, 768), 468);
	});

	test('shifts up by the overflow when the menu overflows the bottom edge', () => {
		assert.strictEqual(contextmenu_calculate_constrained_y(600, 300, 768), 468);
	});

	test('shifts past zero when the menu is larger than the layout', () => {
		// Current behavior: a menu taller than the layout gets a negative coordinate,
		// pinning the bottom edge of the menu to the bottom edge of the layout.
		assert.strictEqual(contextmenu_calculate_constrained_y(0, 900, 768), -132);
	});
});

describe('contextmenu_is_valid_target', () => {
	test('returns false when shiftKey is true', () => {
		const div = document.createElement('div');
		document.body.appendChild(div);

		assert.strictEqual(contextmenu_is_valid_target(div, true), false);

		div.remove();
	});

	test('returns false for null', () => {
		assert.strictEqual(contextmenu_is_valid_target(null, false), false);
	});

	test('returns false for a non-element event target', () => {
		assert.strictEqual(contextmenu_is_valid_target(document, false), false);
		assert.strictEqual(contextmenu_is_valid_target(window, false), false);
	});

	test('returns false for an editable input', () => {
		const input = document.createElement('input');
		document.body.appendChild(input);

		assert.strictEqual(contextmenu_is_valid_target(input, false), false);

		input.remove();
	});

	test('returns false for an element inside a contenteditable ancestor', () => {
		const parent = document.createElement('div');
		parent.setAttribute('contenteditable', 'true');
		const child = document.createElement('span');
		parent.appendChild(child);
		document.body.appendChild(parent);

		assert.strictEqual(contextmenu_is_valid_target(child, false), false);

		parent.remove();
	});

	test('returns true for a plain div', () => {
		const div = document.createElement('div');
		document.body.appendChild(div);

		assert.strictEqual(contextmenu_is_valid_target(div, false), true);

		div.remove();
	});

	test('returns true for an SVG element', () => {
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		document.body.appendChild(svg);

		assert.strictEqual(contextmenu_is_valid_target(svg, false), true);

		svg.remove();
	});
});

describe('contextmenu_create_keydown_handler', () => {
	let contextmenu: ContextmenuState;
	let keydown: (e: KeyboardEvent) => void;
	let target: HTMLElement;

	beforeEach(() => {
		contextmenu = new ContextmenuState();
		keydown = contextmenu_create_keydown_handler(contextmenu_create_keyboard_handlers(contextmenu));
		target = document.createElement('div');
		document.body.appendChild(target);
	});

	afterEach(() => {
		target.remove();
	});

	test('Escape with the menu open closes it and swallows the event', () => {
		contextmenu.open([], 0, 0);
		assert.strictEqual(contextmenu.opened, true);

		const event = create_keyboard_event('Escape');
		set_event_target(event, target);
		keydown(event);

		assert.strictEqual(contextmenu.opened, false);
		assert.strictEqual(event.defaultPrevented, true);
	});

	test('ArrowDown invokes select_next', () => {
		const entry = add_test_entry(contextmenu.root_menu);
		contextmenu.open([], 0, 0);

		const event = create_keyboard_event('ArrowDown');
		set_event_target(event, target);
		keydown(event);

		assert.strictEqual(entry.selected, true);
		assert.strictEqual(event.defaultPrevented, true);
	});

	test('unknown key does nothing', () => {
		contextmenu.open([], 0, 0);

		const event = create_keyboard_event('a');
		set_event_target(event, target);
		keydown(event);

		assert.strictEqual(contextmenu.opened, true);
		assert.strictEqual(event.defaultPrevented, false);
	});

	test('known key from an editable target does nothing', () => {
		contextmenu.open([], 0, 0);
		const input = document.createElement('input');
		document.body.appendChild(input);

		const event = create_keyboard_event('Escape');
		set_event_target(event, input);
		keydown(event);

		assert.strictEqual(contextmenu.opened, true);
		assert.strictEqual(event.defaultPrevented, false);

		input.remove();
	});
});

describe('contextmenu_create_mousedown_handler', () => {
	let contextmenu: ContextmenuState;
	let menu_el: HTMLElement;
	let outside_el: HTMLElement;

	beforeEach(() => {
		contextmenu = new ContextmenuState();
		contextmenu.open([], 0, 0);
		menu_el = document.createElement('div');
		document.body.appendChild(menu_el);
		outside_el = document.createElement('div');
		document.body.appendChild(outside_el);
	});

	afterEach(() => {
		menu_el.remove();
		outside_el.remove();
	});

	test('closes the menu when the event target is outside the menu element', () => {
		const handler = contextmenu_create_mousedown_handler(contextmenu, () => menu_el);

		const event = create_mouse_event('mousedown');
		set_event_target(event, outside_el);
		handler(event);

		assert.strictEqual(contextmenu.opened, false);
	});

	test('does not close when the event target is inside the menu element', () => {
		const inside_el = document.createElement('span');
		menu_el.appendChild(inside_el);
		const handler = contextmenu_create_mousedown_handler(contextmenu, () => menu_el);

		const event = create_mouse_event('mousedown');
		set_event_target(event, inside_el);
		handler(event);

		assert.strictEqual(contextmenu.opened, true);
	});

	test('is a no-op when the menu element getter returns undefined', () => {
		const handler = contextmenu_create_mousedown_handler(contextmenu, () => undefined);

		const event = create_mouse_event('mousedown');
		set_event_target(event, outside_el);
		handler(event);

		assert.strictEqual(contextmenu.opened, true);
	});
});

describe('contextmenu_open_from_event', () => {
	let contextmenu: ContextmenuState;
	let el: HTMLElement;
	let cleanup: (() => void) | void;

	const test_params = [
		{snippet: 'text' as const, props: {content: 'Test', icon: '🧪', run: () => undefined}},
	];

	beforeEach(() => {
		contextmenu = new ContextmenuState();
		el = document.createElement('div');
		document.body.appendChild(el);
		cleanup = contextmenu_attachment(test_params)(el);
	});

	afterEach(() => {
		if (cleanup) cleanup();
		el.remove();
	});

	test('opens the menu at event coords plus default offsets and swallows the event', () => {
		const event = create_contextmenu_event(100, 200);
		set_event_target(event, el);

		assert.strictEqual(contextmenu_open_from_event(event, contextmenu, undefined), true);

		assert.strictEqual(contextmenu.opened, true);
		assert.strictEqual(contextmenu.x, 100 + CONTEXTMENU_DEFAULT_OPEN_OFFSET_X);
		assert.strictEqual(contextmenu.y, 200 + CONTEXTMENU_DEFAULT_OPEN_OFFSET_Y);
		assert.strictEqual(event.defaultPrevented, true);
	});

	test('applies custom offsets', () => {
		const event = create_contextmenu_event(100, 200);
		set_event_target(event, el);

		assert.strictEqual(
			contextmenu_open_from_event(event, contextmenu, undefined, {
				open_offset_x: 10,
				open_offset_y: 20,
			}),
			true,
		);

		assert.strictEqual(contextmenu.x, 110);
		assert.strictEqual(contextmenu.y, 220);
	});

	test('returns false for shift-clicks', () => {
		const event = create_contextmenu_event(100, 200, {shiftKey: true});
		set_event_target(event, el);

		assert.strictEqual(contextmenu_open_from_event(event, contextmenu, undefined), false);

		assert.strictEqual(contextmenu.opened, false);
		assert.strictEqual(event.defaultPrevented, false);
	});

	test('returns false when the target is inside the menu element', () => {
		const menu_el = document.createElement('div');
		document.body.appendChild(menu_el);
		menu_el.appendChild(el); // re-parent the attachment target inside the menu

		const event = create_contextmenu_event(100, 200);
		set_event_target(event, el);

		assert.strictEqual(contextmenu_open_from_event(event, contextmenu, menu_el), false);

		assert.strictEqual(contextmenu.opened, false);
		assert.strictEqual(event.defaultPrevented, false);

		menu_el.remove();
	});
});

describe('ContextmenuTouchOpenGuard', () => {
	let guard: ContextmenuTouchOpenGuard;

	beforeEach(() => {
		guard = new ContextmenuTouchOpenGuard();
	});

	test('guards the release of a gesture that opened the menu', () => {
		guard.touchstart();
		guard.opened();

		const touchend = create_touch_event('touchend', []);
		assert.strictEqual(guard.touchend(touchend), true);
		assert.strictEqual(touchend.defaultPrevented, true);

		// The click blocker is armed and consumes exactly one click.
		assert.strictEqual(guard.consume_blocked_click(), true);
		assert.strictEqual(guard.consume_blocked_click(), false);
	});

	test('does not guard a release when the menu did not open during the touch', () => {
		guard.touchstart();

		const touchend = create_touch_event('touchend', []);
		assert.strictEqual(guard.touchend(touchend), false);
		assert.strictEqual(touchend.defaultPrevented, false);
		assert.strictEqual(guard.consume_blocked_click(), false);
	});

	test('does not arm when the menu opens without an active touch', () => {
		// A mouse right-click open - no touchstart preceded it.
		guard.opened();

		const touchend = create_touch_event('touchend', []);
		assert.strictEqual(guard.touchend(touchend), false);
		assert.strictEqual(touchend.defaultPrevented, false);
		assert.strictEqual(guard.consume_blocked_click(), false);
	});

	test('guards only the opening gesture, not subsequent releases', () => {
		guard.touchstart();
		guard.opened();
		guard.touchend(create_touch_event('touchend', []));
		guard.consume_blocked_click();

		// The next gesture is a normal tap on a menu item.
		guard.touchstart();
		const touchend = create_touch_event('touchend', []);
		assert.strictEqual(guard.touchend(touchend), false);
		assert.strictEqual(touchend.defaultPrevented, false);
	});

	test('touchstart clears a stale armed click blocker', () => {
		guard.touchstart();
		guard.opened();
		guard.touchend(create_touch_event('touchend', []));

		// The blocker is armed but no click arrived - the next gesture clears it.
		guard.touchstart();
		assert.strictEqual(guard.consume_blocked_click(), false);
	});

	test('reset clears the armed state', () => {
		guard.touchstart();
		guard.opened();
		guard.reset();

		const touchend = create_touch_event('touchend', []);
		assert.strictEqual(guard.touchend(touchend), false);
		assert.strictEqual(touchend.defaultPrevented, false);
		assert.strictEqual(guard.consume_blocked_click(), false);
	});
});
