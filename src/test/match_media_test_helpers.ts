/**
 * Shared helper for tests that drive Svelte's client runtime in jsdom: a
 * `window.matchMedia` stub the test can flip.
 *
 * Not itself a test file — no `.test.` infix means vitest does not pick it up.
 *
 * @module
 */

import { vi } from 'vitest';

export interface MatchMediaStub {
	/** Flips whether every stubbed query matches, notifying `change` listeners. */
	set_matches: (matches: boolean) => void;
	/** The queries passed to `window.matchMedia`, in call order. */
	queries: Array<string>;
}

/**
 * Installs a `window.matchMedia` stub whose single `matches` flag the test
 * controls. Each returned list is a real `EventTarget`, so `change` reaches
 * listeners the way a browser dispatches it. Pair with `vi.unstubAllGlobals()` in `afterEach`.
 */
export const stub_match_media = (): MatchMediaStub => {
	let matches = false;
	const lists: Array<EventTarget> = [];
	const queries: Array<string> = [];
	vi.stubGlobal('matchMedia', (query: string) => {
		queries.push(query);
		const list = Object.defineProperties(new EventTarget(), {
			media: { value: query },
			matches: { get: () => matches }
		});
		lists.push(list);
		return list;
	});
	return {
		set_matches: (value) => {
			matches = value;
			for (const list of lists) list.dispatchEvent(new Event('change'));
		},
		queries
	};
};
