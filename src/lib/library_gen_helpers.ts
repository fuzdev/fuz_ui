/**
 * Build-time helpers for library metadata generation.
 *
 * These functions handle Gro-specific concerns like file collection and dependency
 * graph extraction. Core analysis logic has been extracted to reusable helpers:
 *
 * - `ts_helpers.ts` - `ts_analyze_module_exports`
 * - `svelte_helpers.ts` - `svelte_analyze_file`
 * - `module_helpers.ts` - path utilities and source detection
 *
 * Design philosophy: Fail fast with clear errors rather than silently producing invalid
 * metadata. All validation errors halt the build immediately with actionable messages.
 *
 * @see library_gen.ts for the main generation task
 * @see @fuzdev/fuz_util/source_json.js for type definitions
 * @see ts_helpers.ts for reusable TypeScript analysis
 * @see svelte_helpers.ts for reusable Svelte component analysis
 */

import type {PackageJson} from '@fuzdev/fuz_util/package_json.js';
import type {Logger} from '@fuzdev/fuz_util/log.js';
import type {ModuleJson, SourceJson} from '@fuzdev/fuz_util/source_json.js';
import {library_json_parse, type LibraryJson} from '@fuzdev/fuz_util/library_json.js';
import type {Disknode} from '@ryanatkn/gro/disknode.js';
import type ts from 'typescript';
import type {PathId} from '@fuzdev/fuz_util/path.js';

import {ts_analyze_module_exports, type ReExportInfo} from './ts_helpers.js';
import {svelte_analyze_file} from './svelte_helpers.js';
import {
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
 * Validates that no declaration names are duplicated across modules.
 * The flat namespace is intentional - duplicates should fail fast.
 *
 * @throws Error if duplicate declaration names are found
 */
export const library_gen_validate_no_duplicates = (source_json: SourceJson, log: Logger): void => {
	const declaration_locations: Map<string, Array<{module: string; kind: string}>> = new Map();

	// Collect all declaration names and their locations
	for (const mod of source_json.modules ?? []) {
		for (const declaration of mod.declarations ?? []) {
			const name = declaration.name;
			if (!declaration_locations.has(name)) {
				declaration_locations.set(name, []);
			}
			declaration_locations.get(name)!.push({
				module: mod.path,
				kind: declaration.kind,
			});
		}
	}

	// Check for duplicates
	const duplicates: Array<{name: string; locations: Array<{module: string; kind: string}>}> = [];
	for (const [name, locations] of declaration_locations.entries()) {
		if (locations.length > 1) {
			duplicates.push({name, locations});
		}
	}

	if (duplicates.length > 0) {
		log.error('Duplicate declaration names detected in flat namespace:');
		for (const {name, locations} of duplicates) {
			log.error(`  "${name}" found in:`);
			for (const {module, kind} of locations) {
				log.error(`    - ${module} (${kind})`);
			}
		}
		throw new Error(
			`Found ${duplicates.length} duplicate declaration name${duplicates.length === 1 ? '' : 's'} across modules. ` +
				'The flat namespace requires unique names. To resolve: ' +
				'(1) rename one of the conflicting declarations, or ' +
				'(2) add /** @nodocs */ to exclude from documentation. ' +
				'See CLAUDE.md "Declaration namespacing" section for details.',
		);
	}
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

	const ts_content = `// generated by library.gen.json.ts - do not edit

import _json from './library.json' with {type: 'json'};
import {SourceJson} from '${fuz_util_prefix}source_json.js';
import {library_json_parse} from '${fuz_util_prefix}library_json.js';

// Validate source_json with zod to get proper types (JSON imports widen literals to string)
const source_json = SourceJson.parse(_json.source_json);

export const library_json = library_json_parse(_json.package_json, source_json);
`;

	return {json_content, ts_content};
};

/**
 * Collect and filter source files from filer.
 *
 * Returns disknodes for TypeScript/JS files and Svelte components from src/lib, excluding test files.
 * Returns an empty array with a warning if no source files are found.
 */
export const library_gen_collect_source_files = (
	files: Map<PathId, Disknode>,
	log: Logger,
): Array<Disknode> => {
	log.info(`filer has ${files.size} files total`);

	const source_disknodes: Array<Disknode> = [];
	for (const [id, disknode] of files.entries()) {
		if (module_matches_source(id)) {
			// Include TypeScript/JS files and Svelte components
			if (module_is_typescript(id) || module_is_svelte(id)) {
				source_disknodes.push(disknode);
			}
		}
	}

	log.info(`found ${source_disknodes.length} source files to analyze`);

	if (source_disknodes.length === 0) {
		log.warn('No source files found in src/lib - generating empty library metadata');
		return [];
	}

	// Sort for deterministic output (stable alphabetical module ordering)
	source_disknodes.sort((a, b) => a.id.localeCompare(b.id));

	return source_disknodes;
};

/**
 * Analyze a Svelte component file and extract metadata.
 *
 * Uses `svelte_analyze_file` for core analysis, then adds
 * Gro-specific dependency information from the disknode.
 */
export const library_gen_analyze_svelte_file = (
	disknode: Disknode,
	module_path: string,
	checker: ts.TypeChecker,
): ModuleJson => {
	// Use the extracted helper for core analysis
	const declaration_json = svelte_analyze_file(disknode.id, module_path, checker);

	// Extract dependencies and dependents (Gro-specific)
	const {dependencies, dependents} = library_gen_extract_dependencies(disknode);

	return {
		path: module_path,
		declarations: [declaration_json],
		dependencies: dependencies.length > 0 ? dependencies : undefined,
		dependents: dependents.length > 0 ? dependents : undefined,
	};
};

/**
 * Analyze a TypeScript file and extract all declarations.
 *
 * Uses `ts_analyze_module_exports` for core analysis, then adds
 * Gro-specific dependency information from the disknode.
 *
 * Returns both the module metadata and re-export information for post-processing.
 */
export const library_gen_analyze_typescript_file = (
	disknode: Disknode,
	source_file: ts.SourceFile,
	module_path: string,
	checker: ts.TypeChecker,
): TsFileAnalysis => {
	// Use the extracted helper for core analysis
	const {module_comment, declarations, re_exports} = ts_analyze_module_exports(
		source_file,
		checker,
	);

	const mod: ModuleJson = {
		path: module_path,
		declarations,
	};

	if (module_comment) {
		mod.module_comment = module_comment;
	}

	// Extract dependencies and dependents (Gro-specific)
	const {dependencies, dependents} = library_gen_extract_dependencies(disknode);
	if (dependencies.length > 0) {
		mod.dependencies = dependencies;
	}
	if (dependents.length > 0) {
		mod.dependents = dependents;
	}

	return {module: mod, re_exports};
};

/**
 * Extract dependencies and dependents for a module from the filer's dependency graph.
 *
 * Filters to only include source modules from src/lib (excludes external packages, node_modules, tests).
 * Returns sorted arrays of module paths (relative to src/lib) for deterministic output.
 */
export const library_gen_extract_dependencies = (
	disknode: Disknode,
): {dependencies: Array<string>; dependents: Array<string>} => {
	const dependencies: Array<string> = [];
	const dependents: Array<string> = [];

	// Extract dependencies (files this module imports)
	for (const dep_id of disknode.dependencies.keys()) {
		if (module_matches_source(dep_id)) {
			dependencies.push(module_extract_path(dep_id));
		}
	}

	// Extract dependents (files that import this module)
	for (const dependent_id of disknode.dependents.keys()) {
		if (module_matches_source(dependent_id)) {
			dependents.push(module_extract_path(dependent_id));
		}
	}

	// Sort for deterministic output
	dependencies.sort();
	dependents.sort();

	return {dependencies, dependents};
};
