/**
 * @vitest-environment jsdom
 */
import {describe, test, assert, beforeEach, afterEach} from 'vitest';

import {
	ContextmenuState,
	contextmenu_attachment,
	contextmenu_open,
} from '$lib/contextmenu_state.svelte.js';

describe('contextmenu_open DOM querying', () => {
	let contextmenu: ContextmenuState;
	let root: HTMLElement;

	beforeEach(() => {
		contextmenu = new ContextmenuState();
		root = document.createElement('div');
		document.body.appendChild(root);
	});

	afterEach(() => {
		root.remove();
	});

	test('returns false without hanging for a stale dataset key', () => {
		// Simulates an attachment that was nullified or torn down,
		// leaving its dataset attribute on the element with no corresponding cache entry.
		const el = document.createElement('div');
		el.dataset.contextmenu = 'stale_key_with_no_cache_entry';
		root.appendChild(el);
		const child = document.createElement('span');
		el.appendChild(child);

		assert.strictEqual(contextmenu_open(child, 0, 0, contextmenu), false);
		assert.strictEqual(contextmenu.opened, false);
	});

	test('collects entries from ancestors above a stale dataset key', () => {
		const outer = document.createElement('div');
		root.appendChild(outer);
		const stale = document.createElement('div');
		stale.dataset.contextmenu = 'another_stale_key';
		outer.appendChild(stale);
		const target = document.createElement('span');
		stale.appendChild(target);

		const params = [
			{snippet: 'text' as const, props: {content: 'outer entry', icon: '🙂', run: () => {}}},
		];
		const cleanup = contextmenu_attachment(params)(outer);

		assert.strictEqual(contextmenu_open(target, 10, 20, contextmenu), true);
		assert.strictEqual(contextmenu.opened, true);
		assert.deepEqual(contextmenu.params, params);

		cleanup?.();
	});

	test('attachment params register and unregister with the cache', () => {
		const el = document.createElement('div');
		root.appendChild(el);

		const params = [
			{snippet: 'text' as const, props: {content: 'entry', icon: '🙂', run: () => {}}},
		];
		const cleanup = contextmenu_attachment(params)(el);

		assert.strictEqual(contextmenu_open(el, 0, 0, contextmenu), true);
		contextmenu.close();

		// After cleanup the dataset attribute remains but the cache entry is gone,
		// so opening is a no-op instead of hanging or showing stale entries.
		cleanup?.();
		assert.strictEqual(contextmenu_open(el, 0, 0, contextmenu), false);
		assert.strictEqual(contextmenu.opened, false);
	});
});
