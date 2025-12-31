/**
 * Library source analysis - unified entry point.
 *
 * Provides a single function for analyzing TypeScript and Svelte source files,
 * dispatching to the appropriate domain-specific analyzer.
 *
 * This is the main consumer-facing API for source analysis. For pipeline
 * orchestration (collection, validation, re-export merging), see `library_gen_helpers.ts`.
 *
 * @example
 * ```ts
 * import {library_analyze_module} from '@fuzdev/fuz_ui/library_analysis.js';
 * import {ts_create_program} from '@fuzdev/fuz_ui/ts_helpers.js';
 * import {MODULE_SOURCE_DEFAULTS} from '@fuzdev/fuz_ui/module_helpers.js';
 * import {AnalysisContext} from '@fuzdev/fuz_ui/analysis_context.js';
 *
 * const program = ts_create_program({root: './my-project'});
 * const ctx = new AnalysisContext();
 *
 * const result = library_analyze_module(
 *   {id: '/path/to/file.ts', content: '...'},
 *   'file.ts',
 *   program,
 *   MODULE_SOURCE_DEFAULTS,
 *   ctx,
 * );
 *
 * if (result) {
 *   console.log('Module:', result.module);
 * }
 * ```
 *
 * @see ts_helpers.ts for TypeScript-specific analysis
 * @see svelte_helpers.ts for Svelte component analysis
 * @see module_helpers.ts for path utilities and SourceFileInfo
 */

import ts from 'typescript';
import type {Logger} from '@fuzdev/fuz_util/log.js';
import type {ModuleJson} from '@fuzdev/fuz_util/source_json.js';

import {type ReExportInfo, ts_analyze_module} from './ts_helpers.js';
import {svelte_analyze_module} from './svelte_helpers.js';
import {type SourceFileInfo, type ModuleSourceOptions, module_is_svelte} from './module_helpers.js';
import type {AnalysisContext} from './analysis_context.js';

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
 * This function can be called incrementally - consumers may cache results and
 * only re-analyze changed files. The TypeScript program should include all files
 * for accurate type resolution, but only changed files need re-analysis.
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
