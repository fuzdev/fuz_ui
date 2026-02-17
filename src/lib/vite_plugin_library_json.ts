/**
 * Vite plugin for library metadata generation.
 *
 * Generates library metadata via virtual module as an alternative to the
 * Gro genfile (`library.gen.ts`). Scans source files from the filesystem and
 * calls `library_generate()` directly.
 *
 * Consumers import from `virtual:library.json`:
 *
 * ```ts
 * import {library_json} from 'virtual:library.json';
 * ```
 *
 * For TypeScript support, add to your `app.d.ts`:
 *
 * ```ts
 * /// <reference types="@fuzdev/fuz_ui/virtual_library_json.js" />
 * ```
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import {vite_plugin_library_json} from '@fuzdev/fuz_ui/vite_plugin_library_json.js';
 * import {library_throw_on_duplicates} from '@fuzdev/fuz_ui/library_generate.js';
 *
 * export default defineConfig({
 *   plugins: [
 *     vite_plugin_library_json({on_duplicates: library_throw_on_duplicates}),
 *     sveltekit(),
 *   ],
 * });
 * ```
 *
 * @module
 */

import type {Plugin, ViteDevServer} from 'vite';
import {readdir, readFile} from 'node:fs/promises';
import {join} from 'node:path';
import type {PackageJson} from '@fuzdev/fuz_util/package_json.js';

import {
	type SourceFileInfo,
	type ModuleSourceOptions,
	type ModuleSourcePartial,
	module_create_source_options,
	module_is_source,
} from './module_helpers.js';
import {library_collect_source_files} from './library_pipeline.js';
import {library_generate, type OnDuplicatesCallback} from './library_generate.js';

const VIRTUAL_ID = 'virtual:library.json';
const RESOLVED_VIRTUAL_ID = '\0virtual:library.json';

/**
 * Debounce delay for regeneration in dev mode.
 * Higher than fuz_css (10ms) because library generation involves
 * full TypeScript analysis which is much heavier.
 */
const HMR_DEBOUNCE_MS = 100;

/** Options for the library JSON Vite plugin. */
export interface VitePluginLibraryJsonOptions {
	/**
	 * Module source options for filtering and path extraction.
	 *
	 * Can provide full `ModuleSourceOptions` or partial options that will be
	 * merged with defaults. The `project_root` is automatically set from
	 * Vite's resolved config root if not provided.
	 */
	source?: ModuleSourceOptions | Partial<ModuleSourcePartial>;
	/**
	 * Callback invoked when duplicate declaration names are found.
	 *
	 * Use `library_throw_on_duplicates` for strict flat namespace enforcement.
	 */
	on_duplicates?: OnDuplicatesCallback;
	/**
	 * Path to package.json, relative to project root.
	 * @default 'package.json'
	 */
	package_json_path?: string;
}

/**
 * Collect source files from the filesystem.
 *
 * Scans configured source directories recursively, reads file contents,
 * and filters through `module_is_source`. Returns `SourceFileInfo[]` without
 * dependency/dependent info (these are optional and only available via Gro's filer).
 *
 * @param source_options Module source options for directory scanning and filtering.
 * @param log Optional logger for status messages.
 */
export const library_collect_source_files_from_fs = async (
	source_options: ModuleSourceOptions,
	log?: {info: (...args: Array<unknown>) => void; warn: (...args: Array<unknown>) => void},
): Promise<Array<SourceFileInfo>> => {
	const raw_files: Array<SourceFileInfo> = [];

	for (const source_path of source_options.source_paths) {
		const dir = join(source_options.project_root, source_path);

		let entries: Array<string>;
		try {
			entries = await readdir(dir, {recursive: true}); // eslint-disable-line no-await-in-loop
		} catch (error) {
			log?.warn(`Could not read source directory ${dir}:`, error);
			continue;
		}

		for (const relative_entry of entries) {
			const absolute_path = join(dir, relative_entry);
			if (!module_is_source(absolute_path, source_options)) continue;
			const content = await readFile(absolute_path, 'utf-8'); // eslint-disable-line no-await-in-loop
			raw_files.push({id: absolute_path, content});
		}
	}

	log?.info(`read ${raw_files.length} source files from filesystem`);
	return library_collect_source_files(raw_files, source_options);
};

/**
 * Creates the library JSON Vite plugin.
 *
 * Generates library metadata by scanning source files from the filesystem
 * and serves it via the `virtual:library.json` virtual module.
 * In dev mode, watches source files and regenerates on changes.
 */
export const vite_plugin_library_json = (options: VitePluginLibraryJsonOptions = {}): Plugin => {
	const {on_duplicates, package_json_path = 'package.json'} = options;

	let project_root: string;
	let source_options: ModuleSourceOptions;
	let resolved_package_json_path: string;
	let server: ViteDevServer | null = null;
	let generated_module: string | null = null;
	let hmr_timeout: ReturnType<typeof setTimeout> | null = null;

	const generate = async (): Promise<string> => {
		const package_json: PackageJson = JSON.parse(
			await readFile(resolved_package_json_path, 'utf-8'),
		);
		const source_files = await library_collect_source_files_from_fs(source_options);
		const result = library_generate({
			source_files,
			package_json,
			source_options,
			on_duplicates,
		});
		return `export const library_json = ${result.json_content};`;
	};

	return {
		name: 'vite-plugin-library-json',
		enforce: 'pre',

		configResolved(config) {
			project_root = config.root;
			source_options =
				options.source && 'project_root' in options.source
					? options.source
					: module_create_source_options(project_root, options.source);
			resolved_package_json_path = join(project_root, package_json_path);
		},

		async buildStart() {
			generated_module = await generate();
		},

		resolveId(id) {
			if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID;
			return undefined;
		},

		load(id) {
			if (id === RESOLVED_VIRTUAL_ID) return generated_module;
			return undefined;
		},

		configureServer(dev_server) {
			server = dev_server;

			const schedule_regenerate = (file: string): void => {
				if (!module_is_source(file, source_options)) return;
				if (hmr_timeout) clearTimeout(hmr_timeout);
				hmr_timeout = setTimeout(async () => {
					hmr_timeout = null;
					try {
						const new_module = await generate();
						if (new_module === generated_module) return;
						generated_module = new_module;
						const mod = server!.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID);
						if (mod) {
							server!.moduleGraph.invalidateModule(mod);
							const hot = server?.hot ?? server!.ws;
							hot.send({type: 'full-reload'});
						}
					} catch (error) {
						dev_server.config.logger.error(`[library_json] regeneration failed: ${error}`);
					}
				}, HMR_DEBOUNCE_MS);
			};

			dev_server.watcher.on('add', schedule_regenerate);
			dev_server.watcher.on('change', schedule_regenerate);
			dev_server.watcher.on('unlink', schedule_regenerate);

			dev_server.httpServer?.on('close', () => {
				if (hmr_timeout) {
					clearTimeout(hmr_timeout);
					hmr_timeout = null;
				}
			});
		},
	};
};
