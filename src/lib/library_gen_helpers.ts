/**
 * Build-time helpers for library metadata generation.
 *
 * These functions are build-tool agnostic, working with the `SourceFileInfo` interface.
 * Core analysis logic has been extracted to reusable helpers:
 *
 * - `ts_helpers.ts` - `ts_analyze_module_exports`
 * - `svelte_helpers.ts` - `svelte_analyze_file`
 * - `module_helpers.ts` - path utilities, source detection, and `SourceFileInfo`
 *
 * Design philosophy: Fail fast with clear errors rather than silently producing invalid
 * metadata. All validation errors halt the build immediately with actionable messages.
 *
 * @see library_gen.ts for the main generation task (Gro-specific)
 * @see @fuzdev/fuz_util/source_json.js for type definitions
 * @see ts_helpers.ts for reusable TypeScript analysis
 * @see svelte_helpers.ts for reusable Svelte component analysis
 */

import type {PackageJson} from '@fuzdev/fuz_util/package_json.js';
import type {Logger} from '@fuzdev/fuz_util/log.js';
import type {DeclarationJson, ModuleJson, SourceJson} from '@fuzdev/fuz_util/source_json.js';
import {library_json_parse, type LibraryJson} from '@fuzdev/fuz_util/library_json.js';
import type ts from 'typescript';

import {ts_analyze_module_exports, type ReExportInfo} from './ts_helpers.js';
import {svelte_analyze_file} from './svelte_helpers.js';
import {
	type SourceFileInfo,
	type ModuleSourceOptions,
	module_extract_path,
	module_is_typescript,
	module_is_svelte,
	module_matches_source,
} from './module_helpers.js';

/**
 * Result of analyzing a TypeScript file.
 * Includes both the module metadata and re-export information for post-processing.
 */
export interface TsFileAnalysis {
	/** Module metadata for inclusion in source_json. */
	module: ModuleJson;
	/** Re-exports from this module for building also_exported_from. */
	re_exports: Array<ReExportInfo>;
}

/**
 * A duplicate declaration with its full metadata and module path.
 */
export interface DuplicateDeclaration {
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
 * const duplicates = library_gen_find_duplicates(source_json);
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
export const library_gen_find_duplicates = (
	source_json: SourceJson,
): Map<string, Array<DuplicateDeclaration>> => {
	const all_occurrences: Map<string, Array<DuplicateDeclaration>> = new Map();

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
	const duplicates: Map<string, Array<DuplicateDeclaration>> = new Map();
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
export const library_gen_sort_modules = (modules: Array<ModuleJson>): Array<ModuleJson> => {
	return modules.slice().sort((a, b) => a.path.localeCompare(b.path));
};

/**
 * Result of generating library files.
 * Contains both the JSON data and the TypeScript wrapper file.
 */
export interface LibraryGenOutput {
	/** JSON content for library.json */
	json_content: string;
	/** TypeScript wrapper content for library.ts */
	ts_content: string;
}

/**
 * Generate the library.json and library.ts file contents.
 * Parses at generation time so runtime only needs the pre-computed result.
 *
 * Returns JSON + .ts wrapper because:
 * - JSON is natively importable by Node.js and Vite without TypeScript loaders
 * - Works in CI environments that don't have TS compilation
 * - The .ts wrapper validates with zod and exports with proper types
 *   (JSON imports get widened types like `string` instead of literal unions)
 */
export const library_gen_generate_json = (
	package_json: PackageJson,
	source_json: SourceJson,
): LibraryGenOutput => {
	const is_this_fuz_util = package_json.name === '@fuzdev/fuz_util';
	const fuz_util_prefix = is_this_fuz_util ? './' : '@fuzdev/fuz_util/';

	// Parse at generation time, not runtime
	const library_json: LibraryJson = library_json_parse(package_json, source_json);

	const json_content = JSON.stringify(library_json, null, '\t') + '\n';

	const banner = '// generated by library.gen.ts - do not edit';

	const ts_content = `${banner}

import type {LibraryJson} from '${fuz_util_prefix}library_json.js';

import json from './library.json' with {type: 'json'};

export const library_json: LibraryJson = json as LibraryJson;

${banner}
`;

	return {json_content, ts_content};
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
export const library_gen_collect_source_files = (
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
 * Analyze a Svelte component file and extract metadata.
 *
 * Uses `svelte_analyze_file` for core analysis, then adds
 * dependency information from the source file info if available.
 *
 * @param source_file The source file info
 * @param module_path The module path (relative to source root)
 * @param checker TypeScript type checker
 * @param options Module source options for path extraction
 */
export const library_gen_analyze_svelte_file = (
	source_file: SourceFileInfo,
	module_path: string,
	checker: ts.TypeChecker,
	options: ModuleSourceOptions,
): ModuleJson => {
	// Use the extracted helper for core analysis
	const {declaration, module_comment} = svelte_analyze_file(source_file, module_path, checker);

	// Extract dependencies and dependents if provided
	const {dependencies, dependents} = library_gen_extract_dependencies(source_file, options);

	return {
		path: module_path,
		declarations: [declaration],
		module_comment,
		dependencies: dependencies.length > 0 ? dependencies : undefined,
		dependents: dependents.length > 0 ? dependents : undefined,
	};
};

/**
 * Analyze a TypeScript file and extract all declarations.
 *
 * Uses `ts_analyze_module_exports` for core analysis, then adds
 * dependency information from the source file info if available.
 *
 * Returns both the module metadata and re-export information for post-processing.
 *
 * @param source_file_info The source file info
 * @param ts_source_file TypeScript source file from the program
 * @param module_path The module path (relative to source root)
 * @param checker TypeScript type checker
 * @param options Module source options for path extraction
 */
export const library_gen_analyze_typescript_file = (
	source_file_info: SourceFileInfo,
	ts_source_file: ts.SourceFile,
	module_path: string,
	checker: ts.TypeChecker,
	options: ModuleSourceOptions,
): TsFileAnalysis => {
	// Use the extracted helper for core analysis
	const {module_comment, declarations, re_exports} = ts_analyze_module_exports(
		ts_source_file,
		checker,
		options,
	);

	const mod: ModuleJson = {
		path: module_path,
		declarations,
	};

	if (module_comment) {
		mod.module_comment = module_comment;
	}

	// Extract dependencies and dependents if provided
	const {dependencies, dependents} = library_gen_extract_dependencies(source_file_info, options);
	if (dependencies.length > 0) {
		mod.dependencies = dependencies;
	}
	if (dependents.length > 0) {
		mod.dependents = dependents;
	}

	return {module: mod, re_exports};
};

/**
 * Extract dependencies and dependents for a module from source file info.
 *
 * Filters to only include source modules (excludes external packages, node_modules, tests).
 * Returns sorted arrays of module paths (relative to source_root) for deterministic output.
 *
 * If no dependencies/dependents are provided in the source file info, returns empty arrays.
 *
 * @param source_file The source file info to extract dependencies from
 * @param options Module source options for filtering and path extraction
 */
export const library_gen_extract_dependencies = (
	source_file: SourceFileInfo,
	options: ModuleSourceOptions,
): {dependencies: Array<string>; dependents: Array<string>} => {
	const dependencies: Array<string> = [];
	const dependents: Array<string> = [];

	// Extract dependencies (files this module imports) if provided
	if (source_file.dependencies) {
		for (const dep_id of source_file.dependencies) {
			if (module_matches_source(dep_id, options)) {
				dependencies.push(module_extract_path(dep_id, options));
			}
		}
	}

	// Extract dependents (files that import this module) if provided
	if (source_file.dependents) {
		for (const dependent_id of source_file.dependents) {
			if (module_matches_source(dependent_id, options)) {
				dependents.push(module_extract_path(dependent_id, options));
			}
		}
	}

	// Sort for deterministic output
	dependencies.sort();
	dependents.sort();

	return {dependencies, dependents};
};
