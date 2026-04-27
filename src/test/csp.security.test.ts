import {test, assert, describe} from 'vitest';

import {create_csp_directives, COLOR_SCHEME_SCRIPT_HASH} from '$lib/csp.js';
import {create_test_source, TEST_SOURCES} from './csp_test_helpers.js';

const {TRUSTED} = TEST_SOURCES;

describe('default security posture', () => {
	test('default-src is set to none (deny by default)', () => {
		const csp = create_csp_directives();
		assert.deepEqual(csp['default-src'], ['none'], 'default-src should be none for security');
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

		// script-src-attr should be none
		assert.deepEqual(csp['script-src-attr'], ['none']);
	});

	test('object/embed are blocked by default', () => {
		const csp = create_csp_directives();

		// Plugins like Flash should be blocked
		assert.deepEqual(csp['object-src'], ['none']);
	});

	test('base URI is locked down', () => {
		const csp = create_csp_directives();

		// Prevent base tag hijacking
		assert.deepEqual(csp['base-uri'], ['none']);
	});

	test('child-src is restricted', () => {
		const csp = create_csp_directives();

		// child-src should be none by default
		assert.deepEqual(csp['child-src'], ['none']);
	});

	test('insecure requests are upgraded by default', () => {
		const csp = create_csp_directives();

		assert.strictEqual(
			csp['upgrade-insecure-requests'],
			true,
			'should upgrade http to https by default',
		);
	});
});

describe('XSS protection through defaults', () => {
	test('inline scripts are not allowed by default', () => {
		const csp = create_csp_directives();

		// script-src-attr blocks onclick, etc.
		assert.deepEqual(csp['script-src-attr'], ['none']);

		// script-src does not include unsafe-inline
		assert.ok(!csp['script-src']!.includes('unsafe-inline' as any));
	});

	test('eval is not allowed by default, but WASM compile is', () => {
		const csp = create_csp_directives();

		// 'unsafe-eval' (which re-enables `eval` and `new Function`) is not allowed
		// on either script-src or worker-src.
		assert.ok(!csp['script-src']!.includes('unsafe-eval' as any));
		assert.ok(!csp['worker-src']!.includes('unsafe-eval' as any));

		// The narrower 'wasm-unsafe-eval' (permits WebAssembly.compile/instantiate only)
		// IS allowed by default — required by `@fuzdev/fuz_util/hash_blake3` and any
		// other WASM module loaded in the page or a worker.
		assert.ok(csp['script-src']!.includes('wasm-unsafe-eval' as any));
		assert.ok(csp['worker-src']!.includes('wasm-unsafe-eval' as any));
	});

	test('external scripts require explicit allowlist', () => {
		const csp = create_csp_directives();

		// Only self is allowed by default (plus color scheme hash and the wasm-unsafe-eval keyword).
		assert.ok(csp['script-src']!.includes('self'));
		assert.strictEqual(
			csp['script-src']!.filter(
				(v) => v !== 'self' && v !== 'wasm-unsafe-eval' && !v.startsWith('sha256-'),
			).length,
			0,
			'no external domains by default',
		);
	});

	test('only trusted sources can add script origins', () => {
		const untrusted = 'untrusted-cdn.com';

		// Without adding as trusted source, external domains are not included
		const csp = create_csp_directives();

		assert.ok(!csp['script-src']!.includes(untrusted as any));

		// Adding as trusted source includes it
		const csp_with_trusted = create_csp_directives({
			trusted_sources: [create_test_source(untrusted, 'high')],
		});

		assert.ok(csp_with_trusted['script-src']!.includes(untrusted as any));
	});
});

describe('defense in depth with styles', () => {
	test('styles allow unsafe-inline but restrict network sources', () => {
		const csp = create_csp_directives();

		// unsafe-inline is allowed for styles (common requirement)
		assert.ok(csp['style-src']!.includes('unsafe-inline' as any));

		// But only self for network sources
		assert.ok(csp['style-src']!.includes('self'));
	});

	test('external stylesheets require trust level', () => {
		const external_styles = 'blog.fuz.dev';

		const csp_default = create_csp_directives();
		assert.ok(!csp_default['style-src']!.includes(external_styles as any));

		// Medium or higher trust required for styles
		const csp_low = create_csp_directives({
			trusted_sources: [create_test_source(external_styles, 'low')],
		});
		assert.ok(
			!csp_low['style-src']!.includes(external_styles as any),
			'low trust not sufficient for styles',
		);

		const csp_medium = create_csp_directives({
			trusted_sources: [create_test_source(external_styles, 'medium')],
		});
		assert.ok(
			csp_medium['style-src']!.includes(external_styles as any),
			'medium trust sufficient for styles',
		);
	});
});

describe('trust levels enforce security boundaries', () => {
	test('high trust required for script execution', () => {
		const source = 'blog.fuz.dev';

		// Low trust cannot add scripts
		const csp_low = create_csp_directives({
			trusted_sources: [create_test_source(source, 'low')],
		});
		assert.ok(!csp_low['script-src']!.includes(source as any), 'low trust cannot add scripts');

		// Medium trust cannot add scripts
		const csp_medium = create_csp_directives({
			trusted_sources: [create_test_source(source, 'medium')],
		});
		assert.ok(
			!csp_medium['script-src']!.includes(source as any),
			'medium trust cannot add scripts',
		);

		// High trust can add scripts
		const csp_high = create_csp_directives({
			trusted_sources: [create_test_source(source, 'high')],
		});
		assert.ok(csp_high['script-src']!.includes(source as any), 'high trust can add scripts');
	});

	test('trust levels correctly cascade downward', () => {
		const source = 'trusted.fuz.dev';

		// High trust source appears in high, medium, and low directives
		const csp = create_csp_directives({
			trusted_sources: [create_test_source(source, 'high')],
		});

		// High trust directives
		assert.ok(csp['script-src']!.includes(source as any), 'high trust in script-src');
		assert.ok(csp['connect-src']!.includes(source as any), 'high trust in connect-src');

		// Medium trust directives
		assert.ok(csp['style-src']!.includes(source as any), 'high trust cascades to style-src');
		assert.ok(csp['frame-src']!.includes(source as any), 'high trust cascades to frame-src');

		// Low trust directives
		assert.ok(csp['img-src']!.includes(source as any), 'high trust cascades to img-src');
		assert.ok(csp['font-src']!.includes(source as any), 'high trust cascades to font-src');
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
			directives: {
				'script-src': (value) => [...value, custom_hash as any],
			},
		});

		// Custom hash is added
		assert.ok(csp['script-src']!.includes(custom_hash as any));

		// But security baseline is maintained
		assert.ok(!csp['script-src']!.includes('unsafe-inline' as any));
		assert.ok(!csp['script-src']!.includes('unsafe-eval' as any));
	});
});

describe('nonce-based script execution', () => {
	test('nonces can be added dynamically', () => {
		const nonce = 'nonce-random123456';

		const csp = create_csp_directives({
			directives: {
				'script-src': (value) => [...value, nonce as any],
			},
		});

		assert.ok(csp['script-src']!.includes(nonce as any));
	});

	test('nonce does not weaken other protections', () => {
		const nonce = 'nonce-abc123';

		const csp = create_csp_directives({
			directives: {
				'script-src': (value) => [...value, nonce as any],
			},
		});

		// Nonce is present
		assert.ok(csp['script-src']!.includes(nonce as any));

		// But unsafe patterns are still absent
		assert.ok(!csp['script-src']!.includes('unsafe-inline' as any));
		assert.ok(!csp['script-src']!.includes('unsafe-eval' as any));

		// self is still present
		assert.ok(csp['script-src']!.includes('self'));
	});
});

describe('preventing common misconfigurations', () => {
	test('cannot accidentally allow all sources via wildcard', () => {
		const csp = create_csp_directives();

		// No wildcards in default config
		for (const [directive, value] of Object.entries(csp)) {
			if (Array.isArray(value)) {
				assert.ok(!value.includes('*' as any), `${directive} should not include wildcard`);
			}
		}
	});

	test('none directive prevents all sources', () => {
		const csp = create_csp_directives();

		// ['none'] directives should only contain 'none'
		assert.deepEqual(csp['default-src'], ['none']);
		assert.deepEqual(csp['object-src'], ['none']);
		assert.deepEqual(csp['base-uri'], ['none']);
		assert.deepEqual(csp['child-src'], ['none']);
		assert.deepEqual(csp['script-src-attr'], ['none']);
	});

	test('trusted sources do not weaken none directives', () => {
		const csp = create_csp_directives({
			trusted_sources: [create_test_source(TRUSTED, 'high')],
			directives: {
				'object-src': ['none'], // Explicitly set to none
			},
		});

		// object-src should remain none despite high trust sources
		assert.deepEqual(csp['object-src'], ['none']);
	});
});

describe('secure defaults for data URIs and special schemes', () => {
	test('data URIs are allowed only for specific resource types', () => {
		const csp = create_csp_directives();

		// data: allowed for images (common use case)
		assert.ok(csp['img-src']!.includes('data:' as any));

		// data: allowed for fonts
		assert.ok(csp['font-src']!.includes('data:' as any));

		// data: NOT in script-src (would be dangerous)
		assert.ok(!csp['script-src']!.includes('data:' as any));

		// data: NOT in style-src by default
		assert.ok(!csp['style-src']!.includes('data:' as any));
	});

	test('blob: URIs are restricted to appropriate contexts', () => {
		const csp = create_csp_directives();

		// blob: in img-src (for canvas.toBlob() etc)
		assert.ok(csp['img-src']!.includes('blob:' as any));

		// blob: in media-src (for MediaRecorder etc)
		assert.ok(csp['media-src']!.includes('blob:' as any));

		// blob: in worker-src (for Worker(blob))
		assert.ok(csp['worker-src']!.includes('blob:' as any));

		// blob: NOT in script-src directly
		assert.ok(!csp['script-src']!.includes('blob:' as any));
	});
});

describe('form action restrictions', () => {
	test('form actions restricted to self by default', () => {
		const csp = create_csp_directives();

		// Forms can only submit to same origin
		assert.deepEqual(csp['form-action'], ['self']);
	});

	test('form actions require medium trust to expand', () => {
		const external_endpoint = 'template.fuz.dev';

		// Medium trust needed for form-action
		const csp_low = create_csp_directives({
			trusted_sources: [create_test_source(external_endpoint, 'low')],
		});
		assert.ok(!csp_low['form-action']!.includes(external_endpoint as any));

		const csp_medium = create_csp_directives({
			trusted_sources: [create_test_source(external_endpoint, 'medium')],
		});
		assert.ok(csp_medium['form-action']!.includes(external_endpoint as any));
	});
});

describe('frame restrictions', () => {
	test('frames restricted to self by default', () => {
		const csp = create_csp_directives();

		assert.deepEqual(csp['frame-src'], ['self']);
	});

	test('frame-ancestors restricted to self', () => {
		const csp = create_csp_directives();

		// Controls who can embed this page
		assert.deepEqual(csp['frame-ancestors'], ['self']);
	});

	test('medium trust required for frame sources', () => {
		const embedded_content = 'widgets.fuz.dev';

		const csp_low = create_csp_directives({
			trusted_sources: [create_test_source(embedded_content, 'low')],
		});
		assert.ok(!csp_low['frame-src']!.includes(embedded_content as any));

		const csp_medium = create_csp_directives({
			trusted_sources: [create_test_source(embedded_content, 'medium')],
		});
		assert.ok(csp_medium['frame-src']!.includes(embedded_content as any));
	});
});
