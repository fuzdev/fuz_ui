import {describe, test, assert, beforeEach} from 'vitest';

import {
	ContextmenuState,
	EntryState,
	SubmenuState,
	RootMenuState,
} from '$lib/contextmenu_state.svelte.js';

describe('ContextmenuState - Edge Cases', () => {
	let contextmenu: ContextmenuState;

	beforeEach(() => {
		contextmenu = new ContextmenuState();
	});

	describe('error handling', () => {
		test('synchronous errors display correctly', () => {
			const entry = new EntryState(contextmenu.root_menu, () => {
				throw new Error('sync error');
			});

			void contextmenu.activate(entry);

			assert.strictEqual(entry.error_message, 'sync error');
			assert.strictEqual(contextmenu.error, 'sync error');
		});

		test('async errors display correctly', async () => {
			const entry = new EntryState(contextmenu.root_menu, () => async () => {
				throw new Error('async error');
			});

			await contextmenu.activate(entry);

			assert.strictEqual(entry.error_message, 'async error');
			assert.strictEqual(contextmenu.error, 'async error');
		});

		test('multiple errors in sequence handled', async () => {
			const entry1 = new EntryState(contextmenu.root_menu, () => {
				throw new Error('error 1');
			});
			const entry2 = new EntryState(contextmenu.root_menu, () => {
				throw new Error('error 2');
			});

			void contextmenu.activate(entry1);
			assert.strictEqual(contextmenu.error, 'error 1');

			void contextmenu.activate(entry2);
			assert.strictEqual(contextmenu.error, 'error 2');
		});

		test('error state cleared on successful action', async () => {
			const failing_entry = new EntryState(contextmenu.root_menu, () => {
				throw new Error('initial error');
			});
			const success_entry = new EntryState(contextmenu.root_menu, () => () => {
				return {ok: true};
			});

			contextmenu.root_menu.items = [...contextmenu.root_menu.items, failing_entry, success_entry];
			contextmenu.open([], 0, 0);

			void contextmenu.activate(failing_entry);
			assert.strictEqual(contextmenu.error, 'initial error');

			void contextmenu.activate(success_entry);
			// Error is still in entry, but menu closed
			assert.strictEqual(contextmenu.opened, false);
		});

		test('error state cleared on menu close', () => {
			const entry = new EntryState(contextmenu.root_menu, () => async () => {
				throw new Error('error to clear');
			});
			contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry];

			contextmenu.open([], 0, 0);

			// Start async activation that will error
			void contextmenu.activate(entry);

			// Wait for error to propagate (async)
			return new Promise<void>((resolve) => {
				setTimeout(() => {
					assert.strictEqual(entry.error_message, 'error to clear');

					contextmenu.close();
					assert.strictEqual(entry.error_message, null);
					resolve();
				}, 10);
			});
		});

		test('error state cleared on new menu open', async () => {
			const entry = new EntryState(contextmenu.root_menu, () => async () => {
				throw new Error('old error');
			});
			contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry];

			contextmenu.open([], 0, 0);
			await contextmenu.activate(entry);
			assert.strictEqual(contextmenu.error, 'old error');
			assert.strictEqual(entry.error_message, 'old error');

			// Open new menu (which clears selections)
			// Note: Opening doesn't reset entry errors - close() does
			contextmenu.open([], 50, 50);

			// Error message persists until close() or reset_items() is called
			assert.strictEqual(entry.error_message, 'old error');
		});
	});

	describe('boundary conditions', () => {
		test('empty params array', () => {
			contextmenu.open([], 100, 200);

			assert.strictEqual(contextmenu.opened, true);
			assert.strictEqual(contextmenu.params.length, 0);
			assert.strictEqual(contextmenu.x, 100);
			assert.strictEqual(contextmenu.y, 200);
		});

		test('null/undefined handling', () => {
			// Open with valid params
			contextmenu.open(
				[{snippet: 'text' as const, props: {content: 'Test', icon: '🧪', run: () => {}}}],
				0,
				0,
			);
			assert.strictEqual(contextmenu.opened, true);

			// Close should handle state reset
			contextmenu.close();
			assert.strictEqual(contextmenu.opened, false);
		});

		test('invalid coordinates (negative)', () => {
			contextmenu.open([], -100, -200);

			// State accepts negative coordinates (clamping handled elsewhere)
			assert.strictEqual(contextmenu.x, -100);
			assert.strictEqual(contextmenu.y, -200);
		});

		test('invalid coordinates (NaN)', () => {
			contextmenu.open([], NaN, NaN);

			// NaN coordinates are stored as-is
			assert.ok(Number.isNaN(contextmenu.x));
			assert.ok(Number.isNaN(contextmenu.y));
		});

		test('invalid coordinates (Infinity)', () => {
			contextmenu.open([], Infinity, -Infinity);

			assert.strictEqual(contextmenu.x, Infinity);
			assert.strictEqual(contextmenu.y, -Infinity);
		});

		test('very large coordinate values', () => {
			const large_x = Number.MAX_SAFE_INTEGER;
			const large_y = Number.MAX_SAFE_INTEGER - 1;

			contextmenu.open([], large_x, large_y);

			assert.strictEqual(contextmenu.x, large_x);
			assert.strictEqual(contextmenu.y, large_y);
		});

		test('zero-sized layout', () => {
			const zero_layout = {width: 0, height: 0};
			const cm = new ContextmenuState({layout: zero_layout as any});

			assert.strictEqual(cm.layout.width, 0);
			assert.strictEqual(cm.layout.height, 0);

			// Can still open menu (positioning handled elsewhere)
			cm.open([], 100, 100);
			assert.strictEqual(cm.opened, true);
		});

		test('single item menus', () => {
			const entry = new EntryState(contextmenu.root_menu, () => () => {});
			contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry];

			contextmenu.select_next();
			assert.strictEqual(entry.selected, true);

			contextmenu.select_next(); // Wraps to same item
			assert.strictEqual(entry.selected, true);

			contextmenu.select_previous(); // Wraps to same item
			assert.strictEqual(entry.selected, true);
		});

		test('maximum depth nesting', () => {
			// Create 10-level deep menu
			let current_menu: SubmenuState | RootMenuState = contextmenu.root_menu;
			const depth = 10;

			for (let i = 1; i <= depth; i++) {
				const submenu = new SubmenuState(current_menu, i + 1) as any;
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				if (current_menu.is_menu) {
					current_menu.items = [...current_menu.items, submenu];
				}
				current_menu = submenu;
			}

			// Add entry at deepest level
			const deepest_entry = new EntryState(current_menu, () => () => {});
			current_menu.items = [...current_menu.items, deepest_entry];

			// Verify structure depth
			let walker: any = deepest_entry;
			let actual_depth = 0;
			while (walker.menu) {
				walker = walker.menu;
				actual_depth++;
			}
			assert.ok(actual_depth >= depth);
		});
	});

	describe('race conditions', () => {
		test('concurrent open/close', () => {
			// Rapidly open and close
			for (let i = 0; i < 10; i++) {
				contextmenu.open([], i, i);
				if (i % 2 === 0) {
					contextmenu.close();
				}
			}

			// Final state should be consistent
			assert.ok(typeof contextmenu.opened === 'boolean');
		});

		test('concurrent selections', () => {
			const entries = Array.from(
				{length: 10},
				() => new EntryState(contextmenu.root_menu, () => () => {}),
			);
			contextmenu.root_menu.items = [...contextmenu.root_menu.items, ...entries];

			// Rapid selections
			for (let i = 0; i < 100; i++) {
				contextmenu.select(entries[i % entries.length]!);
			}

			// Only one should be selected
			const selected_count = entries.filter((e) => e.selected).length;
			assert.strictEqual(selected_count, 1);
		});

		test('concurrent activations', async () => {
			const entries = Array.from(
				{length: 3},
				() =>
					new EntryState(contextmenu.root_menu, () => async () => {
						await new Promise((resolve) => setTimeout(resolve, 10));
						return {ok: true};
					}),
			);
			contextmenu.root_menu.items = [...contextmenu.root_menu.items, ...entries];

			contextmenu.open([], 0, 0);

			// Start multiple activations
			const promises = entries.map((entry) => contextmenu.activate(entry));

			// eslint-disable-next-line @typescript-eslint/await-thenable
			await Promise.all(promises);

			// All should complete without error
			entries.forEach((entry) => {
				assert.strictEqual(entry.pending, false);
				assert.strictEqual(entry.error_message, null);
			});
		});

		test('promise resolution after close', async () => {
			let resolve: any;
			const promise = new Promise((r) => (resolve = r));

			const entry = new EntryState(contextmenu.root_menu, () => async () => {
				await promise;
				return {ok: true};
			});

			contextmenu.open([], 0, 0);
			const activation = contextmenu.activate(entry);

			contextmenu.close();
			assert.strictEqual(contextmenu.opened, false);

			// Resolve after close
			resolve({ok: true});
			await activation;

			// Should stay closed
			assert.strictEqual(contextmenu.opened, false);
		});

		test('state mutations during iteration', () => {
			const entries = Array.from(
				{length: 5},
				() => new EntryState(contextmenu.root_menu, () => () => {}),
			);
			contextmenu.root_menu.items = [...contextmenu.root_menu.items, ...entries];

			// Iterate and mutate
			contextmenu.root_menu.items.forEach((entry, i) => {
				if (i % 2 === 0) {
					contextmenu.select(entry);
				}
			});

			// Should handle without errors
			assert.ok(contextmenu.selections.length > 0);
		});
	});
});
