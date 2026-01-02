/**
 * Generic library metadata generation.
 *
 * This module provides build-tool agnostic library generation. It takes source files
 * and package metadata, analyzes them, and produces structured metadata with:
 * - JSDoc/TSDoc comments with full tag support
 * - Full type signatures
 * - Source code locations
 * - Parameter information with descriptions and defaults
 * - Return value documentation
 * - Usage examples
 * - Dependency graphs
 * - Svelte component props
 *
 * For Gro integration, see `library_gen.ts` which wraps this with Gro's Gen interface.
 *
 * @see @fuzdev/fuz_util/source_json.js for type definitions
 * @see `library_analysis.ts` for the unified analysis entry point
 * @see `library_pipeline.ts` for pipeline helpers
 * @see `library_output.ts` for JSON/TS file generation
 *
 * @module
 */

import type ts from 'typescript';
import type {SourceJson, ModuleJson} from '@fuzdev/fuz_util/source_json.js';
import type {PackageJson} from '@fuzdev/fuz_util/package_json.js';
import type {Logger} from '@fuzdev/fuz_util/log.js';

import {ts_create_program} from './ts_helpers.js';
import {type SourceFileInfo, type ModuleSourceOptions} from './module_helpers.js';
import {library_analyze_module} from './library_analysis.js';
import {
	library_sort_modules,
	library_find_duplicates,
	library_merge_re_exports,
	type CollectedReExport,
	type DuplicateInfo,
} from './library_pipeline.js';
import {library_generate_output} from './library_output.js';
import {AnalysisContext, format_diagnostic} from './analysis_context.js';

/**
 * Callback for handling duplicate declaration names.
 *
 * @param duplicates Map of declaration names to their occurrences across modules
 * @param log Logger for reporting
 */
export type OnDuplicatesCallback = (
	duplicates: Map<string, Array<DuplicateInfo>>,
	log: {error: (...args: Array<unknown>) => void},
) => void;

/**
 * Strict duplicate handler that throws on any duplicate declaration names.
 *
 * Use this callback with `library_generate({ on_duplicates: library_throw_on_duplicates })`
 * to enforce a flat namespace where all declaration names must be unique.
 *
 * @throws Error if any duplicate declaration names are found
 */
export const library_throw_on_duplicates: OnDuplicatesCallback = (duplicates, log) => {
	if (duplicates.size === 0) return;

	log.error('Duplicate declaration names detected in flat namespace:');
	for (const [name, occurrences] of duplicates) {
		log.error(`  "${name}" found in:`);
		for (const {declaration, module} of occurrences) {
			const line_info = declaration.source_line !== undefined ? `:${declaration.source_line}` : '';
			log.error(`    - ${module}${line_info} (${declaration.kind})`);
		}
	}
	throw new Error(
		`Found ${duplicates.size} duplicate declaration name${duplicates.size === 1 ? '' : 's'} across modules. ` +
			'The flat namespace requires unique names. To resolve: ' +
			'(1) rename one of the conflicting declarations, or ' +
			'(2) add /** @nodocs */ to exclude from documentation.',
	);
};

/** Input for library metadata generation. */
export interface LibraryGenerateInput {
	/** Source files to analyze (must have content loaded). */
	source_files: Array<SourceFileInfo>;
	/** Package metadata (name, version). */
	package_json: PackageJson;
	/** Module source options for path extraction. */
	source_options: ModuleSourceOptions;
	/**
	 * Optional TypeScript program. If not provided, one will be created.
	 * Pass an existing program to reuse across multiple calls.
	 */
	program?: ts.Program;
	/** Optional callback for handling duplicate declaration names. */
	on_duplicates?: OnDuplicatesCallback;
	/** Optional logger for status and diagnostic messages. */
	log?: Logger;
}

/** Result of library metadata generation. */
export interface LibraryGenerateResult {
	/** The generated source metadata. */
	source_json: SourceJson;
	/** JSON file content string. */
	json_content: string;
	/** TypeScript wrapper file content string. */
	ts_content: string;
}

/**
 * Generate library metadata from source files.
 *
 * This is the main entry point for library generation. It analyzes source files,
 * extracts metadata, and produces both structured data and file contents.
 *
 * @example
 * ```ts
 * const result = library_generate({
 *   source_files,
 *   package_json: {name: '@my/lib', version: '1.0.0'},
 *   source_options: module_create_source_options(process.cwd()),
 * });
 *
 * await writeFile('library.json', result.json_content);
 * await writeFile('library.ts', result.ts_content);
 * ```
 */
export const library_generate = (input: LibraryGenerateInput): LibraryGenerateResult => {
	const {source_files, package_json, source_options, on_duplicates, log} = input;

	// Create or use provided TypeScript program
	const program = input.program ?? ts_create_program(undefined, log).program;

	// Create analysis context for collecting diagnostics
	const ctx = new AnalysisContext();

	// Collect modules
	const modules: Array<ModuleJson> = [];

	// Build source_json with array-based modules
	// Phase 1: Analyze all modules and collect re-exports
	const source_json: SourceJson = {
		name: package_json.name,
		version: package_json.version,
		modules,
	};

	// Collect re-exports for phase 2 merging
	// See library_merge_re_exports for the two-phase resolution strategy
	const collected_re_exports: Array<CollectedReExport> = [];

	for (const source_file of source_files) {
		// Use unified analyzer that dispatches based on file type
		const result = library_analyze_module(source_file, program, source_options, ctx, log);
		if (!result) continue;

		// Build ModuleJson, filtering out @nodocs declarations
		const module: ModuleJson = {
			path: result.path,
			declarations: result.declarations.filter((d) => !d.nodocs).map((d) => d.declaration),
		};
		if (result.module_comment) module.module_comment = result.module_comment;
		if (result.dependencies.length > 0) module.dependencies = result.dependencies;
		if (result.dependents.length > 0) module.dependents = result.dependents;
		if (result.star_exports.length > 0) module.star_exports = result.star_exports;

		modules.push(module);

		// Collect re-exports for phase 2 merging
		for (const re_export of result.re_exports) {
			collected_re_exports.push({re_exporting_module: result.path, re_export});
		}
	}

	// Phase 2: Build also_exported_from arrays from re-export data
	library_merge_re_exports(source_json, collected_re_exports);

	// Sort modules alphabetically for deterministic output and cleaner diffs
	source_json.modules = library_sort_modules(modules);

	// Check for duplicate declaration names and invoke callback if provided
	if (on_duplicates) {
		const duplicates = library_find_duplicates(source_json);
		if (duplicates.size > 0) {
			// Use provided logger or a minimal fallback
			const error_log = log ?? {error: (...args: Array<unknown>) => console.error(...args)}; // eslint-disable-line no-console
			on_duplicates(duplicates, error_log);
		}
	}

	// Report any analysis diagnostics
	if (ctx.diagnostics.length > 0 && log) {
		const errors = ctx.errors();
		const warnings = ctx.warnings();
		const format_options = {strip_base: source_options.project_root};

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

	const {json_content, ts_content} = library_generate_output(package_json, source_json);

	return {source_json, json_content, ts_content};
};
