/**
 * Gro-specific library metadata generation.
 *
 * This module provides Gro integration for library generation. It uses svelte-docinfo's
 * pure analysis (`library_analyze`) and wraps the results with fuz_ui's opinionated
 * LibraryJson format (GitHub/npm metadata).
 *
 * For build-tool agnostic usage, see `@fuzdev/svelte-docinfo`.
 *
 * @see @fuzdev/svelte-docinfo/library_analyze.js for the generic analysis entry point
 * @see @fuzdev/svelte-docinfo/library_pipeline.js for pipeline helpers
 * @see library_output.js for output file generation
 *
 * @module
 */

import type {Gen} from '@ryanatkn/gro';
import {package_json_load} from '@ryanatkn/gro/package_json.js';
import type {Disknode} from '@ryanatkn/gro/disknode.js';
import {
	library_analyze,
	type OnDuplicatesCallback,
} from '@fuzdev/svelte-docinfo/library_analyze.js';
import type {SourceJson} from '@fuzdev/fuz_util/source_json.js';
import {
	type SourceFileInfo,
	type ModuleSourceOptions,
	type ModuleSourcePartial,
	module_create_source_options,
	module_validate_source_options,
	module_is_source,
	module_get_source_root,
} from '@fuzdev/svelte-docinfo/module_helpers.js';

import {library_generate_output} from './library_output.js';

/** Options for Gro library generation. */
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
	 * Use `library_throw_on_duplicates` for strict flat namespace enforcement.
	 *
	 * @example
	 * // Throw on duplicates (strict flat namespace)
	 * library_gen({ on_duplicates: library_throw_on_duplicates });
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
 * This is the Gro-specific entry point. It handles:
 * - Reading files from Gro's filer
 * - Loading package.json via Gro utilities
 * - Analyzing source with svelte-docinfo (pure analysis)
 * - Wrapping with LibraryJson (GitHub/npm metadata)
 * - Returning output in Gro's Gen format
 *
 * For build-tool agnostic usage, use `library_analyze` directly.
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
		dependencies: 'all',
		generate: async ({log, filer}) => {
			log.info('generating library metadata with full TypeScript analysis...');

			// Build source options with project_root from cwd
			const source_options: ModuleSourceOptions =
				options?.source && 'project_root' in options.source
					? options.source
					: module_create_source_options(process.cwd(), options?.source);

			// Ensure filer is initialized
			await filer.init();

			// Read package.json
			const package_json = await package_json_load();

			// Collect source files from Gro filer
			const source_files = library_collect_source_files_from_disknodes(
				filer.files.values(),
				source_options,
				log,
			);

			// Get pure analysis from svelte-docinfo (no package metadata)
			const {modules} = library_analyze({
				source_files,
				source_options,
				on_duplicates: options?.on_duplicates,
				log: log as any, // Type cast needed due to workspace dependency duplication
			});

			// Wrap modules with package metadata (fuz_ui's own SourceJson type)
			const source_json: SourceJson = {
				name: package_json.name,
				version: package_json.version,
				repository:
					typeof package_json.repository === 'string'
						? package_json.repository
						: package_json.repository?.url,
				modules,
			};

			// Generate output files with fuz_ui's LibraryJson wrapper
			const {json_content, ts_content} = library_generate_output(package_json, source_json);

			log.info('library metadata generation complete');

			// Return array of files in Gro's expected format
			return [{content: ts_content}, {content: json_content, filename: 'library.json'}];
		},
	};
};
