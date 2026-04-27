import {test, assert, describe} from 'vitest';

import {
	create_csp_directives,
	COLOR_SCHEME_SCRIPT_HASH,
	type CreateCspDirectivesOptions,
} from '$lib/csp.js';
import {
	create_test_source,
	TEST_SOURCES,
	assert_directive_exists,
	assert_directive_not_exists,
	assert_source_in_directive,
} from './csp_test_helpers.js';

const {DEFAULT_OVERRIDE, SECONDARY_DEFAULT, TRUSTED} = TEST_SOURCES;

describe('value_defaults option tests', () => {
	test('value_defaults: overrides base defaults', () => {
		const csp = create_csp_directives({
			value_defaults: {
				'img-src': ['self', DEFAULT_OVERRIDE as any],
				'connect-src': ['self', DEFAULT_OVERRIDE as any],
			},
		});

		// Check that defaults are applied
		assert.deepEqual(csp['img-src'], ['self', DEFAULT_OVERRIDE]);
		assert.deepEqual(csp['connect-src'], ['self', DEFAULT_OVERRIDE]);

		// Other directives should use original defaults
		assert.deepEqual(csp['script-src'], ['self', 'wasm-unsafe-eval', COLOR_SCHEME_SCRIPT_HASH]);
	});

	test('value_defaults: partial override (some directives)', () => {
		const csp = create_csp_directives({
			value_defaults: {
				'img-src': ['self', DEFAULT_OVERRIDE as any],
			},
		});

		// Only img-src should be overridden
		assert.deepEqual(csp['img-src'], ['self', DEFAULT_OVERRIDE]);

		// Other directives should use original defaults
		assert.deepEqual(csp['connect-src'], ['self']);
		assert.deepEqual(csp['script-src'], ['self', 'wasm-unsafe-eval', COLOR_SCHEME_SCRIPT_HASH]);
	});

	test('value_defaults: works with trusted sources', () => {
		const csp = create_csp_directives({
			value_defaults: {
				'img-src': ['self', DEFAULT_OVERRIDE as any],
				'connect-src': ['self', DEFAULT_OVERRIDE as any],
			},
			trusted_sources: [create_test_source(TRUSTED, 'high')],
		});

		// Trusted sources should be added to the defaults
		assert_source_in_directive(csp, 'img-src', DEFAULT_OVERRIDE, 'default value should be present');
		assert_source_in_directive(
			csp,
			'img-src',
			TRUSTED,
			'trusted source should be added to default',
		);
		assert_source_in_directive(
			csp,
			'connect-src',
			DEFAULT_OVERRIDE,
			'default value should be present',
		);
		assert_source_in_directive(
			csp,
			'connect-src',
			TRUSTED,
			'trusted source should be added to default',
		);
	});

	test('value_defaults: with null values removes directive', () => {
		const csp = create_csp_directives({
			value_defaults: {
				'img-src': null,
			},
		});

		// The directive should be removed
		assert.strictEqual(csp['img-src'], undefined, 'img-src should be undefined/removed');
		assert.strictEqual('img-src' in csp, false, 'img-src should not be in the object');

		// Other directives should still exist
		assert_directive_exists(csp, 'script-src', 'script-src should still exist');
	});

	test('value_defaults: boolean directive', () => {
		const csp = create_csp_directives({
			value_defaults: {
				'upgrade-insecure-requests': false,
			},
		});

		assert.strictEqual(csp['upgrade-insecure-requests'], false);
	});

	test('value_defaults: multiple defaults combined', () => {
		const csp = create_csp_directives({
			value_defaults: {
				'img-src': ['self', DEFAULT_OVERRIDE as any, SECONDARY_DEFAULT as any],
				'script-src': ['self', DEFAULT_OVERRIDE as any],
			},
			trusted_sources: [create_test_source(TRUSTED, 'high')],
		});

		// Check img-src has all default values and trusted source
		assert_source_in_directive(csp, 'img-src', 'self');
		assert_source_in_directive(
			csp,
			'img-src',
			DEFAULT_OVERRIDE,
			'img-src should have first default value',
		);
		assert_source_in_directive(
			csp,
			'img-src',
			SECONDARY_DEFAULT,
			'img-src should have second default value',
		);
		assert_source_in_directive(csp, 'img-src', TRUSTED, 'img-src should have trusted source');

		// Check script-src
		assert_source_in_directive(csp, 'script-src', 'self');
		assert_source_in_directive(
			csp,
			'script-src',
			DEFAULT_OVERRIDE,
			'script-src should have default value',
		);
		assert_source_in_directive(csp, 'script-src', TRUSTED, 'script-src should have trusted source');
	});
});

describe('value_defaults_base option tests', () => {
	test('value_defaults_base: reset to null removes all defaults', () => {
		const csp = create_csp_directives({
			value_defaults_base: null,
			value_defaults: {
				'script-src': ['self', 'https://fuz.dev' as any],
			},
			trusted_sources: [create_test_source(TRUSTED, 'high')],
		});

		// Only the explicitly added directive should exist
		assert.deepEqual(csp['script-src'], ['self', 'https://fuz.dev', TRUSTED]);

		// No other directives should be present
		assert_directive_not_exists(csp, 'img-src', 'img-src should not exist in the result');
		assert_directive_not_exists(csp, 'connect-src', 'connect-src should not exist in the result');
		assert_directive_not_exists(
			csp,
			'upgrade-insecure-requests',
			'upgrade-insecure-requests should not exist',
		);
	});

	test('value_defaults_base: reset to empty object', () => {
		const csp = create_csp_directives({
			value_defaults_base: {},
			value_defaults: {
				'script-src': ['self', 'https://fuz.dev' as any],
			},
		});

		// Only the explicitly added directive should exist
		assert.deepEqual(csp['script-src'], ['self', 'https://fuz.dev']);

		// No other directives should be present
		assert_directive_not_exists(csp, 'img-src', 'img-src should not exist in the result');
		assert_directive_not_exists(csp, 'connect-src', 'connect-src should not exist in the result');
	});

	test('value_defaults_base: custom base defaults', () => {
		const custom_base = {
			'script-src': ['https://custom-base.com' as any],
			'img-src': ['https://custom-images.com' as any],
		};

		const csp = create_csp_directives({
			value_defaults_base: custom_base,
			value_defaults: {
				'script-src': ['self', 'https://fuz.dev' as any],
			},
		});

		// The overridden directive should have the new values
		assert.deepEqual(csp['script-src'], ['self', 'https://fuz.dev']);

		// The non-overridden directive should use the custom base
		assert.deepEqual(csp['img-src'], ['https://custom-images.com']);

		// Directives not in the custom base should not be present
		assert_directive_not_exists(csp, 'connect-src', 'connect-src should not exist in the result');
	});

	test('value_defaults_base: merging behavior', () => {
		const custom_base: CreateCspDirectivesOptions['value_defaults_base'] = {
			'script-src': ['https://base-script.com' as any],
			'img-src': ['https://base-images.com' as any],
		};

		const csp = create_csp_directives({
			value_defaults_base: custom_base,
			value_defaults: {
				// Override script-src from custom base
				'script-src': ['self'],
				// Add connect-src not in custom base
				'connect-src': ['self', 'https://template.fuz.dev' as any],
			},
		});

		// script-src should use value_defaults (overrides custom_base)
		assert.deepEqual(csp['script-src'], ['self']);

		// img-src should use custom_base (not overridden)
		assert.deepEqual(csp['img-src'], ['https://base-images.com']);

		// connect-src should use value_defaults (new directive)
		assert.deepEqual(csp['connect-src'], ['self', 'https://template.fuz.dev']);

		// Other directives should not exist
		assert_directive_not_exists(csp, 'style-src');
	});
});

describe('minimal configurations', () => {
	test('minimal config: null bases with minimal value_defaults', () => {
		const csp = create_csp_directives({
			value_defaults_base: null,
			required_trust_defaults_base: null,
			value_defaults: {'script-src': ['self']},
		});

		assert.deepEqual(csp, {'script-src': ['self']});
	});

	test('minimal config: empty bases with minimal value_defaults', () => {
		const csp = create_csp_directives({
			value_defaults_base: {},
			required_trust_defaults_base: {},
			value_defaults: {'script-src': ['self']},
		});

		assert.deepEqual(csp, {'script-src': ['self']});
	});

	test('minimal config: undefined bases use default behavior', () => {
		const csp = create_csp_directives({
			value_defaults_base: undefined,
			required_trust_defaults_base: undefined,
			value_defaults: {'script-src': ['self']},
		});

		// Should have more than just script-src because undefined uses the default base
		assert.notDeepEqual(csp, {'script-src': ['self']});
		assert_directive_exists(csp, 'script-src');
		assert_directive_exists(csp, 'img-src'); // From default base
		assert_directive_exists(csp, 'default-src'); // From default base
	});
});

describe('array vs non-array directives', () => {
	test('array directives are properly cloned', () => {
		const original_array = ['self', 'https://fuz.dev' as any];
		const csp1 = create_csp_directives({
			value_defaults: {
				'script-src': original_array,
			},
		});

		// Modify the original array
		original_array.push('https://modified.com' as any);

		// csp1 should not be affected
		assert.ok(
			!csp1['script-src']!.includes('https://modified.com' as any),
			'modifying original array should not affect csp',
		);
	});

	test('non-array directives are properly set', () => {
		const csp = create_csp_directives({
			value_defaults: {
				'upgrade-insecure-requests': false,
				'report-to': ['csp-endpoint' as any],
			},
		});

		assert.strictEqual(csp['upgrade-insecure-requests'], false);
		assert.deepEqual(csp['report-to'], ['csp-endpoint']);
	});
});

describe("default value mutation doesn't affect subsequent calls", () => {
	test('modifying returned directives does not affect subsequent calls', () => {
		const options = {
			value_defaults: {
				'script-src': ['self', 'https://fuz.dev' as any],
			},
		};

		const csp1 = create_csp_directives(options);
		const csp2 = create_csp_directives(options);

		// Modify csp1
		if (Array.isArray(csp1['script-src'])) {
			csp1['script-src'].push('https://modified.com' as any);
		}

		// csp2 should not be affected
		assert.ok(
			!csp2['script-src']!.includes('https://modified.com' as any),
			'modifying csp1 should not affect csp2',
		);
	});
});
