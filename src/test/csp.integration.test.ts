import {describe, test, assert} from 'vitest';

import {create_csp_directives, COLOR_SCHEME_SCRIPT_HASH} from '$lib/csp.js';
import {
	TEST_SOURCES,
	assert_source_in_directive,
	assert_source_not_in_directive,
} from './csp_test_helpers.js';

const {GOOGLE_FONTS, GOOGLE_FONTS_STATIC, CLOUDFLARE_CDN, ANALYTICS, STRIPE} = TEST_SOURCES;

describe('full pipeline integration', () => {
	test('replace_defaults + extend + overrides compose correctly', () => {
		const csp = create_csp_directives({
			replace_defaults: {
				'default-src': ['none'],
				'script-src': ['self', COLOR_SCHEME_SCRIPT_HASH],
				'style-src': ['self', 'unsafe-inline'],
				'img-src': ['self'],
				'connect-src': ['self'],
			},
			extend: [
				{
					'script-src': [ANALYTICS as any],
					'connect-src': [ANALYTICS as any],
				},
			],
			overrides: {
				'connect-src': ['self', ANALYTICS as any],
			},
		});

		assert_source_in_directive(csp, 'script-src', 'self');
		assert_source_in_directive(csp, 'script-src', ANALYTICS);
		assert_source_in_directive(csp, 'script-src', COLOR_SCHEME_SCRIPT_HASH);

		// overrides replaces extend output for connect-src
		assert.deepEqual(csp['connect-src'], ['self', ANALYTICS]);

		// img-src untouched
		assert.deepEqual(csp['img-src'], ['self']);
	});

	test('multiple extend layers compose with library defaults', () => {
		const csp = create_csp_directives({
			extend: [
				// Shared "library" of trusted sources
				{
					'img-src': ['https://*.fuz.dev/' as any],
				},
				// App-specific extras
				{
					'connect-src': ['https://api.example.com/' as any],
					'img-src': ['https://cdn.example.com/' as any],
				},
			],
		});

		assert_source_in_directive(csp, 'img-src', 'https://*.fuz.dev/');
		assert_source_in_directive(csp, 'img-src', 'https://cdn.example.com/');
		assert_source_in_directive(csp, 'connect-src', 'https://api.example.com/');

		// Library defaults still in place
		assert_source_in_directive(csp, 'img-src', 'self');
		assert_source_in_directive(csp, 'connect-src', 'self');
	});
});

describe('real-world SvelteKit scenarios', () => {
	test('Google Fonts (style + font CDN)', () => {
		const csp = create_csp_directives({
			extend: [
				{
					'style-src': [GOOGLE_FONTS as any, GOOGLE_FONTS_STATIC as any],
					'font-src': [GOOGLE_FONTS as any, GOOGLE_FONTS_STATIC as any],
				},
			],
		});

		assert_source_in_directive(csp, 'style-src', GOOGLE_FONTS);
		assert_source_in_directive(csp, 'style-src', GOOGLE_FONTS_STATIC);
		assert_source_in_directive(csp, 'font-src', GOOGLE_FONTS);
		assert_source_in_directive(csp, 'font-src', GOOGLE_FONTS_STATIC);

		// Doesn't leak into script-src
		assert_source_not_in_directive(csp, 'script-src', GOOGLE_FONTS);
	});

	test('analytics (script + connect)', () => {
		const csp = create_csp_directives({
			extend: [
				{
					'script-src': [ANALYTICS as any],
					'connect-src': [ANALYTICS as any],
				},
			],
		});

		assert_source_in_directive(csp, 'script-src', ANALYTICS);
		assert_source_in_directive(csp, 'connect-src', ANALYTICS);
		assert_source_not_in_directive(csp, 'img-src', ANALYTICS);
	});

	test('CDN for scripts and styles', () => {
		const csp = create_csp_directives({
			extend: [
				{
					'script-src': [CLOUDFLARE_CDN as any],
					'style-src': [CLOUDFLARE_CDN as any],
				},
			],
		});

		assert_source_in_directive(csp, 'script-src', CLOUDFLARE_CDN);
		assert_source_in_directive(csp, 'style-src', CLOUDFLARE_CDN);

		// CDN does NOT auto-leak into other directives
		assert_source_not_in_directive(csp, 'connect-src', CLOUDFLARE_CDN);
		assert_source_not_in_directive(csp, 'img-src', CLOUDFLARE_CDN);
	});

	test('Stripe payment integration', () => {
		const csp = create_csp_directives({
			extend: [
				{
					'script-src': [STRIPE as any],
					'connect-src': [STRIPE as any],
					'frame-src': [STRIPE as any],
				},
			],
		});

		assert_source_in_directive(csp, 'script-src', STRIPE);
		assert_source_in_directive(csp, 'connect-src', STRIPE);
		assert_source_in_directive(csp, 'frame-src', STRIPE);
		assert_source_not_in_directive(csp, 'img-src', STRIPE);
		assert_source_not_in_directive(csp, 'style-src', STRIPE);
	});

	test('nonce-based script execution', () => {
		const nonce = 'nonce-abc123' as any;

		const csp = create_csp_directives({
			extend: [{'script-src': [nonce]}],
		});

		assert_source_in_directive(csp, 'script-src', nonce);
		assert_source_in_directive(csp, 'script-src', 'self');
		assert_source_in_directive(csp, 'script-src', COLOR_SCHEME_SCRIPT_HASH);
	});

	test('hash-based inline scripts', () => {
		const custom_hash = 'sha256-customhashvalue123' as any;

		const csp = create_csp_directives({
			extend: [{'script-src': [custom_hash]}],
		});

		assert_source_in_directive(csp, 'script-src', custom_hash);
		assert_source_in_directive(csp, 'script-src', COLOR_SCHEME_SCRIPT_HASH);
	});
});

describe('progressive enhancement patterns', () => {
	test('start strict, layer in shared lib + app-specific extras', () => {
		const shared_lib = {'img-src': ['https://*.fuz.dev/' as any]};

		// Phase 1: defaults only
		const phase1 = create_csp_directives();
		assert.notInclude(phase1['img-src']! as Array<any>, 'https://*.fuz.dev/');

		// Phase 2: add shared lib
		const phase2 = create_csp_directives({
			extend: [shared_lib],
		});
		assert_source_in_directive(phase2, 'img-src', 'https://*.fuz.dev/');

		// Phase 3: add app-specific connect
		const phase3 = create_csp_directives({
			extend: [shared_lib, {'connect-src': [ANALYTICS as any]}],
		});
		assert_source_in_directive(phase3, 'img-src', 'https://*.fuz.dev/');
		assert_source_in_directive(phase3, 'connect-src', ANALYTICS);
	});
});

describe('multi-environment configurations', () => {
	test('production: strict (no unsafe-eval)', () => {
		const prod_csp = create_csp_directives();

		assert_source_not_in_directive(prod_csp, 'script-src', 'unsafe-eval' as any);
	});

	test('development: extended with unsafe-eval via extend', () => {
		const dev_csp = create_csp_directives({
			extend: [{'script-src': ['unsafe-eval' as any]}],
		});

		assert_source_in_directive(dev_csp, 'script-src', 'unsafe-eval' as any);
		// Defaults still present
		assert_source_in_directive(dev_csp, 'script-src', 'self');
	});
});

describe('common pitfalls and gotchas', () => {
	test("['none'] in directives blocks everything for that directive", () => {
		const csp = create_csp_directives({
			overrides: {
				'script-src': ['none'],
			},
		});

		assert.deepEqual(csp['script-src'], ['none']);
	});

	test('directives static replacement removes default COLOR_SCHEME_SCRIPT_HASH', () => {
		const csp = create_csp_directives({
			overrides: {
				'script-src': ['self'], // Forgot the hash
			},
		});

		assert_source_not_in_directive(csp, 'script-src', COLOR_SCHEME_SCRIPT_HASH);
	});

	test('to preserve defaults while adding sources, use extend', () => {
		const correct_csp = create_csp_directives({
			extend: [{'script-src': [ANALYTICS as any]}],
		});

		assert_source_in_directive(correct_csp, 'script-src', COLOR_SCHEME_SCRIPT_HASH);
		assert_source_in_directive(correct_csp, 'script-src', ANALYTICS);
	});
});

describe('maximum complexity scenario', () => {
	test('all options at once', () => {
		const nonce = 'nonce-runtime123' as any;
		const custom_hash = 'sha256-customscript' as any;

		const csp = create_csp_directives({
			// Custom base — wholesale replace
			replace_defaults: {
				'default-src': ['none'],
				'script-src': ['self', COLOR_SCHEME_SCRIPT_HASH],
				'style-src': ['self', 'unsafe-inline'],
				'img-src': ['self', 'data:'],
				'connect-src': ['self'],
				'font-src': ['self'],
				'frame-ancestors': ['self'],
			},
			// Layer trusted sources — explicit per directive
			extend: [
				// Shared lib
				{'img-src': ['https://*.fuz.dev/' as any]},
				// App-specific
				{
					'script-src': [ANALYTICS as any, CLOUDFLARE_CDN as any, nonce, custom_hash],
					'connect-src': [ANALYTICS as any],
					'style-src': [GOOGLE_FONTS as any, CLOUDFLARE_CDN as any],
					'font-src': [GOOGLE_FONTS as any],
				},
			],
			// Final pass — replace connect-src wholesale
			overrides: {
				'connect-src': ['self', ANALYTICS as any],
			},
		});

		// script-src: base + extend
		assert_source_in_directive(csp, 'script-src', 'self');
		assert_source_in_directive(csp, 'script-src', COLOR_SCHEME_SCRIPT_HASH);
		assert_source_in_directive(csp, 'script-src', ANALYTICS);
		assert_source_in_directive(csp, 'script-src', CLOUDFLARE_CDN);
		assert_source_in_directive(csp, 'script-src', nonce);
		assert_source_in_directive(csp, 'script-src', custom_hash);

		// connect-src: overrides wins over extend
		assert.deepEqual(csp['connect-src'], ['self', ANALYTICS]);

		// style-src: base + extend
		assert_source_in_directive(csp, 'style-src', GOOGLE_FONTS);
		assert_source_in_directive(csp, 'style-src', CLOUDFLARE_CDN);
		assert_source_in_directive(csp, 'style-src', 'unsafe-inline' as any);

		// img-src: base + extend
		assert_source_in_directive(csp, 'img-src', 'self');
		assert_source_in_directive(csp, 'img-src', 'data:' as any);
		assert_source_in_directive(csp, 'img-src', 'https://*.fuz.dev/');

		// font-src: base + extend
		assert_source_in_directive(csp, 'font-src', GOOGLE_FONTS);

		// default-src: base preserved
		assert.deepEqual(csp['default-src'], ['none']);
	});
});
