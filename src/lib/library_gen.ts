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
 * This file contains Gro-specific integration. The actual analysis logic is in
 * build-tool agnostic helpers that work with `SourceFileInfo`.
 *
 * @see @fuzdev/fuz_util/source_json.js for type definitions
 * @see `library_gen_helpers.ts` for build-tool agnostic helpers
 * @see `tsdoc_helpers.ts` for JSDoc/TSDoc parsing
 * @see `ts_helpers.ts` for TypeScript analysis
 * @see `svelte_helpers.ts` for Svelte component analysis
 */

import type {Gen} from '@ryanatkn/gro';
import {package_json_load} from '@ryanatkn/gro/package_json.js';
import type {Disknode} from '@ryanatkn/gro/disknode.js';
import type {SourceJson} from '@fuzdev/fuz_util/source_json.js';

import {ts_create_program, ts_analyze_module, type ReExportInfo} from './ts_helpers.js';
import {svelte_analyze_module} from './svelte_helpers.js';
import {
	type SourceFileInfo,
	type ModuleSourceOptions,
	MODULE_SOURCE_DEFAULTS,
	module_extract_path,
	module_is_svelte,
} from './module_helpers.js';
import {
	library_collect_source_files,
	library_sort_modules,
	library_find_duplicates,
	library_generate_json,
} from './library_gen_helpers.js';
import {AnalysisContext, format_diagnostic} from './analysis_context.js';

/** Options for library generation. */
export interface LibraryGenOptions {
	/** Module source options for filtering and path extraction. */
	source?: ModuleSourceOptions;
	/** Whether to enforce flat namespace (fail on duplicate names). @default true */
	enforce_flat_namespace?: boolean;
}

/**
 * Convert Gro's Disknode to the build-tool agnostic SourceFileInfo interface.
 */
const source_file_from_disknode = (disknode: Disknode): SourceFileInfo => ({
	id: disknode.id,
	content: disknode.contents ?? undefined,
	dependencies: disknode.dependencies.keys(),
	dependents: disknode.dependents.keys(),
});

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
 *
 * @param options Optional generation options
 */
export const library_gen = (options?: LibraryGenOptions): Gen => {
	const source_options = options?.source ?? MODULE_SOURCE_DEFAULTS;
	const enforce_flat_namespace = options?.enforce_flat_namespace ?? true;

	return {
		generate: async ({log, filer}) => {
			log.info('generating library metadata with full TypeScript analysis...');

			// Ensure filer is initialized
			await filer.init();

			// Read package.json
			const package_json = await package_json_load();

			// Create TypeScript program
			const program = ts_create_program(log);
			const checker = program.getTypeChecker();

			// Create analysis context for collecting diagnostics
			const ctx = new AnalysisContext();

			// Convert Gro's filer files to build-tool agnostic SourceFileInfo
			const all_source_files: Array<SourceFileInfo> = [];
			for (const disknode of filer.files.values()) {
				all_source_files.push(source_file_from_disknode(disknode));
			}

			// Collect and filter source files
			const source_files = library_collect_source_files(all_source_files, source_options, log);

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

			for (const source_file of source_files) {
				const source_id = source_file.id;
				const module_path = module_extract_path(source_id, source_options);
				const is_svelte = module_is_svelte(module_path);

				// Handle Svelte files separately (before trying to get TypeScript source file)
				if (is_svelte) {
					const mod = svelte_analyze_module(source_file, module_path, checker, source_options, ctx);
					source_json.modules!.push(mod);
				} else {
					// For TypeScript/JS files, get the source file from the program
					const ts_source_file = program.getSourceFile(source_id);
					if (!ts_source_file) {
						log.warn(`Could not get source file: ${source_id}`);
						continue;
					}

					// May throw, which we want to see
					const {module: mod, re_exports} = ts_analyze_module(
						source_file,
						ts_source_file,
						module_path,
						checker,
						source_options,
						ctx,
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
				? library_sort_modules(source_json.modules)
				: undefined;

			// Validate no duplicate declaration names across modules
			if (enforce_flat_namespace) {
				const duplicates = library_find_duplicates(source_json);
				if (duplicates.size > 0) {
					log.error('Duplicate declaration names detected in flat namespace:');
					for (const [name, occurrences] of duplicates) {
						log.error(`  "${name}" found in:`);
						for (const {declaration, module} of occurrences) {
							const line_info =
								declaration.source_line !== undefined ? `:${declaration.source_line}` : '';
							log.error(`    - ${module}${line_info} (${declaration.kind})`);
						}
					}
					throw new Error(
						`Found ${duplicates.size} duplicate declaration name${duplicates.size === 1 ? '' : 's'} across modules. ` +
							'The flat namespace requires unique names. To resolve: ' +
							'(1) rename one of the conflicting declarations, or ' +
							'(2) add /** @nodocs */ to exclude from documentation. ' +
							'See CLAUDE.md "Declaration namespacing" section for details.',
					);
				}
			}

			// Report any analysis diagnostics
			if (ctx.diagnostics.length > 0) {
				const errors = ctx.errors();
				const warnings = ctx.warnings();
				const format_options = {strip_base: process.cwd()};

				if (errors.length > 0) {
					log.error(`Analysis completed with ${errors.length} error(s):`);
					for (const diagnostic of errors) {
						log.error(`  ${format_diagnostic(diagnostic, format_options)}`);
					}
				}

				if (warnings.length > 0) {
					log.warn(`Analysis completed with ${warnings.length} warning(s):`);
					for (const diagnostic of warnings) {
						log.warn(`  ${format_diagnostic(diagnostic, format_options)}`);
					}
				}
			}

			log.info('library metadata generation complete');

			const {json_content, ts_content} = library_generate_json(package_json, source_json);

			// Return array of files:
			// - library.json (default from .gen.json.ts naming)
			// - library.ts (typed wrapper that validates with zod)
			return [{content: ts_content}, {content: json_content, filename: 'library.json'}];
		},
	};
};
