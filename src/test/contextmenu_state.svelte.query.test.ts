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

	test('returns false without hanging for a stale dataset marker', () => {
		// Simulates a stale marker - the dataset attribute is present
		// (e.g. set by external code) but no params are registered for the element.
		const el = document.createElement('div');
		el.dataset.contextmenu = '';
		root.appendChild(el);
		const child = document.createElement('span');
		el.appendChild(child);

		assert.strictEqual(contextmenu_open(child, 0, 0, contextmenu), false);
		assert.strictEqual(contextmenu.opened, false);
	});

	test('collects entries from ancestors above a stale dataset marker', () => {
		const outer = document.createElement('div');
		root.appendChild(outer);
		const stale = document.createElement('div');
		stale.dataset.contextmenu = '';
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

	test('attachment params register and unregister', () => {
		const el = document.createElement('div');
		root.appendChild(el);

		const params = [
			{snippet: 'text' as const, props: {content: 'entry', icon: '🙂', run: () => {}}},
		];
		const cleanup = contextmenu_attachment(params)(el);
		assert.strictEqual(el.dataset.contextmenu, '');

		assert.strictEqual(contextmenu_open(el, 0, 0, contextmenu), true);
		contextmenu.close();

		// Cleanup removes both the registration and the crawl marker,
		// so opening is a no-op instead of hanging or showing stale entries.
		cleanup?.();
		assert.strictEqual(el.dataset.contextmenu, undefined);
		assert.strictEqual(contextmenu_open(el, 0, 0, contextmenu), false);
		assert.strictEqual(contextmenu.opened, false);
	});
});

describe('contextmenu_open entry filtering', () => {
	let contextmenu: ContextmenuState;
	let root: HTMLElement;

	const text_param = {
		snippet: 'text' as const,
		props: {content: 'entry', icon: '🙂', run: () => {}},
	};
	const separator_param = {snippet: 'separator' as const, props: {}};

	beforeEach(() => {
		contextmenu = new ContextmenuState();
		root = document.createElement('div');
		document.body.appendChild(root);
	});

	afterEach(() => {
		root.remove();
	});

	test('separator_enabled: false drops separator params', () => {
		const el = document.createElement('div');
		root.appendChild(el);
		const cleanup = contextmenu_attachment([text_param, separator_param])(el);

		assert.strictEqual(contextmenu_open(el, 0, 0, contextmenu, {separator_enabled: false}), true);
		assert.deepEqual(contextmenu.params, [text_param]);

		cleanup?.();
	});

	test('link_enabled: false drops the anchor-derived link param', () => {
		const anchor = document.createElement('a');
		anchor.href = '/somewhere';
		root.appendChild(anchor);
		const el = document.createElement('span');
		anchor.appendChild(el);
		const cleanup = contextmenu_attachment([text_param])(el);

		// sanity: with links enabled the anchor contributes a link param
		assert.strictEqual(contextmenu_open(el, 0, 0, contextmenu), true);
		assert.strictEqual(contextmenu.params.length, 2);
		contextmenu.close();

		assert.strictEqual(contextmenu_open(el, 0, 0, contextmenu, {link_enabled: false}), true);
		assert.deepEqual(contextmenu.params, [text_param]);

		cleanup?.();
	});

	test('returns false when filtering removes every param', () => {
		const el = document.createElement('div');
		root.appendChild(el);
		const cleanup = contextmenu_attachment([text_param])(el);

		assert.strictEqual(contextmenu_open(el, 0, 0, contextmenu, {text_enabled: false}), false);
		assert.strictEqual(contextmenu.opened, false);

		cleanup?.();
	});
});
