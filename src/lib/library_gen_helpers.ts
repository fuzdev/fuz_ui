/**
 * Library metadata generation helpers - pipeline orchestration.
 *
 * These functions handle collection, validation, and transformation of library metadata
 * during the generation pipeline. They are internal to the generation process.
 *
 * For source analysis (the consumer-facing API), see `library_analysis.ts`.
 *
 * Pipeline stages:
 * 1. **Collection** - `library_collect_source_files` gathers and filters source files
 * 2. **Analysis** - `library_analyze_module` (in library_analysis.ts) extracts metadata
 * 3. **Validation** - `library_find_duplicates` checks flat namespace constraints
 * 4. **Transformation** - `library_merge_re_exports` resolves re-export relationships
 * 5. **Output** - `library_sort_modules` prepares deterministic output
 *
 * @see library_analysis.ts for the analysis entry point
 * @see library_gen_output.ts for output file generation (JSON/TS wrapper)
 * @see library_gen.ts for the main generation task (Gro-specific)
 */

import type {Logger} from '@fuzdev/fuz_util/log.js';
import type {DeclarationJson, ModuleJson, SourceJson} from '@fuzdev/fuz_util/source_json.js';

import type {ReExportInfo} from './library_analysis.js';
import {
	type SourceFileInfo,
	type ModuleSourceOptions,
	module_matches_source,
	module_validate_source_options,
} from './module_helpers.js';

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
 * File types are determined by `options.get_analyzer`. By default, `.ts`, `.js`, and `.svelte`
 * files are supported. Customize `get_analyzer` to support additional file types like `.svx`.
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
	// Validate options early to fail fast on misconfiguration
	module_validate_source_options(options);

	const all_files = Array.from(files);
	log?.info(`received ${all_files.length} files total`);

	const source_files: Array<SourceFileInfo> = [];
	for (const file of all_files) {
		if (module_matches_source(file.id, options)) {
			// Include files that have a valid analyzer
			if (options.get_analyzer(file.id) !== null) {
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
