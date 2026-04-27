import {test, assert, describe} from 'vitest';
import type {KitConfig} from '@sveltejs/kit';
import type {Defined} from '@fuzdev/fuz_util/types.js';

import {create_csp_directives, type CspDirectives, COLOR_SCHEME_SCRIPT_HASH} from '$lib/csp.js';

describe('SvelteKit type compatibility', () => {
	test('CspDirectives is assignable to SvelteKit CSP directives type', () => {
		type KitCspDirectives = Defined<KitConfig['csp']>['directives'];

		const csp: CspDirectives = create_csp_directives();
		const kit_csp: KitCspDirectives = csp;

		assert.ok(kit_csp);
		assert.ok('script-src' in kit_csp);
	});

	test('individual directive types match SvelteKit expectations', () => {
		const csp = create_csp_directives();

		assert.ok(Array.isArray(csp['script-src']));
		assert.ok(Array.isArray(csp['style-src']));
		assert.ok(Array.isArray(csp['img-src']));

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
	test('typical dev config: HMR needs unsafe-eval via extend', () => {
		const csp = create_csp_directives({
			extend: [{'script-src': ['unsafe-eval' as any]}],
		});

		assert.ok(csp['script-src']!.includes('unsafe-eval' as any));
		assert.ok(csp['script-src']!.includes('self'));
	});

	test('typical production config: strict defaults', () => {
		const csp = create_csp_directives();

		assert.ok(!csp['script-src']!.includes('unsafe-eval' as any));
		assert.ok(!csp['script-src']!.includes('unsafe-inline' as any));
		assert.ok(csp['script-src']!.includes('self'));
	});

	test('CDN assets — explicit per-directive', () => {
		const cdn = 'blog.fuz.dev';

		const csp = create_csp_directives({
			extend: [
				{
					'script-src': [cdn as any],
					'style-src': [cdn as any],
				},
			],
		});

		assert.ok(csp['script-src']!.includes(cdn as any));
		assert.ok(csp['style-src']!.includes(cdn as any));

		// Does NOT auto-leak into other directives
		assert.ok(!csp['img-src']!.includes(cdn as any));
		assert.ok(!csp['font-src']!.includes(cdn as any));
	});

	test('Google Fonts — style + font directives only', () => {
		const csp = create_csp_directives({
			extend: [
				{
					'style-src': ['fonts.googleapis.com' as any],
					'font-src': ['fonts.gstatic.com' as any],
				},
			],
		});

		assert.ok(csp['style-src']!.includes('fonts.googleapis.com' as any));
		assert.ok(csp['font-src']!.includes('fonts.gstatic.com' as any));
	});

	test('analytics — script + connect directives only', () => {
		const analytics = 'analytics.fuz.dev';

		const csp = create_csp_directives({
			extend: [
				{
					'script-src': [analytics as any],
					'connect-src': [analytics as any],
				},
			],
		});

		assert.ok(csp['script-src']!.includes(analytics as any));
		assert.ok(csp['connect-src']!.includes(analytics as any));
	});
});

describe('SvelteKit SSR considerations', () => {
	test('inline styles for SSR with unsafe-inline', () => {
		const csp = create_csp_directives();

		assert.ok(csp['style-src']!.includes('unsafe-inline' as any));
	});

	test('script hashes for inline scripts', () => {
		const csp = create_csp_directives();

		assert.ok(csp['script-src']!.includes(COLOR_SCHEME_SCRIPT_HASH));
	});

	test('self for SSR-generated scripts', () => {
		const csp = create_csp_directives();
		assert.ok(csp['script-src']!.includes('self'));
	});

	test('data URIs for SSR-generated images', () => {
		const csp = create_csp_directives();
		assert.ok(csp['img-src']!.includes('data:' as any));
	});
});

describe('SvelteKit adapter configurations', () => {
	test('adapter-vercel: Vercel Analytics', () => {
		const csp = create_csp_directives({
			extend: [
				{
					'script-src': ['va.vercel-scripts.com' as any],
				},
			],
		});

		assert.ok(csp['script-src']!.includes('va.vercel-scripts.com' as any));
	});

	test('adapter-static: tighter connect-src via overrides', () => {
		const csp = create_csp_directives({
			overrides: {
				'connect-src': ['self'],
			},
		});

		assert.deepEqual(csp['connect-src'], ['self']);
	});
});

describe('SvelteKit reporting endpoint', () => {
	test('report-to via base', () => {
		const csp = create_csp_directives({
			replace_defaults: {
				'report-to': ['csp-endpoint'],
			},
		});

		assert.deepEqual(csp['report-to'], ['csp-endpoint']);
	});

	test('report-to via overrides', () => {
		const csp = create_csp_directives({
			overrides: {
				'report-to': ['csp-violations'],
			},
		});

		assert.deepEqual(csp['report-to'], ['csp-violations']);
	});
});

describe('SvelteKit form handling', () => {
	test('form-action defaults to self', () => {
		const csp = create_csp_directives();
		assert.deepEqual(csp['form-action'], ['self']);
	});

	test('form-action extended for external API', () => {
		const api_endpoint = 'template.fuz.dev';

		const csp = create_csp_directives({
			extend: [{'form-action': [api_endpoint as any]}],
		});

		assert.ok(csp['form-action']!.includes(api_endpoint as any));
	});
});

describe('SvelteKit WebSocket support', () => {
	test('connect-src includes self for WebSocket', () => {
		const csp = create_csp_directives();
		assert.ok(csp['connect-src']!.includes('self'));
	});

	test('connect-src extended for external WebSocket server', () => {
		const ws_server = 'wss://ws.fuz.dev';

		const csp = create_csp_directives({
			extend: [{'connect-src': [ws_server as any]}],
		});

		assert.ok(csp['connect-src']!.includes(ws_server as any));
	});
});

describe('SvelteKit iframe embedding', () => {
	test('frame-ancestors restricts embedding by default', () => {
		const csp = create_csp_directives();
		assert.deepEqual(csp['frame-ancestors'], ['self']);
	});

	test('frame-ancestors extended for widget use case', () => {
		const parent_site = 'parent.fuz.dev';

		const csp = create_csp_directives({
			extend: [{'frame-ancestors': [parent_site as any]}],
		});

		assert.ok(csp['frame-ancestors']!.includes(parent_site as any));
	});
});

describe('SvelteKit conditional configuration', () => {
	test('conditional extend layer — production omits dev-only sources', () => {
		// Pattern: build the extend array based on env, e.g. `is_dev ? [...] : []`.
		const prod_csp = create_csp_directives({extend: []});
		assert.ok(!prod_csp['script-src']!.includes('unsafe-eval' as any));

		const dev_csp = create_csp_directives({
			extend: [{'script-src': ['unsafe-eval' as any]}],
		});
		assert.ok(dev_csp['script-src']!.includes('unsafe-eval' as any));
	});

	test('conditional analytics in production', () => {
		const analytics = 'analytics.fuz.dev';

		const prod_csp = create_csp_directives({
			extend: [{'script-src': [analytics as any]}],
		});
		assert.ok(prod_csp['script-src']!.includes(analytics as any));

		const non_prod_csp = create_csp_directives({extend: []});
		assert.ok(!non_prod_csp['script-src']!.includes(analytics as any));
	});
});

describe('SvelteKit worker support', () => {
	test('worker-src defaults', () => {
		const csp = create_csp_directives();

		assert.ok(csp['worker-src']!.includes('self'));
		assert.ok(csp['worker-src']!.includes('blob:' as any));
	});

	test('worker-src extended with external worker script', () => {
		const worker_cdn = 'workers.cdn.com';

		const csp = create_csp_directives({
			extend: [{'worker-src': [worker_cdn as any]}],
		});

		assert.ok(csp['worker-src']!.includes(worker_cdn as any));
	});
});

describe('SvelteKit manifest support', () => {
	test('manifest-src for PWA manifest', () => {
		const csp = create_csp_directives();
		assert.deepEqual(csp['manifest-src'], ['self']);
	});

	test('manifest-src extended with CDN', () => {
		const cdn = 'blog.fuz.dev';

		const csp = create_csp_directives({
			extend: [{'manifest-src': [cdn as any]}],
		});

		assert.ok(csp['manifest-src']!.includes(cdn as any));
	});
});

describe('SvelteKit upgrade-insecure-requests', () => {
	test('enabled by default', () => {
		const csp = create_csp_directives();
		assert.strictEqual(csp['upgrade-insecure-requests'], true);
	});

	test('can disable via overrides', () => {
		const csp = create_csp_directives({
			overrides: {'upgrade-insecure-requests': false},
		});

		assert.strictEqual(csp['upgrade-insecure-requests'], false);
	});
});
