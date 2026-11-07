import {
	color_schemes,
	compose_themes,
	type ColorSchemePreference
} from '@fuzdev/fuz_css/theme.ts';
import { parse_theme, type Theme } from '@fuzdev/fuz_css/variable.ts';
import {
	contrast_modifiers,
	default_themes,
	DEFAULT_THEME,
	type ContrastModifiers
} from '@fuzdev/fuz_css/themes.ts';
import { BROWSER } from 'esm-env';

import { create_context } from './context_helpers.ts';
import { load_from_storage, save_to_storage } from './storage.ts';

export interface ThemeStateJson {
	theme: Theme;
	color_scheme: ColorSchemePreference;
}

export type ThemeStateOptions = Partial<ThemeStateJson>;

export class ThemeState {
	theme: Theme = $state.raw()!;
	color_scheme: ColorSchemePreference = $state.raw()!;

	constructor(options?: ThemeStateOptions) {
		const theme = options?.theme ?? default_themes[0]!;
		const color_scheme = options?.color_scheme ?? 'auto';
		if (parse_color_scheme(color_scheme) === null) {
			throw Error('unknown color scheme: ' + color_scheme);
		}
		this.theme = theme;
		this.color_scheme = color_scheme; // TODO `resolved_color_scheme` if auto? users could then do different things based on the final value - would not be added to `ThemeStateJson`
	}

	toJSON(): ThemeStateJson {
		return {
			theme: this.theme,
			color_scheme: this.color_scheme
		};
	}
}
export const theme_state_context = create_context<() => ThemeState>();

export const sync_color_scheme = (color_scheme: ColorSchemePreference | null): void => {
	if (!BROWSER) return;
	const dark =
		color_scheme === 'dark' ||
		(color_scheme !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
	document.documentElement.classList.add(dark ? 'dark' : 'light');
	document.documentElement.classList.remove(dark ? 'light' : 'dark');
};

export const COLOR_SCHEME_STORAGE_KEY = 'fuz:color-scheme';
export const THEME_STORAGE_KEY = 'fuz:theme';

export const save_color_scheme = (
	color_scheme: ColorSchemePreference | null,
	key = COLOR_SCHEME_STORAGE_KEY
): void => {
	save_to_storage(key, color_scheme);
};

export const load_color_scheme = (
	fallback: ColorSchemePreference = 'auto',
	key = COLOR_SCHEME_STORAGE_KEY
): ColorSchemePreference => load_from_storage(key, false, parse_color_scheme) ?? fallback;

/**
 * Saves a theme to storage: a theme in the `themes` registry by its name, a
 * registry theme composed with a contrast modifier as `{name, contrast}`, and
 * any other theme whole, trimmed to its authored fields (`name`, `summary`,
 * `scheme`, `variables`). Saving by reference means a later load takes the
 * registry's current version, recomposed. Both matches are by name, so a theme
 * sharing a registry theme's name saves as that registry theme, and one named
 * like a composition (`ledger (high contrast)`) saves as that composition.
 *
 * A composition assigned at runtime, like `theme_state.theme =
 * compose_themes(ledger_theme, contrast_modifiers.high)`, takes the
 * `{name, contrast}` path.
 *
 * @param theme - the theme to save, or `null` to remove the saved one
 * @param themes - the app's theme registry
 * @param key - the storage key
 */
export const save_theme = (
	theme: Theme | null,
	themes: Array<Theme> = default_themes,
	key = THEME_STORAGE_KEY
): void => {
	save_to_storage(key, theme === null ? null : to_saved_theme(theme, themes), true);
};

const CONTRASTS = ['low', 'high'] as const satisfies ReadonlyArray<keyof ContrastModifiers>;

/**
 * The value `save_theme` stores for a non-null theme.
 */
const to_saved_theme = (theme: Theme, themes: Array<Theme>): SavedTheme => {
	if (themes.some((t) => t.name === theme.name)) return theme.name;
	// recomposing keeps the naming rule in `compose_themes`, and costs one
	// composition per registry theme and modifier, only when saving
	for (const t of themes) {
		for (const contrast of CONTRASTS) {
			if (compose_themes(t, contrast_modifiers[contrast]).name === theme.name) {
				return { name: t.name, contrast };
			}
		}
	}
	return trim_theme(theme);
};

/**
 * A theme as `save_theme` stores it: a registry theme's name, a registry
 * theme's name with a contrast modifier, or a whole trimmed theme.
 */
type SavedTheme = string | { name: string; contrast: keyof ContrastModifiers } | Theme;

/**
 * Loads the saved theme from storage, falling back when there's none or it
 * doesn't resolve to a theme. A saved name loads the registry theme of that
 * name, `{name, contrast}` the registry theme composed with that contrast
 * modifier, an object named like a registry theme the registry theme (so a
 * whole-object save from before themes saved by name loads the current
 * version), and any other object its authored fields when they parse as a
 * `Theme`.
 *
 * @param themes - the app's theme registry
 * @param fallback - the theme to use when storage holds none
 * @param key - the storage key
 */
export const load_theme = (
	themes: Array<Theme> = default_themes,
	fallback: Theme = themes[0] ?? DEFAULT_THEME,
	key = THEME_STORAGE_KEY
): Theme => load_from_storage(key, true, (value) => parse_saved_theme(value, themes)) ?? fallback;

/**
 * Resolves a value from storage to a theme, the parsing half of `load_theme`.
 *
 * @param value - the stored value, parsed from JSON
 * @param themes - the app's theme registry
 * @returns the theme, or `null` when the value doesn't resolve to one
 */
export const parse_saved_theme = (value: unknown, themes: Array<Theme>): Theme | null => {
	if (typeof value === 'string') {
		return themes.find((t) => t.name === value) ?? null;
	}
	if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
	const { name, contrast } = value as Record<string, unknown>;
	const registry_theme = typeof name === 'string' ? themes.find((t) => t.name === name) : undefined;
	if (registry_theme) {
		return contrast === 'low' || contrast === 'high'
			? compose_themes(registry_theme, contrast_modifiers[contrast])
			: registry_theme;
	}
	return parse_theme(trim_theme(value as Theme));
};

/**
 * Copies a theme's authored fields, dropping anything else it carries.
 */
const trim_theme = (theme: Theme): Theme => {
	const trimmed: Record<string, unknown> = { name: theme.name };
	if (theme.summary !== undefined) trimmed.summary = theme.summary;
	if (theme.scheme !== undefined) trimmed.scheme = theme.scheme;
	trimmed.variables = theme.variables;
	return trimmed as Theme;
};

// TODO move to fuz_css
const parse_color_scheme = (value: unknown): ColorSchemePreference | null =>
	color_schemes.includes(value as any) ? (value as ColorSchemePreference) : null;
