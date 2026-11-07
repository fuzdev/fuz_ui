/**
 * @vitest-environment jsdom
 */
import { describe, test, assert, beforeEach } from 'vitest';
import { compose_themes } from '@fuzdev/fuz_css/theme.ts';
import { contrast_modifiers, default_themes, DEFAULT_THEME } from '@fuzdev/fuz_css/themes.ts';
import { ledger_theme } from '@fuzdev/fuz_css/themes/ledger.ts';
import type { Theme } from '@fuzdev/fuz_css/variable.ts';

import {
	load_theme,
	parse_saved_theme,
	save_theme,
	THEME_STORAGE_KEY
} from '#lib/theme_state.svelte.ts';

const custom_theme: Theme = {
	name: 'custom',
	summary: 'a custom theme',
	scheme: 'dark',
	variables: [{ name: 'hue_accent', base: '200' }]
};

const read_saved = (): unknown => {
	const saved = localStorage.getItem(THEME_STORAGE_KEY);
	return saved === null ? null : JSON.parse(saved);
};

const write_saved = (value: unknown): void => {
	localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(value));
};

beforeEach(() => {
	localStorage.clear();
});

describe('save_theme', () => {
	test('saves a registry theme by name', () => {
		save_theme(ledger_theme, default_themes);
		assert.equal(read_saved(), 'ledger');
	});

	test('a theme sharing a registry name saves as that name', () => {
		save_theme({ name: 'ledger', variables: [{ name: 'hue_accent', base: '10' }] }, default_themes);
		assert.equal(read_saved(), 'ledger');
	});

	test('saves a non-registry theme whole, trimmed to its authored fields', () => {
		save_theme({ ...custom_theme, scheme_mirror: [], extra: 1 } as Theme, default_themes);
		assert.deepEqual(read_saved(), custom_theme);
	});

	test('omits absent optional fields', () => {
		save_theme({ name: 'plain', variables: [] }, default_themes);
		assert.deepEqual(read_saved(), { name: 'plain', variables: [] });
	});

	test('null removes the saved theme', () => {
		write_saved('ledger');
		save_theme(null, default_themes);
		assert.equal(localStorage.getItem(THEME_STORAGE_KEY), null);
	});

	test('saves a contrast composition by reference', () => {
		save_theme(compose_themes(ledger_theme, contrast_modifiers.high), default_themes);
		assert.deepEqual(read_saved(), { name: 'ledger', contrast: 'high' });
		save_theme(compose_themes(DEFAULT_THEME, contrast_modifiers.low), default_themes);
		assert.deepEqual(read_saved(), { name: DEFAULT_THEME.name, contrast: 'low' });
	});

	test('a theme named like a composition saves as that composition', () => {
		const name = compose_themes(ledger_theme, contrast_modifiers.high).name;
		save_theme({ name, variables: [{ name: 'hue_accent', base: '10' }] }, default_themes);
		assert.deepEqual(read_saved(), { name: 'ledger', contrast: 'high' });
	});

	test('a composition over a theme outside the registry saves whole', () => {
		const composed = compose_themes(custom_theme, contrast_modifiers.high);
		save_theme(composed, default_themes);
		assert.deepEqual(read_saved(), composed);
	});

	test('membership follows the given registry', () => {
		save_theme(custom_theme, [DEFAULT_THEME, custom_theme]);
		assert.equal(read_saved(), 'custom');
	});
});

describe('load_theme', () => {
	test('falls back to the registry first theme with nothing saved', () => {
		assert.equal(load_theme(), default_themes[0]);
		assert.equal(load_theme([ledger_theme]), ledger_theme);
	});

	test('falls back to the given fallback', () => {
		assert.equal(load_theme(default_themes, custom_theme), custom_theme);
	});

	test('a saved name loads the registry theme', () => {
		write_saved('ledger');
		assert.equal(load_theme(), ledger_theme);
	});

	test('a saved name not in the registry falls back', () => {
		write_saved('ledger');
		assert.equal(load_theme([DEFAULT_THEME]), DEFAULT_THEME);
	});

	test('{name, contrast} loads the registry theme composed with the modifier', () => {
		write_saved({ name: 'ledger', contrast: 'high' });
		assert.deepEqual(load_theme(), compose_themes(ledger_theme, contrast_modifiers.high));
		write_saved({ name: 'ledger', contrast: 'low' });
		assert.deepEqual(load_theme(), compose_themes(ledger_theme, contrast_modifiers.low));
	});

	test('an unknown contrast loads the registry theme', () => {
		write_saved({ name: 'ledger', contrast: 'medium' });
		assert.equal(load_theme(), ledger_theme);
	});

	test('a contrast on an unknown name falls through to the object parse', () => {
		write_saved({ name: 'gone', contrast: 'high' });
		assert.equal(load_theme(), DEFAULT_THEME);
	});

	test('an object named like a registry theme loads the registry theme', () => {
		write_saved({ name: 'ledger', variables: [{ name: 'hue_accent', base: '10' }] });
		assert.equal(load_theme(), ledger_theme);
	});

	test('any other object loads its authored fields', () => {
		write_saved({ ...custom_theme, scheme_mirror: [{ name: 'shade_00', base: 'red' }], extra: 1 });
		assert.deepEqual(load_theme(), custom_theme);
	});

	test('an object that does not parse falls back', () => {
		write_saved({ name: 'bad', variables: 'nope' });
		assert.equal(load_theme(), DEFAULT_THEME);
		write_saved({ name: 'bad', variables: [{ name: 'not a name!', base: '1' }] });
		assert.equal(load_theme(), DEFAULT_THEME);
		write_saved({ variables: [] });
		assert.equal(load_theme(), DEFAULT_THEME);
	});

	test('malformed storage falls back', () => {
		localStorage.setItem(THEME_STORAGE_KEY, '{not json');
		assert.equal(load_theme(), DEFAULT_THEME);
		for (const value of [null, 1, true, [], ['ledger']]) {
			write_saved(value);
			assert.equal(load_theme(), DEFAULT_THEME);
		}
	});

	test('a contrast composition round-trips byte-stable', () => {
		write_saved({ name: 'ledger', contrast: 'high' });
		const saved = localStorage.getItem(THEME_STORAGE_KEY);
		const loaded = load_theme();
		assert.deepEqual(loaded, compose_themes(ledger_theme, contrast_modifiers.high));
		save_theme(loaded, default_themes);
		assert.equal(localStorage.getItem(THEME_STORAGE_KEY), saved);
		assert.deepEqual(load_theme(), loaded);
	});

	test('round-trips through save_theme', () => {
		save_theme(ledger_theme, default_themes);
		assert.equal(load_theme(), ledger_theme);
		save_theme(custom_theme, default_themes);
		assert.deepEqual(load_theme(), custom_theme);
	});
});

describe('parse_saved_theme', () => {
	test('reads the given registry', () => {
		assert.equal(parse_saved_theme('custom', [custom_theme]), custom_theme);
		assert.equal(parse_saved_theme('custom', default_themes), null);
	});
});
