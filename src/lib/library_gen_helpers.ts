/**
 * Library metadata generation helpers - orchestration.
 *
 * These functions handle collection, validation, and transformation of library metadata.
 * Analysis functions are in their respective domain helpers:
 *
 * - `ts_helpers.ts` - `ts_analyze_module` for TypeScript files
 * - `svelte_helpers.ts` - `svelte_analyze_module` for Svelte components
 * - `module_helpers.ts` - path utilities, source detection, and `SourceFileInfo`
 *
 * Design philosophy: Fail fast with clear errors rather than silently producing invalid
 * metadata. All validation errors halt the build immediately with actionable messages.
 *
 * @see library_gen_output.ts for output file generation (JSON/TS wrapper)
 * @see library_gen.ts for the main generation task (Gro-specific)
 * @see @fuzdev/fuz_util/source_json.js for type definitions
 */

import ts from 'typescript';
import type {Logger} from '@fuzdev/fuz_util/log.js';
import type {DeclarationJson, ModuleJson, SourceJson} from '@fuzdev/fuz_util/source_json.js';

import {type ReExportInfo, ts_analyze_module} from './ts_helpers.js';
import {svelte_analyze_module} from './svelte_helpers.js';
import {
	type SourceFileInfo,
	type ModuleSourceOptions,
	module_is_typescript,
	module_is_svelte,
	module_matches_source,
} from './module_helpers.js';
import type {AnalysisContext} from './analysis_context.js';

/**
 * A duplicate declaration with its full metadata and module path.
 */
export interface DuplicateInfo {
	/** The full declaration metadata. */
	declaration: DeclarationJson;
	/** Module path where this declaration is defined. */
	module: string;
}

/**
 * Find duplicate declaration names across modules.
 *
 * Returns a Map of declaration names to their full metadata (only includes duplicates).
 * Callers can decide how to handle duplicates (throw, warn, ignore).
 *
 * @example
 * const duplicates = library_find_duplicates(source_json);
 * if (duplicates.size > 0) {
 *   for (const [name, occurrences] of duplicates) {
 *     console.error(`"${name}" found in:`);
 *     for (const {declaration, module} of occurrences) {
 *       console.error(`  - ${module}:${declaration.source_line} (${declaration.kind})`);
 *     }
 *   }
 *   throw new Error(`Found ${duplicates.size} duplicate declaration names`);
 * }
 */
export const library_find_duplicates = (
	source_json: SourceJson,
): Map<string, Array<DuplicateInfo>> => {
	const all_occurrences: Map<string, Array<DuplicateInfo>> = new Map();

	// Collect all declaration names and their full metadata
	for (const mod of source_json.modules ?? []) {
		for (const declaration of mod.declarations ?? []) {
			const name = declaration.name;
			if (!all_occurrences.has(name)) {
				all_occurrences.set(name, []);
			}
			all_occurrences.get(name)!.push({
				declaration,
				module: mod.path,
			});
		}
	}

	// Filter to only duplicates
	const duplicates: Map<string, Array<DuplicateInfo>> = new Map();
	for (const [name, occurrences] of all_occurrences) {
		if (occurrences.length > 1) {
			duplicates.set(name, occurrences);
		}
	}

	return duplicates;
};

/**
 * Sort modules alphabetically by path for deterministic output and cleaner diffs.
 */
export const library_sort_modules = (modules: Array<ModuleJson>): Array<ModuleJson> => {
	return modules.slice().sort((a, b) => a.path.localeCompare(b.path));
};

/**
 * A collected re-export with its source module context.
 *
 * Used during the two-phase re-export resolution:
 * 1. Phase 1: Collect re-exports from each module during analysis
 * 2. Phase 2: Group by original module and merge into `also_exported_from`
 */
export interface CollectedReExport {
	/** The module that re-exports the declaration. */
	re_exporting_module: string;
	/** The re-export info (name and original module). */
	re_export: ReExportInfo;
}

/**
 * Build `also_exported_from` arrays from collected re-export data.
 *
 * This function resolves the two-phase re-export problem:
 *
 * **Problem**: When module A re-exports from module B, we discover this while
 * analyzing A, but need to update B's declarations. However, B may already be
 * processed or may be processed later.
 *
 * **Solution**: Collect all re-exports in phase 1, then merge them in phase 2
 * after all modules are analyzed.
 *
 * @example
 * // helpers.ts exports: foo, bar
 * // index.ts does: export {foo, bar} from './helpers.js'
 * //
 * // After processing:
 * // - helpers.ts foo declaration gets: also_exported_from: ['index.ts']
 * // - helpers.ts bar declaration gets: also_exported_from: ['index.ts']
 *
 * @param source_json The source JSON with all modules (will be mutated)
 * @param collected_re_exports Array of re-exports collected during phase 1
 * @mutates source_json - adds `also_exported_from` to declarations
 */
export const library_merge_re_exports = (
	source_json: SourceJson,
	collected_re_exports: Array<CollectedReExport>,
): void => {
	// Group re-exports by original module and declaration name
	// Structure: Map<original_module_path, Map<declaration_name, Array<re_exporting_module_path>>>
	const re_export_map: Map<string, Map<string, Array<string>>> = new Map();

	for (const {re_exporting_module, re_export} of collected_re_exports) {
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
				// Sort for deterministic output
				declaration.also_exported_from = re_exporters.sort();
			}
		}
	}
};

/**
 * Collect and filter source files.
 *
 * Returns source files for TypeScript/JS files and Svelte components, excluding test files.
 * Returns an empty array with a warning if no source files are found.
 *
 * Note: Only `.ts`, `.js`, and `.svelte` files are supported. The `options.extensions`
 * filters within these types (e.g., `['.ts']` to exclude .js and .svelte).
 * Other extensions like `.css` are ignored even if added to options.
 *
 * @param files Iterable of source file info (from Gro filer, file system, or other source)
 * @param options Module source options for filtering
 * @param log Optional logger for status messages
 */
export const library_collect_source_files = (
	files: Iterable<SourceFileInfo>,
	options: ModuleSourceOptions,
	log?: Logger,
): Array<SourceFileInfo> => {
	const all_files = Array.from(files);
	log?.info(`received ${all_files.length} files total`);

	const source_files: Array<SourceFileInfo> = [];
	for (const file of all_files) {
		if (module_matches_source(file.id, options)) {
			// Include TypeScript/JS files and Svelte components
			if (module_is_typescript(file.id) || module_is_svelte(file.id)) {
				source_files.push(file);
			}
		}
	}

	log?.info(`found ${source_files.length} source files to analyze`);

	if (source_files.length === 0) {
		log?.warn(
			`No source files found in ${options.source_root} - generating empty library metadata`,
		);
		return [];
	}

	// Sort for deterministic output (stable alphabetical module ordering)
	source_files.sort((a, b) => a.id.localeCompare(b.id));

	return source_files;
};

/**
 * Result of analyzing a single module (TypeScript or Svelte).
 */
export interface ModuleAnalysisResult {
	/** The analyzed module metadata. */
	module: ModuleJson;
	/** Re-exports discovered during analysis (empty for Svelte components). */
	re_exports: Array<ReExportInfo>;
}

/**
 * Analyze a source file and extract module metadata.
 *
 * Unified entry point that dispatches to the appropriate analyzer based on file type:
 * - TypeScript/JavaScript files → `ts_analyze_module`
 * - Svelte components → `svelte_analyze_module`
 *
 * @param source_file The source file info with content and optional dependency data
 * @param module_path The module path relative to source root
 * @param program TypeScript program (used for type checking and source file lookup)
 * @param options Module source options for path extraction
 * @param ctx Analysis context for collecting diagnostics
 * @param log Optional logger for warnings
 * @returns Module metadata and re-exports, or undefined if source file not found in program
 */
export const library_analyze_module = (
	source_file: SourceFileInfo,
	module_path: string,
	program: ts.Program,
	options: ModuleSourceOptions,
	ctx: AnalysisContext,
	log?: Logger,
): ModuleAnalysisResult | undefined => {
	const checker = program.getTypeChecker();

	if (module_is_svelte(module_path)) {
		// Svelte components don't have re-exports
		const module = svelte_analyze_module(source_file, module_path, checker, options, ctx);
		return {module, re_exports: []};
	}

	// TypeScript/JavaScript file - need source file from program
	const ts_source_file = program.getSourceFile(source_file.id);
	if (!ts_source_file) {
		log?.warn(`Could not get source file from program: ${source_file.id}`);
		return undefined;
	}

	const {module, re_exports} = ts_analyze_module(
		source_file,
		ts_source_file,
		module_path,
		checker,
		options,
		ctx,
	);
	return {module, re_exports};
};
