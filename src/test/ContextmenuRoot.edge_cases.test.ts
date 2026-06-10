/**
 * @vitest-environment jsdom
 */
import {describe, test, assert, afterEach, vi} from 'vitest';
import {flushSync} from 'svelte';

import {create_shared_edge_case_tests} from './contextmenu_test_edge_cases.js';
import ContextmenuRoot from '$lib/ContextmenuRoot.svelte';
import {contextmenu_attachment} from '$lib/contextmenu_state.svelte.js';
import {
	unmount_component,
	create_contextmenu_event,
	create_mouse_event,
	create_touch_event,
	set_event_target,
} from './test_helpers.js';
import {mount_contextmenu_root} from './contextmenu_test_helpers.js';

// ResizeObserver is not currently available in jsdom
class ResizeObserverMock {
	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

create_shared_edge_case_tests(ContextmenuRoot, 'ContextmenuRoot');

describe('ContextmenuRoot - Reopen While Open', () => {
	let mounted: ReturnType<typeof mount_contextmenu_root> | null = null;

	afterEach(async () => {
		if (mounted) {
			await unmount_component(mounted.instance, mounted.container);
			mounted = null;
		}
	});

	/**
	 * Sets up two contextmenu targets with different text-entry params and opens
	 * the menu from the first one. Uses `contextmenu_attachment` directly so each
	 * target gets a unique cache key (`setup_contextmenu_attachment` shares one key,
	 * which would clobber the first target).
	 */
	const mount_and_open_first_target = () => {
		mounted = mount_contextmenu_root(ContextmenuRoot);
		const {container, contextmenu} = mounted;

		const target_a = document.createElement('div');
		container.appendChild(target_a);
		const cleanup_a = contextmenu_attachment([
			{snippet: 'text' as const, props: {content: 'A1', icon: '🍎', run: () => undefined}},
			{snippet: 'text' as const, props: {content: 'A2', icon: '🍎', run: () => undefined}},
		])(target_a);

		const target_b = document.createElement('div');
		container.appendChild(target_b);
		const cleanup_b = contextmenu_attachment([
			{snippet: 'text' as const, props: {content: 'B1', icon: '🍌', run: () => undefined}},
			{snippet: 'text' as const, props: {content: 'B2', icon: '🍌', run: () => undefined}},
			{snippet: 'text' as const, props: {content: 'B3', icon: '🍌', run: () => undefined}},
		])(target_b);

		// Open from the first target - its entries mount and register in root_menu.items.
		const event_a = create_contextmenu_event(100, 100);
		set_event_target(event_a, target_a);
		window.dispatchEvent(event_a);
		flushSync();

		assert.strictEqual(contextmenu.opened, true);
		assert.strictEqual(contextmenu.root_menu.items.length, 2);

		const open_second_target = () => {
			const event_b = create_contextmenu_event(200, 200);
			set_event_target(event_b, target_b);
			window.dispatchEvent(event_b);
			flushSync();
		};

		const cleanup = () => {
			cleanup_a?.();
			cleanup_b?.();
			target_a.remove();
			target_b.remove();
		};

		return {contextmenu, open_second_target, cleanup};
	};

	// Guards the interleaved add/destroy case: when the keyed each replaces entries
	// within a single batch, the destroyed entries' teardowns must remove only
	// themselves without losing concurrently-registered entries
	// (see `ContextmenuItemsState`'s non-reactive source array).
	test('reopening while open replaces root_menu items with the new entries', () => {
		const {contextmenu, open_second_target, cleanup} = mount_and_open_first_target();

		// While still open, open again from the other target with different params.
		open_second_target();

		assert.strictEqual(contextmenu.opened, true);
		assert.strictEqual(contextmenu.params.length, 3);
		// The destroyed entries' onDestroy must remove only themselves from items,
		// not lose any of the freshly mounted ones.
		assert.strictEqual(contextmenu.root_menu.items.length, 3);

		cleanup();
	});

	test('reopening after close mounts exactly the new entries', () => {
		const {contextmenu, open_second_target, cleanup} = mount_and_open_first_target();

		// Close first (the realistic mouse flow closes via mousedown before reopening).
		contextmenu.close();
		flushSync();
		assert.strictEqual(contextmenu.root_menu.items.length, 0);

		open_second_target();

		assert.strictEqual(contextmenu.opened, true);
		assert.strictEqual(contextmenu.params.length, 3);
		assert.strictEqual(contextmenu.root_menu.items.length, 3);

		cleanup();
	});
});

describe('ContextmenuRoot - Synthesized Click After Touch Open', () => {
	let mounted: ReturnType<typeof mount_contextmenu_root> | null = null;

	afterEach(async () => {
		vi.useRealTimers();
		if (mounted) {
			await unmount_component(mounted.instance, mounted.container);
			mounted = null;
		}
	});

	// On touch devices this root opens from the native longpress `contextmenu` event;
	// the release of that same gesture must not interact with the menu - an unprevented
	// `touchend` lets the browser synthesize a `click` at the touch point, which the open
	// offsets place on the first menu item (see `ContextmenuTouchOpenGuard`).
	test('touch-opened menu does not activate the first item on release', () => {
		vi.useFakeTimers();
		mounted = mount_contextmenu_root(ContextmenuRoot);
		// Touch listeners attach via Svelte's microtask queue - drain it before dispatching.
		flushSync();
		const {container, contextmenu} = mounted;

		let activated = false;
		const target = document.createElement('div');
		container.appendChild(target);
		const cleanup = contextmenu_attachment([
			{
				snippet: 'text' as const,
				props: {
					content: 'First',
					icon: '🧪',
					run: () => {
						activated = true;
					},
				},
			},
		])(target);

		// The opening gesture: finger down, the native `contextmenu` fires during the hold.
		const touchstart = create_touch_event('touchstart', [{clientX: 100, clientY: 200, target}]);
		set_event_target(touchstart, target);
		window.dispatchEvent(touchstart);

		const contextmenu_event = create_contextmenu_event(100, 200);
		set_event_target(contextmenu_event, target);
		window.dispatchEvent(contextmenu_event);
		flushSync();
		assert.strictEqual(contextmenu.opened, true);

		// The release of the same gesture.
		const touchend = create_touch_event('touchend', []);
		set_event_target(touchend, target);
		window.dispatchEvent(touchend);

		// When `touchend` isn't `preventDefault`ed, the browser synthesizes compatibility
		// mouse events at the touch point - the open offsets put the first item there.
		if (!touchend.defaultPrevented) {
			const item = container.querySelector('.contextmenu [role="menuitem"]');
			assert.ok(item);
			const click = create_mouse_event('click', {bubbles: true, cancelable: true});
			set_event_target(click, item);
			item.dispatchEvent(click);
		}

		// Entry activation defers through a timeout.
		vi.runAllTimers();
		flushSync();

		assert.strictEqual(activated, false, 'the opening release must not activate the first item');
		assert.strictEqual(contextmenu.opened, true, 'menu should stay open after the opening release');

		cleanup?.();
		target.remove();
	});
});

describe('ContextmenuRoot - Blocked Click After Touch Open', () => {
	let mounted: ReturnType<typeof mount_contextmenu_root> | null = null;

	afterEach(async () => {
		vi.useRealTimers();
		if (mounted) {
			await unmount_component(mounted.instance, mounted.container);
			mounted = null;
		}
	});

	// iOS can synthesize the click even when the opening gesture's `touchend` is
	// swallowed - the menu's click capture handler blocks that first click.
	test('click synthesized despite the swallowed release is blocked', () => {
		vi.useFakeTimers();
		mounted = mount_contextmenu_root(ContextmenuRoot);
		// Touch listeners attach via Svelte's microtask queue - drain it before dispatching.
		flushSync();
		const {container, contextmenu} = mounted;

		let activated = false;
		const target = document.createElement('div');
		container.appendChild(target);
		const cleanup = contextmenu_attachment([
			{
				snippet: 'text' as const,
				props: {
					content: 'First',
					icon: '🧪',
					run: () => {
						activated = true;
					},
				},
			},
		])(target);

		const touchstart = create_touch_event('touchstart', [{clientX: 100, clientY: 200, target}]);
		set_event_target(touchstart, target);
		window.dispatchEvent(touchstart);

		const contextmenu_event = create_contextmenu_event(100, 200);
		set_event_target(contextmenu_event, target);
		window.dispatchEvent(contextmenu_event);
		flushSync();
		assert.strictEqual(contextmenu.opened, true);

		const touchend = create_touch_event('touchend', []);
		set_event_target(touchend, target);
		window.dispatchEvent(touchend);
		assert.strictEqual(touchend.defaultPrevented, true, 'the opening release is swallowed');

		// iOS-style: the click arrives anyway.
		const item = container.querySelector('.contextmenu [role="menuitem"]');
		assert.ok(item);
		const click = create_mouse_event('click', {bubbles: true, cancelable: true});
		set_event_target(click, item);
		item.dispatchEvent(click);
		assert.strictEqual(click.defaultPrevented, true, 'the synthesized click is blocked');

		vi.runAllTimers();
		flushSync();

		assert.strictEqual(activated, false);
		assert.strictEqual(contextmenu.opened, true);

		// The blocker consumes exactly one click - the next click activates normally.
		const second_click = create_mouse_event('click', {bubbles: true, cancelable: true});
		set_event_target(second_click, item);
		item.dispatchEvent(second_click);
		vi.runAllTimers();
		flushSync();
		assert.strictEqual(activated, true, 'subsequent clicks activate normally');

		cleanup?.();
		target.remove();
	});
});
