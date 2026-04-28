import {test, assert, describe} from 'vitest';

import {create_csp_directives} from '$lib/csp.js';
import {TEST_SOURCES, assert_directive_not_exists} from './csp_test_helpers.js';

const {TRUSTED, TRUSTED_2} = TEST_SOURCES;

describe('overrides option — replace per directive', () => {
	test('replaces the value, ignoring replace_defaults and extend', () => {
		const csp = create_csp_directives({
			extend: [{'script-src': [TRUSTED as any]}],
			overrides: {
				'script-src': ['self', TRUSTED_2 as any],
			},
		});

		// `TRUSTED` from extend is dropped — overrides replaces wholesale.
		assert.deepEqual(csp['script-src'], ['self', TRUSTED_2]);
	});

	test('only the named directive is affected', () => {
		const csp = create_csp_directives({
			replace_defaults: {'script-src': ['self'], 'connect-src': ['self']},
			extend: [
				{
					'script-src': [TRUSTED as any],
					'connect-src': [TRUSTED as any],
				},
			],
			overrides: {
				'script-src': ['self', TRUSTED_2 as any],
			},
		});

		assert.deepEqual(csp, {
			'script-src': ['self', TRUSTED_2],
			'connect-src': ['self', TRUSTED],
		});
	});

	test('multiple directives in one overrides object', () => {
		const csp = create_csp_directives({
			overrides: {
				'script-src': ['self', TRUSTED_2 as any],
				'connect-src': ['self', TRUSTED_2 as any],
			},
		});

		assert.deepEqual(csp['script-src'], ['self', TRUSTED_2]);
		assert.deepEqual(csp['connect-src'], ['self', TRUSTED_2]);
	});

	test('boolean directive value', () => {
		const csp = create_csp_directives({
			overrides: {
				'upgrade-insecure-requests': false,
			},
		});

		assert.strictEqual(csp['upgrade-insecure-requests'], false);
	});

	test('can set a directive to ["none"] explicitly', () => {
		const csp = create_csp_directives({
			extend: [{'connect-src': [TRUSTED as any]}],
			overrides: {
				'connect-src': ['none'],
			},
		});

		assert.deepEqual(csp['connect-src'], ['none']);
	});
});

describe('overrides option — null removes', () => {
	test('null removes the directive from output', () => {
		const csp = create_csp_directives({
			overrides: {
				'script-src': null,
			},
		});

		assert_directive_not_exists(csp, 'script-src');
		assert.ok('connect-src' in csp, 'other directives unaffected');
	});

	test('null on a directive not present is a no-op', () => {
		const csp = create_csp_directives({
			replace_defaults: {},
			overrides: {
				'script-src': null,
			},
		});

		assert.deepEqual(csp, {});
	});

	test('null wins over extend in the same call', () => {
		const csp = create_csp_directives({
			extend: [{'script-src': [TRUSTED as any]}],
			overrides: {
				'script-src': null,
			},
		});

		assert_directive_not_exists(csp, 'script-src');
	});
});

describe('overrides option — undefined values', () => {
	test('undefined value in overrides is a no-op', () => {
		// Distinct from `null` (removes) — `undefined` is treated as omission, leaving the
		// pipeline result from earlier stages untouched.
		const csp = create_csp_directives({
			replace_defaults: {'script-src': ['self']},
			overrides: {
				'script-src': undefined as any,
			},
		});

		assert.deepEqual(csp, {'script-src': ['self']});
	});
});

describe('overrides interaction with extend output', () => {
	test('overrides ["none"] replaces an extend-built array (full pipeline)', () => {
		// replace_defaults seeds, extend appends, overrides replaces wholesale with ['none'].
		// The intermediate ['self', TRUSTED] never reaches the output.
		const csp = create_csp_directives({
			replace_defaults: {'img-src': ['self']},
			extend: [{'img-src': [TRUSTED as any]}],
			overrides: {'img-src': ['none']},
		});

		assert.deepEqual(csp, {'img-src': ['none']});
	});
});

describe('precedence: replace_defaults → extend → overrides', () => {
	test('full pipeline: replace_defaults sets, extend appends, overrides replaces', () => {
		const csp = create_csp_directives({
			replace_defaults: {'connect-src': ['self']},
			extend: [{'connect-src': [TRUSTED as any]}],
			overrides: {
				'connect-src': ['self', TRUSTED_2 as any],
			},
		});

		assert.deepEqual(csp, {'connect-src': ['self', TRUSTED_2]});
	});

	test('overrides runs after extend even when extend would throw on `none`', () => {
		// `overrides` cannot rescue an `extend` on a `'none'` directive — extend runs first.
		assert.throws(
			() =>
				create_csp_directives({
					extend: [{'object-src': [TRUSTED as any]}],
					overrides: {'object-src': ['self']},
				}),
			/Cannot extend directive 'object-src'/,
		);
	});

	test('overrides can independently replace a `none` default', () => {
		const csp = create_csp_directives({
			overrides: {'object-src': ['self', TRUSTED as any]},
		});

		assert.deepEqual(csp['object-src'], ['self', TRUSTED]);
	});
});

describe('input immutability', () => {
	test('mutating override input does not change output', () => {
		const value = ['self', 'https://fuz.dev' as any];
		const csp = create_csp_directives({
			overrides: {'script-src': value},
		});

		value.push('https://modified.com' as any);

		assert.ok(
			!csp['script-src']!.includes('https://modified.com' as any),
			'mutating input array does not affect output',
		);
	});
});
