import {describe, test, assert, beforeEach} from 'vitest';

import {ContextmenuState, EntryState, SubmenuState} from '$lib/contextmenu_state.svelte.js';

describe('ContextmenuState - Lifecycle', () => {
	let contextmenu: ContextmenuState;

	beforeEach(() => {
		contextmenu = new ContextmenuState();
	});

	describe('open and close', () => {
		test('open sets state correctly', () => {
			const params = [
				{snippet: 'text' as const, props: {content: 'Test', icon: '🧪', run: () => {}}},
			];
			contextmenu.open(params, 100, 200);

			assert.strictEqual(contextmenu.opened, true);
			assert.strictEqual(contextmenu.x, 100);
			assert.strictEqual(contextmenu.y, 200);
			assert.strictEqual(contextmenu.params, params);
		});

		test('open clears selections', () => {
			// Setup some selections first
			const entry = new EntryState(contextmenu.root_menu, () => () => {});
			entry.selected = true;
			contextmenu.selections = [...contextmenu.selections, entry];

			contextmenu.open([], 0, 0);
			assert.strictEqual(contextmenu.selections.length, 0);
		});

		test('close sets opened to false', () => {
			contextmenu.open([], 100, 200);
			assert.strictEqual(contextmenu.opened, true);

			contextmenu.close();
			assert.strictEqual(contextmenu.opened, false);
		});

		test('close resets entry states', () => {
			const entry = new EntryState(contextmenu.root_menu, () => () => {});
			entry.promise = Promise.resolve();
			entry.pending = true;
			entry.error_message = 'test error';
			contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry];

			contextmenu.open([], 0, 0); // Must open first, otherwise close() returns early
			contextmenu.close();

			assert.strictEqual(entry.promise, null);
			assert.strictEqual(entry.pending, false);
			assert.strictEqual(entry.error_message, null);
		});

		test('close resets pending state during async operation', async () => {
			let resolve: any;
			const promise = new Promise((r) => (resolve = r));

			const entry = new EntryState(contextmenu.root_menu, () => async () => {
				await promise;
				return {ok: true};
			});
			contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry];

			contextmenu.open([], 0, 0);
			void contextmenu.activate(entry);

			assert.strictEqual(entry.pending, true);

			// Close menu while async operation is still pending
			contextmenu.close();

			assert.strictEqual(entry.pending, false);
			assert.strictEqual(entry.promise, null);
			assert.strictEqual(contextmenu.opened, false);

			// Resolve the promise after close
			resolve({ok: true});
		});

		test('close does nothing when already closed', () => {
			assert.strictEqual(contextmenu.opened, false);
			contextmenu.close(); // Should not throw
			assert.strictEqual(contextmenu.opened, false);
		});

		test('close resets nested submenu items', () => {
			const submenu = new SubmenuState(contextmenu.root_menu, 2);
			const entry = new EntryState(submenu, () => () => {});
			entry.error_message = 'error';
			submenu.items = [...submenu.items, entry];
			contextmenu.root_menu.items = [...contextmenu.root_menu.items, submenu];

			contextmenu.open([], 0, 0); // Must open first, otherwise close() returns early
			contextmenu.close();

			assert.strictEqual(entry.error_message, null);
		});

		test('rapid open/close sequences maintain consistency', () => {
			const params1 = [{snippet: 'text' as const, props: {content: 'A', icon: '1', run: () => {}}}];
			const params2 = [{snippet: 'text' as const, props: {content: 'B', icon: '2', run: () => {}}}];
			const params3 = [{snippet: 'text' as const, props: {content: 'C', icon: '3', run: () => {}}}];

			// Rapid sequence: open, close, open, close, open
			contextmenu.open(params1, 10, 10);
			assert.strictEqual(contextmenu.opened, true);
			assert.strictEqual(contextmenu.params, params1);

			contextmenu.close();
			assert.strictEqual(contextmenu.opened, false);

			contextmenu.open(params2, 20, 20);
			assert.strictEqual(contextmenu.opened, true);
			assert.strictEqual(contextmenu.params, params2);
			assert.strictEqual(contextmenu.x, 20);
			assert.strictEqual(contextmenu.y, 20);

			contextmenu.close();
			assert.strictEqual(contextmenu.opened, false);

			contextmenu.open(params3, 30, 30);
			assert.strictEqual(contextmenu.opened, true);
			assert.strictEqual(contextmenu.params, params3);
			assert.strictEqual(contextmenu.x, 30);
			assert.strictEqual(contextmenu.y, 30);
		});

		test('opening while already open replaces content', () => {
			const params1 = [
				{snippet: 'text' as const, props: {content: 'First', icon: '1', run: () => {}}},
			];
			const params2 = [
				{snippet: 'text' as const, props: {content: 'Second', icon: '2', run: () => {}}},
			];

			contextmenu.open(params1, 100, 100);
			assert.strictEqual(contextmenu.opened, true);
			assert.strictEqual(contextmenu.params, params1);
			assert.strictEqual(contextmenu.x, 100);
			assert.strictEqual(contextmenu.y, 100);

			// Open again without closing
			contextmenu.open(params2, 200, 200);
			assert.strictEqual(contextmenu.opened, true);
			assert.strictEqual(contextmenu.params, params2);
			assert.strictEqual(contextmenu.x, 200);
			assert.strictEqual(contextmenu.y, 200);

			// Old params should be replaced
			assert.notStrictEqual(contextmenu.params, params1);
		});

		test("opening doesn't leak old state", () => {
			const entry = new EntryState(contextmenu.root_menu, () => () => {});
			entry.error_message = 'old error';
			entry.selected = true;
			contextmenu.selections = [...contextmenu.selections, entry];
			contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry];

			const params = [
				{snippet: 'text' as const, props: {content: 'New', icon: '🆕', run: () => {}}},
			];
			contextmenu.open(params, 50, 50);

			// Selections array is cleared
			assert.strictEqual(contextmenu.selections.length, 0);
			// Note: The entry.selected flag itself remains true until explicitly deselected
			// The selections array being empty is what matters for correctness

			// Old errors should still exist until explicitly reset
			// (open doesn't call reset_items, close does)
			assert.strictEqual(entry.error_message, 'old error');
		});

		test('closing during activation stops correctly', async () => {
			let resolve: any;
			const promise = new Promise((r) => (resolve = r));
			let ran_to_completion = false;

			const entry = new EntryState(contextmenu.root_menu, () => async () => {
				await promise;
				ran_to_completion = true;
				return {ok: true};
			});
			contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry];

			contextmenu.open([], 0, 0);
			const activation = contextmenu.activate(entry);

			// Close while activation is pending
			contextmenu.close();

			// Menu should be closed
			assert.strictEqual(contextmenu.opened, false);
			assert.strictEqual(entry.pending, false);

			// Resolve the activation
			resolve({ok: true});
			await activation;

			// Activation completed but menu stayed closed
			assert.strictEqual(ran_to_completion, true);
			assert.strictEqual(contextmenu.opened, false);
		});
	});
});
