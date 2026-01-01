/**
 * Diagnostic collection for source analysis.
 *
 * Provides structured error/warning collection during TypeScript and Svelte
 * analysis, replacing silent catch blocks with actionable diagnostics.
 *
 * ## Error Handling Contract
 *
 * Analysis functions follow a two-tier error model:
 *
 * **Accumulated (non-fatal)** - Collected in AnalysisContext, analysis continues:
 * - Type resolution failures (complex generics, circular refs)
 * - Missing or unparseable JSDoc
 * - Individual member/prop extraction failures
 * - The return value is still valid but may have partial data
 *
 * **Thrown (fatal)** - Analysis cannot continue for this file:
 * - File not found or unreadable
 * - Syntax errors preventing parsing
 * - svelte2tsx transformation failures
 * - Svelte version incompatibility
 *
 * ## Usage Pattern
 *
 * ```ts
 * const ctx = new AnalysisContext();
 * const results = files.map(f => {
 *   try {
 *     return library_analyze_module(f, program, options, ctx);
 *   } catch (e) {
 *     // Fatal error - log and skip this file
 *     console.error(`Failed to analyze ${f.id}: ${e}`);
 *     return null;
 *   }
 * });
 *
 * // Results are valid even with accumulated errors
 * // Check ctx for diagnostics to display to user
 * if (ctx.has_errors()) {
 *   for (const err of ctx.errors()) {
 *     console.error(format_diagnostic(err));
 *   }
 * }
 * ```
 *
 * @example
 * const ctx = new AnalysisContext();
 * // ... analysis functions add diagnostics via ctx.add(...)
 * if (ctx.has_errors()) {
 *   for (const err of ctx.errors()) {
 *     console.error(`${err.file}:${err.line}: ${err.message}`);
 *   }
 * }
 *
 * @module
 */

/**
 * Diagnostic severity levels.
 *
 * - `error`: Analysis failed, declaration may be incomplete or missing data
 * - `warning`: Partial success, something seems off but analysis continued
 */
export type DiagnosticSeverity = 'error' | 'warning';

/**
 * Discriminant for diagnostic types.
 */
export type DiagnosticKind =
	| 'type_extraction_failed'
	| 'signature_analysis_failed'
	| 'class_member_failed'
	| 'svelte_prop_failed';

/**
 * Base diagnostic fields shared by all diagnostic types.
 */
export interface BaseDiagnostic {
	kind: DiagnosticKind;
	/** File path relative to project root (display with './' prefix). */
	file: string;
	/** Line number (1-based), or null if location unavailable. */
	line: number | null;
	/** Column number (1-based), or null if location unavailable. */
	column: number | null;
	/** Human-readable description of the issue. */
	message: string;
	severity: DiagnosticSeverity;
}

/**
 * Type extraction failed (e.g., complex or recursive types).
 */
export interface TypeExtractionDiagnostic extends BaseDiagnostic {
	kind: 'type_extraction_failed';
	/** Name of the symbol whose type couldn't be extracted. */
	symbol_name: string;
}

/**
 * Function/method signature analysis failed.
 */
export interface SignatureAnalysisDiagnostic extends BaseDiagnostic {
	kind: 'signature_analysis_failed';
	/** Name of the function or method. */
	function_name: string;
}

/**
 * Class member analysis failed.
 */
export interface ClassMemberDiagnostic extends BaseDiagnostic {
	kind: 'class_member_failed';
	/** Name of the class. */
	class_name: string;
	/** Name of the member that failed. */
	member_name: string;
}

/**
 * Svelte prop type resolution failed.
 */
export interface SveltePropDiagnostic extends BaseDiagnostic {
	kind: 'svelte_prop_failed';
	/** Name of the component. */
	component_name: string;
	/** Name of the prop. */
	prop_name: string;
}

/**
 * Union of all diagnostic types.
 */
export type Diagnostic =
	| TypeExtractionDiagnostic
	| SignatureAnalysisDiagnostic
	| ClassMemberDiagnostic
	| SveltePropDiagnostic;

/**
 * Context for collecting diagnostics during source analysis.
 *
 * Thread an instance through analysis functions to collect errors and warnings
 * without halting analysis. After analysis completes, check `has_errors()` and
 * report collected diagnostics.
 *
 * @example
 * const ctx = new AnalysisContext();
 * ts_analyze_module_exports(source_file, checker, options, ctx);
 * if (ctx.has_errors()) {
 *   console.error('Analysis completed with errors:');
 *   for (const d of ctx.errors()) {
 *     console.error(format_diagnostic(d));
 *   }
 * }
 */
export class AnalysisContext {
	readonly diagnostics: Array<Diagnostic> = [];

	/**
	 * Add a diagnostic to the collection.
	 */
	add(diagnostic: Diagnostic): void {
		this.diagnostics.push(diagnostic);
	}

	/**
	 * Check if any errors were collected.
	 */
	has_errors(): boolean {
		return this.diagnostics.some((d) => d.severity === 'error');
	}

	/**
	 * Check if any warnings were collected.
	 */
	has_warnings(): boolean {
		return this.diagnostics.some((d) => d.severity === 'warning');
	}

	/**
	 * Get all error diagnostics.
	 */
	errors(): Array<Diagnostic> {
		return this.diagnostics.filter((d) => d.severity === 'error');
	}

	/**
	 * Get all warning diagnostics.
	 */
	warnings(): Array<Diagnostic> {
		return this.diagnostics.filter((d) => d.severity === 'warning');
	}

	/**
	 * Get diagnostics of a specific kind.
	 */
	by_kind<K extends DiagnosticKind>(kind: K): Array<Extract<Diagnostic, {kind: K}>> {
		return this.diagnostics.filter((d) => d.kind === kind) as Array<Extract<Diagnostic, {kind: K}>>;
	}
}

/**
 * Options for formatting diagnostics.
 */
export interface FormatDiagnosticOptions {
	/** Prefix for file path (default: './'). */
	prefix?: string;
	/** Base path to strip from absolute file paths (e.g., process.cwd()). */
	strip_base?: string;
}

/**
 * Format a diagnostic for display.
 *
 * @param diagnostic The diagnostic to format
 * @param options Formatting options
 * @returns Formatted string like './file.ts:10:5: error: message'
 */
export const format_diagnostic = (
	diagnostic: Diagnostic,
	options?: FormatDiagnosticOptions,
): string => {
	const prefix = options?.prefix ?? './';
	const strip_base = options?.strip_base;

	let file = diagnostic.file;
	if (strip_base && file.startsWith(strip_base)) {
		file = file.slice(strip_base.length);
		// Remove leading slash if present
		if (file.startsWith('/')) file = file.slice(1);
	}

	const {line, column, severity, message} = diagnostic;
	const location = line !== null ? (column !== null ? `${line}:${column}` : `${line}`) : '';
	const file_part = location ? `${prefix}${file}:${location}` : `${prefix}${file}`;
	return `${file_part}: ${severity}: ${message}`;
};
