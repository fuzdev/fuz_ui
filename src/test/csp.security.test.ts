import {test, assert, describe} from 'vitest';

import {create_csp_directives, COLOR_SCHEME_SCRIPT_HASH} from '$lib/csp.js';
import {TEST_SOURCES} from './csp_test_helpers.js';

const {TRUSTED} = TEST_SOURCES;

describe('default security posture', () => {
	test('default-src is set to none (deny by default)', () => {
		const csp = create_csp_directives();
		assert.deepEqual(csp['default-src'], ['none']);
	});

	test('script execution is restricted by default', () => {
		const csp = create_csp_directives();

		// script-src allows self, the color scheme hash, and 'wasm-unsafe-eval' (WASM compile only).
		assert.deepEqual(csp['script-src'], ['self', 'wasm-unsafe-eval', COLOR_SCHEME_SCRIPT_HASH]);

		// No unsafe-inline
		assert.notInclude(csp['script-src']! as Array<any>, 'unsafe-inline');

		// No unsafe-eval (the narrow 'wasm-unsafe-eval' is allowed; broad 'unsafe-eval' is not)
		assert.notInclude(csp['script-src']! as Array<any>, 'unsafe-eval');
	});

	test('inline script attributes are blocked by default', () => {
		const csp = create_csp_directives();
		assert.deepEqual(csp['script-src-attr'], ['none']);
	});

	test('object/embed are blocked by default', () => {
		const csp = create_csp_directives();
		assert.deepEqual(csp['object-src'], ['none']);
	});

	test('base URI is locked down', () => {
		const csp = create_csp_directives();
		assert.deepEqual(csp['base-uri'], ['none']);
	});

	test('child-src is restricted', () => {
		const csp = create_csp_directives();
		assert.deepEqual(csp['child-src'], ['none']);
	});

	test('insecure requests are upgraded by default', () => {
		const csp = create_csp_directives();
		assert.strictEqual(csp['upgrade-insecure-requests'], true);
	});
});

describe('XSS protection through defaults', () => {
	test('inline scripts are not allowed by default', () => {
		const csp = create_csp_directives();

		assert.deepEqual(csp['script-src-attr'], ['none']);
		assert.ok(!csp['script-src']!.includes('unsafe-inline' as any));
	});

	test('eval is not allowed by default, but WASM compile is', () => {
		const csp = create_csp_directives();

		// 'unsafe-eval' is not allowed on either script-src or worker-src.
		assert.ok(!csp['script-src']!.includes('unsafe-eval' as any));
		assert.ok(!csp['worker-src']!.includes('unsafe-eval' as any));

		// 'wasm-unsafe-eval' (WebAssembly.compile/instantiate only) IS allowed by default —
		// required by `@fuzdev/fuz_util/hash_blake3` and any other WASM module.
		assert.ok(csp['script-src']!.includes('wasm-unsafe-eval' as any));
		assert.ok(csp['worker-src']!.includes('wasm-unsafe-eval' as any));
	});

	test('external scripts require explicit allowlist', () => {
		const csp = create_csp_directives();

		assert.ok(csp['script-src']!.includes('self'));
		assert.strictEqual(
			csp['script-src']!.filter(
				(v) => v !== 'self' && v !== 'wasm-unsafe-eval' && !v.startsWith('sha256-'),
			).length,
			0,
			'no external domains by default',
		);
	});

	test('script origins land on script-src only when explicitly extended there', () => {
		const untrusted = 'untrusted-cdn.com';

		// Default: not allowed.
		const csp = create_csp_directives();
		assert.ok(!csp['script-src']!.includes(untrusted as any));

		// Adding to img-src does NOT also grant script-src — sources land only where named.
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

	test('none directive prevents all sources', () => {
		const csp = create_csp_directives();

		assert.deepEqual(csp['default-src'], ['none']);
		assert.deepEqual(csp['object-src'], ['none']);
		assert.deepEqual(csp['base-uri'], ['none']);
		assert.deepEqual(csp['child-src'], ['none']);
		assert.deepEqual(csp['script-src-attr'], ['none']);
	});

	test('extending a `none` directive throws — visible signal in source', () => {
		// The structural design is the guardrail: opting into a default-deny directive
		// requires explicit `base` or `directives` override, not silent extension.
		assert.throws(
			() =>
				create_csp_directives({
					extend: [{'object-src': [TRUSTED as any]}],
				}),
			/Cannot extend directive 'object-src'/,
		);
	});

	test('output never produces `none` alongside other tokens', () => {
		// Even raw `directives` overrides are validated — invalid CSP is rejected at build time.
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
	test('form actions restricted to self by default', () => {
		const csp = create_csp_directives();
		assert.deepEqual(csp['form-action'], ['self']);
	});

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
	test('frames restricted to self by default', () => {
		const csp = create_csp_directives();
		assert.deepEqual(csp['frame-src'], ['self']);
	});

	test('frame-ancestors restricted to self', () => {
		const csp = create_csp_directives();
		assert.deepEqual(csp['frame-ancestors'], ['self']);
	});

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
