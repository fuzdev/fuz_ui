<script lang="ts" module>
	let mounted = false;
</script>

<script lang="ts">
	import { onMount, untrack, type Snippet } from 'svelte';
	import {
		render_theme_style,
		to_theme_stance,
		type ResolvedTheme
	} from '@fuzdev/fuz_css/theme.ts';
	import type { Theme } from '@fuzdev/fuz_css/variable.ts';
	import { DEFAULT_THEME, default_themes } from '@fuzdev/fuz_css/themes.ts';
	import { DEV } from 'esm-env';

	import {
		load_color_scheme as default_load_color_scheme,
		save_color_scheme as default_save_color_scheme,
		sync_color_scheme as default_sync_color_scheme,
		save_theme as default_save_theme,
		load_theme as default_load_theme,
		theme_state_context,
		ThemeState
	} from './theme_state.svelte.ts';
	import { effect_with_count } from './rune_helpers.svelte.ts';

	const {
		sync_color_scheme = default_sync_color_scheme,
		load_color_scheme = default_load_color_scheme,
		save_color_scheme = default_save_color_scheme,
		load_theme = default_load_theme,
		save_theme = default_save_theme,
		themes = default_themes,
		resolve_theme,
		theme_fallback,
		theme_state = new ThemeState({
			theme: load_theme(themes, theme_fallback),
			color_scheme: load_color_scheme()
		}),
		children
	}: {
		sync_color_scheme?: typeof default_sync_color_scheme;
		load_color_scheme?: typeof default_load_color_scheme;
		save_color_scheme?: typeof default_save_color_scheme;
		load_theme?: typeof default_load_theme;
		save_theme?: typeof default_save_theme;
		/**
		 * The app's theme registry. Themes in it persist by name, so a later load
		 * takes the registry's current version.
		 * @default default_themes
		 */
		themes?: Array<Theme>;
		/**
		 * Resolves a theme's derived data for rendering. Inject
		 * `resolve_theme_stance` from `@fuzdev/fuz_css/theme_stance.ts` when the app
		 * ships a single-scheme (stanced) theme, which renders its stance mirror
		 * only through it. Construction throws when `themes` or `theme_fallback`
		 * holds a stanced theme and this is absent.
		 */
		resolve_theme?: (theme: Theme) => ResolvedTheme;
		/**
		 * The theme used when storage holds none. When absent, `load_theme` falls
		 * back to the first of `themes`, or `DEFAULT_THEME` when `themes` is empty.
		 */
		theme_fallback?: Theme | undefined;
		/**
		 * A reactive class containing the selected theme and color scheme.
		 * Defaults to a `ThemeState` over `load_theme(themes, theme_fallback)` and
		 * the saved color scheme.
		 */
		theme_state?: ThemeState;
		children: Snippet<
			[theme_state: ThemeState, style: string | null, theme_style_html: string | null]
		>;
	} = $props();

	// In dev mode only, warn about misuse of the singleton `ThemeRoot`.
	if (DEV) {
		onMount(() => {
			if (mounted) {
				console.warn('more than one ThemeRoot was mounted'); // eslint-disable-line no-console
			}
			mounted = true;
			return () => {
				mounted = false;
			};
		});
	}

	/**
	 * `ThemeRoot` adds global color scheme and theme support to the page.
	 * It also sets in the Svelte context a reactive `theme_state` containing the theme and color scheme.
	 *
	 * @module
	 */

	// The app's own stanced themes fail loudly at construction without a resolver -
	// they'd render without their mirror, the wrong appearance in one color scheme.
	// The props are read once, like `theme_state`'s default.
	untrack(() => {
		if (!resolve_theme) {
			for (const [theme, prop] of [
				...themes.map((t) => [t, 'themes'] as const),
				...(theme_fallback ? [[theme_fallback, 'theme_fallback'] as const] : [])
			]) {
				const stance = to_theme_stance(theme.scheme);
				if (stance !== null) {
					throw Error(
						`ThemeRoot: the theme "${theme.name}" in \`${prop}\` has the "${stance}" scheme stance` +
							' and no `resolve_theme` is injected - pass `resolve_theme={resolve_theme_stance}`' +
							' from `@fuzdev/fuz_css/theme_stance.ts`'
					);
				}
			}
		}
	});

	theme_state_context.set(() => theme_state);

	let logged_unresolved = false;

	const style = $derived.by(() => {
		const { theme } = theme_state;
		// the bundled CSS already renders the default theme, compared by reference
		// because a custom theme may share its name
		if (theme === DEFAULT_THEME) return null;
		if (resolve_theme) {
			const resolved = resolve_theme(theme);
			return render_theme_style(resolved.theme, resolved) || null;
		}
		// a stanced theme the app didn't ship, like a custom one restored from
		// storage, renders without its mirror rather than throwing on saved data
		if (!logged_unresolved && to_theme_stance(theme.scheme) !== null) {
			logged_unresolved = true;
			// eslint-disable-next-line no-console -- a lost mirror is a bug the app should see
			console.error(
				`ThemeRoot: the theme "${theme.name}" has a scheme stance and no \`resolve_theme\`` +
					' is injected, so it renders without its stance mirror'
			);
		}
		return render_theme_style(theme) || null;
	});
	const theme_style_html = $derived(style ? `<style>${style}</style>` : null);

	effect_with_count((count) => {
		const v = theme_state.color_scheme;
		if (count === 1) return;
		sync_color_scheme(v);
	});
	effect_with_count((count) => {
		const v = theme_state.color_scheme;
		if (count === 1) return;
		save_color_scheme(v); // helper may change, so is separate from `sync_color_scheme`
	});
	effect_with_count((count) => {
		const v = theme_state.theme;
		if (count === 1) return;
		// a new `themes` array alone doesn't re-save an unchanged theme
		save_theme(
			v,
			untrack(() => themes)
		);
	});

	// TODO @many @html making me nervous
</script>

<!-- eslint-disable svelte/no-at-html-tags -->
<svelte:head>
	{#if theme_style_html}{@html theme_style_html}{/if}
</svelte:head>

{@render children(theme_state, style, theme_style_html)}
