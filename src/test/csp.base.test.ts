import {test, assert, describe} from 'vitest';

import {create_csp_directives, COLOR_SCHEME_SCRIPT_HASH} from '$lib/csp.js';
import {TEST_SOURCES} from './csp_test_helpers.js';

const {TRUSTED_2, TRUSTED_3, TRUSTED} = TEST_SOURCES;

describe('default output snapshot', () => {
	// Snapshot of the canonical library default policy. This is the only test that asserts
	// the full output of `create_csp_directives()` — any change to `csp_directive_value_defaults`
	// surfaces here as a focused diff. Update by hand; do not generate from the constant.
	test('omitted replace_defaults uses library defaults', () => {
		const csp = create_csp_directives();

		assert.deepEqual(csp, {
			'default-src': ['none'],
			'script-src': ['self', 'wasm-unsafe-eval', COLOR_SCHEME_SCRIPT_HASH],
			'script-src-elem': ['self', COLOR_SCHEME_SCRIPT_HASH],
			'script-src-attr': ['none'],
			'style-src': ['self', 'unsafe-inline'],
			'style-src-elem': ['self', 'unsafe-inline'],
			'style-src-attr': ['unsafe-inline'],
			'img-src': ['self', 'data:', 'blob:', 'filesystem:'],
			'media-src': ['self', 'data:', 'blob:', 'mediastream:', 'filesystem:'],
			'font-src': ['self', 'data:'],
			'manifest-src': ['self'],
			'child-src': ['none'],
			'connect-src': ['self'],
			'frame-src': ['self'],
			'frame-ancestors': ['self'],
			'form-action': ['self'],
			'worker-src': ['self', 'blob:', 'wasm-unsafe-eval'],
			'object-src': ['none'],
			'base-uri': ['none'],
			'upgrade-insecure-requests': true,
		});
	});
});

describe('replace_defaults option — wholesale replace semantics', () => {
	test('provided replace_defaults replaces library defaults wholesale — no inheritance', () => {
		const csp = create_csp_directives({
			replace_defaults: {
				'script-src': ['self', TRUSTED_2 as any],
			},
		});

		// Whole-CSP deepEqual asserts both the script-src value and that no library defaults leaked.
		assert.deepEqual(csp, {'script-src': ['self', TRUSTED_2]});
	});

	test('replace_defaults: {} produces an empty starting state', () => {
		const csp = create_csp_directives({
			replace_defaults: {},
		});

		assert.deepEqual(csp, {});
	});

	test('replace_defaults: null throws — omit the option or pass {}', () => {
		// `null` is intentionally rejected to avoid the null/undefined footgun where a
		// conditional that produces null silently disables all security defaults.
		assert.throws(
			() =>
				create_csp_directives({
					replace_defaults: null as any,
				}),
			/Invalid value 'null' for options.replace_defaults/,
		);
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

		assert.deepEqual(csp, {
			'script-src': ['self', TRUSTED_2],
			'img-src': ['self', TRUSTED_3],
		});
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

		assert.deepEqual(csp, {'connect-src': ['self', TRUSTED]});
	});

	test('extend on a directive not present in custom replace_defaults creates it', () => {
		const csp = create_csp_directives({
			replace_defaults: {'script-src': ['self']},
			extend: [{'img-src': [TRUSTED as any]}],
		});

		assert.deepEqual(csp, {
			'script-src': ['self'],
			'img-src': [TRUSTED],
		});
	});

	test('blank replace_defaults + extend produces only extended directives', () => {
		const csp = create_csp_directives({
			replace_defaults: {},
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
	test('blank replace_defaults with explicit directives via overrides', () => {
		const csp = create_csp_directives({
			replace_defaults: {},
			overrides: {'script-src': ['self']},
		});

		assert.deepEqual(csp, {'script-src': ['self']});
	});

	test('blank replace_defaults with single extend layer', () => {
		const csp = create_csp_directives({
			replace_defaults: {},
			extend: [{'script-src': ['self']}],
		});

		assert.deepEqual(csp, {'script-src': ['self']});
	});
});
