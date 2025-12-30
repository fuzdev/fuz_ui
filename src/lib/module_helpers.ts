/**
 * Module path and metadata helpers.
 *
 * Provides utilities for working with source module paths, file types,
 * and import relationships in the package generation system.
 *
 * All functions are prefixed with `module_` for clarity.
 */

/**
 * Minimal file information for source analysis.
 *
 * Can be constructed from Gro's Disknode or from plain file system access.
 * This abstraction enables non-Gro usage while keeping Gro support via adapter.
 */
export interface SourceFileInfo {
	/** Absolute path to the file. */
	id: string;
	/** Optional pre-read content (avoids re-reading from disk). */
	content?: string;
	/** Module paths this file imports (optional, for dependency tracking). */
	dependencies?: Iterable<string>;
	/** Module paths that import this file (optional, for dependent tracking). */
	dependents?: Iterable<string>;
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
}

/**
 * Default options for standard SvelteKit library structure.
 */
export const MODULE_SOURCE_DEFAULTS: ModuleSourceOptions = {
	source_root: '/src/lib/',
	source_paths: ['/src/lib/'],
	extensions: ['.ts', '.js', '.svelte'],
	exclude_patterns: [/\.test\.ts$/],
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
 * Rejects nested repo paths by ensuring the first `/src/` leads to the source directory
 * (e.g. rejects `/src/fixtures/repos/foo/src/lib/index.ts` because `/src/fixtures/` ≠ `/src/lib/`).
 *
 * @param path Full path to check
 * @param options Module source options for filtering
 * @returns True if the path matches all criteria
 */
export const module_matches_source = (path: string, options: ModuleSourceOptions): boolean => {
	// Check if path is in one of the source directories
	// The first /src/ in the path must lead directly to the source directory
	// This rejects nested repos like /src/fixtures/repos/foo/src/lib/
	const in_source_dir = options.source_paths.some((source_path) => {
		if (!path.includes(source_path)) return false;
		// Find the first /src/ and verify it's part of the source_path
		const first_src_index = path.indexOf('/src/');
		if (first_src_index === -1) return false;
		// The source_path should start at that position
		return path.substring(first_src_index).startsWith(source_path);
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
