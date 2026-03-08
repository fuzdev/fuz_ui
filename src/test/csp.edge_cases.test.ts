import {test, assert, describe} from 'vitest';

import {
	create_csp_directives,
	parse_csp_directive,
	parse_csp_trust_level,
	csp_directive_specs,
} from '$lib/csp.js';
import {create_test_source, TEST_SOURCES} from './csp_test_helpers.js';

const {TRUSTED} = TEST_SOURCES;

describe('extreme array sizes', () => {
	test('handles very large source arrays', () => {
		const many_sources = Array.from({length: 1000}, (_, i) => `source${i}.com`);

		const csp = create_csp_directives({
			value_defaults: {
				'img-src': many_sources as any,
			},
		});

		assert.strictEqual(csp['img-src']!.length, 1000);
		assert.ok(csp['img-src']!.includes('source0.com' as any));
		assert.ok(csp['img-src']!.includes('source999.com' as any));
	});

	test('handles many trusted sources', () => {
		const many_trusted = Array.from({length: 100}, (_, i) => ({
			source: `trusted${i}.com` as any,
			trust: 'low' as const,
		}));

		const csp = create_csp_directives({
			trusted_sources: many_trusted,
		});

		// All sources should be added to img-src (low trust)
		assert.ok(csp['img-src']!.includes('trusted0.com' as any));
		assert.ok(csp['img-src']!.includes('trusted99.com' as any));
	});

	test('handles very long source URLs', () => {
		const long_url = 'https://' + 'a'.repeat(1000) + '.com';

		const csp = create_csp_directives({
			trusted_sources: [{source: long_url as any, trust: 'low'}],
		});

		assert.ok(csp['img-src']!.includes(long_url as any));
	});
});

describe('deeply nested transforms', () => {
	test('handles multiple chained transform functions', () => {
		const csp = create_csp_directives({
			directives: {
				'img-src': (value) => [...value, 'step1.com' as any],
			},
		});

		// Apply another transform
		const csp2 = create_csp_directives({
			value_defaults: {
				'img-src': csp['img-src'],
			},
			directives: {
				'img-src': (value) => [...value, 'step2.com' as any],
			},
		});

		assert.ok(csp2['img-src']!.includes('step1.com' as any));
		assert.ok(csp2['img-src']!.includes('step2.com' as any));
	});

	test('transform with complex logic does not break', () => {
		const csp = create_csp_directives({
			directives: {
				'script-src': (value) => {
					// Complex transform with multiple operations
					const filtered = value.filter((v) => v !== 'self');
					const mapped = filtered.map((v) => v);
					const added = [...mapped, 'self', 'custom.com' as any];
					return added;
				},
			},
		});

		assert.ok(csp['script-src']!.includes('self'));
		assert.ok(csp['script-src']!.includes('custom.com' as any));
	});
});

describe('unusual option combinations', () => {
	test('all bases set to null with empty directives', () => {
		const csp = create_csp_directives({
			value_defaults_base: null,
			required_trust_defaults_base: null,
			value_defaults: {},
			directives: {},
		});

		// Result should be an empty object
		assert.deepEqual(csp, {});
	});

	test('all bases set to empty objects', () => {
		const csp = create_csp_directives({
			value_defaults_base: {},
			required_trust_defaults_base: {},
		});

		assert.deepEqual(csp, {});
	});

	test('mixing null and defined values in options', () => {
		const csp = create_csp_directives({
			value_defaults_base: null,
			value_defaults: {
				'script-src': ['self'],
			},
			required_trust_defaults_base: {},
			required_trust_defaults: {
				'script-src': 'high',
			},
			trusted_sources: [create_test_source(TRUSTED, 'high')],
		});

		assert.ok(csp['script-src']!.includes('self'));
		assert.ok(csp['script-src']!.includes(TRUSTED as any));
	});
});

describe('parse function edge cases', () => {
	test('parse_csp_directive handles all invalid types', () => {
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

	test('parse_csp_directive handles strings that look like directives', () => {
		assert.strictEqual(parse_csp_directive('script'), null);
		assert.strictEqual(parse_csp_directive('src'), null);
		assert.strictEqual(parse_csp_directive('script-source'), null);
		assert.strictEqual(parse_csp_directive('SCRIPT-SRC'), null); // wrong case
	});

	test('parse_csp_trust_level handles all invalid types', () => {
		assert.strictEqual(parse_csp_trust_level(undefined), null);
		assert.strictEqual(parse_csp_trust_level(null), null);
		assert.strictEqual(parse_csp_trust_level(123), null);
		assert.strictEqual(parse_csp_trust_level(true), null);
		assert.strictEqual(parse_csp_trust_level({}), null);
		assert.strictEqual(parse_csp_trust_level([]), null);
	});

	test('parse_csp_trust_level handles strings that look like trust levels', () => {
		assert.strictEqual(parse_csp_trust_level('LOW'), null); // wrong case
		assert.strictEqual(parse_csp_trust_level('High'), null); // wrong case
		assert.strictEqual(parse_csp_trust_level('none'), null);
		assert.strictEqual(parse_csp_trust_level('super-high'), null);
		assert.strictEqual(parse_csp_trust_level(''), null);
	});
});

describe('memory and reference safety', () => {
	test('modifying input options does not affect future calls', () => {
		const sources: Array<any> = [create_test_source(TRUSTED, 'high')];
		const value_defaults: any = {'script-src': ['self']};

		const csp1 = create_csp_directives({
			trusted_sources: sources,
			value_defaults,
		});

		// Modify the inputs
		sources.push(create_test_source('new.com', 'high'));
		value_defaults['script-src'].push('modified.com');

		// Create new CSP with modified inputs
		const csp2 = create_csp_directives({
			trusted_sources: sources,
			value_defaults,
		});

		// csp1 should not have the modifications
		assert.ok(!csp1['script-src']!.includes('new.com' as any));
		assert.ok(!csp1['script-src']!.includes('modified.com' as any));

		// csp2 should have the modifications
		assert.ok(csp2['script-src']!.includes('new.com' as any));
		assert.ok(csp2['script-src']!.includes('modified.com' as any));
	});

	test('modifying returned directives does not affect the system', () => {
		const csp1 = create_csp_directives();

		// Modify returned directive
		csp1['script-src']!.push('hacked.com' as any);

		// New call should not include modification
		const csp2 = create_csp_directives();
		assert.ok(!csp2['script-src']!.includes('hacked.com' as any));
	});
});

describe('transform function edge cases', () => {
	test('transform returning empty array', () => {
		const csp = create_csp_directives({
			directives: {
				'script-src': () => [],
			},
		});

		assert.deepEqual(csp['script-src'], []);
	});

	test('transform returning single value array', () => {
		const csp = create_csp_directives({
			directives: {
				'script-src': () => ['self'],
			},
		});

		assert.deepEqual(csp['script-src'], ['self']);
	});

	test('transform throwing error propagates correctly', () => {
		assert.throws(() => {
			create_csp_directives({
				directives: {
					'script-src': () => {
						throw new Error('Transform error');
					},
				},
			});
		}, /Transform error/);
	});

	test('transform receiving undefined for non-existent directive', () => {
		let received_value: any = 'not-called';

		const csp = create_csp_directives({
			value_defaults_base: null,
			directives: {
				'script-src': (value) => {
					received_value = value;
					return ['self'];
				},
			},
		});

		assert.strictEqual(received_value, undefined);
		assert.deepEqual(csp['script-src'], ['self']);
	});

	test('transform can handle malformed input gracefully', () => {
		const csp = create_csp_directives({
			directives: {
				'script-src': (value) => {
					// Defensive transform
					if (!Array.isArray(value)) return ['self'];
					return value.filter((v) => typeof v === 'string');
				},
			},
		});

		// Should work normally
		assert.ok(Array.isArray(csp['script-src']));
	});
});

describe('boolean directive edge cases', () => {
	test('boolean directive set to false', () => {
		const csp = create_csp_directives({
			value_defaults: {
				'upgrade-insecure-requests': false,
			},
		});

		assert.strictEqual(csp['upgrade-insecure-requests'], false);
	});

	test('boolean directive removed by setting to null', () => {
		const csp = create_csp_directives({
			value_defaults: {
				'upgrade-insecure-requests': null,
			},
		});

		assert.ok(!('upgrade-insecure-requests' in csp));
	});

	test('boolean directive cannot be accidentally set to array', () => {
		// TypeScript should prevent this, but testing runtime behavior
		const csp = create_csp_directives({
			value_defaults: {
				'upgrade-insecure-requests': ['self'],
			},
		});

		// It will be set to the array (no runtime validation)
		assert.deepEqual(csp['upgrade-insecure-requests'], ['self'] as any);
	});
});

describe('directive override precedence edge cases', () => {
	test('transform on non-existent base directive creates it', () => {
		const csp = create_csp_directives({
			value_defaults_base: null,
			directives: {
				'script-src': (value) => {
					assert.isUndefined(value);
					return ['self', 'new.com' as any];
				},
			},
		});

		assert.deepEqual(csp['script-src'], ['self', 'new.com']);
	});

	test('multiple option layers all apply correctly', () => {
		const csp = create_csp_directives({
			value_defaults_base: {
				'script-src': ['base.com' as any],
			},
			value_defaults: {
				'script-src': ['defaults.com' as any],
			},
			trusted_sources: [create_test_source(TRUSTED, 'high')],
			directives: {
				'script-src': (value) => [...value, 'final.com' as any],
			},
		});

		// Should have defaults (overrides base), trusted, and final
		assert.ok(csp['script-src']!.includes('defaults.com' as any));
		assert.ok(csp['script-src']!.includes(TRUSTED as any));
		assert.ok(csp['script-src']!.includes('final.com' as any));

		// Should not have base (overridden by value_defaults)
		assert.ok(!csp['script-src']!.includes('base.com' as any));
	});
});

describe('structuredClone edge cases', () => {
	test('clones nested arrays correctly', () => {
		const nested = [['self', 'fuz.dev']];

		const csp1 = create_csp_directives({
			directives: {
				// @ts-expect-error testing nested array
				'script-src': () => nested,
			},
		});

		// Modify the nested array
		(nested[0] as any).push('modified.com');

		const csp2 = create_csp_directives({
			directives: {
				// @ts-expect-error testing nested array
				'script-src': () => nested,
			},
		});

		// csp1 should not have the modification
		assert.strictEqual((csp1['script-src'] as any)[0].length, 2);

		// csp2 should have the modification
		assert.strictEqual((csp2['script-src'] as any)[0].length, 3);
	});

	test('clones special values correctly', () => {
		const csp = create_csp_directives({
			directives: {
				'script-src': () => ['self', null as any, undefined as any, 0 as any, '' as any],
			},
		});

		// All values should be preserved
		assert.deepEqual(csp['script-src'], ['self', null, undefined, 0, '']);
	});
});

describe('unusual directive names', () => {
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
		// Simulate concurrent calls
		const promises = Array.from({length: 10}, (_, i) =>
			Promise.resolve(
				create_csp_directives({
					trusted_sources: [create_test_source(`source${i}.com`, 'low')],
				}),
			),
		);

		return Promise.all(promises).then((results) => {
			// Each result should have only its own source
			for (let i = 0; i < results.length; i++) {
				assert.ok(results[i]!['img-src']!.includes(`source${i}.com` as any));

				// Should not have other sources
				for (let j = 0; j < results.length; j++) {
					if (i !== j) {
						assert.ok(!results[i]!['img-src']!.includes(`source${j}.com` as any));
					}
				}
			}
		});
	});
});
