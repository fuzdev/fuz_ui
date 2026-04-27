import {test, assert, describe} from 'vitest';

import {
	create_csp_directives,
	parse_csp_directive,
	csp_directive_specs,
	csp_directive_spec_by_name,
} from '$lib/csp.js';
import {TEST_SOURCES} from './csp_test_helpers.js';

const {TRUSTED} = TEST_SOURCES;

describe('parse_csp_directive', () => {
	test('accepts valid directive names', () => {
		assert.strictEqual(parse_csp_directive('default-src'), 'default-src');
		assert.strictEqual(parse_csp_directive('script-src'), 'script-src');
		assert.strictEqual(parse_csp_directive('img-src'), 'img-src');
		assert.strictEqual(parse_csp_directive('style-src'), 'style-src');
		assert.strictEqual(parse_csp_directive('connect-src'), 'connect-src');
		assert.strictEqual(
			parse_csp_directive('upgrade-insecure-requests'),
			'upgrade-insecure-requests',
		);
	});

	test('returns null for invalid directive names', () => {
		assert.strictEqual(parse_csp_directive('invalid-src'), null);
		assert.strictEqual(parse_csp_directive('script'), null);
		assert.strictEqual(parse_csp_directive('SCRIPT-SRC'), null);
		assert.strictEqual(parse_csp_directive('script_src'), null);
		assert.strictEqual(parse_csp_directive(''), null);
	});

	test('returns null for non-string types', () => {
		assert.strictEqual(parse_csp_directive(undefined), null);
		assert.strictEqual(parse_csp_directive(null), null);
		assert.strictEqual(parse_csp_directive(123), null);
		assert.strictEqual(parse_csp_directive({}), null);
		assert.strictEqual(parse_csp_directive([]), null);
		assert.strictEqual(parse_csp_directive(true), null);
	});

	test('validates all known directives', () => {
		for (const spec of csp_directive_specs) {
			assert.strictEqual(
				parse_csp_directive(spec.name),
				spec.name,
				`${spec.name} should be a valid directive`,
			);
		}
	});
});

describe('error handling', () => {
	test('throws on invalid directive in replace_defaults', () => {
		assert.throws(
			() =>
				create_csp_directives({
					replace_defaults: {'invalid-directive': ['self']} as any,
				}),
			/Invalid directive in options.replace_defaults/,
		);
	});

	test('throws on invalid directive in extend', () => {
		assert.throws(
			() =>
				create_csp_directives({
					extend: [{'invalid-directive': ['self'] as any} as any],
				}),
			/Invalid directive in options.extend/,
		);
	});

	test('throws on invalid directive in overrides', () => {
		assert.throws(
			() =>
				create_csp_directives({
					overrides: {'invalid-directive': ['self']} as any,
				}),
			/Invalid directive in options.overrides/,
		);
	});

	test('error message includes the invalid directive name', () => {
		try {
			create_csp_directives({
				overrides: {'my-bad-directive': ['self']} as any,
			});
			assert.fail('should have thrown');
		} catch (error: any) {
			assert.ok(
				error.message.includes('my-bad-directive'),
				'error message should include the invalid directive name',
			);
			assert.ok(
				error.message.includes('options.overrides'),
				'error message should locate the source of the bad input',
			);
		}
	});

	test('error message identifies extend as the source', () => {
		try {
			create_csp_directives({
				extend: [{'my-bad-directive': [TRUSTED] as any} as any],
			});
			assert.fail('should have thrown');
		} catch (error: any) {
			assert.ok(error.message.includes('my-bad-directive'));
			assert.ok(error.message.includes('options.extend'));
		}
	});
});

describe('immutability', () => {
	test('modifying returned directives does not affect subsequent calls', () => {
		const csp1 = create_csp_directives();
		const csp2 = create_csp_directives();

		csp1['script-src']!.push('https://modified.com' as any);

		assert.ok(
			!csp2['script-src']!.includes('https://modified.com' as any),
			'arrays are independent between calls',
		);
	});

	test('modifying base input array does not affect output', () => {
		const value = ['self', 'https://fuz.dev' as any];

		const csp = create_csp_directives({
			replace_defaults: {'script-src': value},
		});

		value.push('https://modified.com' as any);

		assert.ok(!csp['script-src']!.includes('https://modified.com' as any));
	});

	test('modifying extend layer array does not affect output', () => {
		const value = ['https://fuz.dev' as any];

		const csp = create_csp_directives({
			extend: [{'connect-src': value}],
		});

		value.push('https://modified.com' as any);

		assert.ok(!csp['connect-src']!.includes('https://modified.com' as any));
	});

	test('modifying overrides array does not affect output', () => {
		const value = ['self', 'https://fuz.dev' as any];

		const csp = create_csp_directives({
			overrides: {'script-src': value},
		});

		value.push('https://modified.com' as any);

		assert.ok(!csp['script-src']!.includes('https://modified.com' as any));
	});

	test('boolean directives pass through correctly', () => {
		const csp = create_csp_directives({
			overrides: {'upgrade-insecure-requests': true},
		});
		assert.strictEqual(csp['upgrade-insecure-requests'], true);
	});
});

describe('directive specs validation', () => {
	test('all specs have valid structure', () => {
		for (const spec of csp_directive_specs) {
			assert.ok(spec.name, `spec should have a name`);
			assert.strictEqual(typeof spec.name, 'string', `spec name should be a string`);

			assert.ok(
				Array.isArray(spec.fallback) || spec.fallback === null, // eslint-disable-line @typescript-eslint/no-unnecessary-condition
				`${spec.name} fallback should be array or null`,
			);

			assert.ok(
				spec.fallback_of === null || Array.isArray(spec.fallback_of),
				`${spec.name} fallback_of should be array or null`,
			);
		}
	});

	test('fallback references are valid', () => {
		for (const spec of csp_directive_specs) {
			if (spec.fallback) {
				for (const fallback_name of spec.fallback) {
					assert.ok(
						csp_directive_spec_by_name.has(fallback_name),
						`${spec.name} references valid fallback ${fallback_name}`,
					);
				}
			}
		}
	});

	test('fallback_of references are valid', () => {
		for (const spec of csp_directive_specs) {
			if (spec.fallback_of) {
				for (const fallback_of_name of spec.fallback_of) {
					assert.ok(
						csp_directive_spec_by_name.has(fallback_of_name),
						`${spec.name} references valid fallback_of ${fallback_of_name}`,
					);
				}
			}
		}
	});

	test('csp_directive_spec_by_name Map is correctly populated', () => {
		assert.strictEqual(csp_directive_spec_by_name.size, csp_directive_specs.length);

		for (const spec of csp_directive_specs) {
			assert.ok(csp_directive_spec_by_name.has(spec.name));
			assert.strictEqual(csp_directive_spec_by_name.get(spec.name), spec);
		}
	});

	test('fallback chains are consistent', () => {
		for (const spec of csp_directive_specs) {
			if (spec.fallback) {
				for (const fallback_name of spec.fallback) {
					const fallback_spec = csp_directive_spec_by_name.get(fallback_name);
					if (fallback_spec?.fallback_of) {
						assert.ok(
							fallback_spec.fallback_of.includes(spec.name),
							`${fallback_name} should list ${spec.name} in fallback_of`,
						);
					}
				}
			}
		}
	});

	test('all known directives are present', () => {
		const expected_directives = [
			'default-src',
			'script-src',
			'script-src-elem',
			'script-src-attr',
			'style-src',
			'style-src-elem',
			'style-src-attr',
			'img-src',
			'media-src',
			'font-src',
			'manifest-src',
			'child-src',
			'connect-src',
			'frame-src',
			'frame-ancestors',
			'form-action',
			'worker-src',
			'object-src',
			'base-uri',
			'upgrade-insecure-requests',
			'report-to',
			'require-trusted-types-for',
			'trusted-types',
			'sandbox',
		];

		for (const directive of expected_directives) {
			assert.ok(csp_directive_spec_by_name.has(directive as any));
		}
	});
});
