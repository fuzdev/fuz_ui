/**
 * Module path and metadata helpers.
 *
 * Provides utilities for working with source module paths, file types,
 * and import relationships in the package generation system.
 *
 * All functions are prefixed with `module_` for clarity.
 *
 * @module
 */

/**
 * Analyzer type for source files.
 *
 * - `'typescript'` - TypeScript/JS files analyzed via TypeScript Compiler API
 * - `'svelte'` - Svelte components analyzed via svelte2tsx + TypeScript Compiler API
 */
export type AnalyzerType = 'typescript' | 'svelte';

/**
 * File information for source analysis.
 *
 * Can be constructed from Gro's Disknode or from plain file system access.
 * This abstraction enables non-Gro usage while keeping Gro support via adapter.
 *
 * Note: `content` is required to keep analysis functions pure (no hidden I/O).
 * Callers are responsible for reading file content before analysis.
 */
export interface SourceFileInfo {
	/** Absolute path to the file. */
	id: string;
	/** File content (required - analysis functions don't read from disk). */
	content: string;
	/**
	 * Absolute file paths of modules this file imports (optional).
	 * Only include resolved local imports, not node_modules.
	 * Order should be declaration order in source for deterministic output.
	 */
	dependencies?: ReadonlyArray<string>;
	/**
	 * Absolute file paths of modules that import this file (optional).
	 * Only include resolved local imports, not node_modules.
	 */
	dependents?: ReadonlyArray<string>;
}

/**
 * Configuration for module source detection and path extraction.
 *
 * Uses proper path semantics with `project_root` as the base for all path operations.
 * Paths are matched using `startsWith` rather than substring search, which correctly
 * handles nested directories without special heuristics.
 *
 * @example
 * ```ts
 * const options = module_create_source_options(process.cwd(), {
 *   source_paths: ['src/lib', 'src/routes'],
 *   source_root: 'src',
 * });
 * ```
 */
export interface ModuleSourceOptions {
	/**
	 * Absolute path to the project root directory.
	 *
	 * All `source_paths` are relative to this. Typically `process.cwd()` when
	 * running from the project root via Gro, Vite, or other build tools.
	 *
	 * @example
	 * ```ts
	 * '/home/user/my-project'
	 * ```
	 */
	project_root: string;
	/**
	 * Source directory paths to include, relative to `project_root`.
	 *
	 * Paths should not have leading or trailing slashes - they are added
	 * internally for correct matching.
	 *
	 * @example
	 * ```ts
	 * ['src/lib'] // single source directory
	 * ```
	 * @example
	 * ```ts
	 * ['src/lib', 'src/routes'] // multiple directories
	 * ```
	 */
	source_paths: Array<string>;
	/**
	 * Source root for extracting relative module paths, relative to `project_root`.
	 *
	 * When omitted:
	 * - Single `source_path`: defaults to that path
	 * - Multiple `source_paths`: required (no auto-derivation)
	 *
	 * @example
	 * ```ts
	 * 'src/lib' // module paths like 'foo.ts', 'utils/bar.ts'
	 * ```
	 * @example
	 * ```ts
	 * 'src' // module paths like 'lib/foo.ts', 'routes/page.svelte'
	 * ```
	 */
	source_root?: string;
	/** Patterns to exclude (matched against full path). */
	exclude_patterns: Array<RegExp>;
	/**
	 * Determine which analyzer to use for a file path.
	 *
	 * Called for files in source directories. Return `'typescript'`, `'svelte'`,
	 * or `null` to skip the file. This is the single source of truth for which
	 * files are analyzable and how to analyze them.
	 *
	 * @default Uses file extension: `.svelte` → svelte, `.ts`/`.js` → typescript
	 *
	 * @example
	 * ```ts
	 * // Add MDsveX support
	 * get_analyzer: (path) => {
	 *   if (path.endsWith('.svelte') || path.endsWith('.svx')) return 'svelte';
	 *   if (path.endsWith('.ts') || path.endsWith('.js')) return 'typescript';
	 *   return null;
	 * }
	 * ```
	 *
	 * @example
	 * ```ts
	 * // Include .d.ts files
	 * get_analyzer: (path) => {
	 *   if (path.endsWith('.svelte')) return 'svelte';
	 *   if (path.endsWith('.ts') || path.endsWith('.d.ts') || path.endsWith('.js')) return 'typescript';
	 *   return null;
	 * }
	 * ```
	 */
	get_analyzer: (path: string) => AnalyzerType | null;
}

/**
 * Default analyzer resolver based on file extension.
 *
 * - `.svelte` → `'svelte'`
 * - `.ts`, `.js` → `'typescript'`
 * - Other extensions → `null` (skip)
 */
export const module_get_analyzer_default = (path: string): AnalyzerType | null => {
	if (module_is_svelte(path)) return 'svelte';
	if (module_is_typescript(path)) return 'typescript';
	return null;
};

/**
 * Partial source options without `project_root`.
 *
 * Use with `module_create_source_options` to build complete options.
 */
export type ModuleSourcePartial = Omit<ModuleSourceOptions, 'project_root'>;

/**
 * Default partial options for standard SvelteKit library structure.
 *
 * Does not include `project_root` - use `module_create_source_options()` to create
 * complete options with your project root.
 */
export const MODULE_SOURCE_PARTIAL: ModuleSourcePartial = {
	source_paths: ['src/lib'],
	exclude_patterns: [/\.test\.ts$/],
	get_analyzer: module_get_analyzer_default,
};

/**
 * Create complete source options from project root and optional overrides.
 *
 * @param project_root Absolute path to project root (typically `process.cwd()`)
 * @param overrides Optional overrides for default options
 *
 * @example
 * ```ts
 * // Standard SvelteKit library
 * const options = module_create_source_options(process.cwd());
 * ```
 *
 * @example
 * ```ts
 * // Multiple source directories
 * const options = module_create_source_options(process.cwd(), {
 *   source_paths: ['src/lib', 'src/routes'],
 *   source_root: 'src',
 * });
 * ```
 *
 * @example
 * ```ts
 * // Custom exclusions
 * const options = module_create_source_options(process.cwd(), {
 *   exclude_patterns: [/\.test\.ts$/, /\.internal\.ts$/],
 * });
 * ```
 */
export const module_create_source_options = (
	project_root: string,
	overrides?: Partial<ModuleSourcePartial>,
): ModuleSourceOptions => ({
	project_root,
	...MODULE_SOURCE_PARTIAL,
	...overrides,
});

/**
 * Validate `ModuleSourceOptions` format and consistency.
 *
 * Checks:
 * 1. `project_root` is an absolute path (starts with `/`)
 * 2. `source_paths` entries don't have leading/trailing slashes
 * 3. `source_root` (if provided) doesn't have leading/trailing slashes
 * 4. Multiple `source_paths` require explicit `source_root`
 * 5. `source_root` is a prefix of all `source_paths`
 *
 * @throws Error if validation fails
 *
 * @example
 * ```ts
 * // Valid - single source path (source_root auto-derived)
 * module_validate_source_options({
 *   project_root: '/home/user/project',
 *   source_paths: ['src/lib'],
 *   ...
 * });
 * ```
 *
 * @example
 * ```ts
 * // Valid - multiple source paths with explicit source_root
 * module_validate_source_options({
 *   project_root: '/home/user/project',
 *   source_paths: ['src/lib', 'src/routes'],
 *   source_root: 'src',
 *   ...
 * });
 * ```
 *
 * @example
 * ```ts
 * // Invalid - multiple source paths without source_root
 * module_validate_source_options({
 *   project_root: '/home/user/project',
 *   source_paths: ['src/lib', 'src/routes'],  // throws
 *   ...
 * });
 * ```
 */
export const module_validate_source_options = (options: ModuleSourceOptions): void => {
	const {project_root, source_paths, source_root} = options;

	// Validate project_root is absolute
	if (!project_root.startsWith('/')) {
		throw new Error(`project_root must be an absolute path (start with "/"): "${project_root}"`);
	}

	// Validate project_root doesn't have trailing slash (we add it internally)
	if (project_root.endsWith('/')) {
		throw new Error(
			`project_root should not have trailing slash: "${project_root}". ` +
				`Trailing slashes are added internally for correct matching.`,
		);
	}

	// Validate source_paths
	if (source_paths.length === 0) {
		throw new Error('source_paths must have at least one entry');
	}

	for (const source_path of source_paths) {
		if (source_path.startsWith('/')) {
			throw new Error(
				`source_paths entry should not start with "/": "${source_path}". ` +
					`Paths are relative to project_root.`,
			);
		}
		if (source_path.endsWith('/')) {
			throw new Error(
				`source_paths entry should not end with "/": "${source_path}". ` +
					`Trailing slashes are added internally for correct matching.`,
			);
		}
	}

	// Validate source_root if provided
	if (source_root !== undefined) {
		if (source_root.startsWith('/')) {
			throw new Error(
				`source_root should not start with "/": "${source_root}". ` +
					`Paths are relative to project_root.`,
			);
		}
		if (source_root.endsWith('/')) {
			throw new Error(
				`source_root should not end with "/": "${source_root}". ` +
					`Trailing slashes are added internally for correct matching.`,
			);
		}

		// Validate each source_path starts with source_root
		for (const source_path of source_paths) {
			// source_path should equal source_root or start with source_root/
			if (source_path !== source_root && !source_path.startsWith(source_root + '/')) {
				throw new Error(
					`source_paths entry "${source_path}" must start with source_root "${source_root}". ` +
						`module_extract_path uses source_root to compute module paths.`,
				);
			}
		}
	} else if (source_paths.length > 1) {
		// Multiple source_paths without source_root - error
		throw new Error(
			`source_root is required when source_paths has multiple entries. ` +
				`Got source_paths: [${source_paths.map((p) => `"${p}"`).join(', ')}]. ` +
				`Provide source_root to specify the common prefix for module path extraction.`,
		);
	}
};

/**
 * Get the effective source_root from options.
 *
 * Returns `source_root` if provided, otherwise returns `source_paths[0]` for single-path configs.
 *
 * @throws Error if source_root is required but not provided (multiple source_paths)
 */
export const module_get_source_root = (options: ModuleSourceOptions): string => {
	if (options.source_root !== undefined) {
		return options.source_root;
	}
	if (options.source_paths.length === 1) {
		return options.source_paths[0]!;
	}
	throw new Error(
		`source_root is required when source_paths has multiple entries. ` +
			`Got source_paths: [${options.source_paths.map((p) => `"${p}"`).join(', ')}].`,
	);
};

/**
 * Extract module path relative to source root from absolute source ID.
 *
 * Uses proper path semantics: strips `project_root/source_root/` prefix.
 *
 * @param source_id Absolute path to the source file
 * @param options Module source options for path extraction
 *
 * @example
 * ```ts
 * const options = module_create_source_options('/home/user/project');
 * module_extract_path('/home/user/project/src/lib/foo.ts', options) // => 'foo.ts'
 * module_extract_path('/home/user/project/src/lib/nested/bar.svelte', options) // => 'nested/bar.svelte'
 * ```
 *
 * @example
 * ```ts
 * const options = module_create_source_options('/home/user/project', {
 *   source_paths: ['src/lib', 'src/routes'],
 *   source_root: 'src',
 * });
 * module_extract_path('/home/user/project/src/lib/foo.ts', options) // => 'lib/foo.ts'
 * module_extract_path('/home/user/project/src/routes/page.svelte', options) // => 'routes/page.svelte'
 * ```
 */
export const module_extract_path = (source_id: string, options: ModuleSourceOptions): string => {
	const effective_root = module_get_source_root(options);
	// Build the full prefix: project_root + '/' + source_root + '/'
	const prefix = options.project_root + '/' + effective_root + '/';

	if (source_id.startsWith(prefix)) {
		return source_id.slice(prefix.length);
	}
	// Fallback: return full path if prefix doesn't match (shouldn't happen with valid inputs)
	return source_id;
};

/**
 * Extract component name from a Svelte module path.
 *
 * @example
 * ```ts
 * module_get_component_name('Alert.svelte') // => 'Alert'
 * module_get_component_name('components/Button.svelte') // => 'Button'
 * ```
 */
export const module_get_component_name = (module_path: string): string =>
	module_path.replace(/^.*\//, '').replace(/\.svelte$/, '');

/**
 * Convert module path to module key format (with ./ prefix).
 *
 * @example
 * ```ts
 * module_get_key('foo.ts') // => './foo.ts'
 * ```
 */
export const module_get_key = (module_path: string): string => `./${module_path}`;

/**
 * Check if a path is a TypeScript or JS file.
 *
 * Includes both `.ts` and `.js` files since JS files are valid in TS projects.
 * Excludes `.d.ts` declaration files - use a custom `get_analyzer` to include them.
 */
export const module_is_typescript = (path: string): boolean =>
	(path.endsWith('.ts') && !path.endsWith('.d.ts')) || path.endsWith('.js');

export const module_is_svelte = (path: string): boolean => path.endsWith('.svelte');

export const module_is_css = (path: string): boolean => path.endsWith('.css');

export const module_is_json = (path: string): boolean => path.endsWith('.json');

export const module_is_test = (path: string): boolean => path.endsWith('.test.ts');

/**
 * Check if a path is an analyzable source file.
 *
 * Combines all filtering: exclusion patterns, source directory paths,
 * and analyzer availability. This is the single check for whether a
 * file should be included in library analysis.
 *
 * Uses proper path semantics with `startsWith` matching against
 * `project_root/source_path/`. No heuristics needed - nested directories
 * are correctly excluded by the prefix check.
 *
 * @param path Full absolute path to check
 * @param options Module source options for filtering
 * @returns True if the path is an analyzable source file
 *
 * @example
 * ```ts
 * const options = module_create_source_options('/home/user/project');
 * module_is_source('/home/user/project/src/lib/foo.ts', options) // => true
 * module_is_source('/home/user/project/src/lib/foo.test.ts', options) // => false (excluded)
 * module_is_source('/home/user/project/src/fixtures/mini/src/lib/bar.ts', options) // => false (wrong prefix)
 * ```
 */
export const module_is_source = (path: string, options: ModuleSourceOptions): boolean => {
	// Check exclusion patterns first (fast regex check)
	const is_excluded = options.exclude_patterns.some((pattern) => pattern.test(path));
	if (is_excluded) return false;

	// Check if path starts with project_root/source_path/
	// Using startsWith with trailing slash ensures correct directory matching
	const in_source_dir = options.source_paths.some((source_path) => {
		const full_prefix = options.project_root + '/' + source_path + '/';
		return path.startsWith(full_prefix);
	});
	if (!in_source_dir) return false;

	// Check if file type is analyzable
	return options.get_analyzer(path) !== null;
};

/**
 * Extract dependencies and dependents for a module from source file info.
 *
 * Filters to only include source modules (excludes external packages, node_modules, tests).
 * Returns sorted arrays of module paths (relative to source_root) for deterministic output.
 *
 * @param source_file The source file info to extract dependencies from
 * @param options Module source options for filtering and path extraction
 */
export const module_extract_dependencies = (
	source_file: SourceFileInfo,
	options: ModuleSourceOptions,
): {dependencies: Array<string>; dependents: Array<string>} => {
	const dependencies: Array<string> = [];
	const dependents: Array<string> = [];

	// Extract dependencies (files this module imports) if provided
	if (source_file.dependencies) {
		for (const dep_id of source_file.dependencies) {
			if (module_is_source(dep_id, options)) {
				dependencies.push(module_extract_path(dep_id, options));
			}
		}
	}

	// Extract dependents (files that import this module) if provided
	if (source_file.dependents) {
		for (const dependent_id of source_file.dependents) {
			if (module_is_source(dependent_id, options)) {
				dependents.push(module_extract_path(dependent_id, options));
			}
		}
	}

	// Sort for deterministic output
	dependencies.sort();
	dependents.sort();

	return {dependencies, dependents};
};
