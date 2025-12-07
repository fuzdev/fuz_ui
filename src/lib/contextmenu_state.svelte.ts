import {onDestroy, type Snippet} from 'svelte';
import type {Result} from '@fuzdev/fuz_util/result.js';
import {is_promise} from '@fuzdev/fuz_util/async.js';
import {BROWSER} from 'esm-env';
import type {SvelteHTMLElements} from 'svelte/elements';
import {EMPTY_OBJECT} from '@fuzdev/fuz_util/object.js';
import type {Attachment} from 'svelte/attachments';

import {Dimensions} from './dimensions.svelte.js';
import {create_context} from './context_helpers.js';
import {url_to_root_relative} from './library_helpers.js';

export type ContextmenuParams =
	| Snippet
	// TODO maybe this should be generic?
	| {snippet: 'link'; props: {href: string; icon?: string}}
	| {snippet: 'text'; props: {content: string; icon: string; run: ContextmenuRun}}
	| {snippet: 'separator'; props: SvelteHTMLElements['li']};

export type ContextmenuActivateResult =
	| void
	| undefined
	| Result<{close?: boolean}, {message?: string}>;

export type ItemState = SubmenuState | EntryState;

export class EntryState {
	readonly is_menu = false; // TODO rename to `type`?
	readonly menu: SubmenuState | RootMenuState;

	readonly run: () => ContextmenuRun;
	readonly disabled: () => boolean;

	selected: boolean = $state(false);
	pending: boolean = $state(false);
	error_message: string | null = $state(null);
	promise: Promise<ContextmenuActivateResult> | null = $state.raw(null);

	constructor(
		menu: SubmenuState | RootMenuState,
		run: () => ContextmenuRun,
		disabled: () => boolean = () => false,
	) {
		this.menu = menu;
		this.run = run;
		this.disabled = disabled;
	}
}

export class SubmenuState {
	readonly is_menu = true;
	readonly menu: SubmenuState | RootMenuState;
	readonly depth: number;

	selected: boolean = $state(false);
	items: ReadonlyArray<ItemState> = $state.raw([]);

	constructor(menu: SubmenuState | RootMenuState, depth: number) {
		this.menu = menu;
		this.depth = depth;
	}
}

export class RootMenuState {
	readonly is_menu = true;
	readonly menu = null;
	readonly depth = 1;

	items: ReadonlyArray<ItemState> = $state.raw([]);
}

export type ContextmenuRun = () => ContextmenuActivateResult | Promise<ContextmenuActivateResult>;

export interface ContextmenuStateOptions {
	layout?: Dimensions; // TODO consider making this a prop on `ContextmenuRoot`, and being assigned here
}

/**
 * Creates a `contextmenu` store.
 * See usage with `ContextmenuRoot.svelte` and `Contextmenu.svelte`.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event
 */
export class ContextmenuState {
	layout: Dimensions; // TODO $state?
	/**
	 * If an initial layout is provided, control is deferred externally.
	 * Otherwise the layout syncs to the page dimensions.
	 */
	readonly has_custom_layout: boolean;

	// State for external consumers.
	opened: boolean = $state(false);
	x: number = $state(0);
	y: number = $state(0);
	params: ReadonlyArray<ContextmenuParams> = $state.raw([]);
	error: string | undefined = $state();

	// These arrays use immutable updates (reassignment, not mutation).
	// If you need reactivity, use `$contextmenu` in a reactive statement to react to all changes, and
	// then access the immutable `contextmenu.root_menu` and `contextmenu.selections`.
	// See `ContextmenuEntry.svelte` and `ContextmenuSubmenu.svelte` for reactive usage examples.
	readonly root_menu: RootMenuState = new RootMenuState();
	selections: ReadonlyArray<ItemState> = $state.raw([]);

	can_collapse = $derived(this.selections.length > 1);

	can_expand = $derived.by(() => {
		const selected = this.selections.at(-1);
		return !!selected?.is_menu && selected.items.length > 0;
	});

	can_select_next = $derived.by(() => {
		const menu = this.selections.at(-1)?.menu ?? this.root_menu;
		return menu.items.length > 1;
	});

	can_select_previous = $derived.by(() => {
		const menu = this.selections.at(-1)?.menu ?? this.root_menu;
		return menu.items.length > 1;
	});

	can_activate = $derived.by(() => {
		const selected = this.selections.at(-1);
		if (!selected) return false;
		if (selected.is_menu) return selected.items.length > 0;
		return !selected.disabled();
	});

	constructor(options: ContextmenuStateOptions = EMPTY_OBJECT) {
		const {layout} = options;

		this.has_custom_layout = !!layout;
		this.layout = layout ?? new Dimensions();
	}

	open(params: Array<ContextmenuParams>, x: number, y: number): void {
		this.selections = [];
		this.opened = true;
		this.x = x;
		this.y = y;
		this.params = params;
	}

	close(): void {
		if (!this.opened) return;
		this.reset_items(this.root_menu.items);
		this.opened = false;
	}

	reset_items(items: ReadonlyArray<ItemState>): void {
		for (const item of items) {
			if (item.is_menu) {
				this.reset_items(item.items);
			} else {
				item.promise = null;
				item.pending = false;
				item.error_message = null;
			}
		}
	}

	activate(item: ItemState): boolean | Promise<ContextmenuActivateResult> {
		if (item.is_menu) {
			this.expand_selected();
		} else {
			if (item.disabled()) return false;
			let returned;
			try {
				returned = item.run()();
			} catch (error) {
				const message = typeof error?.message === 'string' ? error.message : undefined;
				item.error_message = message ?? 'unknown error';
				this.error = message;
			}
			if (is_promise(returned)) {
				item.pending = true;
				item.error_message = null;
				const promise = (item.promise = returned
					.then(
						(result) => {
							if (promise !== item.promise) return;
							if (typeof result?.ok === 'boolean') {
								if (result.ok) {
									if (result.close !== false) {
										this.close();
									}
								} else {
									const message = typeof result.message === 'string' ? result.message : undefined;
									item.error_message = message ?? 'unknown error';
									this.error = message;
								}
							} else {
								// void or undefined - default behavior is to close
								this.close();
							}
							return result;
						},
						(err) => {
							if (promise !== item.promise) return;
							const message = typeof err?.message === 'string' ? err.message : undefined;
							item.error_message = message ?? 'unknown error';
							this.error = message;
						},
					)
					.finally(() => {
						if (promise !== item.promise) return;
						item.pending = false;
						item.promise = null;
					}));
				return item.promise; // async path
			}
			// synchronous path
			if (typeof returned?.ok === 'boolean') {
				if (returned.ok) {
					if (returned.close !== false) {
						this.close();
					}
				} else {
					const message = typeof returned.message === 'string' ? returned.message : undefined;
					item.error_message = message ?? 'unknown error';
					this.error = message;
				}
			} else {
				// void or undefined - default behavior is to close
				this.close();
			}
		}
		return true;
	}

	activate_selected(): void | boolean | Promise<ContextmenuActivateResult> {
		const selected = this.selections.at(-1);
		if (selected) {
			return this.activate(selected);
		}
		this.select_first();
	}

	// Instead of diffing, this does the simple thing and
	// deselects everything and then re-creates the list of selections.
	// Could be improved but it's fine because we're using mutation and the N is very small,
	// and it allows us to have a single code path for the various selection methods.
	/**
	 * Activates the selected entry, or if none, selects the first.
	 */
	// TODO implement focus management per APG: call .focus() on the selected item's DOM element (requires storing element refs in EntryState/SubmenuState)
	select(item: ItemState): void {
		if (this.selections.at(-1) === item) return;
		for (const s of this.selections) s.selected = false;
		const new_selections: Array<ItemState> = [];
		let i: ItemState | RootMenuState = item;
		do {
			i.selected = true;
			new_selections.unshift(i);
		} while ((i = i.menu) && i.menu); // eslint-disable-line @typescript-eslint/no-unnecessary-condition
		this.selections = new_selections;
	}

	collapse_selected(): void {
		if (!this.can_collapse) return;
		const deselected = this.selections.at(-1)!;
		deselected.selected = false;
		this.selections = this.selections.slice(0, -1);
	}

	expand_selected(): void {
		if (!this.can_expand) return;
		const parent = this.selections.at(-1);
		if (!parent?.is_menu || !parent.items.length) return;
		const selected = parent.items[0]!;
		selected.selected = true;
		this.selections = [...this.selections, selected];
	}

	select_next(): void {
		if (!this.selections.length) {
			this.select_first();
			return;
		}
		const item = this.selections.at(-1)!;
		const index = item.menu.items.indexOf(item);
		this.select(item.menu.items[index === item.menu.items.length - 1 ? 0 : index + 1]!);
	}

	select_previous(): void {
		if (!this.selections.length) {
			this.select_last();
			return;
		}
		const item = this.selections.at(-1)!;
		const index = item.menu.items.indexOf(item);
		this.select(item.menu.items[index === 0 ? item.menu.items.length - 1 : index - 1]!);
	}

	select_first(): void {
		const menu = this.selections.at(-1)?.menu ?? this.root_menu;
		if (!menu.items.length) return;
		this.select(menu.items[0]!);
	}

	select_last(): void {
		const {items} = this.selections.at(-1)?.menu ?? this.root_menu;
		this.select(items.at(-1)!);
	}

	/**
	 * Used by `ContextmenuEntry` and custom entry components
	 * @initializes
	 */
	add_entry(run: () => ContextmenuRun, disabled: () => boolean = () => false): EntryState {
		const menu = contextmenu_submenu_context.get_maybe() ?? this.root_menu;
		const entry = new EntryState(menu, run, disabled);
		menu.items = [...menu.items, entry];
		// TODO messy, runs more than needed
		onDestroy(() => {
			menu.items = [];
		});
		return entry;
	}

	/**
	 * @initializes
	 */
	add_submenu(): SubmenuState {
		const menu = contextmenu_submenu_context.get_maybe() ?? this.root_menu;
		const submenu = new SubmenuState(menu, menu.depth + 1);
		menu.items = [...menu.items, submenu];
		contextmenu_submenu_context.set(submenu);
		// TODO messy, runs more than needed
		onDestroy(() => {
			menu.items = [];
		});
		return submenu;
	}
}

// The dataset key must not have capital letters or dashes or it'll differ between JS and DOM:
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset
const CONTEXTMENU_DATASET_KEY = 'contextmenu';
const CONTEXTMENU_DOM_QUERY = `a,[data-${CONTEXTMENU_DATASET_KEY}]`;
const contextmenu_cache: Map<string, ContextmenuParams | Array<ContextmenuParams>> = new Map();
let cache_key_counter = 0;

/**
 * Creates an attachment that sets up contextmenu behavior on an element.
 * @param params Contextmenu parameters or nullish to disable
 */
export const contextmenu_attachment =
	<T extends ContextmenuParams, U extends T | Array<T>>(
		params: U | null | undefined,
	): Attachment<HTMLElement | SVGElement> =>
	(el): undefined | (() => void) => {
		// TODO could clean up the dataset attr, maybe use a weakmap?
		if (params == null) return;

		// Only create key once per element, reuse on updates
		let key = el.dataset[CONTEXTMENU_DATASET_KEY];
		if (!key) {
			key = cache_key_counter++ + '';
			el.dataset[CONTEXTMENU_DATASET_KEY] = key;
		}

		contextmenu_cache.set(key, params);

		return () => {
			contextmenu_cache.delete(key);
		};
	};

const CONTEXTMENU_OPEN_VIBRATE_DURATION = 17;

export interface ContextmenuOpenOptions {
	link_enabled?: boolean;
	text_enabled?: boolean;
	separator_enabled?: boolean;
	vibrate?: boolean;
}

/**
 * Opens the contextmenu, if appropriate,
 * querying the menu items from the DOM starting at the event target.
 * @param target the leaf element from which to open the contextmenu
 * @param x the page X coordinate at which to open the contextmenu, typically the mouse `pageX`
 * @param y the page Y coordinate at which to open the contextmenu, typically the mouse `pageY`
 * @param contextmenu the contextmenu store
 * @param options optional configuration for filtering entries and haptic feedback
 * @returns a boolean indicating if the menu was opened or not
 */
export const contextmenu_open = (
	target: HTMLElement | SVGElement,
	x: number,
	y: number,
	contextmenu: ContextmenuState,
	options?: ContextmenuOpenOptions,
): boolean => {
	const {
		link_enabled = true,
		text_enabled = true,
		separator_enabled = true,
		vibrate = true,
	} = options ?? EMPTY_OBJECT;

	const params = contextmenu_query_params(target)?.filter(
		(p) =>
			typeof p === 'function' ||
			((p.snippet !== 'link' || link_enabled) &&
				(p.snippet !== 'text' || text_enabled) &&
				(p.snippet !== 'separator' || separator_enabled)),
	);

	// No-op if empty
	if (!params?.length) return false;

	contextmenu.open(params, x, y);

	// `navigator.vibrate()` works with `ContextmenuRoot` but gets blocked by some browsers
	// when used with `ContextmenuRootForSafariCompatibility` because its longpress
	// workaround triggers from a timeout rather than a direct user interaction.
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (BROWSER && vibrate && navigator.vibrate) {
		navigator.vibrate(CONTEXTMENU_OPEN_VIBRATE_DURATION);
	}

	return true;
};

const contextmenu_query_params = (
	target: HTMLElement | SVGElement,
): null | Array<ContextmenuParams> => {
	let params: null | Array<ContextmenuParams> = null;
	// crawl DOM for contextmenu entries
	let el: HTMLElement | SVGElement | null | undefined = target;
	let cache_key: string, cached: ContextmenuParams | Array<ContextmenuParams> | undefined;
	while ((el = el?.closest(CONTEXTMENU_DOM_QUERY))) {
		if ((cache_key = el.dataset[CONTEXTMENU_DATASET_KEY]!)) {
			params ??= [];
			cached = contextmenu_cache.get(cache_key);
			if (cached === undefined) {
				continue;
			}
			// preserve bubbling order
			if (Array.isArray(cached)) {
				(params ??= []).push(...cached);
			} else {
				(params ??= []).push(cached);
			}
		}
		if (el.tagName === 'A') {
			(params ??= []).push({
				snippet: 'link',
				// anchor elements have the full url, but we want the slash-prefixed/absolute/root-relative version
				props: {href: url_to_root_relative((el as HTMLAnchorElement).href)},
			});
		}
		el = el.parentElement;
	}
	// add "copy text" entry if anything is selected and we have any other entries
	if (params) {
		const text = window.getSelection()?.toString();
		if (text) {
			params.unshift({
				snippet: 'text',
				props: {
					content: 'copy text',
					icon: '📋',
					run: async () => {
						await navigator.clipboard.writeText(text);
					},
				},
			});
		}
	}
	return params;
};

export const contextmenu_context = create_context<ContextmenuState>();

export const contextmenu_submenu_context = create_context<SubmenuState>();

export const contextmenu_dimensions_context = create_context(() => new Dimensions());

// Global registry of non-scoped contextmenu roots (only used in DEV)
const non_scoped_roots: Set<symbol> = new Set();

/**
 * Registers a contextmenu root and warns if multiple non-scoped roots are detected.
 * Only active in development mode. Automatically handles cleanup on unmount.
 *
 * @param get_scoped Getter function that returns the current scoped value
 */
export const contextmenu_check_global_root = (get_scoped: () => boolean): void => {
	$effect(() => {
		const id = Symbol('contextmenu_root');

		if (!get_scoped()) {
			// Register as global (non-scoped)
			non_scoped_roots.add(id);

			if (non_scoped_roots.size > 1) {
				// eslint-disable-next-line no-console
				console.error(
					`Detected multiple non-scoped contextmenu roots (${non_scoped_roots.size} mounted). ` +
						'Only one global contextmenu root should be active at a time. ' +
						'Are you missing a `scoped` attribute?',
				);
			}
		}

		// Cleanup: unregister when scoped changes or component unmounts
		return () => {
			non_scoped_roots.delete(id);
		};
	});
};
