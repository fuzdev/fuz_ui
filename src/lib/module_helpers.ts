/**
 * Module path and metadata helpers.
 *
 * Provides utilities for working with source module paths, file types,
 * and import relationships in the package generation system.
 *
 * All functions are prefixed with `module_` for clarity.
 */

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
 * All fields are required - use `MODULE_SOURCE_DEFAULTS` as a starting point
 * and override what you need.
 *
 * @example
 * const options: ModuleSourceOptions = {
 *   ...MODULE_SOURCE_DEFAULTS,
 *   source_root: '/src/routes/',
 *   source_paths: ['/src/routes/'],
 * };
 */
export interface ModuleSourceOptions {
	/** Source root for extracting relative paths (e.g., '/src/lib/'). */
	source_root: string;
	/** Source directory paths to include in filtering. */
	source_paths: Array<string>;
	/** File extensions to include (subset of supported: .ts, .js, .svelte). */
	extensions: Array<string>;
	/** Patterns to exclude (matched against full path). */
	exclude_patterns: Array<RegExp>;
	/**
	 * Skip paths from nested source directories.
	 *
	 * When true, filters out files where the first `/src/` in the path doesn't
	 * lead to one of the `source_paths`. This prevents including files from
	 * nested repositories (e.g., test fixtures containing full projects).
	 *
	 * Files are silently skipped, not rejected with an error.
	 *
	 * @default true
	 *
	 * @example
	 * // With skip_nested_source_dirs: true (default)
	 * // ✓ /project/src/lib/foo.ts - first /src/ leads to /src/lib/
	 * // ✗ /project/src/fixtures/repos/bar/src/lib/x.ts - first /src/ leads to /src/fixtures/ (skipped)
	 */
	skip_nested_source_dirs: boolean;
}

/**
 * Default options for standard SvelteKit library structure.
 */
export const MODULE_SOURCE_DEFAULTS: ModuleSourceOptions = {
	source_root: '/src/lib/',
	source_paths: ['/src/lib/'],
	extensions: ['.ts', '.js', '.svelte'],
	exclude_patterns: [/\.test\.ts$/],
	skip_nested_source_dirs: true,
};

/**
 * Extract module path relative to source root from absolute source ID.
 *
 * @param source_id Absolute path to the source file
 * @param options Module source options for path extraction
 *
 * @example
 * module_extract_path('/home/user/project/src/lib/foo.ts', MODULE_SOURCE_DEFAULTS) // => 'foo.ts'
 * module_extract_path('/home/user/project/src/lib/nested/bar.svelte', MODULE_SOURCE_DEFAULTS) // => 'nested/bar.svelte'
 * module_extract_path('/home/user/project/src/routes/foo.ts', {...MODULE_SOURCE_DEFAULTS, source_root: '/src/routes/'}) // => 'foo.ts'
 */
export const module_extract_path = (source_id: string, options: ModuleSourceOptions): string => {
	const root_index = source_id.indexOf(options.source_root);
	return root_index !== -1
		? source_id.substring(root_index + options.source_root.length)
		: source_id;
};

/**
 * Extract component name from a Svelte module path.
 *
 * @example
 * module_get_component_name('Alert.svelte') // => 'Alert'
 * module_get_component_name('components/Button.svelte') // => 'Button'
 */
export const module_get_component_name = (module_path: string): string =>
	module_path.replace(/^.*\//, '').replace(/\.svelte$/, '');

/**
 * Convert module path to module key format (with ./ prefix).
 *
 * @example
 * module_get_key('foo.ts') // => './foo.ts'
 */
export const module_get_key = (module_path: string): string => `./${module_path}`;

/**
 * Check if a path is a TypeScript or JavaScript file.
 *
 * Includes both `.ts` and `.js` files since JS files are valid in TS projects.
 */
export const module_is_typescript = (path: string): boolean =>
	path.endsWith('.ts') || path.endsWith('.js');

export const module_is_svelte = (path: string): boolean => path.endsWith('.svelte');

export const module_is_css = (path: string): boolean => path.endsWith('.css');

export const module_is_json = (path: string): boolean => path.endsWith('.json');

export const module_is_test = (path: string): boolean => path.endsWith('.test.ts');

/**
 * Check if a path matches source criteria.
 *
 * Checks source directory paths, file extensions, and exclusion patterns.
 *
 * When `skip_nested_source_dirs` is true, skips nested repo paths by ensuring
 * source_paths match starting from the first `/src/` in the path.
 *
 * @param path Full path to check
 * @param options Module source options for filtering
 * @returns True if the path matches all criteria
 */
export const module_matches_source = (path: string, options: ModuleSourceOptions): boolean => {
	// Check if path is in one of the source directories
	const in_source_dir = options.source_paths.some((source_path) => {
		if (!path.includes(source_path)) return false;

		// If nested source dir skipping is enabled and path contains /src/,
		// verify the first /src/ leads to source_path.
		// This skips nested repos like /src/fixtures/repos/foo/src/lib/
		// Paths without /src/ skip this check (the nested repo problem doesn't apply).
		if (options.skip_nested_source_dirs) {
			const first_src_index = path.indexOf('/src/');
			if (first_src_index !== -1) {
				// The source_path should start at the /src/ position
				if (!path.substring(first_src_index).startsWith(source_path)) {
					return false;
				}
			}
		}

		// No nested source dir skipping - just check path contains source_path
		return true;
	});
	if (!in_source_dir) return false;

	// Check if extension matches
	const has_valid_extension = options.extensions.some((ext) => path.endsWith(ext));
	if (!has_valid_extension) return false;

	// Check exclusion patterns
	const is_excluded = options.exclude_patterns.some((pattern) => pattern.test(path));
	if (is_excluded) return false;

	return true;
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
