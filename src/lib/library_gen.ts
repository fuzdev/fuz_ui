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
 * @see `library_analysis.ts` for the unified analysis entry point
 * @see `library_gen_helpers.ts` for pipeline orchestration helpers
 * @see `tsdoc_helpers.ts` for JSDoc/TSDoc parsing
 * @see `ts_helpers.ts` for TypeScript analysis
 * @see `svelte_helpers.ts` for Svelte component analysis
 *
 * @module
 */

import type {Gen} from '@ryanatkn/gro';
import {package_json_load} from '@ryanatkn/gro/package_json.js';
import type {Disknode} from '@ryanatkn/gro/disknode.js';
import type {SourceJson, ModuleJson} from '@fuzdev/fuz_util/source_json.js';

import {ts_create_program} from './ts_helpers.js';
import {
	type SourceFileInfo,
	type ModuleSourceOptions,
	type ModuleSourcePartial,
	module_create_source_options,
	module_validate_source_options,
	module_is_source,
	module_get_source_root,
} from './module_helpers.js';
import {library_analyze_module} from './library_analysis.js';
import {
	library_sort_modules,
	library_find_duplicates,
	library_merge_re_exports,
	type CollectedReExport,
	type DuplicateInfo,
} from './library_gen_helpers.js';
import {library_generate_json} from './library_gen_output.js';
import {AnalysisContext, format_diagnostic} from './analysis_context.js';

/** Options for library generation. */
export interface LibraryGenOptions {
	/**
	 * Module source options for filtering and path extraction.
	 *
	 * Can provide full `ModuleSourceOptions` or partial options that will be
	 * merged with defaults. The `project_root` is automatically set to
	 * `process.cwd()` if not provided.
	 */
	source?: ModuleSourceOptions | Partial<ModuleSourcePartial>;
	/**
	 * Callback invoked when duplicate declaration names are found.
	 *
	 * Consumers decide how to handle duplicates: throw, warn, or ignore.
	 * Use `library_gen_throw_on_duplicates` for strict flat namespace enforcement.
	 *
	 * @example
	 * // Throw on duplicates (strict flat namespace)
	 * library_gen({ on_duplicates: library_gen_throw_on_duplicates });
	 *
	 * // Warn but continue
	 * library_gen({
	 *   on_duplicates: (dupes, log) => {
	 *     for (const [name, locs] of dupes) {
	 *       log.warn(`Duplicate: ${name} in ${locs.map(l => l.module).join(', ')}`);
	 *     }
	 *   }
	 * });
	 */
	on_duplicates?: OnDuplicatesCallback;
}

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
 * Use this callback with `library_gen({ on_duplicates: library_gen_throw_on_duplicates })`
 * to enforce a flat namespace where all declaration names must be unique.
 *
 * @throws Error if any duplicate declaration names are found
 */
export const library_gen_throw_on_duplicates: OnDuplicatesCallback = (duplicates, log) => {
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
			'(2) add /** @nodocs */ to exclude from documentation. ' +
			'See CLAUDE.md "Declaration namespacing" section for details.',
	);
};

/**
 * Convert Gro's Disknode to the build-tool agnostic SourceFileInfo interface.
 *
 * Use this when you want to analyze files using Gro's filer directly.
 *
 * @throws Error if disknode has no content (should be loaded by Gro filer)
 */
export const source_file_from_disknode = (disknode: Disknode): SourceFileInfo => {
	if (disknode.contents == null) {
		throw new Error(
			`Source file has no content: ${disknode.id} (ensure Gro filer loads file contents)`,
		);
	}
	return {
		id: disknode.id,
		content: disknode.contents,
		dependencies: [...disknode.dependencies.keys()],
		dependents: [...disknode.dependents.keys()],
	};
};

// TODO more generic helpers
/**
 * Collect source files from Gro disknodes, filtering BEFORE conversion to SourceFileInfo.
 *
 * This avoids errors from files outside source directories (like test fixtures that may
 * have malformed paths or missing content). The filtering uses `module_is_source` which
 * checks `source_paths` to only include files in configured source directories.
 *
 * @param disknodes Iterator of Gro disknodes from filer
 * @param options Module source options for filtering
 * @param log Optional logger for status messages
 */
export const library_collect_source_files_from_disknodes = (
	disknodes: Iterable<Disknode>,
	options: ModuleSourceOptions,
	log?: {info: (...args: Array<unknown>) => void; warn: (...args: Array<unknown>) => void},
): Array<SourceFileInfo> => {
	// Validate options early to fail fast on misconfiguration
	module_validate_source_options(options);

	const all_disknodes = Array.from(disknodes);
	log?.info(`received ${all_disknodes.length} files total from filer`);

	const source_files: Array<SourceFileInfo> = [];
	for (const disknode of all_disknodes) {
		// Filter by source_paths BEFORE trying to convert
		// This avoids errors from test fixtures or other non-source files
		if (!module_is_source(disknode.id, options)) {
			continue;
		}
		source_files.push(source_file_from_disknode(disknode));
	}

	log?.info(`found ${source_files.length} source files to analyze`);

	if (source_files.length === 0) {
		const effective_root = module_get_source_root(options);
		log?.warn(`No source files found in ${effective_root} - generating empty library metadata`);
		return [];
	}

	// Sort for deterministic output (stable alphabetical module ordering)
	source_files.sort((a, b) => a.id.localeCompare(b.id));

	return source_files;
};

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
	return {
		generate: async ({log, filer}) => {
			log.info('generating library metadata with full TypeScript analysis...');

			// Build source options with project_root from cwd
			const source_options: ModuleSourceOptions =
				options?.source && 'project_root' in options.source
					? options.source
					: module_create_source_options(process.cwd(), options?.source);

			// Validate options early to fail fast on misconfiguration
			// (before expensive operations like program creation)
			module_validate_source_options(source_options);

			// Ensure filer is initialized
			await filer.init();

			// Read package.json
			const package_json = await package_json_load();

			// Create TypeScript program
			const {program} = ts_create_program(undefined, log);

			// Create analysis context for collecting diagnostics
			const ctx = new AnalysisContext();

			// Collect source files, filtering by source_options BEFORE converting to SourceFileInfo
			// This avoids errors from files outside source directories (like test fixtures)
			const source_files = library_collect_source_files_from_disknodes(
				filer.files.values(),
				source_options,
				log,
			);

			// Collect modules (declared before source_json to include directly)
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
			if (options?.on_duplicates) {
				const duplicates = library_find_duplicates(source_json);
				if (duplicates.size > 0) {
					options.on_duplicates(duplicates, log);
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
