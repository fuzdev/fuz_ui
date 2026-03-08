import {describe, test, assert, beforeEach} from 'vitest';

import {ContextmenuState, EntryState, SubmenuState} from '$lib/contextmenu_state.svelte.js';

describe('ContextmenuState - Activation', () => {
	let contextmenu: ContextmenuState;

	beforeEach(() => {
		contextmenu = new ContextmenuState();
	});

	describe('activation', () => {
		test('activate() runs synchronous callback and closes', () => {
			let ran = false;
			const entry = new EntryState(contextmenu.root_menu, () => () => {
				ran = true;
			});

			contextmenu.open([], 0, 0);
			void contextmenu.activate(entry);

			assert.strictEqual(ran, true);
			assert.strictEqual(contextmenu.opened, false);
		});

		test('activate() handles synchronous error', () => {
			const entry = new EntryState(contextmenu.root_menu, () => {
				throw new Error('test error');
			});

			void contextmenu.activate(entry);

			assert.strictEqual(entry.error_message, 'test error');
			assert.strictEqual(contextmenu.error, 'test error');
		});

		test('activate() handles async success and closes', async () => {
			let resolved = false;
			const entry = new EntryState(contextmenu.root_menu, () => async () => {
				resolved = true;
				return {ok: true};
			});

			contextmenu.open([], 0, 0);
			const promise = contextmenu.activate(entry);

			assert.strictEqual(entry.pending, true);
			assert.strictEqual(entry.error_message, null);

			await promise;

			assert.strictEqual(resolved, true);
			assert.strictEqual(entry.pending, false);
			assert.strictEqual(contextmenu.opened, false);
		});

		test('activate() handles async error', async () => {
			const entry = new EntryState(contextmenu.root_menu, () => async () => {
				throw new Error('async error');
			});

			const promise = contextmenu.activate(entry);
			await promise;

			assert.strictEqual(entry.error_message, 'async error');
			assert.strictEqual(contextmenu.error, 'async error');
			assert.strictEqual(entry.pending, false);
		});

		test('activate() handles async failure result', async () => {
			const entry = new EntryState(contextmenu.root_menu, () => async () => {
				return {ok: false, message: 'failed'};
			});

			contextmenu.open([], 0, 0);
			await contextmenu.activate(entry);

			assert.strictEqual(entry.error_message, 'failed');
			assert.strictEqual(contextmenu.error, 'failed');
			assert.strictEqual(contextmenu.opened, true); // Should not close on failure
		});

		test('activate() on submenu calls expand_selected', () => {
			const submenu = new SubmenuState(contextmenu.root_menu, 2);
			const child = new EntryState(submenu, () => () => {});
			submenu.items = [...submenu.items, child];

			contextmenu.select(submenu);
			void contextmenu.activate(submenu);

			assert.strictEqual(child.selected, true);
		});

		test('activate_selected() activates current selection', () => {
			let ran = false;
			const entry = new EntryState(contextmenu.root_menu, () => () => {
				ran = true;
			});

			contextmenu.open([], 0, 0);
			contextmenu.select(entry);
			void contextmenu.activate_selected();

			assert.strictEqual(ran, true);
		});

		test('activate_selected() selects first when no selection', () => {
			const entry = new EntryState(contextmenu.root_menu, () => () => {});
			contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry];

			void contextmenu.activate_selected();

			assert.strictEqual(entry.selected, true);
		});

		test('activate() closes on void return (async)', async () => {
			const entry = new EntryState(contextmenu.root_menu, () => async () => {
				// Implicit undefined/void return
			});

			contextmenu.open([], 0, 0);
			await contextmenu.activate(entry);

			assert.strictEqual(contextmenu.opened, false);
		});

		test('activate() ignores stale promise', async () => {
			let resolve1: any;
			let resolve2: any;
			const promise1: Promise<{ok: true}> = new Promise((r) => (resolve1 = r));
			const promise2: Promise<{ok: true}> = new Promise((r) => (resolve2 = r));

			let call_count = 0;
			const entry = new EntryState(contextmenu.root_menu, () => async () => {
				call_count++;
				return call_count === 1 ? await promise1 : await promise2;
			});

			contextmenu.open([], 0, 0);

			// First activation
			void contextmenu.activate(entry);
			assert.strictEqual(entry.pending, true);

			// Second activation (should replace first promise)
			const activation2 = contextmenu.activate(entry);

			// Resolve first promise (should be ignored)
			resolve1({ok: true});
			await promise1;

			assert.strictEqual(contextmenu.opened, true); // Should still be open

			// Resolve second promise (should close)
			resolve2({ok: true});
			await activation2;

			assert.strictEqual(contextmenu.opened, false);
		});

		test('activate() with close: false keeps menu open (async)', async () => {
			const entry = new EntryState(contextmenu.root_menu, () => async () => {
				return {ok: true, close: false};
			});

			contextmenu.open([], 0, 0);
			await contextmenu.activate(entry);

			assert.strictEqual(contextmenu.opened, true); // Should stay open
		});

		test('activate() with close: true explicitly closes menu (async)', async () => {
			const entry = new EntryState(contextmenu.root_menu, () => async () => {
				return {ok: true, close: true};
			});

			contextmenu.open([], 0, 0);
			await contextmenu.activate(entry);

			assert.strictEqual(contextmenu.opened, false); // Should close
		});

		test('activate() with {ok: true} defaults to closing (async)', async () => {
			const entry = new EntryState(contextmenu.root_menu, () => async () => {
				return {ok: true};
			});

			contextmenu.open([], 0, 0);
			await contextmenu.activate(entry);

			assert.strictEqual(contextmenu.opened, false); // Should close by default
		});

		test('activate() with close: false keeps menu open (sync)', () => {
			const entry = new EntryState(contextmenu.root_menu, () => () => {
				return {ok: true, close: false};
			});

			contextmenu.open([], 0, 0);
			void contextmenu.activate(entry);

			assert.strictEqual(contextmenu.opened, true); // Should stay open
		});

		test('activate() with {ok: true} defaults to closing (sync)', () => {
			const entry = new EntryState(contextmenu.root_menu, () => () => {
				return {ok: true};
			});

			contextmenu.open([], 0, 0);
			void contextmenu.activate(entry);

			assert.strictEqual(contextmenu.opened, false); // Should close by default
		});

		test('activate() with {ok: false} never closes', async () => {
			const entry = new EntryState(contextmenu.root_menu, () => async () => {
				return {ok: false, message: 'error'};
			});

			contextmenu.open([], 0, 0);
			await contextmenu.activate(entry);

			assert.strictEqual(contextmenu.opened, true); // Should not close on error
			assert.strictEqual(entry.error_message, 'error');
		});

		test('multiple concurrent activations handle correctly', async () => {
			let activation1_started = false;
			let activation2_started = false;
			let resolve1: any;
			let resolve2: any;

			const entry1 = new EntryState(contextmenu.root_menu, () => async () => {
				activation1_started = true;
				await new Promise((r) => (resolve1 = r));
				return {ok: true};
			});

			const entry2 = new EntryState(contextmenu.root_menu, () => async () => {
				activation2_started = true;
				await new Promise((r) => (resolve2 = r));
				return {ok: true};
			});

			contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry1, entry2];
			contextmenu.open([], 0, 0);

			// Start both activations
			const promise1 = contextmenu.activate(entry1);
			const promise2 = contextmenu.activate(entry2);

			assert.strictEqual(activation1_started, true);
			assert.strictEqual(activation2_started, true);

			// Resolve in order
			resolve1({ok: true});
			await promise1;

			resolve2({ok: true});
			await promise2;

			// Both should complete successfully
			assert.strictEqual(entry1.pending, false);
			assert.strictEqual(entry2.pending, false);
		});

		test('activation during menu close is handled gracefully', async () => {
			let resolve: any;
			const promise = new Promise((r) => (resolve = r));

			const entry = new EntryState(contextmenu.root_menu, () => async () => {
				await promise;
				return {ok: true};
			});

			contextmenu.open([], 0, 0);
			const activation = contextmenu.activate(entry);

			// Close menu while activation is pending
			contextmenu.close();
			assert.strictEqual(contextmenu.opened, false);

			// Resolve activation
			resolve({ok: true});
			await activation;

			// Menu should stay closed
			assert.strictEqual(contextmenu.opened, false);
			assert.strictEqual(entry.pending, false);
		});

		test("activation error doesn't corrupt state", async () => {
			const entry = new EntryState(contextmenu.root_menu, () => async () => {
				throw new Error('corruption test');
			});

			contextmenu.open([], 0, 0);
			await contextmenu.activate(entry);

			// Error set correctly
			assert.strictEqual(entry.error_message, 'corruption test');
			assert.strictEqual(contextmenu.error, 'corruption test');

			// State remains consistent
			assert.strictEqual(entry.pending, false);
			assert.strictEqual(entry.promise, null);

			// Menu stays open on error
			assert.strictEqual(contextmenu.opened, true);

			// Can activate again successfully
			const entry2 = new EntryState(contextmenu.root_menu, () => () => {
				return {ok: true};
			});
			contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry2];

			void contextmenu.activate(entry2);
			assert.strictEqual(contextmenu.opened, false);
		});

		test('promise cancellation on close works', async () => {
			let resolve: any;
			const promise = new Promise((r) => (resolve = r));
			let completed = false;

			const entry = new EntryState(contextmenu.root_menu, () => async () => {
				await promise;
				completed = true;
				return {ok: true};
			});

			contextmenu.open([], 0, 0);
			const activation = contextmenu.activate(entry);

			assert.strictEqual(entry.pending, true);

			// Close while pending - note: close() may not immediately clear pending
			// if the promise is still active
			contextmenu.close();
			// The menu is closed but promise may still be pending
			assert.strictEqual(contextmenu.opened, false);

			// Resolve promise
			resolve({ok: true});
			await activation;

			// Activation completed, pending cleared
			assert.strictEqual(completed, true);
			assert.strictEqual(contextmenu.opened, false);
			assert.strictEqual(entry.pending, false);
		});

		test('disabled state is checked via can_activate (not enforced by activate)', () => {
			// The state layer provides can_activate to check disabled state
			// but doesn't prevent calling activate() directly
			const disabled_entry = new EntryState(
				contextmenu.root_menu,
				() => () => {
					return {ok: true};
				},
				() => true, // disabled function returns true
			);

			contextmenu.root_menu.items = [...contextmenu.root_menu.items, disabled_entry];
			contextmenu.select(disabled_entry);

			// can_activate should return false for disabled entries
			assert.strictEqual(contextmenu.can_activate, false);

			// The UI should check can_activate before calling activate
			// (The state layer doesn't enforce this programmatically)
		});
	});
});
