import {test, assert, describe} from 'vitest';

import {csp_directive_specs, csp_directive_spec_by_name, type CspDirective} from '$lib/csp.js';

describe('directive spec fallback relationships', () => {
	test('all fallback references point to valid directives', () => {
		for (const spec of csp_directive_specs) {
			if (spec.fallback) {
				for (const fallback_name of spec.fallback) {
					assert.ok(
						csp_directive_spec_by_name.has(fallback_name),
						`${spec.name} fallback ${fallback_name} should be a valid directive`,
					);
				}
			}
		}
	});

	test('all fallback_of references point to valid directives', () => {
		for (const spec of csp_directive_specs) {
			if (spec.fallback_of) {
				for (const fallback_of_name of spec.fallback_of) {
					assert.ok(
						csp_directive_spec_by_name.has(fallback_of_name),
						`${spec.name} fallback_of ${fallback_of_name} should be a valid directive`,
					);
				}
			}
		}
	});

	test('fallback relationships are bidirectional', () => {
		// If A falls back to B, then B should list A in fallback_of
		for (const spec of csp_directive_specs) {
			if (spec.fallback) {
				for (const fallback_name of spec.fallback) {
					const fallback_spec = csp_directive_spec_by_name.get(fallback_name);
					assert.ok(fallback_spec);
					assert.ok(
						fallback_spec.fallback_of,
						`${fallback_name} should have fallback_of (needed for bidirectional relationship with ${spec.name})`,
					);
					assert.ok(
						fallback_spec.fallback_of.includes(spec.name),
						`${fallback_name} should list ${spec.name} in fallback_of (bidirectional relationship)`,
					);
				}
			}
		}
	});

	test('fallback_of relationships are bidirectional', () => {
		// If B is listed in A's fallback_of, then A should list B in fallback
		for (const spec of csp_directive_specs) {
			if (spec.fallback_of) {
				for (const fallback_of_name of spec.fallback_of) {
					const child_spec = csp_directive_spec_by_name.get(fallback_of_name);
					assert.ok(child_spec);
					assert.ok(
						child_spec.fallback,
						`${fallback_of_name} should have fallback (needed for bidirectional relationship with ${spec.name})`,
					);
					assert.ok(
						child_spec.fallback.includes(spec.name),
						`${fallback_of_name} should list ${spec.name} in fallback (reverse relationship)`,
					);
				}
			}
		}
	});
});

describe('specific fallback chains', () => {
	test('script-src-elem falls back to script-src then default-src', () => {
		const spec = csp_directive_spec_by_name.get('script-src-elem');
		assert.ok(spec, 'script-src-elem should exist');
		assert.deepEqual(
			spec.fallback,
			['script-src', 'default-src'],
			'script-src-elem should fall back to script-src then default-src',
		);
	});

	test('script-src-attr falls back to script-src then default-src', () => {
		const spec = csp_directive_spec_by_name.get('script-src-attr');
		assert.ok(spec, 'script-src-attr should exist');
		assert.deepEqual(
			spec.fallback,
			['script-src', 'default-src'],
			'script-src-attr should fall back to script-src then default-src',
		);
	});

	test('script-src falls back to default-src', () => {
		const spec = csp_directive_spec_by_name.get('script-src');
		assert.ok(spec, 'script-src should exist');
		assert.deepEqual(spec.fallback, ['default-src'], 'script-src should fall back to default-src');
	});

	test('style-src-elem falls back to style-src then default-src', () => {
		const spec = csp_directive_spec_by_name.get('style-src-elem');
		assert.ok(spec, 'style-src-elem should exist');
		assert.deepEqual(
			spec.fallback,
			['style-src', 'default-src'],
			'style-src-elem should fall back to style-src then default-src',
		);
	});

	test('style-src-attr falls back to style-src then default-src', () => {
		const spec = csp_directive_spec_by_name.get('style-src-attr');
		assert.ok(spec, 'style-src-attr should exist');
		assert.deepEqual(
			spec.fallback,
			['style-src', 'default-src'],
			'style-src-attr should fall back to style-src then default-src',
		);
	});

	test('worker-src has complex fallback chain', () => {
		const spec = csp_directive_spec_by_name.get('worker-src');
		assert.ok(spec, 'worker-src should exist');
		assert.deepEqual(
			spec.fallback,
			['child-src', 'script-src', 'default-src'],
			'worker-src should fall back to child-src, script-src, then default-src',
		);
	});

	test('frame-src falls back to child-src', () => {
		const spec = csp_directive_spec_by_name.get('frame-src');
		assert.ok(spec, 'frame-src should exist');
		assert.deepEqual(spec.fallback, ['child-src'], 'frame-src should fall back to child-src');
	});

	test('default-src has no fallback', () => {
		const spec = csp_directive_spec_by_name.get('default-src');
		assert.ok(spec, 'default-src should exist');
		assert.strictEqual(
			spec.fallback,
			null,
			'default-src should have no fallback (it is the final fallback)',
		);
	});
});

describe('fallback_of relationships', () => {
	test('default-src is fallback for many directives', () => {
		const spec = csp_directive_spec_by_name.get('default-src');
		assert.ok(spec, 'default-src should exist');
		assert.ok(spec.fallback_of, 'default-src should be fallback for other directives');
		assert.ok(spec.fallback_of.length > 10, 'default-src should be fallback for many directives');

		// Check some key ones
		const expected_children = [
			'script-src',
			'style-src',
			'img-src',
			'connect-src',
			'font-src',
		] as Array<CspDirective>;

		for (const child of expected_children) {
			assert.ok(spec.fallback_of.includes(child), `default-src should be fallback for ${child}`);
		}
	});

	test('script-src is fallback for script-src-elem and script-src-attr', () => {
		const spec = csp_directive_spec_by_name.get('script-src');
		assert.ok(spec?.fallback_of, 'script-src should be fallback for other directives');
		assert.ok(
			spec.fallback_of.includes('script-src-elem'),
			'script-src should be fallback for script-src-elem',
		);
		assert.ok(
			spec.fallback_of.includes('script-src-attr'),
			'script-src should be fallback for script-src-attr',
		);
	});

	test('child-src is fallback for frame-src and worker-src', () => {
		const spec = csp_directive_spec_by_name.get('child-src');
		assert.ok(spec?.fallback_of, 'child-src should be fallback for other directives');
		assert.ok(spec.fallback_of.includes('frame-src'), 'child-src should be fallback for frame-src');
		assert.ok(
			spec.fallback_of.includes('worker-src'),
			'child-src should be fallback for worker-src',
		);
	});

	test('style-src is fallback for style-src-elem and style-src-attr', () => {
		const spec = csp_directive_spec_by_name.get('style-src');
		assert.ok(spec?.fallback_of, 'style-src should be fallback for other directives');
		assert.ok(
			spec.fallback_of.includes('style-src-elem'),
			'style-src should be fallback for style-src-elem',
		);
		assert.ok(
			spec.fallback_of.includes('style-src-attr'),
			'style-src should be fallback for style-src-attr',
		);
	});
});

describe('directives without fallback', () => {
	test('standalone directives have no fallback', () => {
		const standalone = [
			'base-uri',
			'form-action',
			'frame-ancestors',
			'upgrade-insecure-requests',
			'report-to',
			'sandbox',
			'require-trusted-types-for',
			'trusted-types',
		] as Array<CspDirective>;

		for (const directive of standalone) {
			const spec = csp_directive_spec_by_name.get(directive);
			assert.ok(spec, `${directive} should exist`);
			assert.strictEqual(
				spec.fallback,
				null,
				`${directive} should have no fallback (standalone directive)`,
			);
		}
	});

	test('terminal directives in chains have no fallback', () => {
		// These are at the end of their chains
		const terminal = [
			'img-src',
			'font-src',
			'media-src',
			'manifest-src',
			'object-src',
		] as Array<CspDirective>;

		for (const directive of terminal) {
			const spec = csp_directive_spec_by_name.get(directive);
			// These fall back only to default-src
			assert.ok(spec, `${directive} should exist`);
			assert.deepEqual(spec.fallback, ['default-src']);
		}
	});
});

describe('no circular fallback chains', () => {
	test('no directive can reach itself through fallback chain', () => {
		// BFS through all fallback branches — convergent paths are fine, only cycles are bugs
		for (const spec of csp_directive_specs) {
			if (!spec.fallback) continue;

			const visited: Set<CspDirective> = new Set();
			visited.add(spec.name);
			const queue: Array<CspDirective> = [...spec.fallback];

			while (queue.length > 0) {
				const fallback_name = queue.shift()!;
				if (fallback_name === spec.name) {
					assert.fail(`Circular fallback detected: ${spec.name} → ... → ${spec.name}`);
				}

				// Skip already-visited nodes (convergent paths, not cycles)
				if (visited.has(fallback_name)) continue;

				visited.add(fallback_name);
				const fallback_spec = csp_directive_spec_by_name.get(fallback_name);
				if (fallback_spec?.fallback) {
					queue.push(...fallback_spec.fallback);
				}
			}
		}
	});
});

describe('fallback chain length limits', () => {
	test('no fallback chain exceeds reasonable depth', () => {
		const MAX_DEPTH = 5;

		for (const spec of csp_directive_specs) {
			if (!spec.fallback) continue;

			let depth = 0;
			let current: typeof spec | undefined = spec;

			while (current?.fallback && depth < MAX_DEPTH) {
				depth++;
				// Follow the first fallback
				current = csp_directive_spec_by_name.get(current.fallback[0]!);
			}

			assert.ok(
				depth <= MAX_DEPTH,
				`${spec.name} has fallback chain depth of ${depth}, exceeds max of ${MAX_DEPTH}`,
			);
		}
	});

	test('longest fallback chain is worker-src with 3 steps', () => {
		// worker-src → child-src → script-src → default-src
		const spec = csp_directive_spec_by_name.get('worker-src');
		assert.deepEqual(spec?.fallback, ['child-src', 'script-src', 'default-src']);
	});
});
