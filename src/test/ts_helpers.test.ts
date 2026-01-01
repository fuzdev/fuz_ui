import {test, assert, describe, beforeAll} from 'vitest';
import ts from 'typescript';
import type {DeclarationJson} from '@fuzdev/fuz_util/source_json.js';

import {
	ts_analyze_module_exports,
	ts_analyze_module,
	ts_create_program,
	ts_extract_signature_parameters,
} from '$lib/ts_helpers.js';
import {module_create_source_options, type ModuleSourceOptions} from '$lib/module_helpers.js';
import {AnalysisContext} from '$lib/analysis_context.js';

import {
	load_fixtures,
	validate_declaration_structure,
	create_test_program,
	create_multi_file_program,
	extract_declaration_from_source,
	type TsFixture,
} from './fixtures/ts/ts_test_helpers.js';
import {normalize_json} from './test_helpers.js';

// Test helper for consistent options
const test_options = (
	overrides?: Partial<Omit<ModuleSourceOptions, 'project_root'>>,
): ModuleSourceOptions => module_create_source_options(process.cwd(), overrides);

let fixtures: Array<TsFixture> = [];

beforeAll(async () => {
	fixtures = await load_fixtures();
});

describe('TypeScript helpers (fixture-based)', () => {
	test('all fixtures extract correctly', () => {
		for (const fixture of fixtures) {
			// Create a source file
			const source_file = ts.createSourceFile(
				`${fixture.name}.ts`,
				fixture.input,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TS,
			);

			// Create a program with this source file for type checking
			const {checker} = create_test_program(source_file, `${fixture.name}.ts`);

			// Extract the declaration from the source file
			const result = extract_declaration_from_source(source_file, checker, fixture.category);

			// Compare with expected (normalize to match JSON serialization)
			assert.deepEqual(
				normalize_json(result),
				normalize_json(fixture.expected),
				`Fixture "${fixture.category}/${fixture.name}" failed`,
			);
		}
	});

	test('all fixtures have valid structure', () => {
		for (const fixture of fixtures) {
			// Skip module_comment category (returns string, not DeclarationJson)
			if (fixture.category === 'module_comment') continue;

			// Validate declaration structure
			validate_declaration_structure(fixture.expected as DeclarationJson);
		}
	});

	test('class fixtures correctly exclude private fields', () => {
		const private_fields_fixture = fixtures.find(
			(f) => f.category === 'class' && f.name === 'fields_private',
		);

		if (!private_fields_fixture) {
			throw new Error('fields_private fixture not found');
		}

		const result = private_fields_fixture.expected as DeclarationJson;

		// Verify that #count, #max, and #reset are NOT in the members
		if (result.members) {
			const member_names = result.members.map((m) => m.name);
			assert.notInclude(member_names, '#count', 'Private field #count should be excluded');
			assert.notInclude(member_names, '#max', 'Private field #max should be excluded');
			assert.notInclude(member_names, '#reset', 'Private method #reset should be excluded');

			// Verify that public members ARE included
			assert.include(member_names, 'name', 'Public field name should be included');
			assert.include(member_names, 'get_count', 'Public method get_count should be included');
			assert.include(member_names, 'increment', 'Public method increment should be included');
		} else {
			throw new Error('Expected members to be defined for Counter class');
		}
	});
});

describe('ts_analyze_module_exports', () => {
	test('extracts module comment and all exported identifiers', () => {
		const source_code = `
/**
 * Test module with exports.
 *
 * @module
 */

export const foo = 42;
export function bar(): string { return 'bar'; }
export type Baz = { value: number };
`;

		const source_file = ts.createSourceFile('test.ts', source_code, ts.ScriptTarget.Latest, true);
		const {checker} = create_test_program(source_file, 'test.ts');

		const result = ts_analyze_module_exports(
			source_file,
			checker,
			test_options(),
			new AnalysisContext(),
		);

		// Should have module comment
		assert.strictEqual(result.module_comment, 'Test module with exports.');

		// Should have 3 identifiers
		assert.strictEqual(result.declarations.length, 3);

		const names = result.declarations.map((i) => i.declaration.name);
		assert.include(names, 'foo');
		assert.include(names, 'bar');
		assert.include(names, 'Baz');
	});

	test('handles module with no exports', () => {
		const source_code = `
/**
 * Module with no exports.
 *
 * @module
 */

const internal = 'not exported';
`;

		const source_file = ts.createSourceFile('empty.ts', source_code, ts.ScriptTarget.Latest, true);
		const {checker} = create_test_program(source_file, 'empty.ts');

		const result = ts_analyze_module_exports(
			source_file,
			checker,
			test_options(),
			new AnalysisContext(),
		);

		assert.strictEqual(result.module_comment, 'Module with no exports.');
		assert.strictEqual(result.declarations.length, 0);
	});

	test('handles module with no comment', () => {
		const source_code = `
export const foo = 'no comment';
export const bar = 123;
`;

		const source_file = ts.createSourceFile(
			'no_comment.ts',
			source_code,
			ts.ScriptTarget.Latest,
			true,
		);
		const {checker} = create_test_program(source_file, 'no_comment.ts');

		const result = ts_analyze_module_exports(
			source_file,
			checker,
			test_options(),
			new AnalysisContext(),
		);

		assert.isUndefined(result.module_comment);
		assert.strictEqual(result.declarations.length, 2);
	});

	test('extracts full declaration metadata', () => {
		const source_code = `
/**
 * Adds two numbers.
 * @param a First number
 * @param b Second number
 * @returns The sum
 */
export function add(a: number, b: number): number {
	return a + b;
}
`;

		const source_file = ts.createSourceFile('math.ts', source_code, ts.ScriptTarget.Latest, true);
		const {checker} = create_test_program(source_file, 'math.ts');

		const result = ts_analyze_module_exports(
			source_file,
			checker,
			test_options(),
			new AnalysisContext(),
		);

		assert.strictEqual(result.declarations.length, 1);

		const add_fn = result.declarations[0]!.declaration;
		assert.strictEqual(add_fn.name, 'add');
		assert.strictEqual(add_fn.kind, 'function');
		assert.strictEqual(add_fn.doc_comment, 'Adds two numbers.');
		assert.strictEqual(add_fn.return_type, 'number');
		assert.strictEqual(add_fn.return_description, 'The sum');
		assert.ok(add_fn.parameters);
		assert.strictEqual(add_fn.parameters.length, 2);
		const first_param = add_fn.parameters[0];
		assert.ok(first_param);
		assert.strictEqual(first_param.name, 'a');
		assert.strictEqual(first_param.description, 'First number');
	});

	test('handles class exports with members', () => {
		const source_code = `
export class Counter {
	value: number = 0;

	increment(): void {
		this.value++;
	}
}
`;

		const source_file = ts.createSourceFile(
			'counter.ts',
			source_code,
			ts.ScriptTarget.Latest,
			true,
		);
		const {checker} = create_test_program(source_file, 'counter.ts');

		const result = ts_analyze_module_exports(
			source_file,
			checker,
			test_options(),
			new AnalysisContext(),
		);

		assert.strictEqual(result.declarations.length, 1);

		const counter = result.declarations[0]!.declaration;
		assert.strictEqual(counter.name, 'Counter');
		assert.strictEqual(counter.kind, 'class');
		assert.ok(counter.members);
		assert.isTrue(counter.members.length >= 2);

		const member_names = counter.members.map((m) => m.name);
		assert.include(member_names, 'value');
		assert.include(member_names, 'increment');
	});

	test('handles type exports with properties', () => {
		const source_code = `
export interface Config {
	/** The name of the configuration. */
	name: string;
	/** Whether the config is enabled. */
	enabled: boolean;
}
`;

		const source_file = ts.createSourceFile('config.ts', source_code, ts.ScriptTarget.Latest, true);
		const {checker} = create_test_program(source_file, 'config.ts');

		const result = ts_analyze_module_exports(
			source_file,
			checker,
			test_options(),
			new AnalysisContext(),
		);

		assert.strictEqual(result.declarations.length, 1);

		const config = result.declarations[0]!.declaration;
		assert.strictEqual(config.name, 'Config');
		assert.strictEqual(config.kind, 'type');
		assert.ok(config.properties);
		assert.strictEqual(config.properties.length, 2);
	});

	test('handles re-exports', () => {
		const source_code = `
const internal_value = 42;
export { internal_value as exported_value };
`;

		const source_file = ts.createSourceFile(
			'reexport.ts',
			source_code,
			ts.ScriptTarget.Latest,
			true,
		);
		const {checker} = create_test_program(source_file, 'reexport.ts');

		const result = ts_analyze_module_exports(
			source_file,
			checker,
			test_options(),
			new AnalysisContext(),
		);

		// Should have the re-exported value
		assert.strictEqual(result.declarations.length, 1);
		assert.strictEqual(result.declarations[0]!.declaration.name, 'exported_value');
	});

	test('handles mixed export kinds in same module', () => {
		const source_code = `
/**
 * Module with all kinds of exports.
 */

export const VERSION = '1.0.0';

export function greet(name: string): string {
	return \`Hello, \${name}\`;
}

export type Config = {
	debug: boolean;
};

export interface Logger {
	log(message: string): void;
}

export class Service {
	start(): void {}
}
`;

		const source_file = ts.createSourceFile('mixed.ts', source_code, ts.ScriptTarget.Latest, true);
		const {checker} = create_test_program(source_file, 'mixed.ts');

		const result = ts_analyze_module_exports(
			source_file,
			checker,
			test_options(),
			new AnalysisContext(),
		);

		// Should have 5 identifiers of different kinds
		assert.strictEqual(result.declarations.length, 5);

		const by_name = new Map(result.declarations.map((i) => [i.declaration.name, i.declaration]));

		// Check each kind
		const version = by_name.get('VERSION');
		assert.ok(version);
		assert.strictEqual(version.kind, 'variable');

		const greet = by_name.get('greet');
		assert.ok(greet);
		assert.strictEqual(greet.kind, 'function');

		const config = by_name.get('Config');
		assert.ok(config);
		assert.strictEqual(config.kind, 'type');

		const logger = by_name.get('Logger');
		assert.ok(logger);
		assert.strictEqual(logger.kind, 'type');

		const service = by_name.get('Service');
		assert.ok(service);
		assert.strictEqual(service.kind, 'class');
	});

	test('returns @nodocs identifiers with nodocs flag for consumer filtering', () => {
		const source_code = `
/**
 * Module with nodocs exports.
 */

export const public_value = 42;

/**
 * Helper excluded from documentation.
 * @nodocs
 */
export function nodocs_helper(): void {}

/** @nodocs */
export type NodocsType = { secret: string };

export function public_function(): string {
	return 'public';
}
`;

		const source_file = ts.createSourceFile('nodocs.ts', source_code, ts.ScriptTarget.Latest, true);
		const {checker} = create_test_program(source_file, 'nodocs.ts');

		const result = ts_analyze_module_exports(
			source_file,
			checker,
			test_options(),
			new AnalysisContext(),
		);

		// Should have ALL 4 identifiers - filtering is now consumer responsibility
		assert.strictEqual(result.declarations.length, 4);

		const names = result.declarations.map((i) => i.declaration.name);
		assert.include(names, 'public_value');
		assert.include(names, 'public_function');
		assert.include(names, 'nodocs_helper');
		assert.include(names, 'NodocsType');

		// Verify nodocs flags are correctly set
		const by_name = new Map(result.declarations.map((d) => [d.declaration.name, d]));

		assert.strictEqual(by_name.get('public_value')!.nodocs, false);
		assert.strictEqual(by_name.get('public_function')!.nodocs, false);
		assert.strictEqual(by_name.get('nodocs_helper')!.nodocs, true);
		assert.strictEqual(by_name.get('NodocsType')!.nodocs, true);

		// Consumer can filter like this:
		const public_only = result.declarations.filter((d) => !d.nodocs);
		assert.strictEqual(public_only.length, 2);
	});

	test('detects same-name re-exports and tracks in re_exports array', () => {
		const {checker, source_files} = create_multi_file_program([
			{
				path: '/src/lib/helpers.ts',
				content: `
/** A helper function. */
export function helper(): void {}

export const CONSTANT = 42;
`,
			},
			{
				path: '/src/lib/index.ts',
				content: `
// Re-export from helpers
export {helper, CONSTANT} from './helpers.js';

// Direct export
export const local_value = 'local';
`,
			},
		]);

		const index_file = source_files.get('/src/lib/index.ts')!;
		const virtual_options = module_create_source_options('', {source_paths: ['src/lib']});
		const result = ts_analyze_module_exports(
			index_file,
			checker,
			virtual_options,
			new AnalysisContext(),
		);

		// index.ts should only have local_value as a direct export
		// helper and CONSTANT are re-exports and should be in re_exports array
		assert.strictEqual(result.declarations.length, 1);
		assert.strictEqual(result.declarations[0]!.declaration.name, 'local_value');

		// re_exports should contain the two re-exported identifiers
		assert.strictEqual(result.re_exports.length, 2);

		const re_export_names = result.re_exports.map((r) => r.name);
		assert.include(re_export_names, 'helper');
		assert.include(re_export_names, 'CONSTANT');

		// Each re-export should reference the original module
		for (const re_export of result.re_exports) {
			assert.strictEqual(re_export.original_module, 'helpers.ts');
		}
	});

	test('handles renamed re-exports with alias_of metadata', () => {
		const {checker, source_files} = create_multi_file_program([
			{
				path: '/src/lib/internal.ts',
				content: `
/** Internal implementation. */
export function internal_impl(): string {
	return 'internal';
}
`,
			},
			{
				path: '/src/lib/public.ts',
				content: `
// Renamed re-export
export {internal_impl as public_api} from './internal.js';
`,
			},
		]);

		const public_file = source_files.get('/src/lib/public.ts')!;
		const virtual_options = module_create_source_options('', {source_paths: ['src/lib']});
		const result = ts_analyze_module_exports(
			public_file,
			checker,
			virtual_options,
			new AnalysisContext(),
		);

		// Renamed re-export creates a NEW declaration with alias_of
		assert.strictEqual(result.declarations.length, 1);
		const declaration = result.declarations[0]!.declaration;
		assert.strictEqual(declaration.name, 'public_api');
		assert.ok(declaration.alias_of);
		assert.strictEqual(declaration.alias_of.module, 'internal.ts');
		assert.strictEqual(declaration.alias_of.name, 'internal_impl');

		// Should not be in re_exports (renamed exports are tracked as new declarations)
		assert.strictEqual(result.re_exports.length, 0);
	});

	test('handles mixed direct exports and re-exports', () => {
		const {checker, source_files} = create_multi_file_program([
			{
				path: '/src/lib/utils.ts',
				content: `
export const util_a = 'a';
export const util_b = 'b';
`,
			},
			{
				path: '/src/lib/mixed.ts',
				content: `
// Direct exports
export function direct_fn(): void {}
export type DirectType = { value: string };

// Same-name re-export
export {util_a} from './utils.js';

// Renamed re-export
export {util_b as renamed_util} from './utils.js';
`,
			},
		]);

		const mixed_file = source_files.get('/src/lib/mixed.ts')!;
		const virtual_options = module_create_source_options('', {source_paths: ['src/lib']});
		const result = ts_analyze_module_exports(
			mixed_file,
			checker,
			virtual_options,
			new AnalysisContext(),
		);

		// Should have 3 identifiers: direct_fn, DirectType, renamed_util
		assert.strictEqual(result.declarations.length, 3);

		const names = result.declarations.map((i) => i.declaration.name);
		assert.include(names, 'direct_fn');
		assert.include(names, 'DirectType');
		assert.include(names, 'renamed_util');
		assert.notInclude(names, 'util_a'); // same-name re-export excluded

		// renamed_util should have alias_of
		const renamed = result.declarations.find((i) => i.declaration.name === 'renamed_util');
		assert.ok(renamed?.declaration.alias_of);
		assert.strictEqual(renamed.declaration.alias_of.module, 'utils.ts');
		assert.strictEqual(renamed.declaration.alias_of.name, 'util_b');

		// re_exports should contain util_a
		assert.strictEqual(result.re_exports.length, 1);
		assert.strictEqual(result.re_exports[0]!.name, 'util_a');
		assert.strictEqual(result.re_exports[0]!.original_module, 'utils.ts');
	});
});

describe('ts_create_program with TsProgramOptions', () => {
	test('creates program with default options', () => {
		// Uses current directory and default tsconfig.json
		const {program, checker} = ts_create_program();

		assert.ok(program);
		assert.ok(checker);
		assert.ok(program.getSourceFiles().length > 0);
	});

	test('creates program with explicit root', () => {
		// Explicit root pointing to project directory
		const {program} = ts_create_program({root: './'});

		assert.ok(program);
		assert.ok(program.getSourceFiles().length > 0);
	});

	test('creates program with custom compiler options', () => {
		// Override strict mode
		const {program} = ts_create_program({
			compiler_options: {
				strict: false,
			},
		});

		assert.ok(program);
		// Verify program was created (compiler options are merged)
		assert.ok(program.getSourceFiles().length > 0);
	});

	test('throws when tsconfig not found', () => {
		// Non-existent directory
		assert.throws(() => ts_create_program({root: '/non/existent/path'}), /No tsconfig\.json found/);
	});

	test('throws with custom tsconfig name when not found', () => {
		// Try to use a non-existent custom tsconfig name
		assert.throws(
			() => ts_create_program({tsconfig: 'nonexistent.config.json'}),
			/No nonexistent\.config\.json found/,
		);
	});
});

describe('diagnostic collection in ts_analyze_module_exports', () => {
	test('collects diagnostics without halting analysis', () => {
		// A module with valid exports - should produce no diagnostics
		const source_code = `
export const value = 42;
export function fn(): string { return 'test'; }
`;

		const source_file = ts.createSourceFile('test.ts', source_code, ts.ScriptTarget.Latest, true);
		const {checker} = create_test_program(source_file, 'test.ts');
		const ctx = new AnalysisContext();

		const result = ts_analyze_module_exports(source_file, checker, test_options(), ctx);

		// Should have successful analysis
		assert.strictEqual(result.declarations.length, 2);
		// No diagnostics for valid code
		assert.strictEqual(ctx.diagnostics.length, 0);
	});

	test('analysis context is threaded through to all declarations', () => {
		// Multiple exports - context should be used for each
		const source_code = `
export const a = 1;
export const b = 2;
export const c = 3;
export function fn(): number { return 1; }
export class MyClass {
	value: number = 0;
}
`;

		const source_file = ts.createSourceFile('multi.ts', source_code, ts.ScriptTarget.Latest, true);
		const {checker} = create_test_program(source_file, 'multi.ts');
		const ctx = new AnalysisContext();

		const result = ts_analyze_module_exports(source_file, checker, test_options(), ctx);

		// All declarations should be extracted successfully
		assert.strictEqual(result.declarations.length, 5);
		// No diagnostics for valid code
		assert.strictEqual(ctx.has_errors(), false);
		assert.strictEqual(ctx.has_warnings(), false);
	});

	test('extracts source_line for each declaration', () => {
		const source_code = `
export const first = 1;

export const second = 2;

export function third(): void {}
`;

		const source_file = ts.createSourceFile('lines.ts', source_code, ts.ScriptTarget.Latest, true);
		const {checker} = create_test_program(source_file, 'lines.ts');
		const ctx = new AnalysisContext();

		const result = ts_analyze_module_exports(source_file, checker, test_options(), ctx);

		// Each declaration should have a source_line
		for (const {declaration: decl} of result.declarations) {
			assert.ok(decl.source_line, `Declaration ${decl.name} should have source_line`);
			assert.ok(decl.source_line > 0, `source_line should be positive for ${decl.name}`);
		}

		// Verify relative ordering (second comes after first)
		const first_decl = result.declarations.find((d) => d.declaration.name === 'first')!.declaration;
		const second_decl = result.declarations.find(
			(d) => d.declaration.name === 'second',
		)!.declaration;
		assert.ok(second_decl.source_line! > first_decl.source_line!);
	});
});

describe('re-export chains', () => {
	test('handles re-export chain (A → B → C)', () => {
		// C.ts exports original, B.ts re-exports from C, A.ts re-exports from B
		const {checker, source_files} = create_multi_file_program([
			{
				path: '/src/lib/c.ts',
				content: `
/** Original declaration in C. */
export const original = 'from C';
`,
			},
			{
				path: '/src/lib/b.ts',
				content: `
// Re-export from C
export {original} from './c.js';
`,
			},
			{
				path: '/src/lib/a.ts',
				content: `
// Re-export from B (which re-exports from C)
export {original} from './b.js';
`,
			},
		]);

		const ctx = new AnalysisContext();
		const virtual_options = module_create_source_options('', {source_paths: ['src/lib']});

		// Analyze C - should have the original declaration
		const c_file = source_files.get('/src/lib/c.ts')!;
		const c_result = ts_analyze_module_exports(c_file, checker, virtual_options, ctx);
		assert.strictEqual(c_result.declarations.length, 1);
		assert.strictEqual(c_result.declarations[0]!.declaration.name, 'original');
		assert.strictEqual(c_result.re_exports.length, 0);

		// Analyze B - should track re-export from C
		const b_file = source_files.get('/src/lib/b.ts')!;
		const b_result = ts_analyze_module_exports(b_file, checker, virtual_options, ctx);
		assert.strictEqual(b_result.declarations.length, 0); // No direct declarations
		assert.strictEqual(b_result.re_exports.length, 1);
		assert.strictEqual(b_result.re_exports[0]!.name, 'original');
		assert.strictEqual(b_result.re_exports[0]!.original_module, 'c.ts');

		// Analyze A - TypeScript resolves re-export chains to original source
		const a_file = source_files.get('/src/lib/a.ts')!;
		const a_result = ts_analyze_module_exports(a_file, checker, virtual_options, ctx);
		assert.strictEqual(a_result.declarations.length, 0);
		assert.strictEqual(a_result.re_exports.length, 1);
		assert.strictEqual(a_result.re_exports[0]!.name, 'original');
		// TypeScript's getAliasedSymbol resolves to the ORIGINAL source (C), not intermediate (B)
		// This is expected behavior - re-export chains resolve to origin
		assert.strictEqual(a_result.re_exports[0]!.original_module, 'c.ts');
	});

	test('handles mixed direct exports and re-export chains', () => {
		const {checker, source_files} = create_multi_file_program([
			{
				path: '/src/lib/base.ts',
				content: `
export const base_value = 'base';
`,
			},
			{
				path: '/src/lib/combined.ts',
				content: `
// Direct export
export const local_value = 'local';

// Re-export from base
export {base_value} from './base.js';
`,
			},
		]);

		const ctx = new AnalysisContext();
		const combined_file = source_files.get('/src/lib/combined.ts')!;
		const virtual_options = module_create_source_options('', {source_paths: ['src/lib']});
		const result = ts_analyze_module_exports(combined_file, checker, virtual_options, ctx);

		// Should have local_value as direct declaration
		assert.strictEqual(result.declarations.length, 1);
		assert.strictEqual(result.declarations[0]!.declaration.name, 'local_value');

		// Should have base_value as re-export
		assert.strictEqual(result.re_exports.length, 1);
		assert.strictEqual(result.re_exports[0]!.name, 'base_value');
	});
});

describe('star exports tracking', () => {
	test('detects export * from statements', () => {
		const {checker, source_files} = create_multi_file_program([
			{
				path: '/src/lib/helpers.ts',
				content: `
export const helper_a = 'a';
export const helper_b = 'b';
export function helper_fn(): void {}
`,
			},
			{
				path: '/src/lib/index.ts',
				content: `
// Star export - re-exports all from helpers
export * from './helpers.js';

// Direct export
export const index_value = 'index';
`,
			},
		]);

		const ctx = new AnalysisContext();
		const index_file = source_files.get('/src/lib/index.ts')!;
		const virtual_options = module_create_source_options('', {source_paths: ['src/lib']});
		const result = ts_analyze_module_exports(index_file, checker, virtual_options, ctx);

		// star_exports should contain helpers.ts
		assert.strictEqual(result.star_exports.length, 1);
		assert.strictEqual(result.star_exports[0], 'helpers.ts');

		// Direct export should be in declarations
		assert.ok(result.declarations.some((d) => d.declaration.name === 'index_value'));

		// TypeScript expands export * to individual symbols via getExportsOfModule,
		// which are then tracked as re_exports (same-name re-exports from source modules)
		// The count depends on how TypeScript resolves the star export
		// At minimum, we've verified the star_exports array captures the namespace-level info
	});

	test('handles multiple star exports', () => {
		const {checker, source_files} = create_multi_file_program([
			{
				path: '/src/lib/utils_a.ts',
				content: `export const util_a = 'a';`,
			},
			{
				path: '/src/lib/utils_b.ts',
				content: `export const util_b = 'b';`,
			},
			{
				path: '/src/lib/barrel.ts',
				content: `
export * from './utils_a.js';
export * from './utils_b.js';
`,
			},
		]);

		const ctx = new AnalysisContext();
		const barrel_file = source_files.get('/src/lib/barrel.ts')!;
		const virtual_options = module_create_source_options('', {source_paths: ['src/lib']});
		const result = ts_analyze_module_exports(barrel_file, checker, virtual_options, ctx);

		// Should have both star exports
		assert.strictEqual(result.star_exports.length, 2);
		assert.include(result.star_exports, 'utils_a.ts');
		assert.include(result.star_exports, 'utils_b.ts');
	});

	test('excludes star exports from external modules', () => {
		// When export * from a node_modules package, it shouldn't appear in star_exports
		const source_code = `
// This would be a star export from an external package
// We can't easily test this without actual node_modules,
// but we verify the logic works for source modules only
export const local = 'value';
`;

		const source_file = ts.createSourceFile('test.ts', source_code, ts.ScriptTarget.Latest, true);
		const {checker} = create_test_program(source_file, 'test.ts');
		const ctx = new AnalysisContext();

		const result = ts_analyze_module_exports(source_file, checker, test_options(), ctx);

		// No star exports in this simple case
		assert.strictEqual(result.star_exports.length, 0);
	});

	test('mixed star exports and named re-exports', () => {
		const {checker, source_files} = create_multi_file_program([
			{
				path: '/src/lib/types.ts',
				content: `
export type Config = { value: string };
export type Options = { enabled: boolean };
`,
			},
			{
				path: '/src/lib/utils.ts',
				content: `
export const util_fn = (): void => {};
`,
			},
			{
				path: '/src/lib/combined.ts',
				content: `
// Star export
export * from './types.js';

// Named re-export
export {util_fn} from './utils.js';

// Direct export
export const combined_value = 'combined';
`,
			},
		]);

		const ctx = new AnalysisContext();
		const combined_file = source_files.get('/src/lib/combined.ts')!;
		const virtual_options = module_create_source_options('', {source_paths: ['src/lib']});
		const result = ts_analyze_module_exports(combined_file, checker, virtual_options, ctx);

		// Star export for types.ts
		assert.strictEqual(result.star_exports.length, 1);
		assert.strictEqual(result.star_exports[0], 'types.ts');

		// Named re-export for util_fn
		assert.ok(result.re_exports.some((r) => r.name === 'util_fn'));

		// Direct declaration
		assert.ok(result.declarations.some((d) => d.declaration.name === 'combined_value'));

		// The star_exports array provides namespace-level info about types.ts
		// Individual type exports (Config, Options) may or may not appear in re_exports
		// depending on TypeScript's expansion behavior
	});

	test('star exports return empty array when no star exports present', () => {
		const source_code = `
export const value = 42;
export function fn(): void {}
`;

		const source_file = ts.createSourceFile(
			'no_star.ts',
			source_code,
			ts.ScriptTarget.Latest,
			true,
		);
		const {checker} = create_test_program(source_file, 'no_star.ts');
		const ctx = new AnalysisContext();

		const result = ts_analyze_module_exports(source_file, checker, test_options(), ctx);

		// star_exports should be empty array, not undefined
		assert.ok(Array.isArray(result.star_exports));
		assert.strictEqual(result.star_exports.length, 0);
	});
});

describe('ts_analyze_module with SourceFileInfo dependencies', () => {
	test('passes dependencies from SourceFileInfo to result', () => {
		const source_code = `export const value = 42;`;

		const source_file = ts.createSourceFile(
			'consumer.ts',
			source_code,
			ts.ScriptTarget.Latest,
			true,
		);
		const {checker} = create_test_program(source_file, 'consumer.ts');
		const ctx = new AnalysisContext();

		const options = module_create_source_options('/project', {
			source_paths: ['src/lib'],
		});

		const result = ts_analyze_module(
			{
				id: '/project/src/lib/consumer.ts',
				content: source_code,
				dependencies: [
					'/project/src/lib/dep_a.ts',
					'/project/src/lib/dep_b.ts',
					'/project/node_modules/external/index.js', // should be filtered
				],
				dependents: ['/project/src/lib/user.ts'],
			},
			source_file,
			'consumer.ts',
			checker,
			options,
			ctx,
		);

		// Dependencies should be filtered to source modules only
		assert.ok(Array.isArray(result.dependencies));
		assert.include(result.dependencies, 'dep_a.ts');
		assert.include(result.dependencies, 'dep_b.ts');
		// External deps should be filtered out
		assert.notInclude(result.dependencies, '/project/node_modules/external/index.js');

		assert.ok(Array.isArray(result.dependents));
		assert.include(result.dependents, 'user.ts');
	});

	test('returns empty arrays when SourceFileInfo has no dependencies', () => {
		const source_code = `export const standalone = true;`;

		const source_file = ts.createSourceFile(
			'standalone.ts',
			source_code,
			ts.ScriptTarget.Latest,
			true,
		);
		const {checker} = create_test_program(source_file, 'standalone.ts');
		const ctx = new AnalysisContext();

		const options = module_create_source_options('/project', {
			source_paths: ['src/lib'],
		});

		const result = ts_analyze_module(
			{
				id: '/project/src/lib/standalone.ts',
				content: source_code,
				// No dependencies or dependents provided
			},
			source_file,
			'standalone.ts',
			checker,
			options,
			ctx,
		);

		// Should return empty arrays, not undefined
		assert.ok(Array.isArray(result.dependencies));
		assert.ok(Array.isArray(result.dependents));
		assert.strictEqual(result.dependencies.length, 0);
		assert.strictEqual(result.dependents.length, 0);
	});

	test('all array fields are always arrays (never undefined)', () => {
		const source_code = `export const x = 1;`;

		const source_file = ts.createSourceFile('simple.ts', source_code, ts.ScriptTarget.Latest, true);
		const {checker} = create_test_program(source_file, 'simple.ts');
		const ctx = new AnalysisContext();

		const result = ts_analyze_module(
			{id: '/project/src/lib/simple.ts', content: source_code},
			source_file,
			'simple.ts',
			checker,
			test_options(),
			ctx,
		);

		// Verify all array fields are arrays
		assert.ok(Array.isArray(result.declarations), 'declarations should be array');
		assert.ok(Array.isArray(result.dependencies), 'dependencies should be array');
		assert.ok(Array.isArray(result.dependents), 'dependents should be array');
		assert.ok(Array.isArray(result.star_exports), 'star_exports should be array');
		assert.ok(Array.isArray(result.re_exports), 're_exports should be array');
	});
});

describe('ts_extract_signature_parameters', () => {
	test('extracts basic parameters with types', () => {
		const source_code = `export function greet(name: string, age: number): void {}`;
		const source_file = ts.createSourceFile('test.ts', source_code, ts.ScriptTarget.Latest, true);
		const {checker} = create_test_program(source_file, 'test.ts');

		// Get the function's signature
		const fn_symbol = checker.getSymbolAtLocation(
			(source_file.statements[0] as ts.FunctionDeclaration).name!,
		)!;
		const fn_type = checker.getTypeOfSymbolAtLocation(fn_symbol, source_file.statements[0]!);
		const sig = fn_type.getCallSignatures()[0]!;

		const params = ts_extract_signature_parameters(sig, checker, undefined);

		assert.strictEqual(params.length, 2);
		assert.strictEqual(params[0]!.name, 'name');
		assert.strictEqual(params[0]!.type, 'string');
		assert.strictEqual(params[1]!.name, 'age');
		assert.strictEqual(params[1]!.type, 'number');
	});

	test('extracts optional parameters', () => {
		const source_code = `export function test(required: string, optional?: number): void {}`;
		const source_file = ts.createSourceFile('test.ts', source_code, ts.ScriptTarget.Latest, true);
		const {checker} = create_test_program(source_file, 'test.ts');

		const fn_symbol = checker.getSymbolAtLocation(
			(source_file.statements[0] as ts.FunctionDeclaration).name!,
		)!;
		const fn_type = checker.getTypeOfSymbolAtLocation(fn_symbol, source_file.statements[0]!);
		const sig = fn_type.getCallSignatures()[0]!;

		const params = ts_extract_signature_parameters(sig, checker, undefined);

		assert.strictEqual(params.length, 2);
		assert.strictEqual(params[0]!.optional, undefined); // not optional
		assert.strictEqual(params[1]!.optional, true);
	});

	test('extracts default values', () => {
		const source_code = `export function test(value: boolean = true): void {}`;
		const source_file = ts.createSourceFile('test.ts', source_code, ts.ScriptTarget.Latest, true);
		const {checker} = create_test_program(source_file, 'test.ts');

		const fn_symbol = checker.getSymbolAtLocation(
			(source_file.statements[0] as ts.FunctionDeclaration).name!,
		)!;
		const fn_type = checker.getTypeOfSymbolAtLocation(fn_symbol, source_file.statements[0]!);
		const sig = fn_type.getCallSignatures()[0]!;

		const params = ts_extract_signature_parameters(sig, checker, undefined);

		assert.strictEqual(params.length, 1);
		assert.strictEqual(params[0]!.default_value, 'true');
	});

	test('applies TSDoc descriptions from params map', () => {
		const source_code = `export function greet(name: string): void {}`;
		const source_file = ts.createSourceFile('test.ts', source_code, ts.ScriptTarget.Latest, true);
		const {checker} = create_test_program(source_file, 'test.ts');

		const fn_symbol = checker.getSymbolAtLocation(
			(source_file.statements[0] as ts.FunctionDeclaration).name!,
		)!;
		const fn_type = checker.getTypeOfSymbolAtLocation(fn_symbol, source_file.statements[0]!);
		const sig = fn_type.getCallSignatures()[0]!;

		const tsdoc_params = new Map([['name', 'The user name']]);
		const params = ts_extract_signature_parameters(sig, checker, tsdoc_params);

		assert.strictEqual(params[0]!.description, 'The user name');
	});

	test('returns empty array for function with no parameters', () => {
		const source_code = `export function noop(): void {}`;
		const source_file = ts.createSourceFile('test.ts', source_code, ts.ScriptTarget.Latest, true);
		const {checker} = create_test_program(source_file, 'test.ts');

		const fn_symbol = checker.getSymbolAtLocation(
			(source_file.statements[0] as ts.FunctionDeclaration).name!,
		)!;
		const fn_type = checker.getTypeOfSymbolAtLocation(fn_symbol, source_file.statements[0]!);
		const sig = fn_type.getCallSignatures()[0]!;

		const params = ts_extract_signature_parameters(sig, checker, undefined);

		assert.ok(Array.isArray(params));
		assert.strictEqual(params.length, 0);
	});
});
