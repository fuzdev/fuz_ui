import {test, assert, describe, beforeAll} from 'vitest';
import ts from 'typescript';
import type {DeclarationJson} from '@fuzdev/fuz_util/source_json.js';

import {ts_analyze_module_exports, ts_create_program} from '$lib/ts_helpers.js';
import {MODULE_SOURCE_DEFAULTS} from '$lib/module_helpers.js';
import {
	load_fixtures,
	validate_declaration_structure,
	create_test_program,
	create_multi_file_program,
	extract_declaration_from_source,
	type TsFixture,
} from './fixtures/ts/ts_test_helpers.js';
import {normalize_json} from './test_helpers.js';

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
 */

export const foo = 42;
export function bar(): string { return 'bar'; }
export type Baz = { value: number };
`;

		const source_file = ts.createSourceFile('test.ts', source_code, ts.ScriptTarget.Latest, true);
		const {checker} = create_test_program(source_file, 'test.ts');

		const result = ts_analyze_module_exports(source_file, checker, MODULE_SOURCE_DEFAULTS);

		// Should have module comment
		assert.strictEqual(result.module_comment, 'Test module with exports.');

		// Should have 3 identifiers
		assert.strictEqual(result.declarations.length, 3);

		const names = result.declarations.map((i) => i.name);
		assert.include(names, 'foo');
		assert.include(names, 'bar');
		assert.include(names, 'Baz');
	});

	test('handles module with no exports', () => {
		const source_code = `
/**
 * Module with no exports.
 */

const internal = 'not exported';
`;

		const source_file = ts.createSourceFile('empty.ts', source_code, ts.ScriptTarget.Latest, true);
		const {checker} = create_test_program(source_file, 'empty.ts');

		const result = ts_analyze_module_exports(source_file, checker, MODULE_SOURCE_DEFAULTS);

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

		const result = ts_analyze_module_exports(source_file, checker, MODULE_SOURCE_DEFAULTS);

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

		const result = ts_analyze_module_exports(source_file, checker, MODULE_SOURCE_DEFAULTS);

		assert.strictEqual(result.declarations.length, 1);

		const add_fn = result.declarations[0]!;
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

		const result = ts_analyze_module_exports(source_file, checker, MODULE_SOURCE_DEFAULTS);

		assert.strictEqual(result.declarations.length, 1);

		const counter = result.declarations[0]!;
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

		const result = ts_analyze_module_exports(source_file, checker, MODULE_SOURCE_DEFAULTS);

		assert.strictEqual(result.declarations.length, 1);

		const config = result.declarations[0]!;
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

		const result = ts_analyze_module_exports(source_file, checker, MODULE_SOURCE_DEFAULTS);

		// Should have the re-exported value
		assert.strictEqual(result.declarations.length, 1);
		assert.strictEqual(result.declarations[0]!.name, 'exported_value');
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

		const result = ts_analyze_module_exports(source_file, checker, MODULE_SOURCE_DEFAULTS);

		// Should have 5 identifiers of different kinds
		assert.strictEqual(result.declarations.length, 5);

		const by_name = new Map(result.declarations.map((i) => [i.name, i]));

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

	test('excludes @nodocs identifiers from exports', () => {
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

		const result = ts_analyze_module_exports(source_file, checker, MODULE_SOURCE_DEFAULTS);

		// Should only have 2 public identifiers (nodocs ones excluded)
		assert.strictEqual(result.declarations.length, 2);

		const names = result.declarations.map((i) => i.name);
		assert.include(names, 'public_value');
		assert.include(names, 'public_function');
		assert.notInclude(names, 'nodocs_helper');
		assert.notInclude(names, 'NodocsType');
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
		const result = ts_analyze_module_exports(index_file, checker, MODULE_SOURCE_DEFAULTS);

		// index.ts should only have local_value as a direct export
		// helper and CONSTANT are re-exports and should be in re_exports array
		assert.strictEqual(result.declarations.length, 1);
		assert.strictEqual(result.declarations[0]!.name, 'local_value');

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
		const result = ts_analyze_module_exports(public_file, checker, MODULE_SOURCE_DEFAULTS);

		// Renamed re-export creates a NEW declaration with alias_of
		assert.strictEqual(result.declarations.length, 1);
		const declaration = result.declarations[0]!;
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
		const result = ts_analyze_module_exports(mixed_file, checker, MODULE_SOURCE_DEFAULTS);

		// Should have 3 identifiers: direct_fn, DirectType, renamed_util
		assert.strictEqual(result.declarations.length, 3);

		const names = result.declarations.map((i) => i.name);
		assert.include(names, 'direct_fn');
		assert.include(names, 'DirectType');
		assert.include(names, 'renamed_util');
		assert.notInclude(names, 'util_a'); // same-name re-export excluded

		// renamed_util should have alias_of
		const renamed = result.declarations.find((i) => i.name === 'renamed_util');
		assert.ok(renamed?.alias_of);
		assert.strictEqual(renamed.alias_of.module, 'utils.ts');
		assert.strictEqual(renamed.alias_of.name, 'util_b');

		// re_exports should contain util_a
		assert.strictEqual(result.re_exports.length, 1);
		assert.strictEqual(result.re_exports[0]!.name, 'util_a');
		assert.strictEqual(result.re_exports[0]!.original_module, 'utils.ts');
	});
});

describe('ts_create_program with TsProgramOptions', () => {
	test('creates program with default options', () => {
		const log = {info: () => undefined};

		// Uses current directory and default tsconfig.json
		const program = ts_create_program(log);

		assert.ok(program);
		assert.ok(program.getSourceFiles().length > 0);
	});

	test('creates program with explicit root', () => {
		const log = {info: () => undefined};

		// Explicit root pointing to project directory
		const program = ts_create_program(log, {root: './'});

		assert.ok(program);
		assert.ok(program.getSourceFiles().length > 0);
	});

	test('creates program with custom compiler options', () => {
		const log = {info: () => undefined};

		// Override strict mode
		const program = ts_create_program(log, {
			compiler_options: {
				strict: false,
			},
		});

		assert.ok(program);
		// Verify program was created (compiler options are merged)
		assert.ok(program.getSourceFiles().length > 0);
	});

	test('throws when tsconfig not found', () => {
		const log = {info: () => undefined};

		// Non-existent directory
		assert.throws(
			() => ts_create_program(log, {root: '/non/existent/path'}),
			/No tsconfig\.json found/,
		);
	});

	test('throws with custom tsconfig name when not found', () => {
		const log = {info: () => undefined};

		// Try to use a non-existent custom tsconfig name
		assert.throws(
			() => ts_create_program(log, {tsconfig: 'nonexistent.config.json'}),
			/No nonexistent\.config\.json found/,
		);
	});
});
