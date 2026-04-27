import {test, assert, describe} from 'vitest';

import {create_csp_directives} from '$lib/csp.js';
import {TEST_SOURCES} from './csp_test_helpers.js';

const {TRUSTED, TRUSTED_A, TRUSTED_2} = TEST_SOURCES;

describe('extend basic behavior', () => {
	test('appends a source to an existing directive', () => {
		const csp = create_csp_directives({
			replace_defaults: {'img-src': ['self']},
			extend: [{'img-src': [TRUSTED as any]}],
		});

		assert.deepEqual(csp, {'img-src': ['self', TRUSTED]});
	});

	test('only the named directive is affected', () => {
		const csp = create_csp_directives({
			replace_defaults: {
				'img-src': ['self'],
				'script-src': ['self'],
				'connect-src': ['self'],
				'style-src': ['self'],
			},
			extend: [{'img-src': [TRUSTED as any]}],
		});

		assert.deepEqual(csp, {
			'img-src': ['self', TRUSTED],
			'script-src': ['self'],
			'connect-src': ['self'],
			'style-src': ['self'],
		});
	});

	test('multiple directives in one layer', () => {
		const csp = create_csp_directives({
			replace_defaults: {'img-src': ['self'], 'connect-src': ['self']},
			extend: [
				{
					'img-src': [TRUSTED as any],
					'connect-src': [TRUSTED_2 as any],
				},
			],
		});

		assert.deepEqual(csp, {
			'img-src': ['self', TRUSTED],
			'connect-src': ['self', TRUSTED_2],
		});
	});

	test('empty array is a no-op', () => {
		const csp = create_csp_directives({
			extend: [{'img-src': []}],
		});

		assert.deepEqual(
			csp['img-src'],
			['self', 'data:', 'blob:', 'filesystem:'],
			'img-src unchanged from defaults',
		);
	});

	test('extending a directive not in replace_defaults creates it', () => {
		const csp = create_csp_directives({
			replace_defaults: {},
			extend: [{'img-src': [TRUSTED as any]}],
		});

		assert.deepEqual(csp, {'img-src': [TRUSTED]});
	});
});

describe('extend layering', () => {
	test('layers compose left-to-right', () => {
		const csp = create_csp_directives({
			replace_defaults: {},
			extend: [
				{'img-src': [TRUSTED as any]},
				{'img-src': [TRUSTED_2 as any]},
				{'img-src': [TRUSTED_A as any]},
			],
		});

		assert.deepEqual(csp, {'img-src': [TRUSTED, TRUSTED_2, TRUSTED_A]});
	});

	test('layers from different directives are independent', () => {
		const csp = create_csp_directives({
			replace_defaults: {'img-src': ['self'], 'connect-src': ['self']},
			extend: [
				{'img-src': [TRUSTED as any]},
				{'connect-src': [TRUSTED_2 as any]},
				{'img-src': [TRUSTED_A as any]},
			],
		});

		assert.deepEqual(csp, {
			'img-src': ['self', TRUSTED, TRUSTED_A],
			'connect-src': ['self', TRUSTED_2],
		});
	});
});

describe('extend deduplication', () => {
	test('duplicate within a single layer is collapsed', () => {
		const csp = create_csp_directives({
			replace_defaults: {},
			extend: [{'img-src': [TRUSTED, TRUSTED] as any}],
		});

		assert.deepEqual(csp, {'img-src': [TRUSTED]});
	});

	test('duplicate across layers is collapsed', () => {
		const csp = create_csp_directives({
			replace_defaults: {},
			extend: [{'img-src': [TRUSTED as any]}, {'img-src': [TRUSTED as any]}],
		});

		assert.deepEqual(csp, {'img-src': [TRUSTED]});
	});

	test('source already present in starting state is deduplicated when re-added', () => {
		const csp = create_csp_directives({
			replace_defaults: {'img-src': ['self']},
			extend: [{'img-src': ['self']}],
		});

		assert.deepEqual(csp, {'img-src': ['self']});
	});

	test('insertion order preserved across deduplication', () => {
		const csp = create_csp_directives({
			replace_defaults: {},
			extend: [
				{'img-src': [TRUSTED as any, TRUSTED_2 as any]},
				{'img-src': [TRUSTED as any, TRUSTED_A as any]},
			],
		});

		assert.deepEqual(csp, {'img-src': [TRUSTED, TRUSTED_2, TRUSTED_A]});
	});
});

describe('extend on `none` directives', () => {
	test('throws when extending a directive whose current value is [`none`]', () => {
		assert.throws(
			() =>
				create_csp_directives({
					extend: [{'object-src': [TRUSTED as any]}],
				}),
			/Cannot extend directive 'object-src'/,
		);
	});

	test('error message points to replace_defaults/overrides as the opt-in path', () => {
		assert.throws(
			() =>
				create_csp_directives({
					extend: [{'default-src': [TRUSTED as any]}],
				}),
			/replace_defaults.*default-src.*overrides/s,
		);
	});

	test('error message explains that overrides cannot rescue extend', () => {
		// The pipeline order means an `overrides` entry runs *after* extend, so it cannot
		// pre-empt the ['none'] check. The error message must explain this so users don't
		// keep trying to use `overrides` to fix it.
		assert.throws(
			() =>
				create_csp_directives({
					extend: [{'object-src': [TRUSTED as any]}],
					overrides: {'object-src': null},
				}),
			/pipeline runs.*extend.*overrides.*cannot rescue/s,
		);
	});

	test('opting in via `replace_defaults` first then extending works', () => {
		const csp = create_csp_directives({
			replace_defaults: {
				'object-src': ['self'],
			},
			extend: [{'object-src': [TRUSTED as any]}],
		});

		assert.deepEqual(csp, {'object-src': ['self', TRUSTED]});
	});

	test('empty extend on a `none` directive does not throw', () => {
		// Empty arrays are no-ops — they aren't actually extending anything.
		assert.doesNotThrow(() =>
			create_csp_directives({
				extend: [{'object-src': []}],
			}),
		);
	});
});

describe('extend validation', () => {
	test('throws on unknown directive key', () => {
		assert.throws(
			() =>
				create_csp_directives({
					extend: [{'imag-src': [TRUSTED] as any} as any],
				}),
			/Invalid directive in options.extend: imag-src/,
		);
	});

	test('throws when extending a non-array directive', () => {
		assert.throws(
			() =>
				create_csp_directives({
					extend: [{'upgrade-insecure-requests': true as any} as any],
				}),
			/Cannot extend directive 'upgrade-insecure-requests'/,
		);
	});
});

describe('extend with custom replace_defaults', () => {
	test('extend works against a wholesale-replaced replace_defaults', () => {
		const csp = create_csp_directives({
			replace_defaults: {'connect-src': ['self']},
			extend: [{'connect-src': [TRUSTED as any]}],
		});

		// Whole-CSP deepEqual covers both the connect-src value and that no library defaults leaked.
		assert.deepEqual(csp, {'connect-src': ['self', TRUSTED]});
	});

	test('extend on a blank replace_defaults produces only the extended values', () => {
		const csp = create_csp_directives({
			replace_defaults: {},
			extend: [{'img-src': [TRUSTED as any]}],
		});

		assert.deepEqual(csp, {'img-src': [TRUSTED]});
	});
});

describe('input immutability', () => {
	test('extending does not mutate the input layer object', () => {
		const layer = {'img-src': [TRUSTED as any]};
		const layer_snapshot = JSON.stringify(layer);

		create_csp_directives({extend: [layer]});

		assert.strictEqual(JSON.stringify(layer), layer_snapshot, 'input layer untouched');
	});

	test('two calls with the same layer produce identical results', () => {
		const layer = {'img-src': [TRUSTED as any]};

		const csp1 = create_csp_directives({extend: [layer]});
		const csp2 = create_csp_directives({extend: [layer]});

		assert.deepEqual(csp1, csp2);
	});
});
