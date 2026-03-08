import {describe, test, assert, beforeEach} from 'vitest';

import {ContextmenuState, EntryState, SubmenuState} from '$lib/contextmenu_state.svelte.js';

describe('ContextmenuState - Validation', () => {
	let contextmenu: ContextmenuState;

	beforeEach(() => {
		contextmenu = new ContextmenuState();
	});

	describe('derived validation properties', () => {
		describe('can_collapse', () => {
			test('returns false with no selection', () => {
				assert.strictEqual(contextmenu.can_collapse, false);
			});

			test('returns false with single selection at root level', () => {
				const entry = new EntryState(contextmenu.root_menu, () => () => {});
				contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry];
				contextmenu.select(entry);

				assert.strictEqual(contextmenu.can_collapse, false);
			});

			test('returns true with nested selection', () => {
				const submenu = new SubmenuState(contextmenu.root_menu, 2);
				const entry = new EntryState(submenu, () => () => {});
				submenu.items = [...submenu.items, entry];
				contextmenu.root_menu.items = [...contextmenu.root_menu.items, submenu];

				contextmenu.select(submenu);
				contextmenu.expand_selected();

				assert.strictEqual(contextmenu.can_collapse, true);
			});

			test('returns false after collapsing to root level', () => {
				$effect.root(() => {
					const submenu = new SubmenuState(contextmenu.root_menu, 2);
					const entry = new EntryState(submenu, () => () => {});
					submenu.items = [...submenu.items, entry];
					contextmenu.root_menu.items = [...contextmenu.root_menu.items, submenu];

					contextmenu.select(submenu);
					contextmenu.expand_selected();
					contextmenu.collapse_selected();

					assert.strictEqual(contextmenu.can_collapse, false);
				});
			});

			test('multi-level collapse validation', () => {
				$effect.root(() => {
					const submenu1 = new SubmenuState(contextmenu.root_menu, 2);
					const submenu2 = new SubmenuState(submenu1, 3);
					const entry = new EntryState(submenu2, () => () => {});

					submenu2.items = [...submenu2.items, entry];
					submenu1.items = [...submenu1.items, submenu2];
					contextmenu.root_menu.items = [...contextmenu.root_menu.items, submenu1];

					// Navigate to depth 3
					contextmenu.select(submenu1);
					contextmenu.expand_selected();
					contextmenu.expand_selected();

					// Can collapse from depth 3
					assert.strictEqual(contextmenu.can_collapse, true);

					// Collapse to depth 2
					contextmenu.collapse_selected();
					assert.strictEqual(contextmenu.can_collapse, true);

					// Collapse to depth 1 (root)
					contextmenu.collapse_selected();
					assert.strictEqual(contextmenu.can_collapse, false);
				});
			});
		});

		describe('can_expand', () => {
			test('returns false with no selection', () => {
				assert.strictEqual(contextmenu.can_expand, false);
			});

			test('returns false when entry is selected', () => {
				const entry = new EntryState(contextmenu.root_menu, () => () => {});
				contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry];
				contextmenu.select(entry);

				assert.strictEqual(contextmenu.can_expand, false);
			});

			test('returns true when submenu with items is selected', () => {
				const submenu = new SubmenuState(contextmenu.root_menu, 2);
				const entry = new EntryState(submenu, () => () => {});
				submenu.items = [...submenu.items, entry];
				contextmenu.root_menu.items = [...contextmenu.root_menu.items, submenu];
				contextmenu.select(submenu);

				assert.strictEqual(contextmenu.can_expand, true);
			});

			test('returns false when empty submenu is selected', () => {
				const submenu = new SubmenuState(contextmenu.root_menu, 2);
				contextmenu.root_menu.items = [...contextmenu.root_menu.items, submenu];
				contextmenu.select(submenu);

				assert.strictEqual(contextmenu.can_expand, false);
			});

			test('returns false after expanding into submenu', () => {
				$effect.root(() => {
					const submenu = new SubmenuState(contextmenu.root_menu, 2);
					const entry = new EntryState(submenu, () => () => {});
					submenu.items = [...submenu.items, entry];
					contextmenu.root_menu.items = [...contextmenu.root_menu.items, submenu];

					contextmenu.select(submenu);
					contextmenu.expand_selected();

					// Now entry is selected, which is not a menu
					assert.strictEqual(contextmenu.can_expand, false);
				});
			});

			test('deep submenu expansion validation', () => {
				$effect.root(() => {
					const submenu1 = new SubmenuState(contextmenu.root_menu, 2);
					const submenu2 = new SubmenuState(submenu1, 3);
					const submenu3 = new SubmenuState(submenu2, 4);
					const entry = new EntryState(submenu3, () => () => {});

					submenu3.items = [...submenu3.items, entry];
					submenu2.items = [...submenu2.items, submenu3];
					submenu1.items = [...submenu1.items, submenu2];
					contextmenu.root_menu.items = [...contextmenu.root_menu.items, submenu1];

					// At each level, can_expand should be true when submenu is selected
					contextmenu.select(submenu1);
					assert.strictEqual(contextmenu.can_expand, true);

					contextmenu.expand_selected();
					assert.strictEqual(contextmenu.can_expand, true);

					contextmenu.expand_selected();
					assert.strictEqual(contextmenu.can_expand, true);

					contextmenu.expand_selected();
					// Now entry is selected (not a submenu)
					assert.strictEqual(contextmenu.can_expand, false);
				});
			});
		});

		describe('can_select_next', () => {
			test('returns false with empty menu', () => {
				assert.strictEqual(contextmenu.can_select_next, false);
			});

			test('returns false with single item', () => {
				const entry = new EntryState(contextmenu.root_menu, () => () => {});
				contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry];

				assert.strictEqual(contextmenu.can_select_next, false);
			});

			test('returns true with multiple items', () => {
				const entry1 = new EntryState(contextmenu.root_menu, () => () => {});
				const entry2 = new EntryState(contextmenu.root_menu, () => () => {});
				contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry1, entry2];

				assert.strictEqual(contextmenu.can_select_next, true);
			});

			test('returns true with multiple items and selection', () => {
				const entry1 = new EntryState(contextmenu.root_menu, () => () => {});
				const entry2 = new EntryState(contextmenu.root_menu, () => () => {});
				contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry1, entry2];
				contextmenu.select(entry1);

				assert.strictEqual(contextmenu.can_select_next, true);
			});

			test('checks current menu level when in submenu', () => {
				const submenu = new SubmenuState(contextmenu.root_menu, 2);
				const entry = new EntryState(submenu, () => () => {});
				submenu.items = [...submenu.items, entry];
				contextmenu.root_menu.items = [...contextmenu.root_menu.items, submenu];

				contextmenu.select(submenu);
				contextmenu.expand_selected();

				// Only one item in submenu
				assert.strictEqual(contextmenu.can_select_next, false);
			});

			test('returns true in submenu with multiple items', () => {
				const submenu = new SubmenuState(contextmenu.root_menu, 2);
				const entry1 = new EntryState(submenu, () => () => {});
				const entry2 = new EntryState(submenu, () => () => {});
				submenu.items = [...submenu.items, entry1, entry2];
				contextmenu.root_menu.items = [...contextmenu.root_menu.items, submenu];

				contextmenu.select(submenu);
				contextmenu.expand_selected();

				assert.strictEqual(contextmenu.can_select_next, true);
			});
		});

		describe('can_select_previous', () => {
			test('returns false with empty menu', () => {
				assert.strictEqual(contextmenu.can_select_previous, false);
			});

			test('returns false with single item', () => {
				const entry = new EntryState(contextmenu.root_menu, () => () => {});
				contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry];

				assert.strictEqual(contextmenu.can_select_previous, false);
			});

			test('returns true with multiple items', () => {
				const entry1 = new EntryState(contextmenu.root_menu, () => () => {});
				const entry2 = new EntryState(contextmenu.root_menu, () => () => {});
				contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry1, entry2];

				assert.strictEqual(contextmenu.can_select_previous, true);
			});

			test('returns true with multiple items and selection', () => {
				const entry1 = new EntryState(contextmenu.root_menu, () => () => {});
				const entry2 = new EntryState(contextmenu.root_menu, () => () => {});
				contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry1, entry2];
				contextmenu.select(entry2);

				assert.strictEqual(contextmenu.can_select_previous, true);
			});

			test('checks current menu level when in submenu', () => {
				const submenu = new SubmenuState(contextmenu.root_menu, 2);
				const entry = new EntryState(submenu, () => () => {});
				submenu.items = [...submenu.items, entry];
				contextmenu.root_menu.items = [...contextmenu.root_menu.items, submenu];

				contextmenu.select(submenu);
				contextmenu.expand_selected();

				// Only one item in submenu
				assert.strictEqual(contextmenu.can_select_previous, false);
			});
		});

		describe('can_activate', () => {
			test('returns false with no selection', () => {
				assert.strictEqual(contextmenu.can_activate, false);
			});

			test('returns true with enabled entry selected', () => {
				const entry = new EntryState(contextmenu.root_menu, () => () => {});
				contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry];
				contextmenu.select(entry);

				assert.strictEqual(contextmenu.can_activate, true);
			});

			test('returns false with disabled entry selected', () => {
				const entry = new EntryState(
					contextmenu.root_menu,
					() => () => {},
					() => true,
				);
				contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry];
				contextmenu.select(entry);

				assert.strictEqual(contextmenu.can_activate, false);
			});

			test('returns true when submenu with items is selected', () => {
				const submenu = new SubmenuState(contextmenu.root_menu, 2);
				const entry = new EntryState(submenu, () => () => {});
				submenu.items = [...submenu.items, entry];
				contextmenu.root_menu.items = [...contextmenu.root_menu.items, submenu];
				contextmenu.select(submenu);

				assert.strictEqual(contextmenu.can_activate, true);
			});

			test('returns false when empty submenu is selected', () => {
				const submenu = new SubmenuState(contextmenu.root_menu, 2);
				contextmenu.root_menu.items = [...contextmenu.root_menu.items, submenu];
				contextmenu.select(submenu);

				assert.strictEqual(contextmenu.can_activate, false);
			});

			test('returns true for entry with async action', () => {
				const entry = new EntryState(contextmenu.root_menu, () => async () => {});
				contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry];
				contextmenu.select(entry);

				assert.strictEqual(contextmenu.can_activate, true);
			});

			test('evaluates disabled function for entries', () => {
				let counter = 0;
				const entry = new EntryState(
					contextmenu.root_menu,
					() => () => {},
					() => {
						counter++;
						return false;
					},
				);
				contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry];
				contextmenu.select(entry);

				// Access the property to trigger evaluation
				const result = contextmenu.can_activate;
				assert.strictEqual(result, true);
				// Verify the disabled function was called
				assert.ok(counter > 0);
			});

			test('dynamic disabled state changes', () => {
				$effect.root(() => {
					let is_disabled = $state(false);
					const entry = new EntryState(
						contextmenu.root_menu,
						() => () => {},
						() => is_disabled,
					);
					contextmenu.root_menu.items = [...contextmenu.root_menu.items, entry];
					contextmenu.select(entry);

					// Initially enabled
					assert.strictEqual(contextmenu.can_activate, true);

					// Dynamically disable
					is_disabled = true;
					assert.strictEqual(contextmenu.can_activate, false);

					// Re-enable
					is_disabled = false;
					assert.strictEqual(contextmenu.can_activate, true);
				});
			});
		});
	});
});
