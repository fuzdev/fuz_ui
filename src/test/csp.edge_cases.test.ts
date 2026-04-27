import {test, assert, describe} from 'vitest';

import {create_csp_directives, parse_csp_directive, csp_directive_specs} from '$lib/csp.js';
import {TEST_SOURCES} from './csp_test_helpers.js';

const {TRUSTED} = TEST_SOURCES;

describe('extreme array sizes', () => {
	test('handles very large source arrays in extend', () => {
		const many_sources = Array.from({length: 1000}, (_, i) => `source${i}.com` as any);

		const csp = create_csp_directives({
			extend: [{'img-src': many_sources}],
		});

		// 4 base sources + 1000 extended
		assert.strictEqual(csp['img-src']!.length, 1004);
		assert.ok(csp['img-src']!.includes('source0.com' as any));
		assert.ok(csp['img-src']!.includes('source999.com' as any));
	});

	test('handles many extend layers', () => {
		const many_layers = Array.from({length: 100}, (_, i) => ({
			'img-src': [`trusted${i}.com` as any],
		}));

		const csp = create_csp_directives({
			extend: many_layers,
		});

		assert.ok(csp['img-src']!.includes('trusted0.com' as any));
		assert.ok(csp['img-src']!.includes('trusted99.com' as any));
	});

	test('handles very long source URLs', () => {
		const long_url = ('https://' + 'a'.repeat(1000) + '.com') as any;

		const csp = create_csp_directives({
			extend: [{'img-src': [long_url]}],
		});

		assert.ok(csp['img-src']!.includes(long_url));
	});
});

describe('unusual option combinations', () => {
	test('all options empty produces an empty result', () => {
		const csp = create_csp_directives({
			replace_defaults: null,
			extend: [],
			overrides: {},
		});

		assert.deepEqual(csp, {});
	});

	test('empty replace_defaults with no extend or overrides', () => {
		const csp = create_csp_directives({
			replace_defaults: {},
		});

		assert.deepEqual(csp, {});
	});

	test('mixing null replace_defaults with full pipeline', () => {
		const csp = create_csp_directives({
			replace_defaults: null,
			extend: [{'script-src': ['self', TRUSTED as any]}],
			overrides: {
				'connect-src': ['self'],
			},
		});

		assert.deepEqual(csp, {
			'script-src': ['self', TRUSTED],
			'connect-src': ['self'],
		});
	});
});

describe('parse_csp_directive edge cases', () => {
	test('handles all invalid types', () => {
		assert.strictEqual(parse_csp_directive(undefined), null);
		assert.strictEqual(parse_csp_directive(null), null);
		assert.strictEqual(parse_csp_directive(123), null);
		assert.strictEqual(parse_csp_directive(true), null);
		assert.strictEqual(parse_csp_directive({}), null);
		assert.strictEqual(parse_csp_directive([]), null);
		assert.strictEqual(
			parse_csp_directive(() => {}),
			null,
		);
	});

	test('handles strings that look like directives', () => {
		assert.strictEqual(parse_csp_directive('script'), null);
		assert.strictEqual(parse_csp_directive('src'), null);
		assert.strictEqual(parse_csp_directive('script-source'), null);
		assert.strictEqual(parse_csp_directive('SCRIPT-SRC'), null); // wrong case
	});
});

describe('memory and reference safety', () => {
	test('modifying input options does not affect future calls', () => {
		const layer: any = {'script-src': ['self', 'first.com']};

		const csp1 = create_csp_directives({extend: [layer]});

		layer['script-src'].push('modified.com');

		const csp2 = create_csp_directives({extend: [layer]});

		assert.ok(!csp1['script-src']!.includes('modified.com' as any));
		assert.ok(csp2['script-src']!.includes('modified.com' as any));
	});

	test('modifying returned directives does not affect the system', () => {
		const csp1 = create_csp_directives();

		csp1['script-src']!.push('hacked.com' as any);

		const csp2 = create_csp_directives();
		assert.ok(!csp2['script-src']!.includes('hacked.com' as any));
	});
});

describe('boolean directive edge cases', () => {
	test('boolean directive set to false via replace_defaults', () => {
		const csp = create_csp_directives({
			replace_defaults: {
				'upgrade-insecure-requests': false,
			},
		});

		assert.strictEqual(csp['upgrade-insecure-requests'], false);
	});

	test('boolean directive set to false via overrides', () => {
		const csp = create_csp_directives({
			overrides: {
				'upgrade-insecure-requests': false,
			},
		});

		assert.strictEqual(csp['upgrade-insecure-requests'], false);
	});

	test('boolean directive removed via overrides null', () => {
		const csp = create_csp_directives({
			overrides: {
				'upgrade-insecure-requests': null,
			},
		});

		assert.ok(!('upgrade-insecure-requests' in csp));
	});

	test('extending a boolean directive throws', () => {
		assert.throws(
			() =>
				create_csp_directives({
					extend: [{'upgrade-insecure-requests': true} as any],
				}),
			/Cannot extend directive 'upgrade-insecure-requests'/,
		);
	});
});

describe('directive name properties', () => {
	test('all directive names are lowercase with hyphens', () => {
		for (const spec of csp_directive_specs) {
			assert.strictEqual(spec.name, spec.name.toLowerCase(), `${spec.name} should be lowercase`);
			assert.ok(
				/^[a-z-]+$/.test(spec.name),
				`${spec.name} should only contain lowercase letters and hyphens`,
			);
		}
	});

	test('no directive name conflicts', () => {
		const names = csp_directive_specs.map((s) => s.name);
		const unique_names = new Set(names);

		assert.strictEqual(names.length, unique_names.size, 'all directive names should be unique');
	});
});

describe('concurrent calls', () => {
	test('multiple simultaneous calls produce independent results', () => {
		const promises = Array.from({length: 10}, (_, i) =>
			Promise.resolve(
				create_csp_directives({
					extend: [{'img-src': [`source${i}.com` as any]}],
				}),
			),
		);

		return Promise.all(promises).then((results) => {
			for (let i = 0; i < results.length; i++) {
				assert.ok(results[i]!['img-src']!.includes(`source${i}.com` as any));

				for (let j = 0; j < results.length; j++) {
					if (i !== j) {
						assert.ok(!results[i]!['img-src']!.includes(`source${j}.com` as any));
					}
				}
			}
		});
	});
});

describe('output validation: `none` alone', () => {
	test('throws when overrides produces `none` alongside other tokens', () => {
		assert.throws(
			() =>
				create_csp_directives({
					overrides: {
						'script-src': ['none', 'self', TRUSTED as any] as any,
					},
				}),
			/'none' alongside other tokens/,
		);
	});

	test('throws when replace_defaults contains `none` alongside other tokens', () => {
		assert.throws(
			() =>
				create_csp_directives({
					replace_defaults: {
						'script-src': ['none', 'self'] as any,
					},
				}),
			/'none' alongside other tokens/,
		);
	});

	test('directive set to bare `none` is valid', () => {
		const csp = create_csp_directives({
			overrides: {
				'script-src': ['none'],
			},
		});

		assert.deepEqual(csp['script-src'], ['none']);
	});
});
