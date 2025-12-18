/**
 * Library metadata generator helper.
 *
 * Generates package_json and source_json with rich metadata:
 * - JSDoc/TSDoc comments with full tag support
 * - Full type signatures
 * - Source code locations
 * - Parameter information with descriptions and defaults
 * - Return value documentation
 * - Usage examples
 * - Dependency graphs
 * - Svelte component props
 *
 * @see @fuzdev/fuz_util/source_json.js for type definitions
 * @see src/lib/library_gen_helpers.ts for buildtime-only helpers
 * @see src/lib/tsdoc_helpers.ts for JSDoc/TSDoc parsing
 * @see src/lib/ts_helpers.ts for TypeScript analysis
 * @see src/lib/svelte_helpers.ts for Svelte component analysis
 */

import type {Gen} from '@ryanatkn/gro';
import {load_package_json} from '@ryanatkn/gro/package_json.js';
import type {SourceJson} from '@fuzdev/fuz_util/source_json.js';

import {ts_create_program, type ReExportInfo} from './ts_helpers.js';
import {module_extract_path, module_is_svelte} from './module_helpers.js';
import {
	library_gen_collect_source_files,
	library_gen_sort_modules,
	library_gen_validate_no_duplicates,
	library_gen_generate_ts,
	library_gen_analyze_svelte_file,
	library_gen_analyze_typescript_file,
} from './library_gen_helpers.js';

export interface LibraryGenOptions {
	filename?: string;
}

/**
 * Creates a Gen object for generating library metadata with full TypeScript analysis.
 *
 * Usage in a `.gen.ts` file:
 *
 * ```ts
 * import {library_gen} from '@fuzdev/fuz_ui/library_gen.js';
 *
 * export const gen = library_gen();
 * ```
 */
export const library_gen = (options?: LibraryGenOptions): Gen => {
	return {
		generate: async ({log, filer}) => {
			log.info('generating library metadata with full TypeScript analysis...');

			// Ensure filer is initialized
			await filer.init();

			// Read package.json
			const package_json = await load_package_json();

			// Create TypeScript program
			const program = ts_create_program(log);
			if (!program) {
				throw new Error('Failed to create TypeScript program - cannot generate library metadata');
			}

			const checker = program.getTypeChecker();

			// Collect source files from filer
			const source_disknodes = library_gen_collect_source_files(filer.files, log);

			// Build source_json with array-based modules
			// Phase 1: Analyze all modules and collect re-exports
			const source_json: SourceJson = {
				name: package_json.name,
				version: package_json.version,
				modules: [],
			};

			// Collect all re-exports: Map<declaration_name, Set<re_exporting_module_path>>
			// The Set tracks which modules re-export each declaration
			const all_re_exports: Array<{re_exporting_module: string; re_export: ReExportInfo}> = [];

			for (const disknode of source_disknodes) {
				const source_id = disknode.id;
				const module_path = module_extract_path(source_id);
				const is_svelte = module_is_svelte(module_path);

				// Handle Svelte files separately (before trying to get TypeScript source file)
				if (is_svelte) {
					const mod = library_gen_analyze_svelte_file(disknode, module_path, checker);
					source_json.modules!.push(mod);
				} else {
					// For TypeScript/JS files, get the source file from the program
					const source_file = program.getSourceFile(source_id);
					if (!source_file) {
						log.warn(`Could not get source file: ${source_id}`);
						continue;
					}

					// May throw, which we want to see
					const {module: mod, re_exports} = library_gen_analyze_typescript_file(
						disknode,
						source_file,
						module_path,
						checker,
					);
					source_json.modules!.push(mod);

					// Collect re-exports for post-processing
					for (const re_export of re_exports) {
						all_re_exports.push({re_exporting_module: module_path, re_export});
					}
				}
			}

			// Phase 2: Build also_exported_from arrays from re-export data
			// Group re-exports by original module and declaration name
			const re_export_map: Map<string, Map<string, Array<string>>> = new Map();
			for (const {re_exporting_module, re_export} of all_re_exports) {
				const {name, original_module} = re_export;
				if (!re_export_map.has(original_module)) {
					re_export_map.set(original_module, new Map());
				}
				const module_map = re_export_map.get(original_module)!;
				if (!module_map.has(name)) {
					module_map.set(name, []);
				}
				module_map.get(name)!.push(re_exporting_module);
			}

			// Merge into original declarations
			for (const mod of source_json.modules ?? []) {
				const module_re_exports = re_export_map.get(mod.path);
				if (!module_re_exports) continue;

				for (const declaration of mod.declarations ?? []) {
					const re_exporters = module_re_exports.get(declaration.name);
					if (re_exporters?.length) {
						declaration.also_exported_from = re_exporters.sort();
					}
				}
			}

			// Sort modules alphabetically for deterministic output and cleaner diffs
			source_json.modules = source_json.modules
				? library_gen_sort_modules(source_json.modules)
				: undefined;

			// Validate no duplicate declaration names across modules
			library_gen_validate_no_duplicates(source_json, log);

			log.info('library metadata generation complete');

			return {
				content: library_gen_generate_ts(package_json, source_json),
				...(options?.filename && {filename: options.filename}),
			};
		},
	};
};
