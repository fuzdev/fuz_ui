/**
 * Reactive sidebar visibility state. Provisioned by `AppShell.svelte` via
 * `sidebar_state_context`; consumers read `show` and call `toggle`.
 *
 * Visibility is two viewport-free fields — `show_wide` (the persistent
 * sidebar beside the content) and `show_narrow` (the overlay at or below
 * `narrow_query`) — so server and client render the same classes and CSS
 * picks which field is in effect. `narrow` and `show` read the viewport and
 * are for input handling and ARIA, never for markup that must match SSR.
 *
 * @module
 */

import { DEV } from 'esm-env';
import { MediaQuery } from 'svelte/reactivity';
import { create_context } from './context_helpers.ts';

/**
 * Default `narrow_query` — at or below 800px the sidebar overlays the content
 * and starts closed.
 */
export const SIDEBAR_NARROW_QUERY_DEFAULT = '(max-width: 800px)';

/**
 * Svelte context carrying a reactive `SidebarState` accessor. Set by
 * `AppShell.svelte` (creates a fresh `SidebarState` if not supplied);
 * consumers call `sidebar_state_context.get()` to read or toggle visibility.
 */
export const sidebar_state_context = create_context<() => SidebarState>();

export interface SidebarStateOptions {
	/**
	 * Reactive getter for whether the sidebar is enabled; `show` is `false`
	 * and `AppShell` hides its toggle while it returns `false`.
	 * @default () => true
	 */
	enabled?: () => boolean;
	/**
	 * Media query under which the sidebar overlays the content and starts
	 * closed. It feeds both `AppShell`'s CSS `media` attribute and a
	 * `MediaQuery`, so it must be a full query with parentheses
	 * (`'(max-width: 900px)'`, not `'max-width: 900px'`). `null` disables
	 * narrow mode.
	 * @default SIDEBAR_NARROW_QUERY_DEFAULT
	 */
	narrow_query?: string | null;
	/**
	 * The sidebar element's `id`. Set it when a toggle outside `AppShell` needs
	 * `aria-controls` — the relationship closing the overlay also follows to
	 * return focus when the opener didn't take it (Safari doesn't focus a
	 * clicked button). Omitted, `AppShell` generates one, which only its own
	 * toggle knows. Set, it assumes one shell per state: shells mounted at
	 * the same time with this state would render the same id.
	 */
	id?: string;
}

/**
 * Visibility of an `AppShell` sidebar in its two modes. Construct one to
 * configure the shell (`enabled`, `narrow_query`, `id`) and pass it as
 * `AppShell`'s `sidebar_state`; otherwise the shell creates its own.
 */
export class SidebarState {
	/** The media query for narrow mode, or `null` when narrow mode is disabled. */
	readonly narrow_query: string | null;

	/** The sidebar element's `id`, or `null` to let `AppShell` generate one. */
	readonly id: string | null;

	/**
	 * Whether the sidebar shows beside the content outside narrow mode — the
	 * desktop preference. Narrow-mode interactions never touch it.
	 */
	show_wide: boolean = $state.raw(true);

	/** Whether the narrow-mode overlay is open. */
	show_narrow: boolean = $state.raw(false);

	#get_enabled: (() => boolean) | undefined;
	#narrow_media: MediaQuery | null;

	/**
	 * Creates the state, subscribing to `narrow_query` unless it is `null`.
	 *
	 * @param options - enabled getter, narrow-mode query, and sidebar id
	 * @throws Error in DEV when `narrow_query` has no parentheses — `MediaQuery`
	 *   would auto-wrap it but CSS `media` would not, so they'd disagree
	 */
	constructor(options?: SidebarStateOptions) {
		this.#get_enabled = options?.enabled;
		const narrow_query =
			options?.narrow_query === undefined ? SIDEBAR_NARROW_QUERY_DEFAULT : options.narrow_query;
		if (DEV && narrow_query !== null && !narrow_query.includes('(')) {
			throw new Error(
				`SidebarState narrow_query must include parentheses, got '${narrow_query}' — try '(${narrow_query})'`
			);
		}
		this.narrow_query = narrow_query;
		this.id = options?.id ?? null;
		this.#narrow_media = narrow_query === null ? null : new MediaQuery(narrow_query, false);
	}

	/** Whether the sidebar is enabled, from the `enabled` option, else `true`. */
	get enabled(): boolean {
		return this.#get_enabled?.() ?? true;
	}

	/**
	 * Whether the viewport matches `narrow_query`. Always `false` during SSR
	 * and when `narrow_query` is `null`. Read it for input handling and ARIA
	 * only — markup that must match the server render should key on
	 * `show_wide` / `show_narrow` instead.
	 */
	get narrow(): boolean {
		return this.#narrow_media?.current ?? false;
	}

	/**
	 * Effective visibility for the current mode: `false` while disabled,
	 * otherwise `show_narrow` in narrow mode and `show_wide` outside it. The
	 * setter writes the current mode's field. Viewport-dependent, like
	 * `narrow`.
	 */
	get show(): boolean {
		if (!this.enabled) return false;
		return this.narrow ? this.show_narrow : this.show_wide;
	}

	set show(value: boolean) {
		if (this.narrow) {
			this.show_narrow = value;
		} else {
			this.show_wide = value;
		}
	}

	/** Flips the current mode's visibility, routed by `narrow` at call time. */
	toggle(): void {
		this.show = !this.show;
	}

	/**
	 * Closes the narrow-mode overlay, leaving the wide preference untouched.
	 * `AppShell` calls it on navigation, a hash change, Escape, scrim click,
	 * and when the viewport widens out of narrow mode.
	 */
	close_narrow(): void {
		this.show_narrow = false;
	}
}
