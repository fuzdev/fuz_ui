import {test, assert, describe, vi, beforeEach, type Mock} from 'vitest';
import type {Plugin, ResolvedConfig} from 'vite';

import {
	vite_plugin_library_well_known,
	type VitePluginLibraryWellKnownOptions,
} from '$lib/vite_plugin_library_well_known.js';

/** Helper to initialize a plugin with configResolved */
const init_plugin = (plugin: Plugin, config: Partial<ResolvedConfig> = {}): Plugin => {
	const resolved_config = {
		root: '/test/project',
		base: '/',
		...config,
	} as ResolvedConfig;
	(plugin.configResolved as (config: ResolvedConfig) => void)(resolved_config);
	return plugin;
};

type MiddlewareHandler = (req: unknown, res: unknown, next: () => void) => Promise<void>;

/** Helper to capture the middleware handler from a plugin */
const capture_middleware = (plugin: Plugin): MiddlewareHandler => {
	let handler: MiddlewareHandler | null = null;
	const mock_server = {
		middlewares: {
			use: (h: MiddlewareHandler) => {
				handler = h;
			},
		},
	};
	(plugin.configureServer as (server: typeof mock_server) => void)(mock_server);
	return handler!;
};

describe('vite_plugin_library_well_known', () => {
	describe('plugin structure', () => {
		test('returns a plugin with correct name', () => {
			const plugin = vite_plugin_library_well_known();
			assert.strictEqual(plugin.name, 'vite_plugin_library_well_known');
		});

		test('has configResolved hook', () => {
			const plugin = vite_plugin_library_well_known();
			assert.isFunction(plugin.configResolved);
		});

		test('has buildStart hook', () => {
			const plugin = vite_plugin_library_well_known();
			assert.isFunction(plugin.buildStart);
		});

		test('has configureServer hook', () => {
			const plugin = vite_plugin_library_well_known();
			assert.isFunction(plugin.configureServer);
		});

		test('has generateBundle hook', () => {
			const plugin = vite_plugin_library_well_known();
			assert.isFunction(plugin.generateBundle);
		});
	});

	describe('options', () => {
		test('uses default library_path when not specified', () => {
			const plugin = vite_plugin_library_well_known();
			// We can't directly access the internal state, but we verify the plugin is created
			assert.isDefined(plugin);
		});

		test('accepts custom library_path', () => {
			const options: VitePluginLibraryWellKnownOptions = {
				library_path: './custom/path/library.json',
			};
			const plugin = vite_plugin_library_well_known(options);
			assert.isDefined(plugin);
		});
	});

	describe('configResolved', () => {
		test('captures root from config', () => {
			const plugin = vite_plugin_library_well_known();
			const mock_config = {root: '/test/project/root'};

			// Call configResolved - it should not throw
			assert.doesNotThrow(() => {
				(plugin.configResolved as (config: {root: string}) => void)(mock_config);
			});
		});
	});

	describe('middleware URL parsing', () => {
		// These tests verify the URL parsing logic indirectly through the middleware behavior

		let mock_res: {
			statusCode: number;
			headers: Record<string, string>;
			body: string;
			setHeader: Mock;
			end: Mock;
		};
		let next: Mock;

		beforeEach(() => {
			mock_res = {
				statusCode: 200,
				headers: {},
				body: '',
				setHeader: vi.fn((key: string, value: string) => {
					mock_res.headers[key] = value;
				}),
				end: vi.fn((body: string) => {
					mock_res.body = body;
				}),
			};
			next = vi.fn();
		});

		test('passes through non-.well-known requests', async () => {
			const plugin = init_plugin(vite_plugin_library_well_known());
			const handler = capture_middleware(plugin);

			await handler({url: '/api/data'}, mock_res, next);

			assert.strictEqual(next.mock.calls.length, 1);
		});

		test('passes through when url is undefined', async () => {
			const plugin = init_plugin(vite_plugin_library_well_known());
			const handler = capture_middleware(plugin);

			await handler({url: undefined}, mock_res, next);

			assert.strictEqual(next.mock.calls.length, 1);
		});

		test('handles URL with query string correctly', async () => {
			const plugin = init_plugin(vite_plugin_library_well_known());
			const handler = capture_middleware(plugin);

			await handler({url: '/.well-known/package.json?v=123'}, mock_res, next);

			assert.strictEqual(mock_res.statusCode, 503);
			assert.strictEqual(next.mock.calls.length, 0);
		});

		test('handles URL with hash correctly', async () => {
			const plugin = init_plugin(vite_plugin_library_well_known());
			const handler = capture_middleware(plugin);

			await handler({url: '/.well-known/package.json#section'}, mock_res, next);

			assert.strictEqual(mock_res.statusCode, 503);
			assert.strictEqual(next.mock.calls.length, 0);
		});

		test('returns 503 when library not loaded', async () => {
			const plugin = init_plugin(vite_plugin_library_well_known());
			const handler = capture_middleware(plugin);

			await handler({url: '/.well-known/package.json'}, mock_res, next);

			assert.strictEqual(mock_res.statusCode, 503);
			assert.strictEqual(mock_res.headers['Content-Type'], 'application/json');
			assert.strictEqual(mock_res.headers['Access-Control-Allow-Origin'], '*');
			assert.include(mock_res.body, 'Library not ready');
		});

		test('sets correct headers on 503 response', async () => {
			const plugin = init_plugin(vite_plugin_library_well_known());
			const handler = capture_middleware(plugin);

			await handler({url: '/.well-known/source.json'}, mock_res, next);

			assert.strictEqual(mock_res.headers['Content-Type'], 'application/json');
			assert.strictEqual(mock_res.headers['Cache-Control'], 'no-store');
			assert.strictEqual(mock_res.headers['Access-Control-Allow-Origin'], '*');
		});

		test('passes through unknown .well-known paths when library not loaded', async () => {
			const plugin = init_plugin(vite_plugin_library_well_known());
			const handler = capture_middleware(plugin);

			await handler({url: '/.well-known/unknown.json'}, mock_res, next);

			// Returns 503 because library isn't loaded, not because path is unknown
			assert.strictEqual(mock_res.statusCode, 503);
		});

		test('respects custom base path', async () => {
			const plugin = init_plugin(vite_plugin_library_well_known(), {base: '/my-app/'});
			const handler = capture_middleware(plugin);

			// Root .well-known should pass through (not matched)
			await handler({url: '/.well-known/package.json'}, mock_res, next);
			assert.strictEqual(next.mock.calls.length, 1);

			// Base-prefixed .well-known should match (returns 503 since not loaded)
			next.mockClear();
			mock_res.statusCode = 200;
			await handler({url: '/my-app/.well-known/package.json'}, mock_res, next);
			assert.strictEqual(mock_res.statusCode, 503);
			assert.strictEqual(next.mock.calls.length, 0);
		});

		test('handles nested base path', async () => {
			const plugin = init_plugin(vite_plugin_library_well_known(), {base: '/org/app/'});
			const handler = capture_middleware(plugin);

			await handler({url: '/org/app/.well-known/package.json'}, mock_res, next);

			assert.strictEqual(mock_res.statusCode, 503);
			assert.strictEqual(next.mock.calls.length, 0);
		});

		test('does not match partial base path', async () => {
			const plugin = init_plugin(vite_plugin_library_well_known(), {base: '/my-app/'});
			const handler = capture_middleware(plugin);

			// /my/.well-known should not match /my-app/.well-known
			await handler({url: '/my/.well-known/package.json'}, mock_res, next);

			assert.strictEqual(next.mock.calls.length, 1);
		});

		test('matches source.json path', async () => {
			const plugin = init_plugin(vite_plugin_library_well_known());
			const handler = capture_middleware(plugin);

			await handler({url: '/.well-known/source.json'}, mock_res, next);

			assert.strictEqual(mock_res.statusCode, 503);
			assert.strictEqual(next.mock.calls.length, 0);
		});
	});

	describe('generateBundle', () => {
		test('has generateBundle hook', () => {
			const plugin = vite_plugin_library_well_known();
			assert.isFunction(plugin.generateBundle);
		});

		test('does not throw when content not loaded', () => {
			const plugin = init_plugin(vite_plugin_library_well_known());
			const emitFile = vi.fn();
			const context = {emitFile};

			// Should not throw - just doesn't emit anything
			assert.doesNotThrow(() => {
				(plugin.generateBundle as any).call(context);
			});
			assert.strictEqual(emitFile.mock.calls.length, 0);
		});
	});
});

describe('URL constructor behavior', () => {
	// Documents URL API behavior we rely on - kept as reference

	test('strips query and hash from pathname', () => {
		const {pathname} = new URL('/.well-known/source.json?v=1#top', 'http://localhost');
		assert.strictEqual(pathname, '/.well-known/source.json');
	});

	test('preserves percent-encoded characters', () => {
		// URL constructor does NOT decode percent-encoded characters in pathname
		const {pathname} = new URL('/.well-known/package%2Ejson', 'http://localhost');
		assert.strictEqual(pathname, '/.well-known/package%2Ejson');
	});
});
