import type {Plugin} from 'vite';
import type {ServerResponse} from 'node:http';
import {isAbsolute, join} from 'node:path';
import {pathToFileURL} from 'node:url';
import type {LibraryJson} from '@fuzdev/fuz_util/library_json.js';

export interface VitePluginLibraryWellKnownOptions {
	/**
	 * Path to the library.ts file (relative to vite.config.ts).
	 * @default './src/routes/library.ts'
	 */
	library_path?: string;
}

interface WellKnownContent {
	package_json: string | null;
	source_json: string | null;
}

const respond_json = (res: ServerResponse, body: string): void => {
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Cache-Control', 'no-store');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.end(body);
};

/**
 * Vite plugin that publishes `package.json` and `source.json` to `.well-known/`.
 *
 * Requires a generated library.ts file (created by `library_gen` from `gro gen`).
 * The plugin imports this file and publishes its metadata to `.well-known/` for
 * both dev and production builds.
 *
 * Note: This plugin respects SvelteKit's `base` path configuration, so `.well-known/`
 * will be served at `{base}.well-known/` (e.g., `/my-app/.well-known/`). This deviates
 * from RFC 8615 which specifies `.well-known` should be at the domain root. This tradeoff
 * allows the plugin to work correctly when apps are deployed to non-root paths.
 *
 * Note: CORS headers are only set for the dev server. For production, configure
 * CORS at the server level (nginx, Caddy, etc.) if cross-origin access is needed.
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import {defineConfig} from 'vite';
 * import {sveltekit} from '@sveltejs/kit/vite';
 * import {vite_plugin_library_well_known} from '@fuzdev/fuz_ui/vite_plugin_library_well_known.js';
 *
 * export default defineConfig({
 *   plugins: [sveltekit(), vite_plugin_library_well_known()],
 * });
 * ```
 */
export const vite_plugin_library_well_known = (
	options: VitePluginLibraryWellKnownOptions = {},
): Plugin => {
	const {library_path = './src/routes/library.ts'} = options;

	const content: WellKnownContent = {
		package_json: null,
		source_json: null,
	};

	// Set by configResolved
	let root: string;
	let base: string; // e.g., '/' or '/my-app/'

	// Promise that resolves when library is loaded, used by middleware to avoid race condition
	let ready_promise: Promise<void> | null = null;

	const load_library = async (): Promise<void> => {
		let library_json: LibraryJson | undefined;

		// Resolve path relative to project root
		const resolved_path = isAbsolute(library_path) ? library_path : join(root, library_path);

		// Convert to file:// URL for dynamic import
		const file_url = pathToFileURL(resolved_path).href;

		try {
			const module = await import(file_url);
			library_json = module.library_json;
		} catch (err) {
			throw new Error(
				`vite_plugin_library_well_known: failed to import library_json from "${library_path}"\n` +
					`Resolved to: ${resolved_path}\n` +
					`Make sure you've run \`gro gen\` to generate the library metadata.\n` +
					`Error: ${err}`,
			);
		}

		if (!library_json) {
			throw new Error(
				`vite_plugin_library_well_known: library_json is undefined in "${library_path}"\n` +
					`The file must export a \`library_json\` named export.`,
			);
		}

		content.package_json = JSON.stringify(library_json.package_json, null, 2) + '\n';
		content.source_json = JSON.stringify(library_json.source_json, null, 2) + '\n';
	};

	return {
		name: 'vite_plugin_library_well_known',

		configResolved(config) {
			root = config.root;
			base = config.base; // e.g., '/' or '/my-app/'
		},

		async buildStart() {
			ready_promise = load_library();
			await ready_promise;
		},

		configureServer(server) {
			// TODO: add HMR support to reload library.ts when it changes
			const well_known_prefix = `${base}.well-known/`;

			server.middlewares.use(async (req, res, next) => {
				if (!req.url) {
					next();
					return;
				}

				const {pathname} = new URL(req.url, 'http://localhost');
				if (!pathname.startsWith(well_known_prefix)) {
					next();
					return;
				}

				// Wait for library to load before serving
				try {
					if (!ready_promise) throw new Error('not initialized');
					await ready_promise;
				} catch {
					res.statusCode = 503;
					respond_json(res, JSON.stringify({error: 'Library not ready'}));
					return;
				}

				const path = pathname.slice(well_known_prefix.length);

				if (path === 'package.json' && content.package_json) {
					respond_json(res, content.package_json);
					return;
				}

				if (path === 'source.json' && content.source_json) {
					respond_json(res, content.source_json);
					return;
				}

				next();
			});
		},

		generateBundle() {
			if (content.package_json) {
				this.emitFile({
					type: 'asset',
					fileName: '.well-known/package.json',
					source: content.package_json,
				});
			}

			if (content.source_json) {
				this.emitFile({
					type: 'asset',
					fileName: '.well-known/source.json',
					source: content.source_json,
				});
			}
		},
	};
};
