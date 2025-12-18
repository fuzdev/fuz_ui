import type {Plugin} from 'vite';
import {isAbsolute, join} from 'node:path';
import {pathToFileURL} from 'node:url';
import type {LibraryJson} from '@fuzdev/fuz_util/library_json.js';

export interface VitePluginWellKnownOptions {
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

/**
 * Vite plugin that publishes `package.json` and `source.json` to `.well-known/`.
 *
 * Requires a generated library.ts file (created by `library_gen` from `gro gen`).
 * The plugin imports this file and publishes its metadata to `.well-known/` for
 * both dev and production builds.
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import {sveltekit} from '@sveltejs/kit/vite';
 * import {vite_plugin_well_known} from '@fuzdev/fuz_ui/vite_plugin_well_known.js';
 *
 * export default {
 *   plugins: [sveltekit(), vite_plugin_well_known()],
 * };
 * ```
 */
export const vite_plugin_well_known = (options: VitePluginWellKnownOptions = {}): Plugin => {
	const {library_path = './src/routes/library.ts'} = options;

	const content: WellKnownContent = {
		package_json: null,
		source_json: null,
	};

	const load_library = async (): Promise<void> => {
		let library_json: LibraryJson | undefined;

		// Resolve path relative to project root (cwd), not plugin location
		const resolved_path = isAbsolute(library_path)
			? library_path
			: join(process.cwd(), library_path);

		// Convert to file:// URL for dynamic import
		const file_url = pathToFileURL(resolved_path).href;

		try {
			const module = await import(file_url);
			library_json = module.library_json;
		} catch (err) {
			throw new Error(
				`vite_plugin_well_known: failed to import library_json from "${library_path}"\n` +
					`Resolved to: ${resolved_path}\n` +
					`Make sure you've run \`gro gen\` to generate the library metadata.\n` +
					`Error: ${err}`,
			);
		}

		if (!library_json) {
			throw new Error(
				`vite_plugin_well_known: library_json is undefined in "${library_path}"\n` +
					`The file must export a \`library_json\` named export.`,
			);
		}

		// Serialize package.json
		try {
			content.package_json = JSON.stringify(library_json.package_json, null, 2) + '\n';
		} catch (err) {
			throw new Error(`vite_plugin_well_known: failed to serialize package.json: ${err}`);
		}

		// Serialize source.json
		try {
			content.source_json = JSON.stringify(library_json.source_json, null, 2) + '\n';
		} catch (err) {
			throw new Error(`vite_plugin_well_known: failed to serialize source.json: ${err}`);
		}
	};

	return {
		name: 'vite_plugin_well_known',

		async buildStart() {
			await load_library();
		},

		configureServer(server) {
			server.middlewares.use((req, res, next) => {
				const url = req.url;
				if (!url?.startsWith('/.well-known/')) {
					next();
					return;
				}

				// Strip query string if present
				const query_index = url.indexOf('?');
				const url_path = query_index === -1 ? url : url.slice(0, query_index);
				const path = url_path.slice('/.well-known/'.length);

				if (path === 'package.json' && content.package_json) {
					res.setHeader('Content-Type', 'application/json');
					res.setHeader('Cache-Control', 'no-store');
					res.end(content.package_json);
					return;
				}

				if (path === 'source.json' && content.source_json) {
					res.setHeader('Content-Type', 'application/json');
					res.setHeader('Cache-Control', 'no-store');
					res.end(content.source_json);
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
