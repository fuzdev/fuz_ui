import {test, assert, describe} from 'vitest';
import type {KitConfig} from '@sveltejs/kit';
import type {Defined} from '@fuzdev/fuz_util/types.js';

import {
	create_csp_directives,
	csp_directive_value_defaults,
	csp_directive_specs,
	COLOR_SCHEME_SCRIPT_HASH,
	type CspDirectives,
} from '$lib/csp.js';

// Type compatibility test - this errors if CspDirectives is not assignable to SvelteKit's directives type
type KitCspDirectives = Defined<KitConfig['csp']>['directives'];
const assert_csp_directives: KitCspDirectives = {} as CspDirectives;
assert_csp_directives;

describe('basic defaults', () => {
	test('create_csp_directives produces defaults with no options', () => {
		const csp = create_csp_directives();

		// Check that some directives exist
		assert.ok('default-src' in csp, 'default-src should exist');
		assert.ok('script-src' in csp, 'script-src should exist');
		assert.ok('img-src' in csp, 'img-src should exist');
		assert.ok('upgrade-insecure-requests' in csp, 'upgrade-insecure-requests should exist');

		// Verify defaults match specs
		for (const spec of csp_directive_specs) {
			const default_value = csp_directive_value_defaults[spec.name];
			if (default_value !== null) {
				assert.deepEqual(
					csp[spec.name],
					default_value,
					`${spec.name} should match its spec default value`,
				);
			}
		}
	});

	test('specific default directives have expected values', () => {
		const csp = create_csp_directives();

		// Check specific critical defaults
		assert.deepEqual(csp['default-src'], ['none']);
		assert.deepEqual(csp['script-src'], ['self', COLOR_SCHEME_SCRIPT_HASH]);
		assert.deepEqual(csp['script-src-elem'], ['self', COLOR_SCHEME_SCRIPT_HASH]);
		assert.deepEqual(csp['script-src-attr'], ['none']);
		assert.deepEqual(csp['style-src'], ['self', 'unsafe-inline']);
		assert.deepEqual(csp['img-src'], ['self', 'data:', 'blob:', 'filesystem:']);
		assert.deepEqual(csp['connect-src'], ['self']);
		assert.deepEqual(csp['object-src'], ['none']);
		assert.deepEqual(csp['base-uri'], ['none']);
		assert.strictEqual(csp['upgrade-insecure-requests'], true);
	});

	test('COLOR_SCHEME_SCRIPT_HASH appears in script directives', () => {
		const csp = create_csp_directives();

		// The color scheme script hash should be in script-src and script-src-elem by default
		assert.ok(
			csp['script-src']!.includes(COLOR_SCHEME_SCRIPT_HASH),
			'script-src should include COLOR_SCHEME_SCRIPT_HASH',
		);
		assert.ok(
			csp['script-src-elem']!.includes(COLOR_SCHEME_SCRIPT_HASH),
			'script-src-elem should include COLOR_SCHEME_SCRIPT_HASH',
		);

		// Should not be in other directives
		assert.ok(
			!csp['script-src-attr']!.includes(COLOR_SCHEME_SCRIPT_HASH),
			'script-src-attr should not include COLOR_SCHEME_SCRIPT_HASH',
		);
	});

	test('null default values are omitted from output', () => {
		const csp = create_csp_directives();

		// Directives with null defaults should not appear in the output
		assert.strictEqual('report-to' in csp, false, 'report-to should not be in output');
		assert.strictEqual(
			'require-trusted-types-for' in csp,
			false,
			'require-trusted-types-for should not be in output',
		);
		assert.strictEqual('trusted-types' in csp, false, 'trusted-types should not be in output');
		assert.strictEqual('sandbox' in csp, false, 'sandbox should not be in output');
	});

	test('empty options object produces same result as no options', () => {
		const csp1 = create_csp_directives();
		const csp2 = create_csp_directives({});

		assert.deepEqual(csp1, csp2, 'empty options should produce same result as no options');
	});
});

describe('directive types', () => {
	test('array directives are properly initialized', () => {
		const csp = create_csp_directives();

		// Array directives should be arrays
		assert.ok(Array.isArray(csp['script-src']), 'script-src should be an array');
		assert.ok(Array.isArray(csp['img-src']), 'img-src should be an array');
		assert.ok(Array.isArray(csp['style-src']), 'style-src should be an array');
	});

	test('boolean directives are properly initialized', () => {
		const csp = create_csp_directives();

		// Boolean directives should be booleans
		assert.strictEqual(
			typeof csp['upgrade-insecure-requests'],
			'boolean',
			'upgrade-insecure-requests should be a boolean',
		);
		assert.strictEqual(csp['upgrade-insecure-requests'], true);
	});
});

describe('directive independence', () => {
	test('directives are independent between calls', () => {
		const csp1 = create_csp_directives();
		const csp2 = create_csp_directives();

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

	test('multiple modifications to same directive are isolated', () => {
		const csp1 = create_csp_directives();
		const csp2 = create_csp_directives();
		const csp3 = create_csp_directives();

		// Modify each differently
		csp1['img-src']!.push('https://cdn1.com' as any);
		csp2['img-src']!.push('https://cdn2.com' as any);
		csp3['img-src']!.push('https://cdn3.com' as any);

		// Each should only have its own modification
		assert.ok(csp1['img-src']!.includes('https://cdn1.com' as any));
		assert.ok(!csp1['img-src']!.includes('https://cdn2.com' as any));
		assert.ok(!csp1['img-src']!.includes('https://cdn3.com' as any));

		assert.ok(!csp2['img-src']!.includes('https://cdn1.com' as any));
		assert.ok(csp2['img-src']!.includes('https://cdn2.com' as any));
		assert.ok(!csp2['img-src']!.includes('https://cdn3.com' as any));

		assert.ok(!csp3['img-src']!.includes('https://cdn1.com' as any));
		assert.ok(!csp3['img-src']!.includes('https://cdn2.com' as any));
		assert.ok(csp3['img-src']!.includes('https://cdn3.com' as any));
	});

	test('modifications to nested values are isolated', () => {
		const csp1 = create_csp_directives();
		const csp2 = create_csp_directives();

		// Modify multiple directives in csp1
		csp1['script-src']!.push('https://scripts.com' as any);
		csp1['style-src']!.push('https://styles.com' as any);
		csp1['img-src']!.push('https://images.com' as any);

		// csp2 should have none of these modifications
		assert.ok(!csp2['script-src']!.includes('https://scripts.com' as any));
		assert.ok(!csp2['style-src']!.includes('https://styles.com' as any));
		assert.ok(!csp2['img-src']!.includes('https://images.com' as any));
	});
});

describe("['none'] directive handling", () => {
	test("directives with ['none'] value are preserved", () => {
		const csp = create_csp_directives();

		// These directives default to ['none']
		assert.deepEqual(csp['default-src'], ['none']);
		assert.deepEqual(csp['script-src-attr'], ['none']);
		assert.deepEqual(csp['object-src'], ['none']);
		assert.deepEqual(csp['base-uri'], ['none']);
	});

	test("['none'] directives remain arrays", () => {
		const csp = create_csp_directives();

		assert.ok(Array.isArray(csp['default-src']));
		assert.ok(Array.isArray(csp['script-src-attr']));
		assert.ok(Array.isArray(csp['object-src']));
		assert.ok(Array.isArray(csp['base-uri']));
	});

	test("['none'] directives can be modified like other array directives", () => {
		const csp = create_csp_directives();

		// Should be modifiable (even though semantically this might not make sense)
		csp['object-src']!.push('https://allowed-plugin.com' as any);
		assert.ok(csp['object-src']!.includes('https://allowed-plugin.com' as any));
		assert.ok(csp['object-src']!.includes('none'));
	});
});

describe('all directive types validation', () => {
	test('all array directives are properly typed', () => {
		const csp = create_csp_directives();

		const array_directives = [
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
		] as const;

		for (const directive of array_directives) {
			if (csp[directive]) {
				assert.ok(Array.isArray(csp[directive]), `${directive} should be an array if present`);
			}
		}
	});

	test('boolean directive is properly typed', () => {
		const csp = create_csp_directives();

		assert.strictEqual(typeof csp['upgrade-insecure-requests'], 'boolean');
	});

	test('optional directives with null defaults are absent', () => {
		const csp = create_csp_directives();

		// These default to null and should not be in the output
		assert.strictEqual('report-to' in csp, false);
		assert.strictEqual('require-trusted-types-for' in csp, false);
		assert.strictEqual('trusted-types' in csp, false);
		assert.strictEqual('sandbox' in csp, false);
	});
});
