// @vitest-environment jsdom

/**
 * Tests for `SidebarState` — the wide and narrow visibility fields, mode
 * routing through a flippable `matchMedia` stub, the reactive `narrow`
 * subscription, the `enabled` option, and the narrow-query guard.
 *
 * @module
 */

import { describe, test, assert, vi, beforeEach, afterEach } from 'vitest';

import { flushSync } from 'svelte';

import { SIDEBAR_NARROW_QUERY_DEFAULT, SidebarState } from '#lib/sidebar_state.svelte.ts';
import { stub_match_media, type MatchMediaStub } from './match_media_test_helpers.ts';

let media: MatchMediaStub;

beforeEach(() => {
	media = stub_match_media();
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('SidebarState defaults', () => {
	test('wide open, narrow closed, default query', () => {
		const state = new SidebarState();
		assert.strictEqual(state.narrow_query, SIDEBAR_NARROW_QUERY_DEFAULT);
		assert.deepEqual(media.queries, [SIDEBAR_NARROW_QUERY_DEFAULT]);
		assert.isTrue(state.show_wide);
		assert.isFalse(state.show_narrow);
		assert.isFalse(state.narrow);
		assert.isTrue(state.show);
		assert.isNull(state.id);
	});

	test('custom id is passed through', () => {
		const state = new SidebarState({ id: 'site-menu' });
		assert.strictEqual(state.id, 'site-menu');
	});

	test('narrow viewport starts closed', () => {
		media.set_matches(true);
		const state = new SidebarState();
		assert.isTrue(state.narrow);
		assert.isFalse(state.show);
	});

	test('custom query is passed through', () => {
		const state = new SidebarState({ narrow_query: '(max-width: 900px)' });
		assert.strictEqual(state.narrow_query, '(max-width: 900px)');
		assert.deepEqual(media.queries, ['(max-width: 900px)']);
	});
});

describe('SidebarState mode routing', () => {
	test('wide toggle flips only the wide field', () => {
		const state = new SidebarState();
		state.toggle();
		assert.isFalse(state.show_wide);
		assert.isFalse(state.show_narrow);
		assert.isFalse(state.show);
		state.toggle();
		assert.isTrue(state.show_wide);
		assert.isFalse(state.show_narrow);
	});

	test('narrow toggle flips only the narrow field', () => {
		media.set_matches(true);
		const state = new SidebarState();
		state.toggle();
		assert.isTrue(state.show_narrow);
		assert.isTrue(state.show_wide);
		assert.isTrue(state.show);
		state.toggle();
		assert.isFalse(state.show_narrow);
		assert.isTrue(state.show_wide);
	});

	test('explicit toggle value writes the current mode', () => {
		const state = new SidebarState();
		state.show = false;
		assert.isFalse(state.show_wide);
		media.set_matches(true);
		state.show = true;
		assert.isTrue(state.show_narrow);
		assert.isFalse(state.show_wide);
	});

	test('show setter writes the current mode', () => {
		const state = new SidebarState();
		state.show = false;
		assert.isFalse(state.show_wide);
		media.set_matches(true);
		state.show = true;
		assert.isTrue(state.show_narrow);
		assert.isFalse(state.show_wide);
	});

	test('wide closed survives narrow open, close, and crossings', () => {
		const state = new SidebarState();
		state.show = false;
		media.set_matches(true);
		assert.isFalse(state.show);
		state.toggle();
		assert.isTrue(state.show);
		state.close_narrow();
		assert.isFalse(state.show);
		state.toggle();
		media.set_matches(false);
		assert.isFalse(state.show_wide);
		assert.isFalse(state.show);
		media.set_matches(true);
		assert.isTrue(state.show, 'narrow field is untouched by crossing on its own');
	});

	test('close_narrow clears only the narrow field', () => {
		media.set_matches(true);
		const state = new SidebarState();
		state.show = true;
		state.close_narrow();
		assert.isFalse(state.show_narrow);
		assert.isTrue(state.show_wide);
	});
});

describe('SidebarState narrow reactivity', () => {
	test('an effect reading narrow reruns when the query flips', () => {
		const state = new SidebarState();
		const seen: Array<boolean> = [];
		const cleanup = $effect.root(() => {
			$effect(() => {
				seen.push(state.narrow);
			});
		});
		try {
			flushSync();
			media.set_matches(true);
			flushSync();
			media.set_matches(false);
			flushSync();
		} finally {
			cleanup();
		}
		assert.deepEqual(seen, [false, true, false]);
	});

	test('show follows the flip reactively', () => {
		const state = new SidebarState();
		const seen: Array<boolean> = [];
		const cleanup = $effect.root(() => {
			$effect(() => {
				seen.push(state.show);
			});
		});
		try {
			flushSync();
			media.set_matches(true);
			flushSync();
		} finally {
			cleanup();
		}
		assert.deepEqual(seen, [true, false]);
	});
});

describe('SidebarState enabled', () => {
	test('show is false while disabled, in both modes', () => {
		const state = new SidebarState({ enabled: () => false });
		assert.isFalse(state.show);
		assert.isTrue(state.show_wide);
		media.set_matches(true);
		state.show_narrow = true;
		assert.isFalse(state.show);
	});

	test('the enabled getter is read on every access', () => {
		let enabled = false;
		const state = new SidebarState({ enabled: () => enabled });
		assert.isFalse(state.enabled);
		assert.isFalse(state.show);
		enabled = true;
		assert.isTrue(state.show);
	});
});

describe('SidebarState toggle', () => {
	test('flips the current mode only', () => {
		const state = new SidebarState();
		state.toggle();
		assert.isFalse(state.show_wide);
		media.set_matches(true);
		state.toggle();
		assert.isTrue(state.show_narrow);
		assert.isFalse(state.show_wide);
	});

	test('enabled defaults to true', () => {
		assert.isTrue(new SidebarState().enabled);
	});
});

describe('SidebarState narrow_query', () => {
	test('null disables narrow mode without calling matchMedia', () => {
		media.set_matches(true);
		const state = new SidebarState({ narrow_query: null });
		assert.isNull(state.narrow_query);
		assert.isFalse(state.narrow);
		assert.deepEqual(media.queries, []);
		state.toggle();
		assert.isFalse(state.show_wide);
		assert.isFalse(state.show_narrow);
	});

	test('a query without parentheses throws in DEV', () => {
		assert.throws(() => new SidebarState({ narrow_query: 'max-width: 900px' }), /parentheses/);
		assert.deepEqual(media.queries, []);
	});
});
