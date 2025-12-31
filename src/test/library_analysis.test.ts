import {test, assert, describe} from 'vitest';
import ts from 'typescript';

import {library_analyze_module} from '$lib/library_analysis.js';
import {MODULE_SOURCE_DEFAULTS, type ModuleSourceOptions} from '$lib/module_helpers.js';
import {AnalysisContext} from '$lib/analysis_context.js';

/**
 * Create a minimal TypeScript program from source code for testing.
 */
const create_test_program = (
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

describe('library_analyze_module', () => {
	const options: ModuleSourceOptions = {
		...MODULE_SOURCE_DEFAULTS,
		source_root: '/project/src/lib/',
	};

	test('dispatches to TypeScript analyzer for .ts files', () => {
		const {program} = create_test_program([
			{
				path: '/project/src/lib/helpers.ts',
				content: `
/**
 * Module comment.
 */

export const VALUE = 42;
export function helper(): string { return 'hello'; }
`,
			},
		]);

		const ctx = new AnalysisContext();
		const result = library_analyze_module(
			{id: '/project/src/lib/helpers.ts', content: 'unused - program has it'},
			program,
			options,
			ctx,
		);

		assert.ok(result);
		assert.strictEqual(result.path, 'helpers.ts');
		assert.strictEqual(result.module_comment, 'Module comment.');
		assert.strictEqual(result.declarations.length, 2);

		const names = result.declarations.map((d) => d.declaration.name);
		assert.include(names, 'VALUE');
		assert.include(names, 'helper');
	});

	test('dispatches to Svelte analyzer for .svelte files', () => {
		const svelte_content = `<script lang="ts">
/**
 * A test component.
 */

let {name, count = 0}: {name: string; count?: number} = $props();
</script>
<p>Hello {name}, count: {count}</p>`;

		const ctx = new AnalysisContext();

		// Create a minimal program for the analysis
		const {program} = create_test_program([{path: '/project/src/lib/Test.svelte', content: ''}]);

		// For Svelte, we pass the actual content in source_file
		const result = library_analyze_module(
			{id: '/project/src/lib/Test.svelte', content: svelte_content},
			program,
			options,
			ctx,
		);

		assert.ok(result);
		assert.strictEqual(result.path, 'Test.svelte');
		assert.strictEqual(result.declarations.length, 1);

		const component = result.declarations[0]!.declaration;
		assert.strictEqual(component.name, 'Test');
		assert.strictEqual(component.kind, 'component');
		assert.ok(component.props);
		assert.strictEqual(component.props.length, 2);
	});

	test('derives module_path correctly from source_file.id', () => {
		const {program} = create_test_program([
			{
				path: '/project/src/lib/utils/string_helpers.ts',
				content: `export const trim = (s: string) => s.trim();`,
			},
		]);

		const ctx = new AnalysisContext();
		const result = library_analyze_module(
			{id: '/project/src/lib/utils/string_helpers.ts', content: ''},
			program,
			options,
			ctx,
		);

		assert.ok(result);
		// Should strip source_root prefix
		assert.strictEqual(result.path, 'utils/string_helpers.ts');
	});

	test('derives module_path with custom source_root', () => {
		const custom_options: ModuleSourceOptions = {
			...MODULE_SOURCE_DEFAULTS,
			source_root: '/custom/root/',
		};

		const {program} = create_test_program([
			{
				path: '/custom/root/my_module.ts',
				content: `export const x = 1;`,
			},
		]);

		const ctx = new AnalysisContext();
		const result = library_analyze_module(
			{id: '/custom/root/my_module.ts', content: ''},
			program,
			custom_options,
			ctx,
		);

		assert.ok(result);
		assert.strictEqual(result.path, 'my_module.ts');
	});

	test('returns undefined when TypeScript file not in program', () => {
		// Create program without the file we'll try to analyze
		const {program} = create_test_program([
			{path: '/project/src/lib/other.ts', content: 'export const x = 1;'},
		]);

		const ctx = new AnalysisContext();
		const result = library_analyze_module(
			{id: '/project/src/lib/missing.ts', content: 'export const y = 2;'},
			program,
			options,
			ctx,
		);

		// Should return undefined because file isn't in program
		assert.isUndefined(result);
	});

	test('passes dependencies from SourceFileInfo to result', () => {
		const {program} = create_test_program([
			{
				path: '/project/src/lib/consumer.ts',
				content: `export const value = 'test';`,
			},
		]);

		const ctx = new AnalysisContext();
		const result = library_analyze_module(
			{
				id: '/project/src/lib/consumer.ts',
				content: '',
				dependencies: ['/project/src/lib/dep_a.ts', '/project/src/lib/dep_b.ts'],
				dependents: ['/project/src/lib/user.ts'],
			},
			program,
			options,
			ctx,
		);

		assert.ok(result);
		// Dependencies should be filtered to source modules and converted to relative paths
		assert.ok(Array.isArray(result.dependencies));
		assert.ok(Array.isArray(result.dependents));
	});

	test('handles .js files as TypeScript', () => {
		const {program} = create_test_program([
			{
				path: '/project/src/lib/script.js',
				content: `export const config = {debug: true};`,
			},
		]);

		const ctx = new AnalysisContext();
		const result = library_analyze_module(
			{id: '/project/src/lib/script.js', content: ''},
			program,
			options,
			ctx,
		);

		assert.ok(result);
		assert.strictEqual(result.path, 'script.js');
		assert.strictEqual(result.declarations.length, 1);
		assert.strictEqual(result.declarations[0]!.declaration.name, 'config');
	});
});

describe('library_analyze_module required arrays invariant', () => {
	const options: ModuleSourceOptions = {
		...MODULE_SOURCE_DEFAULTS,
		source_root: '/project/src/lib/',
	};

	test('TypeScript module returns all array fields as arrays (never undefined)', () => {
		const {program} = create_test_program([
			{
				path: '/project/src/lib/simple.ts',
				content: `export const x = 1;`,
			},
		]);

		const ctx = new AnalysisContext();
		const result = library_analyze_module(
			{id: '/project/src/lib/simple.ts', content: ''},
			program,
			options,
			ctx,
		);

		assert.ok(result);

		// All array fields must be arrays, not undefined
		assert.ok(Array.isArray(result.declarations), 'declarations should be array');
		assert.ok(Array.isArray(result.dependencies), 'dependencies should be array');
		assert.ok(Array.isArray(result.dependents), 'dependents should be array');
		assert.ok(Array.isArray(result.star_exports), 'star_exports should be array');
		assert.ok(Array.isArray(result.re_exports), 're_exports should be array');
	});

	test('Svelte module returns all array fields as arrays (never undefined)', () => {
		const {program} = create_test_program([
			{path: '/project/src/lib/Component.svelte', content: ''},
		]);

		const svelte_content = `<script lang="ts">
let {value}: {value: string} = $props();
</script>
<p>{value}</p>`;

		const ctx = new AnalysisContext();
		const result = library_analyze_module(
			{id: '/project/src/lib/Component.svelte', content: svelte_content},
			program,
			options,
			ctx,
		);

		assert.ok(result);

		// All array fields must be arrays, not undefined
		assert.ok(Array.isArray(result.declarations), 'declarations should be array');
		assert.ok(Array.isArray(result.dependencies), 'dependencies should be array');
		assert.ok(Array.isArray(result.dependents), 'dependents should be array');
		assert.ok(Array.isArray(result.star_exports), 'star_exports should be array');
		assert.ok(Array.isArray(result.re_exports), 're_exports should be array');
	});

	test('TypeScript module with no exports still has empty arrays', () => {
		const {program} = create_test_program([
			{
				path: '/project/src/lib/internal.ts',
				content: `const internal = 'not exported';`,
			},
		]);

		const ctx = new AnalysisContext();
		const result = library_analyze_module(
			{id: '/project/src/lib/internal.ts', content: ''},
			program,
			options,
			ctx,
		);

		assert.ok(result);
		assert.strictEqual(result.declarations.length, 0);
		assert.strictEqual(result.dependencies.length, 0);
		assert.strictEqual(result.dependents.length, 0);
		assert.strictEqual(result.star_exports.length, 0);
		assert.strictEqual(result.re_exports.length, 0);
	});

	test('Svelte component with no props still has empty arrays for non-declaration fields', () => {
		const {program} = create_test_program([{path: '/project/src/lib/Static.svelte', content: ''}]);

		const svelte_content = `<p>Static content</p>`;

		const ctx = new AnalysisContext();
		const result = library_analyze_module(
			{id: '/project/src/lib/Static.svelte', content: svelte_content},
			program,
			options,
			ctx,
		);

		assert.ok(result);
		// Should still have the component declaration
		assert.strictEqual(result.declarations.length, 1);
		// Other arrays should be empty
		assert.strictEqual(result.dependencies.length, 0);
		assert.strictEqual(result.dependents.length, 0);
		assert.strictEqual(result.star_exports.length, 0);
		assert.strictEqual(result.re_exports.length, 0);
	});
});

describe('library_analyze_module error handling', () => {
	const options: ModuleSourceOptions = {
		...MODULE_SOURCE_DEFAULTS,
		source_root: '/project/src/lib/',
	};

	test('returns undefined for TypeScript file not in program (logs warning)', () => {
		const {program} = create_test_program([
			{path: '/project/src/lib/exists.ts', content: 'export const x = 1;'},
		]);

		const ctx = new AnalysisContext();
		const warnings: Array<string> = [];
		const mock_log = {
			warn: (msg: string) => warnings.push(msg),
		};

		const result = library_analyze_module(
			{id: '/project/src/lib/not_exists.ts', content: 'export const y = 2;'},
			program,
			options,
			ctx,
			mock_log as any,
		);

		assert.isUndefined(result);
		assert.strictEqual(warnings.length, 1);
		assert.include(warnings[0], 'not_exists.ts');
	});

	test('Svelte analyzer throws on severely malformed content', () => {
		const {program} = create_test_program([{path: '/project/src/lib/Bad.svelte', content: ''}]);

		// Malformed template with unclosed expression
		const bad_content = `<script lang="ts">
let {name}: {name: string} = $props();
</script>
<p>{name</p>`;

		const ctx = new AnalysisContext();

		assert.throws(() => {
			library_analyze_module(
				{id: '/project/src/lib/Bad.svelte', content: bad_content},
				program,
				options,
				ctx,
			);
		});
	});

	test('analysis context collects diagnostics without halting', () => {
		const {program} = create_test_program([
			{
				path: '/project/src/lib/valid.ts',
				content: `
export const value = 42;
export function fn(): string { return 'test'; }
`,
			},
		]);

		const ctx = new AnalysisContext();
		const result = library_analyze_module(
			{id: '/project/src/lib/valid.ts', content: ''},
			program,
			options,
			ctx,
		);

		assert.ok(result);
		// Valid code should produce no diagnostics
		assert.strictEqual(ctx.diagnostics.length, 0);
		assert.strictEqual(ctx.has_errors(), false);
	});
});
