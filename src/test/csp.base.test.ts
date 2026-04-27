import {test, assert, describe} from 'vitest';

import {create_csp_directives, COLOR_SCHEME_SCRIPT_HASH} from '$lib/csp.js';
import {TEST_SOURCES, assert_directive_not_exists} from './csp_test_helpers.js';

const {TRUSTED_2, TRUSTED_3, TRUSTED} = TEST_SOURCES;

describe('replace_defaults option — wholesale replace semantics', () => {
	test('omitted replace_defaults uses library defaults', () => {
		const csp = create_csp_directives();

		assert.deepEqual(csp['script-src'], ['self', 'wasm-unsafe-eval', COLOR_SCHEME_SCRIPT_HASH]);
		assert.deepEqual(csp['img-src'], ['self', 'data:', 'blob:', 'filesystem:']);
		assert.deepEqual(csp['default-src'], ['none']);
	});

	test('provided replace_defaults replaces library defaults wholesale — no inheritance', () => {
		const csp = create_csp_directives({
			replace_defaults: {
				'script-src': ['self', TRUSTED_2 as any],
			},
		});

		assert.deepEqual(csp['script-src'], ['self', TRUSTED_2]);
		assert_directive_not_exists(csp, 'img-src', 'no library default leaked through');
		assert_directive_not_exists(csp, 'default-src', 'no library default leaked through');
		assert_directive_not_exists(csp, 'connect-src', 'no library default leaked through');
	});

	test('replace_defaults: null produces an empty starting state', () => {
		const csp = create_csp_directives({
			replace_defaults: null,
		});

		assert.deepEqual(csp, {});
	});

	test('replace_defaults: {} produces an empty starting state', () => {
		const csp = create_csp_directives({
			replace_defaults: {},
		});

		assert.deepEqual(csp, {});
	});

	test('null values in replace_defaults throw — omit the key or use overrides', () => {
		assert.throws(
			() =>
				create_csp_directives({
					replace_defaults: {
						'script-src': ['self'],
						'img-src': null as any,
					},
				}),
			/Invalid value 'null' for directive 'img-src' in options.replace_defaults/,
		);
	});

	test('boolean values pass through', () => {
		const csp = create_csp_directives({
			replace_defaults: {
				'upgrade-insecure-requests': false,
			},
		});

		assert.strictEqual(csp['upgrade-insecure-requests'], false);
	});

	test('multiple directives in replace_defaults', () => {
		const csp = create_csp_directives({
			replace_defaults: {
				'script-src': ['self', TRUSTED_2 as any],
				'img-src': ['self', TRUSTED_3 as any],
			},
		});

		assert.deepEqual(csp['script-src'], ['self', TRUSTED_2]);
		assert.deepEqual(csp['img-src'], ['self', TRUSTED_3]);
		assert_directive_not_exists(csp, 'connect-src');
	});

	test('throws on unknown directive key', () => {
		assert.throws(
			() =>
				create_csp_directives({
					replace_defaults: {'imag-src': ['self']} as any,
				}),
			/Invalid directive in options.replace_defaults: imag-src/,
		);
	});
});

describe('replace_defaults interaction with extend', () => {
	test('extend appends to replace_defaults values', () => {
		const csp = create_csp_directives({
			replace_defaults: {'connect-src': ['self']},
			extend: [{'connect-src': [TRUSTED as any]}],
		});

		assert.deepEqual(csp['connect-src'], ['self', TRUSTED]);
	});

	test('extend on a directive not present in custom replace_defaults creates it', () => {
		const csp = create_csp_directives({
			replace_defaults: {'script-src': ['self']},
			extend: [{'img-src': [TRUSTED as any]}],
		});

		assert.deepEqual(csp['script-src'], ['self']);
		assert.deepEqual(csp['img-src'], [TRUSTED]);
	});

	test('blank replace_defaults + extend produces only extended directives', () => {
		const csp = create_csp_directives({
			replace_defaults: null,
			extend: [{'img-src': [TRUSTED as any]}],
		});

		assert.deepEqual(csp, {'img-src': [TRUSTED]});
	});
});

describe('replace_defaults immutability', () => {
	test('mutating the input does not change the output', () => {
		const original = ['self', 'https://fuz.dev' as any];
		const csp = create_csp_directives({
			replace_defaults: {'script-src': original},
		});

		original.push('https://modified.com' as any);

		assert.ok(
			!csp['script-src']!.includes('https://modified.com' as any),
			'mutating input array does not affect output',
		);
	});

	test('two calls with the same options produce independent results', () => {
		const options = {replace_defaults: {'script-src': ['self', 'https://fuz.dev' as any]}};

		const csp1 = create_csp_directives(options);
		const csp2 = create_csp_directives(options);

		csp1['script-src']!.push('https://modified.com' as any);

		assert.ok(
			!csp2['script-src']!.includes('https://modified.com' as any),
			'modifying first result does not affect second',
		);
	});
});

describe('minimal configurations', () => {
	test('replace_defaults: null with empty extend yields {}', () => {
		const csp = create_csp_directives({replace_defaults: null});

		assert.deepEqual(csp, {});
	});

	test('blank replace_defaults with explicit directives via overrides', () => {
		const csp = create_csp_directives({
			replace_defaults: null,
			overrides: {'script-src': ['self']},
		});

		assert.deepEqual(csp, {'script-src': ['self']});
	});

	test('blank replace_defaults with single extend layer', () => {
		const csp = create_csp_directives({
			replace_defaults: null,
			extend: [{'script-src': ['self']}],
		});

		assert.deepEqual(csp, {'script-src': ['self']});
	});
});
