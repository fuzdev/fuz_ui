import {test, assert, describe} from 'vitest';
import type {KitConfig} from '@sveltejs/kit';
import type {Defined} from '@fuzdev/fuz_util/types.js';

import {
	create_csp_directives,
	type CspDirectives,
	type CspDirective,
	COLOR_SCHEME_SCRIPT_HASH,
} from '$lib/csp.js';

describe('SvelteKit type compatibility', () => {
	test('CspDirectives is assignable to SvelteKit CSP directives type', () => {
		type KitCspDirectives = Defined<KitConfig['csp']>['directives'];

		// This should compile without errors
		const csp: CspDirectives = create_csp_directives();
		const kit_csp: KitCspDirectives = csp;

		// Verify assignment worked
		assert.ok(kit_csp);
		assert.ok('script-src' in kit_csp);
	});

	test('individual directive types match SvelteKit expectations', () => {
		const csp = create_csp_directives();

		// Array directives
		assert.ok(Array.isArray(csp['script-src']));
		assert.ok(Array.isArray(csp['style-src']));
		assert.ok(Array.isArray(csp['img-src']));

		// Boolean directives
		assert.strictEqual(typeof csp['upgrade-insecure-requests'], 'boolean');
	});

	test('empty CSP is valid for SvelteKit', () => {
		type KitCspDirectives = Defined<KitConfig['csp']>['directives'];

		const empty_csp: CspDirectives = {};
		const kit_csp: KitCspDirectives = empty_csp;

		assert.deepEqual(kit_csp, {});
	});
});

describe('SvelteKit config patterns', () => {
	test('typical SvelteKit development config', () => {
		// Dev mode often needs unsafe-eval for HMR
		const csp = create_csp_directives({
			directives: {
				'script-src': (value) => [...value, 'unsafe-eval' as any],
			},
		});

		assert.ok(csp['script-src']!.includes('unsafe-eval' as any));
		assert.ok(csp['script-src']!.includes('self'));
	});

	test('typical SvelteKit production config', () => {
		// Production should be strict
		const csp = create_csp_directives({
			// Use defaults (no unsafe-eval, no unsafe-inline for scripts)
		});

		assert.ok(!csp['script-src']!.includes('unsafe-eval' as any));
		assert.ok(!csp['script-src']!.includes('unsafe-inline' as any));
		assert.ok(csp['script-src']!.includes('self'));
	});

	test('SvelteKit with CDN assets', () => {
		const cdn = 'blog.fuz.dev';

		const csp = create_csp_directives({
			trusted_sources: [
				{
					source: cdn as any,
					trust: 'high',
					directives: ['script-src', 'style-src'],
				},
			],
		});

		// CDN should be in specified directives
		assert.ok(csp['script-src']!.includes(cdn as any));
		assert.ok(csp['style-src']!.includes(cdn as any));

		// And also in other directives due to high trust
		assert.ok(csp['img-src']!.includes(cdn as any));
		assert.ok(csp['font-src']!.includes(cdn as any));
	});

	test('SvelteKit with external fonts (Google Fonts)', () => {
		const csp = create_csp_directives({
			trusted_sources: [
				{
					source: 'fonts.googleapis.com' as any,
					directives: ['style-src' as CspDirective],
				},
				{
					source: 'fonts.gstatic.com' as any,
					directives: ['font-src' as CspDirective],
				},
			],
		});

		assert.ok(csp['style-src']!.includes('fonts.googleapis.com' as any));
		assert.ok(csp['font-src']!.includes('fonts.gstatic.com' as any));
	});

	test('SvelteKit with analytics', () => {
		const analytics = 'analytics.fuz.dev';

		const csp = create_csp_directives({
			trusted_sources: [
				{
					source: analytics as any,
					trust: 'high',
					directives: ['script-src' as CspDirective, 'connect-src' as CspDirective],
				},
			],
		});

		// Analytics needs both script and connect
		assert.ok(csp['script-src']!.includes(analytics as any));
		assert.ok(csp['connect-src']!.includes(analytics as any));
	});
});

describe('SvelteKit SSR considerations', () => {
	test('inline styles for SSR with unsafe-inline', () => {
		const csp = create_csp_directives();

		// SvelteKit uses inline styles, so unsafe-inline is in style-src by default
		assert.ok(csp['style-src']!.includes('unsafe-inline' as any));
	});

	test('script hashes for inline scripts', () => {
		const csp = create_csp_directives();

		// Color scheme hash is included by default
		assert.ok(csp['script-src']!.includes(COLOR_SCHEME_SCRIPT_HASH));
	});

	test('self for SSR-generated scripts', () => {
		const csp = create_csp_directives();

		// self should always be in script-src for SvelteKit
		assert.ok(csp['script-src']!.includes('self'));
	});

	test('data URIs for SSR-generated images', () => {
		const csp = create_csp_directives();

		// data: URIs often used for small images
		assert.ok(csp['img-src']!.includes('data:' as any));
	});
});

describe('SvelteKit adapter configurations', () => {
	test('adapter-node: basic configuration', () => {
		// Node adapter runs in a controlled environment
		const csp = create_csp_directives({
			// Can use strict defaults
		});

		assert.ok(csp['script-src']!.includes('self'));
		assert.ok(!csp['script-src']!.includes('unsafe-eval' as any));
	});

	test('adapter-vercel: with Vercel Analytics', () => {
		const csp = create_csp_directives({
			trusted_sources: [
				{
					source: 'va.vercel-scripts.com' as any,
					trust: 'high',
				},
			],
		});

		assert.ok(csp['script-src']!.includes('va.vercel-scripts.com' as any));
	});

	test('adapter-static: prerendered with strict CSP', () => {
		// Static adapter can use very strict CSP
		const csp = create_csp_directives({
			value_defaults: {
				// Can be even stricter for static sites
				'connect-src': ['self'],
			},
		});

		assert.deepEqual(csp['connect-src'], ['self']);
	});
});

describe('SvelteKit CSP modes', () => {
	test('report-to mode (modern)', () => {
		const csp = create_csp_directives({
			value_defaults: {
				'report-to': ['csp-endpoint' as any],
			},
		});

		assert.deepEqual(csp['report-to'], ['csp-endpoint']);
	});

	test('report-only mode via SvelteKit config', () => {
		// This would be configured in svelte.config.js as mode: 'report-only'
		// The directives themselves are the same
		const csp = create_csp_directives();

		// Directives are identical, mode is set separately in SvelteKit config
		assert.ok(csp['script-src']);
	});

	test('enabling reporting endpoint', () => {
		const csp = create_csp_directives({
			value_defaults: {
				'report-to': ['csp-violations' as any],
			},
		});

		// report-to should be set for violation reporting
		assert.ok(csp['report-to']);
		assert.ok(csp['report-to'].includes('csp-violations' as any));
	});
});

describe('SvelteKit form handling', () => {
	test('form-action for same-origin forms', () => {
		const csp = create_csp_directives();

		// Forms should be able to submit to same origin
		assert.deepEqual(csp['form-action'], ['self']);
	});

	test('form-action with external API', () => {
		const api_endpoint = 'template.fuz.dev';

		const csp = create_csp_directives({
			trusted_sources: [
				{
					source: api_endpoint as any,
					trust: 'medium',
				},
			],
		});

		// External API should be allowed for forms with medium trust
		assert.ok(csp['form-action']!.includes(api_endpoint as any));
	});
});

describe('SvelteKit WebSocket support', () => {
	test('connect-src includes self for WebSocket', () => {
		const csp = create_csp_directives();

		// WebSockets need connect-src
		assert.ok(csp['connect-src']!.includes('self'));
	});

	test('connect-src with external WebSocket server', () => {
		const ws_server = 'wss://ws.fuz.dev';

		const csp = create_csp_directives({
			trusted_sources: [
				{
					source: ws_server as any,
					trust: 'medium',
				},
			],
		});

		assert.ok(csp['connect-src']!.includes(ws_server as any));
	});
});

describe('SvelteKit iframe embedding', () => {
	test('frame-ancestors restricts embedding by default', () => {
		const csp = create_csp_directives();

		// Only allow embedding from same origin by default
		assert.deepEqual(csp['frame-ancestors'], ['self']);
	});

	test('frame-ancestors for widget use case', () => {
		const parent_site = 'parent.fuz.dev';

		const csp = create_csp_directives({
			trusted_sources: [
				{
					source: parent_site as any,
					trust: 'medium',
					directives: ['frame-ancestors' as CspDirective],
				},
			],
		});

		// Allow embedding from specific parent
		assert.ok(csp['frame-ancestors']!.includes(parent_site as any));
	});
});

describe('SvelteKit environment variables', () => {
	test('dev vs prod configuration', () => {
		const is_dev = false as boolean; // Simulating environment check

		const csp = create_csp_directives({
			directives: {
				'script-src': (value) => {
					// In dev, add unsafe-eval for HMR
					return is_dev ? [...value, 'unsafe-eval' as any] : value;
				},
			},
		});

		// Production should not have unsafe-eval
		assert.ok(!csp['script-src']!.includes('unsafe-eval' as any));
	});

	test('conditional analytics in production', () => {
		const is_prod = true as boolean; // Simulating environment check
		const analytics = 'analytics.fuz.dev';

		const csp = create_csp_directives({
			trusted_sources: is_prod
				? [
						{
							source: analytics as any,
							trust: 'high',
						},
					]
				: [],
		});

		// Analytics should be present in prod
		assert.ok(csp['script-src']!.includes(analytics as any));
	});
});

describe('SvelteKit worker support', () => {
	test('worker-src for Web Workers', () => {
		const csp = create_csp_directives();

		// Workers should be allowed from self and blob
		assert.ok(csp['worker-src']!.includes('self'));
		assert.ok(csp['worker-src']!.includes('blob:' as any));
	});

	test('worker-src with external worker script', () => {
		const worker_cdn = 'workers.cdn.com';

		const csp = create_csp_directives({
			trusted_sources: [
				{
					source: worker_cdn as any,
					trust: 'medium',
					directives: ['worker-src' as CspDirective],
				},
			],
		});

		assert.ok(csp['worker-src']!.includes(worker_cdn as any));
	});
});

describe('SvelteKit manifest support', () => {
	test('manifest-src for PWA manifest', () => {
		const csp = create_csp_directives();

		// Manifest should be from self
		assert.deepEqual(csp['manifest-src'], ['self']);
	});

	test('manifest-src with CDN', () => {
		const cdn = 'blog.fuz.dev';

		const csp = create_csp_directives({
			value_defaults: {
				'manifest-src': ['self', cdn as any],
			},
		});

		assert.ok(csp['manifest-src']!.includes(cdn as any));
	});
});

describe('SvelteKit upgrade-insecure-requests', () => {
	test('upgrade-insecure-requests enabled by default', () => {
		const csp = create_csp_directives();

		// Should upgrade HTTP to HTTPS
		assert.strictEqual(csp['upgrade-insecure-requests'], true);
	});

	test('can disable upgrade-insecure-requests for local dev', () => {
		const csp = create_csp_directives({
			value_defaults: {
				'upgrade-insecure-requests': false,
			},
		});

		assert.strictEqual(csp['upgrade-insecure-requests'], false);
	});
});
