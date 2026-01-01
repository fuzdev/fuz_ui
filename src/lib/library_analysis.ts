/**
 * Library source analysis - unified entry point and shared types.
 *
 * Provides a single function for analyzing TypeScript and Svelte source files,
 * dispatching to the appropriate domain-specific analyzer.
 *
 * This module also exports shared types used by both analyzers:
 * - `DeclarationAnalysis` - A declaration with its nodocs flag
 * - `ReExportInfo` - Information about a same-name re-export
 * - `ModuleAnalysis` - Result of analyzing a module (unified structure)
 *
 * @example
 * ```ts
 * import {library_analyze_module} from '@fuzdev/fuz_ui/library_analysis.js';
 * import {ts_create_program} from '@fuzdev/fuz_ui/ts_helpers.js';
 * import {MODULE_SOURCE_DEFAULTS} from '@fuzdev/fuz_ui/module_helpers.js';
 * import {AnalysisContext} from '@fuzdev/fuz_ui/analysis_context.js';
 *
 * const {program} = ts_create_program({root: './my-project'});
 * const ctx = new AnalysisContext();
 *
 * const result = library_analyze_module(
 *   {id: '/my-project/src/lib/file.ts', content: '...'},
 *   program,
 *   MODULE_SOURCE_DEFAULTS,
 *   ctx,
 * );
 *
 * if (result) {
 *   // Filter out @nodocs declarations
 *   const declarations = result.declarations
 *     .filter(d => !d.nodocs)
 *     .map(d => d.declaration);
 *   console.log('Declarations:', declarations);
 * }
 * ```
 *
 * @see ts_helpers.ts for TypeScript-specific analysis
 * @see svelte_helpers.ts for Svelte component analysis
 * @see module_helpers.ts for path utilities and SourceFileInfo
 */

import ts from 'typescript';
import type {Logger} from '@fuzdev/fuz_util/log.js';
import type {DeclarationJson} from '@fuzdev/fuz_util/source_json.js';

import {ts_analyze_module} from './ts_helpers.js';
import {svelte_analyze_module} from './svelte_helpers.js';
import {
	type SourceFileInfo,
	type ModuleSourceOptions,
	module_extract_path,
} from './module_helpers.js';
import type {AnalysisContext} from './analysis_context.js';

/**
 * Result of analyzing a single declaration.
 * Used by both TypeScript and Svelte analyzers for uniform handling.
 */
export interface DeclarationAnalysis {
	/** The analyzed declaration metadata. */
	declaration: DeclarationJson;
	/** Whether the declaration is marked @nodocs (should be excluded from documentation). */
	nodocs: boolean;
}

/**
 * Information about a same-name re-export.
 * Used for post-processing to build `also_exported_from` arrays.
 */
export interface ReExportInfo {
	/** Name of the re-exported declaration. */
	name: string;
	/** Module path (relative to src/lib) where the declaration is originally declared. */
	original_module: string;
}

/**
 * Result of analyzing a module (TypeScript or Svelte).
 * Both analyzers return this same structure for uniform handling.
 */
export interface ModuleAnalysis {
	/** Module path relative to source root. */
	path: string;
	/** Module-level documentation comment. */
	module_comment?: string;
	/** All declarations with nodocs flags - consumer filters based on policy. */
	declarations: Array<DeclarationAnalysis>;
	/** Dependencies (other source modules this module imports). Empty if none. */
	dependencies: Array<string>;
	/** Dependents (other source modules that import this module). Empty if none. */
	dependents: Array<string>;
	/** Star exports (`export * from './module'`). Empty for Svelte components. */
	star_exports: Array<string>;
	/** Re-exports discovered during analysis. Empty for Svelte components. */
	re_exports: Array<ReExportInfo>;
}

/**
 * Analyze a source file and extract module metadata.
 *
 * Unified entry point that dispatches to the appropriate analyzer based on file type:
 * - TypeScript/JavaScript files → `ts_analyze_module`
 * - Svelte components → `svelte_analyze_module`
 *
 * Returns raw analysis data including `nodocs` flags on declarations.
 * Consumer is responsible for filtering based on their policy.
 *
 * This function can be called incrementally - consumers may cache results and
 * only re-analyze changed files. The TypeScript program should include all files
 * for accurate type resolution, but only changed files need re-analysis.
 *
 * @param source_file The source file info with content and optional dependency data
 * @param program TypeScript program (used for type checking and source file lookup)
 * @param options Module source options for path extraction
 * @param ctx Analysis context for collecting diagnostics
 * @param log Optional logger for warnings
 * @returns Module metadata and re-exports, or undefined if source file not found in program
 */
export const library_analyze_module = (
	source_file: SourceFileInfo,
	program: ts.Program,
	options: ModuleSourceOptions,
	ctx: AnalysisContext,
	log?: Logger,
): ModuleAnalysis | undefined => {
	const checker = program.getTypeChecker();
	const module_path = module_extract_path(source_file.id, options);
	const analyzer_type = options.get_analyzer(source_file.id);

	if (analyzer_type === 'svelte') {
		return svelte_analyze_module(source_file, module_path, checker, options, ctx);
	}

	if (analyzer_type === 'typescript') {
		const ts_source_file = program.getSourceFile(source_file.id);
		if (!ts_source_file) {
			log?.warn(`Could not get source file from program: ${source_file.id}`);
			return undefined;
		}
		return ts_analyze_module(source_file, ts_source_file, module_path, checker, options, ctx);
	}

	// analyzer_type is null - skip this file
	log?.warn(`No analyzer for file: ${source_file.id}`);
	return undefined;
};
