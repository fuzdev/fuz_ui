import {test, assert, describe} from 'vitest';

import {create_csp_directives, COLOR_SCHEME_SCRIPT_HASH} from '$lib/csp.js';

describe('default security posture — properties (decoupled from exact defaults)', () => {
	// These are property tests — what *must* be true for security regardless of exact default
	// values. Exact defaults are pinned in csp.base.test.ts's snapshot; do not duplicate here.
	test('script-src does not include unsafe-inline by default', () => {
		const csp = create_csp_directives();
		assert.notInclude(csp['script-src']! as Array<any>, 'unsafe-inline');
	});

	test('script-src does not include unsafe-eval by default (wasm-unsafe-eval is allowed)', () => {
		const csp = create_csp_directives();
		assert.notInclude(csp['script-src']! as Array<any>, 'unsafe-eval');
		assert.include(csp['script-src']! as Array<any>, 'wasm-unsafe-eval');
	});

	test('worker-src does not include unsafe-eval by default (wasm-unsafe-eval is allowed)', () => {
		const csp = create_csp_directives();
		assert.notInclude(csp['worker-src']! as Array<any>, 'unsafe-eval');
		assert.include(csp['worker-src']! as Array<any>, 'wasm-unsafe-eval');
	});
});

describe('XSS protection — script source allowlist properties', () => {
	test('script-src by default contains only self, wasm-unsafe-eval, and sha256 hashes', () => {
		// Property: no external host or scheme source by default.
		const csp = create_csp_directives();

		assert.ok(csp['script-src']!.includes('self'));
		const non_baseline = csp['script-src']!.filter(
			(v) => v !== 'self' && v !== 'wasm-unsafe-eval' && !v.startsWith('sha256-'),
		);
		assert.strictEqual(non_baseline.length, 0, 'no external domains by default');
	});

	test('audit-log: a source extended onto script-src lands only there', () => {
		// The library's central claim: "every user-added source is named at exactly one site."
		const untrusted = 'untrusted-cdn.com';

		// Adding to img-src does NOT grant script-src — sources land only where named.
		const csp_img = create_csp_directives({
			extend: [{'img-src': [untrusted as any]}],
		});
		assert.ok(csp_img['img-src']!.includes(untrusted as any));
		assert.ok(!csp_img['script-src']!.includes(untrusted as any));

		// Explicit extend on script-src is the only path.
		const csp_script = create_csp_directives({
			extend: [{'script-src': [untrusted as any]}],
		});
		assert.ok(csp_script['script-src']!.includes(untrusted as any));
	});

	test('audit-log: a unique source extended into one directive appears in no other', () => {
		// Central library claim, parameterized: extending source X onto directive D leaves X
		// absent from every other directive in the output.
		const targets: Array<
			'img-src' | 'script-src' | 'connect-src' | 'font-src' | 'style-src' | 'frame-src'
		> = ['img-src', 'script-src', 'connect-src', 'font-src', 'style-src', 'frame-src'];

		for (const target of targets) {
			const unique_source = `unique-${target}.example.com`;

			const csp = create_csp_directives({
				extend: [{[target]: [unique_source as any]}],
			});

			assert.ok(
				csp[target]!.includes(unique_source as any),
				`${unique_source} should appear in ${target}`,
			);

			for (const [directive, value] of Object.entries(csp)) {
				if (directive === target || !Array.isArray(value)) continue;
				assert.ok(
					!value.includes(unique_source as any),
					`${unique_source} leaked into ${directive} but was only added to ${target}`,
				);
			}
		}
	});
});

describe('defense in depth with styles', () => {
	test('styles allow unsafe-inline but restrict network sources', () => {
		const csp = create_csp_directives();

		assert.ok(csp['style-src']!.includes('unsafe-inline' as any));
		assert.ok(csp['style-src']!.includes('self'));
	});

	test('external stylesheets must be explicitly added to style-src', () => {
		const external_styles = 'blog.fuz.dev';

		const csp_default = create_csp_directives();
		assert.ok(!csp_default['style-src']!.includes(external_styles as any));

		// Adding to img-src doesn't grant style-src.
		const csp_img = create_csp_directives({
			extend: [{'img-src': [external_styles as any]}],
		});
		assert.ok(!csp_img['style-src']!.includes(external_styles as any));

		// Explicit extend on style-src is required.
		const csp_style = create_csp_directives({
			extend: [{'style-src': [external_styles as any]}],
		});
		assert.ok(csp_style['style-src']!.includes(external_styles as any));
	});
});

describe('hash-based script execution', () => {
	test('COLOR_SCHEME_SCRIPT_HASH is included by default', () => {
		const csp = create_csp_directives();

		assert.ok(csp['script-src']!.includes(COLOR_SCHEME_SCRIPT_HASH));
		assert.ok(csp['script-src-elem']!.includes(COLOR_SCHEME_SCRIPT_HASH));
	});

	test('custom hashes can be added without weakening security', () => {
		const custom_hash = 'sha256-abcdef1234567890';

		const csp = create_csp_directives({
			extend: [{'script-src': [custom_hash as any]}],
		});

		assert.ok(csp['script-src']!.includes(custom_hash as any));

		// But security baseline is maintained
		assert.ok(!csp['script-src']!.includes('unsafe-inline' as any));
		assert.ok(!csp['script-src']!.includes('unsafe-eval' as any));
	});
});

describe('nonce-based script execution', () => {
	test('nonces can be added via extend', () => {
		const nonce = 'nonce-random123456';

		const csp = create_csp_directives({
			extend: [{'script-src': [nonce as any]}],
		});

		assert.ok(csp['script-src']!.includes(nonce as any));
	});

	test('nonce does not weaken other protections', () => {
		const nonce = 'nonce-abc123';

		const csp = create_csp_directives({
			extend: [{'script-src': [nonce as any]}],
		});

		assert.ok(csp['script-src']!.includes(nonce as any));
		assert.ok(!csp['script-src']!.includes('unsafe-inline' as any));
		assert.ok(!csp['script-src']!.includes('unsafe-eval' as any));
		assert.ok(csp['script-src']!.includes('self'));
	});
});

describe('preventing common misconfigurations', () => {
	test('cannot accidentally allow all sources via wildcard', () => {
		const csp = create_csp_directives();

		for (const [directive, value] of Object.entries(csp)) {
			if (Array.isArray(value)) {
				assert.ok(!value.includes('*' as any), `${directive} should not include wildcard`);
			}
		}
	});
});

describe('secure defaults for data URIs and special schemes', () => {
	test('data URIs are allowed only for specific resource types', () => {
		const csp = create_csp_directives();

		assert.ok(csp['img-src']!.includes('data:' as any));
		assert.ok(csp['font-src']!.includes('data:' as any));
		assert.ok(!csp['script-src']!.includes('data:' as any));
		assert.ok(!csp['style-src']!.includes('data:' as any));
	});

	test('blob: URIs are restricted to appropriate contexts', () => {
		const csp = create_csp_directives();

		assert.ok(csp['img-src']!.includes('blob:' as any));
		assert.ok(csp['media-src']!.includes('blob:' as any));
		assert.ok(csp['worker-src']!.includes('blob:' as any));
		assert.ok(!csp['script-src']!.includes('blob:' as any));
	});
});

describe('form action restrictions', () => {
	test('form actions must be explicitly extended for external endpoints', () => {
		const external_endpoint = 'template.fuz.dev';

		const csp_default = create_csp_directives();
		assert.ok(!csp_default['form-action']!.includes(external_endpoint as any));

		const csp_extended = create_csp_directives({
			extend: [{'form-action': [external_endpoint as any]}],
		});
		assert.ok(csp_extended['form-action']!.includes(external_endpoint as any));
	});
});

describe('frame restrictions', () => {
	test('frame sources must be explicitly extended', () => {
		const embedded_content = 'widgets.fuz.dev';

		const csp_default = create_csp_directives();
		assert.ok(!csp_default['frame-src']!.includes(embedded_content as any));

		const csp_extended = create_csp_directives({
			extend: [{'frame-src': [embedded_content as any]}],
		});
		assert.ok(csp_extended['frame-src']!.includes(embedded_content as any));
	});
});
