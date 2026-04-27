import {test, assert, describe} from 'vitest';

import {create_csp_directives} from '$lib/csp.js';
import {
	TEST_SOURCES,
	assert_source_in_directive,
	assert_source_not_in_directive,
	assert_directive_not_exists,
} from './csp_test_helpers.js';

const {TRUSTED, TRUSTED_A, TRUSTED_2} = TEST_SOURCES;

describe('extend basic behavior', () => {
	test('appends a source to an existing directive', () => {
		const csp = create_csp_directives({
			extend: [{'img-src': [TRUSTED as any]}],
		});

		assert_source_in_directive(csp, 'img-src', 'self', 'base sources preserved');
		assert_source_in_directive(csp, 'img-src', TRUSTED, 'extended source added');
	});

	test('only the named directive is affected', () => {
		const csp = create_csp_directives({
			extend: [{'img-src': [TRUSTED as any]}],
		});

		assert_source_not_in_directive(csp, 'script-src', TRUSTED);
		assert_source_not_in_directive(csp, 'connect-src', TRUSTED);
		assert_source_not_in_directive(csp, 'style-src', TRUSTED);
	});

	test('multiple directives in one layer', () => {
		const csp = create_csp_directives({
			extend: [
				{
					'img-src': [TRUSTED as any],
					'connect-src': [TRUSTED_2 as any],
				},
			],
		});

		assert_source_in_directive(csp, 'img-src', TRUSTED);
		assert_source_in_directive(csp, 'connect-src', TRUSTED_2);
		assert_source_not_in_directive(csp, 'img-src', TRUSTED_2);
		assert_source_not_in_directive(csp, 'connect-src', TRUSTED);
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

	test('extending a directive not in base creates it', () => {
		const csp = create_csp_directives({
			replace_defaults: {},
			extend: [{'img-src': [TRUSTED as any]}],
		});

		assert.deepEqual(csp['img-src'], [TRUSTED]);
	});
});

describe('extend layering', () => {
	test('layers compose left-to-right', () => {
		const csp = create_csp_directives({
			extend: [
				{'img-src': [TRUSTED as any]},
				{'img-src': [TRUSTED_2 as any]},
				{'img-src': [TRUSTED_A as any]},
			],
		});

		const img_src = csp['img-src']!;
		const i_trusted = img_src.indexOf(TRUSTED as any);
		const i_trusted2 = img_src.indexOf(TRUSTED_2 as any);
		const i_trusted_a = img_src.indexOf(TRUSTED_A as any);

		assert.ok(i_trusted < i_trusted2, 'first layer before second');
		assert.ok(i_trusted2 < i_trusted_a, 'second layer before third');
	});

	test('base values come before extended sources', () => {
		const csp = create_csp_directives({
			extend: [{'img-src': [TRUSTED as any]}],
		});

		const img_src = csp['img-src']!;
		const self_index = img_src.indexOf('self');
		const trusted_index = img_src.indexOf(TRUSTED as any);

		assert.ok(self_index < trusted_index, 'base sources before extended');
	});

	test('layers from different directives are independent', () => {
		const csp = create_csp_directives({
			extend: [
				{'img-src': [TRUSTED as any]},
				{'connect-src': [TRUSTED_2 as any]},
				{'img-src': [TRUSTED_A as any]},
			],
		});

		assert_source_in_directive(csp, 'img-src', TRUSTED);
		assert_source_in_directive(csp, 'img-src', TRUSTED_A);
		assert_source_not_in_directive(csp, 'img-src', TRUSTED_2);
		assert_source_in_directive(csp, 'connect-src', TRUSTED_2);
	});
});

describe('extend deduplication', () => {
	test('duplicate within a single layer is collapsed', () => {
		const csp = create_csp_directives({
			extend: [{'img-src': [TRUSTED, TRUSTED] as any}],
		});

		const occurrences = csp['img-src']!.filter((v) => v === TRUSTED).length;
		assert.strictEqual(occurrences, 1, 'duplicates collapse within a layer');
	});

	test('duplicate across layers is collapsed', () => {
		const csp = create_csp_directives({
			extend: [{'img-src': [TRUSTED as any]}, {'img-src': [TRUSTED as any]}],
		});

		const occurrences = csp['img-src']!.filter((v) => v === TRUSTED).length;
		assert.strictEqual(occurrences, 1, 'duplicates collapse across layers');
	});

	test('source already present in base is deduplicated when re-added', () => {
		const csp = create_csp_directives({
			extend: [{'img-src': ['self']}],
		});

		const occurrences = csp['img-src']!.filter((v) => v === 'self').length;
		assert.strictEqual(occurrences, 1, 'base source deduplicates against extend');
	});

	test('insertion order preserved across deduplication', () => {
		const csp = create_csp_directives({
			extend: [
				{'img-src': [TRUSTED as any, TRUSTED_2 as any]},
				{'img-src': [TRUSTED as any, TRUSTED_A as any]},
			],
		});

		const img_src = csp['img-src']!;
		const i_trusted = img_src.indexOf(TRUSTED as any);
		const i_trusted2 = img_src.indexOf(TRUSTED_2 as any);
		const i_trusted_a = img_src.indexOf(TRUSTED_A as any);

		assert.ok(i_trusted < i_trusted2, 'first occurrence wins');
		assert.ok(i_trusted2 < i_trusted_a, 'later additions follow');
	});
});

describe('extend on `none` directives', () => {
	test('throws when extending a directive whose base is [`none`]', () => {
		assert.throws(
			() =>
				create_csp_directives({
					extend: [{'object-src': [TRUSTED as any]}],
				}),
			/Cannot extend directive 'object-src'/,
		);
	});

	test('error message points to base/directives as the override path', () => {
		assert.throws(
			() =>
				create_csp_directives({
					extend: [{'default-src': [TRUSTED as any]}],
				}),
			/base.*default-src.*directives/s,
		);
	});

	test('throws even when directives would later replace `none` — extend runs first', () => {
		// The extend stage sees the base ['none']; this throws even though
		// directives would later replace it. Override via base instead.
		assert.throws(
			() =>
				create_csp_directives({
					extend: [{'object-src': [TRUSTED as any]}],
					overrides: {'object-src': null},
				}),
			/Cannot extend directive 'object-src'/,
		);
	});

	test('overriding via `base` first then extending works', () => {
		const csp = create_csp_directives({
			replace_defaults: {
				'object-src': ['self'],
			},
			extend: [{'object-src': [TRUSTED as any]}],
		});

		assert_source_in_directive(csp, 'object-src', 'self');
		assert_source_in_directive(csp, 'object-src', TRUSTED);
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

describe('extend with custom base', () => {
	test('extend works against a wholesale-replaced base', () => {
		const csp = create_csp_directives({
			replace_defaults: {'connect-src': ['self']},
			extend: [{'connect-src': [TRUSTED as any]}],
		});

		assert.deepEqual(csp['connect-src'], ['self', TRUSTED]);
		assert_directive_not_exists(csp, 'script-src', 'no library default leaked through');
	});

	test('extend on a blank base produces only the extended values', () => {
		const csp = create_csp_directives({
			replace_defaults: null,
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
