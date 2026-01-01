/**
 * Shared test helpers for module analysis tests.
 *
 * Provides consistent test options and program creation for
 * module_helpers, library_analysis, ts_helpers, and svelte_helpers tests.
 */

import ts from 'typescript';

import {
	module_create_source_options,
	type ModuleSourceOptions,
	type ModuleSourcePartial,
} from '$lib/module_helpers.js';

/** Default project root for tests. */
export const TEST_PROJECT_ROOT = '/home/user/project';

/**
 * Create ModuleSourceOptions for testing with consistent defaults.
 *
 * @param project_root Project root path (defaults to TEST_PROJECT_ROOT)
 * @param overrides Optional overrides for default options
 */
export const create_test_source_options = (
	project_root: string = TEST_PROJECT_ROOT,
	overrides?: Partial<ModuleSourcePartial>,
): ModuleSourceOptions => module_create_source_options(project_root, overrides);

/**
 * Create a minimal TypeScript program from source code for testing.
 *
 * Useful for testing analysis functions without reading from disk.
 *
 * @param files Array of virtual files with path and content
 * @returns Program and type checker
 */
export const create_test_program = (
	files: Array<{path: string; content: string}>,
): {program: ts.Program; checker: ts.TypeChecker} => {
	const file_map = new Map(files.map((f) => [f.path, f.content]));

	const compiler_options: ts.CompilerOptions = {
		target: ts.ScriptTarget.Latest,
		module: ts.ModuleKind.ESNext,
		moduleResolution: ts.ModuleResolutionKind.Bundler,
		strict: true,
		skipLibCheck: true,
		noEmit: true,
		allowJs: true,
	};

	const host = ts.createCompilerHost(compiler_options);
	const original_read = host.readFile.bind(host);
	host.readFile = (filename) => file_map.get(filename) ?? original_read(filename);
	host.fileExists = (filename) => file_map.has(filename) || ts.sys.fileExists(filename);

	const program = ts.createProgram(Array.from(file_map.keys()), compiler_options, host);
	return {program, checker: program.getTypeChecker()};
};
