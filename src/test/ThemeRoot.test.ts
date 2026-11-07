/**
 * @vitest-environment jsdom
 */
import { describe, test, assert, vi, afterEach, beforeEach } from 'vitest';
import { flushSync } from 'svelte';
import { fromStore, writable } from 'svelte/store';
import { DEFAULT_THEME, default_themes } from '@fuzdev/fuz_css/themes.ts';
import { ledger_theme } from '@fuzdev/fuz_css/themes/ledger.ts';
import { phosphor_theme } from '@fuzdev/fuz_css/themes/phosphor.ts';
import { resolve_theme_stance } from '@fuzdev/fuz_css/theme_stance.ts';

import { THEME_STORAGE_KEY, ThemeState } from '#lib/theme_state.svelte.ts';
import ThemeRootHarness from './ThemeRootHarness.svelte';
import { mount_component, unmount_component } from './test_helpers.ts';

// a variable in phosphor's stance mirror that phosphor itself doesn't set,
// so it renders only when the theme is resolved
const MIRROR_ONLY_VARIABLE = '--palette_lightness_00:';

let mounted: { instance: any; container: HTMLElement } | null = null;

beforeEach(() => {
	localStorage.clear();
});

afterEach(async () => {
	if (mounted) {
		await unmount_component(mounted.instance, mounted.container);
		mounted = null;
	}
	vi.restoreAllMocks();
});

const mount_root = (props: Record<string, any> = {}): HTMLElement => {
	mounted = mount_component(ThemeRootHarness as any, props);
	flushSync();
	return mounted.container;
};

const get_style = (container: HTMLElement): string =>
	container.querySelector('[data-testid="style"]')!.textContent;

describe('ThemeRoot', () => {
	test('the default theme renders no style', () => {
		assert.equal(get_style(mount_root()), '');
	});

	test('a registry theme saved by name renders', () => {
		localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify('ledger'));
		const container = mount_root();
		assert.include(get_style(container), '@layer fuz.theme');
		assert.equal(container.querySelector('[data-testid="theme_name"]')!.textContent, 'ledger');
	});

	test('a stanced registry theme without a resolver throws', () => {
		assert.throws(
			() => mount_root({ themes: [DEFAULT_THEME, phosphor_theme] }),
			/"phosphor" in `themes`.*resolve_theme/
		);
	});

	test('a stanced theme_fallback without a resolver throws', () => {
		assert.throws(
			() => mount_root({ themes: default_themes, theme_fallback: phosphor_theme }),
			/"phosphor" in `theme_fallback`/
		);
	});

	test('a stanced registry theme with a resolver renders its mirror', () => {
		localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify('phosphor'));
		const style = get_style(
			mount_root({
				themes: [DEFAULT_THEME, phosphor_theme],
				resolve_theme: resolve_theme_stance
			})
		);
		assert.include(style, 'color-scheme: dark');
		assert.include(style, MIRROR_ONLY_VARIABLE);
	});

	test('the resolver passes a dual-scheme theme through', () => {
		localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify('ledger'));
		const resolve_theme = vi.fn(resolve_theme_stance);
		const style = get_style(mount_root({ resolve_theme }));
		assert.equal(resolve_theme.mock.calls[0]![0], ledger_theme);
		assert.include(style, '@layer fuz.theme');
		assert.notInclude(style, MIRROR_ONLY_VARIABLE);
	});

	test('a stanced theme from storage without a resolver logs once and renders', () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});
		localStorage.setItem(
			THEME_STORAGE_KEY,
			JSON.stringify({
				name: 'saved_dark',
				scheme: 'dark',
				variables: [{ name: 'hue_accent', base: '200' }]
			})
		);
		const style = get_style(mount_root());
		assert.equal(error.mock.calls.length, 1);
		assert.include(String(error.mock.calls[0]![0]), '"saved_dark"');
		assert.include(style, '--hue_accent: 200');
		assert.include(style, 'color-scheme: dark');
		assert.notInclude(style, MIRROR_ONLY_VARIABLE);
	});

	test('a new themes array does not re-save an unchanged theme', () => {
		const save_theme = vi.fn();
		const theme_state = new ThemeState({ theme: DEFAULT_THEME, color_scheme: 'auto' });
		const themes = writable(default_themes);
		const themes_ref = fromStore(themes);
		mount_root({
			save_theme,
			theme_state,
			get themes() {
				return themes_ref.current;
			}
		});
		assert.equal(save_theme.mock.calls.length, 0);
		theme_state.theme = ledger_theme;
		flushSync();
		assert.equal(save_theme.mock.calls.length, 1);
		themes.set([...default_themes]);
		flushSync();
		assert.equal(save_theme.mock.calls.length, 1);
		theme_state.theme = DEFAULT_THEME;
		flushSync();
		assert.equal(save_theme.mock.calls.length, 2);
		assert.notEqual(
			save_theme.mock.calls[1]![1],
			default_themes,
			'saves against the current registry'
		);
	});
});
