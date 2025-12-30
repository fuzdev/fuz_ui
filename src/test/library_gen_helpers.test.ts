import {test, assert, describe} from 'vitest';
import type {PackageJson} from '@fuzdev/fuz_util/package_json.js';
import type {SourceJson, ModuleJson, DeclarationKind} from '@fuzdev/fuz_util/source_json.js';

import {
	library_gen_find_duplicates,
	library_gen_sort_modules,
	library_gen_generate_json,
	library_gen_extract_dependencies,
	library_gen_collect_source_files,
} from '$lib/library_gen_helpers.js';
import {
	type SourceFileInfo,
	MODULE_SOURCE_DEFAULTS,
	type ModuleSourceOptions,
} from '$lib/module_helpers.js';

/**
 * Create a mock SourceJson with test modules.
 *
 * Provides minimal package metadata for testing validation logic.
 *
 * @param modules array of ModuleJson objects to include
 * @returns SourceJson with standard test package name and version
 */
const create_mock_source_json = (modules: Array<ModuleJson>): SourceJson => {
	return {
		name: '@test/package',
		version: '1.0.0',
		modules,
	};
};

/**
 * Create a mock ModuleJson with test declarations.
 *
 * Simplifies test setup by auto-generating minimal declaration metadata.
 *
 * @param path module path (e.g., 'foo.ts', 'Bar.svelte')
 * @param declarations array of declaration objects with name and kind
 * @returns ModuleJson with the specified declarations
 */
const create_mock_module = (
	path: string,
	declarations: Array<{name: string; kind: DeclarationKind}>,
): ModuleJson => {
	return {
		path,
		declarations: declarations.map(({name, kind}) => ({
			name,
			kind,
		})),
	};
};

/**
 * Create a mock SourceFileInfo for testing.
 */
const create_mock_source_file = (
	id: string,
	dependencies: Array<string> = [],
	dependents: Array<string> = [],
): SourceFileInfo => ({id, dependencies, dependents});

describe('library_gen_find_duplicates', () => {
	describe('no duplicates - returns empty Map', () => {
		test('unique declarations across modules', () => {
			const source_json = create_mock_source_json([
				create_mock_module('foo.ts', [
					{name: 'foo', kind: 'function'},
					{name: 'bar', kind: 'type'},
				]),
				create_mock_module('baz.ts', [
					{name: 'baz', kind: 'class'},
					{name: 'qux', kind: 'variable'},
				]),
			]);

			const duplicates = library_gen_find_duplicates(source_json);

			assert.strictEqual(duplicates.size, 0);
		});

		test('empty modules array', () => {
			const source_json = create_mock_source_json([]);

			const duplicates = library_gen_find_duplicates(source_json);

			assert.strictEqual(duplicates.size, 0);
		});

		test('modules with no declarations', () => {
			const source_json = create_mock_source_json([
				{path: 'empty.ts', declarations: []},
				{path: 'also_empty.ts', declarations: []},
			]);

			const duplicates = library_gen_find_duplicates(source_json);

			assert.strictEqual(duplicates.size, 0);
		});

		test('undefined modules array', () => {
			const source_json: SourceJson = {
				name: '@test/package',
				version: '1.0.0',
			};

			const duplicates = library_gen_find_duplicates(source_json);

			assert.strictEqual(duplicates.size, 0);
		});

		test('single module with multiple unique declarations', () => {
			const source_json = create_mock_source_json([
				create_mock_module('helpers.ts', [
					{name: 'foo', kind: 'function'},
					{name: 'bar', kind: 'function'},
					{name: 'Baz', kind: 'type'},
					{name: 'Qux', kind: 'class'},
				]),
			]);

			const duplicates = library_gen_find_duplicates(source_json);

			assert.strictEqual(duplicates.size, 0);
		});
	});

	describe('duplicates found - returns populated Map', () => {
		test('single duplicate across two modules', () => {
			const source_json = create_mock_source_json([
				create_mock_module('foo.ts', [{name: 'Duplicate', kind: 'type'}]),
				create_mock_module('bar.ts', [{name: 'Duplicate', kind: 'component'}]),
			]);

			const duplicates = library_gen_find_duplicates(source_json);

			assert.strictEqual(duplicates.size, 1);
			assert.ok(duplicates.has('Duplicate'));

			const occurrences = duplicates.get('Duplicate')!;
			assert.strictEqual(occurrences.length, 2);
			assert.ok(occurrences.some((o) => o.module === 'foo.ts' && o.declaration.kind === 'type'));
			assert.ok(
				occurrences.some((o) => o.module === 'bar.ts' && o.declaration.kind === 'component'),
			);
		});

		test('multiple duplicates', () => {
			const source_json = create_mock_source_json([
				create_mock_module('a.ts', [
					{name: 'Dup1', kind: 'type'},
					{name: 'Dup2', kind: 'function'},
				]),
				create_mock_module('b.ts', [
					{name: 'Dup1', kind: 'class'},
					{name: 'Dup2', kind: 'variable'},
				]),
			]);

			const duplicates = library_gen_find_duplicates(source_json);

			assert.strictEqual(duplicates.size, 2);
			assert.ok(duplicates.has('Dup1'));
			assert.ok(duplicates.has('Dup2'));
		});

		test('same name in 3+ modules', () => {
			const source_json = create_mock_source_json([
				create_mock_module('a.ts', [{name: 'Common', kind: 'type'}]),
				create_mock_module('b.ts', [{name: 'Common', kind: 'function'}]),
				create_mock_module('c.ts', [{name: 'Common', kind: 'class'}]),
			]);

			const duplicates = library_gen_find_duplicates(source_json);

			assert.strictEqual(duplicates.size, 1);
			const occurrences = duplicates.get('Common')!;
			assert.strictEqual(occurrences.length, 3);
			assert.ok(occurrences.some((o) => o.module === 'a.ts'));
			assert.ok(occurrences.some((o) => o.module === 'b.ts'));
			assert.ok(occurrences.some((o) => o.module === 'c.ts'));
		});

		test('includes full declaration for each occurrence', () => {
			const source_json = create_mock_source_json([
				create_mock_module('helpers.ts', [{name: 'Foo', kind: 'function'}]),
				create_mock_module('Foo.svelte', [{name: 'Foo', kind: 'component'}]),
			]);

			const duplicates = library_gen_find_duplicates(source_json);
			const occurrences = duplicates.get('Foo')!;

			assert.ok(occurrences.some((o) => o.declaration.kind === 'function'));
			assert.ok(occurrences.some((o) => o.declaration.kind === 'component'));
			// Verify full declaration is available
			for (const o of occurrences) {
				assert.ok(o.declaration.name === 'Foo');
			}
		});
	});

	describe('edge cases', () => {
		test('real-world scenario - DocsLink collision', () => {
			const source_json = create_mock_source_json([
				create_mock_module('docs_helpers.svelte.ts', [{name: 'DocsLink', kind: 'type'}]),
				create_mock_module('DocsLink.svelte', [{name: 'DocsLink', kind: 'component'}]),
			]);

			const duplicates = library_gen_find_duplicates(source_json);

			assert.strictEqual(duplicates.size, 1);
			assert.ok(duplicates.has('DocsLink'));
			const occurrences = duplicates.get('DocsLink')!;
			assert.ok(occurrences.some((o) => o.module === 'docs_helpers.svelte.ts'));
			assert.ok(occurrences.some((o) => o.module === 'DocsLink.svelte'));
		});
	});

	describe('source_line tracking', () => {
		test('includes source_line when available in declaration', () => {
			const source_json: SourceJson = {
				name: '@test/package',
				version: '1.0.0',
				modules: [
					{
						path: 'foo.ts',
						declarations: [{name: 'Duplicate', kind: 'type', source_line: 10}],
					},
					{
						path: 'bar.ts',
						declarations: [{name: 'Duplicate', kind: 'function', source_line: 25}],
					},
				],
			};

			const duplicates = library_gen_find_duplicates(source_json);
			const occurrences = duplicates.get('Duplicate')!;

			assert.strictEqual(occurrences.length, 2);
			assert.ok(occurrences.some((o) => o.module === 'foo.ts' && o.declaration.source_line === 10));
			assert.ok(occurrences.some((o) => o.module === 'bar.ts' && o.declaration.source_line === 25));
		});

		test('handles missing source_line in declaration', () => {
			const source_json: SourceJson = {
				name: '@test/package',
				version: '1.0.0',
				modules: [
					{
						path: 'foo.ts',
						declarations: [{name: 'Duplicate', kind: 'type'}], // no source_line
					},
					{
						path: 'bar.ts',
						declarations: [{name: 'Duplicate', kind: 'function', source_line: 25}],
					},
				],
			};

			const duplicates = library_gen_find_duplicates(source_json);
			const occurrences = duplicates.get('Duplicate')!;

			const foo_occurrence = occurrences.find((o) => o.module === 'foo.ts')!;
			const bar_occurrence = occurrences.find((o) => o.module === 'bar.ts')!;

			assert.isUndefined(foo_occurrence.declaration.source_line);
			assert.strictEqual(bar_occurrence.declaration.source_line, 25);
		});
	});
});

describe('library_gen_sort_modules', () => {
	test('sorts modules alphabetically by path', () => {
		const modules: Array<ModuleJson> = [
			{path: 'zebra.ts', declarations: []},
			{path: 'alpha.ts', declarations: []},
			{path: 'beta.ts', declarations: []},
		];

		const sorted = library_gen_sort_modules(modules);

		assert.strictEqual(sorted[0]!.path, 'alpha.ts');
		assert.strictEqual(sorted[1]!.path, 'beta.ts');
		assert.strictEqual(sorted[2]!.path, 'zebra.ts');
	});

	test('does not mutate original array', () => {
		const modules: Array<ModuleJson> = [
			{path: 'c.ts', declarations: []},
			{path: 'a.ts', declarations: []},
			{path: 'b.ts', declarations: []},
		];

		const sorted = library_gen_sort_modules(modules);

		// Original array should not be mutated
		assert.strictEqual(modules[0]!.path, 'c.ts');
		assert.strictEqual(modules[1]!.path, 'a.ts');
		assert.strictEqual(modules[2]!.path, 'b.ts');

		// Sorted array should be sorted
		assert.strictEqual(sorted[0]!.path, 'a.ts');
		assert.strictEqual(sorted[1]!.path, 'b.ts');
		assert.strictEqual(sorted[2]!.path, 'c.ts');
	});

	test('handles empty array', () => {
		const sorted = library_gen_sort_modules([]);
		assert.strictEqual(sorted.length, 0);
	});

	test('handles single module', () => {
		const modules: Array<ModuleJson> = [{path: 'single.ts', declarations: []}];
		const sorted = library_gen_sort_modules(modules);
		assert.strictEqual(sorted.length, 1);
		assert.strictEqual(sorted[0]!.path, 'single.ts');
	});

	test('stable sort with identical paths', () => {
		const modules: Array<ModuleJson> = [
			{path: 'same.ts', declarations: [{name: 'first', kind: 'type'}]},
			{path: 'same.ts', declarations: [{name: 'second', kind: 'function'}]},
		];

		const sorted = library_gen_sort_modules(modules);

		// Should maintain original order for identical paths
		assert.strictEqual(sorted[0]!.declarations![0]!.name, 'first');
		assert.strictEqual(sorted[1]!.declarations![0]!.name, 'second');
	});
});

describe('library_gen_generate_json', () => {
	// Helper to create valid package_json for tests (library_json_parse requires repository)
	const create_test_package_json = (overrides: Partial<PackageJson> = {}): PackageJson => ({
		name: '@test/package',
		version: '1.0.0',
		repository: 'https://github.com/test/package',
		...overrides,
	});

	test('generates JSON and .ts wrapper files', () => {
		const package_json = create_test_package_json({type: 'module'});

		const source_json: SourceJson = {
			name: '@test/package',
			version: '1.0.0',
			modules: [
				{
					path: 'test.ts',
					declarations: [{name: 'foo', kind: 'function'}],
				},
			],
		};

		const result = library_gen_generate_json(package_json, source_json);

		// Check we get both outputs
		assert.ok(result.json_content);
		assert.ok(result.ts_content);

		// Check JSON is valid
		const parsed = JSON.parse(result.json_content);
		assert.ok(parsed.package_json);
		assert.ok(parsed.source_json);

		// Check .ts wrapper has correct structure
		assert.ok(result.ts_content.includes('// generated by library.gen.ts - do not edit'));
		assert.ok(result.ts_content.includes("import json from './library.json'"));
		assert.ok(result.ts_content.includes('export const library_json'));
	});

	test('properly serializes library_json data in JSON', () => {
		const package_json = create_test_package_json({
			name: '@scope/pkg',
			version: '2.0.0',
			type: 'module',
			description: 'Test package',
		});

		const source_json: SourceJson = {
			name: '@scope/pkg',
			version: '2.0.0',
		};

		const result = library_gen_generate_json(package_json, source_json);
		const parsed = JSON.parse(result.json_content);

		// Verify library_json contains parsed data
		assert.strictEqual(parsed.package_json.name, '@scope/pkg');
		assert.strictEqual(parsed.package_json.version, '2.0.0');
		// library_json includes computed fields like repo_name
		assert.ok(parsed.repo_name);
	});

	test('properly serializes source_json with modules', () => {
		const package_json = create_test_package_json();

		const source_json: SourceJson = {
			name: '@test/package',
			version: '1.0.0',
			modules: [
				{
					path: 'foo.ts',
					declarations: [
						{name: 'foo', kind: 'function'},
						{name: 'Bar', kind: 'type'},
					],
				},
			],
		};

		const result = library_gen_generate_json(package_json, source_json);
		const parsed = JSON.parse(result.json_content);

		// Verify source_json is included
		assert.ok(parsed.source_json);
		assert.ok(parsed.source_json.modules);
		assert.strictEqual(parsed.source_json.modules[0].path, 'foo.ts');
		assert.strictEqual(parsed.source_json.modules[0].declarations[0].name, 'foo');
		assert.strictEqual(parsed.source_json.modules[0].declarations[0].kind, 'function');
	});

	test('uses tab indentation in JSON', () => {
		const package_json = create_test_package_json();

		const source_json: SourceJson = {
			name: '@test/package',
			version: '1.0.0',
		};

		const result = library_gen_generate_json(package_json, source_json);

		// Should use tabs for indentation
		assert.ok(result.json_content.includes('\t"package_json"'), 'Expected tab-indented JSON');
	});

	test('handles empty modules array', () => {
		const package_json = create_test_package_json();

		const source_json: SourceJson = {
			name: '@test/package',
			version: '1.0.0',
			modules: [],
		};

		const result = library_gen_generate_json(package_json, source_json);
		const parsed = JSON.parse(result.json_content);

		assert.deepStrictEqual(parsed.source_json.modules, []);
	});

	test('handles undefined modules', () => {
		const package_json = create_test_package_json();

		const source_json: SourceJson = {
			name: '@test/package',
			version: '1.0.0',
		};

		const result = library_gen_generate_json(package_json, source_json);
		const parsed = JSON.parse(result.json_content);

		assert.ok(parsed.package_json);
		assert.ok(parsed.source_json);
	});
});

describe('library_gen_extract_dependencies', () => {
	describe('basic functionality', () => {
		test('extracts both dependencies and dependents from source modules', () => {
			const source_file = create_mock_source_file(
				'/home/user/project/src/lib/foo.ts',
				['/home/user/project/src/lib/bar.ts', '/home/user/project/src/lib/baz.svelte'],
				['/home/user/project/src/lib/qux.ts', '/home/user/project/src/lib/Quux.svelte'],
			);

			const result = library_gen_extract_dependencies(source_file, MODULE_SOURCE_DEFAULTS);

			assert.deepStrictEqual(result.dependencies, ['bar.ts', 'baz.svelte']);
			assert.deepStrictEqual(result.dependents, ['Quux.svelte', 'qux.ts']);
		});

		test('returns empty arrays when no dependencies or dependents', () => {
			const source_file = create_mock_source_file('/home/user/project/src/lib/standalone.ts');

			const result = library_gen_extract_dependencies(source_file, MODULE_SOURCE_DEFAULTS);

			assert.deepStrictEqual(result.dependencies, []);
			assert.deepStrictEqual(result.dependents, []);
		});

		test('handles module with only dependencies', () => {
			const source_file = create_mock_source_file(
				'/home/user/project/src/lib/consumer.ts',
				['/home/user/project/src/lib/dependency.ts'],
				[],
			);

			const result = library_gen_extract_dependencies(source_file, MODULE_SOURCE_DEFAULTS);

			assert.deepStrictEqual(result.dependencies, ['dependency.ts']);
			assert.deepStrictEqual(result.dependents, []);
		});

		test('handles module with only dependents', () => {
			const source_file = create_mock_source_file(
				'/home/user/project/src/lib/provider.ts',
				[],
				['/home/user/project/src/lib/consumer.ts'],
			);

			const result = library_gen_extract_dependencies(source_file, MODULE_SOURCE_DEFAULTS);

			assert.deepStrictEqual(result.dependencies, []);
			assert.deepStrictEqual(result.dependents, ['consumer.ts']);
		});
	});

	describe('filtering - only includes src/lib modules', () => {
		test('excludes external node_modules dependencies', () => {
			const source_file = create_mock_source_file(
				'/home/user/project/src/lib/app.ts',
				[
					'/home/user/project/src/lib/local.ts',
					'/home/user/project/node_modules/svelte/index.js',
					'/home/user/project/node_modules/@fuzdev/fuz_util/object.js',
				],
				[],
			);

			const result = library_gen_extract_dependencies(source_file, MODULE_SOURCE_DEFAULTS);

			// Should only include src/lib modules
			assert.deepStrictEqual(result.dependencies, ['local.ts']);
		});

		test('excludes test files from dependencies', () => {
			const source_file = create_mock_source_file(
				'/home/user/project/src/lib/component.svelte',
				['/home/user/project/src/lib/helpers.ts', '/home/user/project/src/test/fixtures/mock.ts'],
				[],
			);

			const result = library_gen_extract_dependencies(source_file, MODULE_SOURCE_DEFAULTS);

			// Should exclude src/test
			assert.deepStrictEqual(result.dependencies, ['helpers.ts']);
		});

		test('excludes test files from dependents', () => {
			const source_file = create_mock_source_file(
				'/home/user/project/src/lib/utils.ts',
				[],
				['/home/user/project/src/lib/app.ts', '/home/user/project/src/test/utils.test.ts'],
			);

			const result = library_gen_extract_dependencies(source_file, MODULE_SOURCE_DEFAULTS);

			// Should exclude test files
			assert.deepStrictEqual(result.dependents, ['app.ts']);
		});

		test('excludes routes directory', () => {
			const source_file = create_mock_source_file(
				'/home/user/project/src/lib/component.svelte',
				[],
				['/home/user/project/src/lib/other.svelte', '/home/user/project/src/routes/index.svelte'],
			);

			const result = library_gen_extract_dependencies(source_file, MODULE_SOURCE_DEFAULTS);

			// Should only include src/lib modules
			assert.deepStrictEqual(result.dependents, ['other.svelte']);
		});
	});

	describe('path extraction', () => {
		test('extracts relative module paths correctly', () => {
			const source_file = create_mock_source_file(
				'/home/user/project/src/lib/components/Button.svelte',
				['/home/user/project/src/lib/styles/theme.ts'],
				['/home/user/project/src/lib/layouts/Layout.svelte'],
			);

			const result = library_gen_extract_dependencies(source_file, MODULE_SOURCE_DEFAULTS);

			assert.deepStrictEqual(result.dependencies, ['styles/theme.ts']);
			assert.deepStrictEqual(result.dependents, ['layouts/Layout.svelte']);
		});

		test('handles deeply nested module paths', () => {
			const source_file = create_mock_source_file(
				'/home/user/project/src/lib/deep/nested/module.ts',
				['/home/user/project/src/lib/deep/nested/sibling.ts'],
				['/home/user/project/src/lib/other/path/consumer.ts'],
			);

			const result = library_gen_extract_dependencies(source_file, MODULE_SOURCE_DEFAULTS);

			assert.deepStrictEqual(result.dependencies, ['deep/nested/sibling.ts']);
			assert.deepStrictEqual(result.dependents, ['other/path/consumer.ts']);
		});

		test('extracts paths with custom options', () => {
			// Custom options with deeper source root
			const source_file = create_mock_source_file(
				'/home/user/project/src/lib/deep/index.ts',
				['/home/user/project/src/lib/deep/utils.ts'],
				['/home/user/project/src/lib/deep/app.ts'],
			);

			// Using custom options with a deeper source_root
			const options = {
				...MODULE_SOURCE_DEFAULTS,
				source_root: '/src/lib/deep/',
				source_paths: ['/src/lib/deep/'],
			};
			const result = library_gen_extract_dependencies(source_file, options);

			assert.deepStrictEqual(result.dependencies, ['utils.ts']);
			assert.deepStrictEqual(result.dependents, ['app.ts']);
		});
	});

	describe('sorting', () => {
		test('sorts dependencies alphabetically', () => {
			const source_file = create_mock_source_file(
				'/home/user/project/src/lib/app.ts',
				[
					'/home/user/project/src/lib/zebra.ts',
					'/home/user/project/src/lib/alpha.ts',
					'/home/user/project/src/lib/beta.ts',
				],
				[],
			);

			const result = library_gen_extract_dependencies(source_file, MODULE_SOURCE_DEFAULTS);

			assert.deepStrictEqual(result.dependencies, ['alpha.ts', 'beta.ts', 'zebra.ts']);
		});

		test('sorts dependents alphabetically', () => {
			const source_file = create_mock_source_file(
				'/home/user/project/src/lib/utils.ts',
				[],
				[
					'/home/user/project/src/lib/zoo.ts',
					'/home/user/project/src/lib/aardvark.ts',
					'/home/user/project/src/lib/middle.ts',
				],
			);

			const result = library_gen_extract_dependencies(source_file, MODULE_SOURCE_DEFAULTS);

			assert.deepStrictEqual(result.dependents, ['aardvark.ts', 'middle.ts', 'zoo.ts']);
		});

		test('sorts case-insensitively for consistency', () => {
			const source_file = create_mock_source_file(
				'/home/user/project/src/lib/app.ts',
				[
					'/home/user/project/src/lib/Zebra.svelte',
					'/home/user/project/src/lib/alpha.ts',
					'/home/user/project/src/lib/Beta.svelte',
				],
				[],
			);

			const result = library_gen_extract_dependencies(source_file, MODULE_SOURCE_DEFAULTS);

			// Standard localeCompare should handle case properly
			assert.strictEqual(result.dependencies.length, 3);
			assert.ok(result.dependencies.includes('alpha.ts'));
			assert.ok(result.dependencies.includes('Beta.svelte'));
			assert.ok(result.dependencies.includes('Zebra.svelte'));
		});
	});

	describe('edge cases', () => {
		test('handles SourceFileInfo without dependencies property', () => {
			const source_file: SourceFileInfo = {id: '/home/user/project/src/lib/standalone.ts'};

			const result = library_gen_extract_dependencies(source_file, MODULE_SOURCE_DEFAULTS);

			assert.deepStrictEqual(result.dependencies, []);
			assert.deepStrictEqual(result.dependents, []);
		});

		test('handles svelte components with .svelte extension', () => {
			const source_file = create_mock_source_file(
				'/home/user/project/src/lib/App.svelte',
				['/home/user/project/src/lib/Button.svelte'],
				['/home/user/project/src/lib/Layout.svelte'],
			);

			const result = library_gen_extract_dependencies(source_file, MODULE_SOURCE_DEFAULTS);

			assert.deepStrictEqual(result.dependencies, ['Button.svelte']);
			assert.deepStrictEqual(result.dependents, ['Layout.svelte']);
		});

		test('handles mixed file types', () => {
			const source_file = create_mock_source_file(
				'/home/user/project/src/lib/component.svelte',
				[
					'/home/user/project/src/lib/utils.ts',
					'/home/user/project/src/lib/types.ts',
					'/home/user/project/src/lib/Other.svelte',
				],
				[],
			);

			const result = library_gen_extract_dependencies(source_file, MODULE_SOURCE_DEFAULTS);

			assert.deepStrictEqual(result.dependencies, ['Other.svelte', 'types.ts', 'utils.ts']);
		});

		test('handles modules at src/lib root', () => {
			const source_file = create_mock_source_file(
				'/home/user/project/src/lib/index.ts',
				['/home/user/project/src/lib/exports.ts'],
				[],
			);

			const result = library_gen_extract_dependencies(source_file, MODULE_SOURCE_DEFAULTS);

			assert.deepStrictEqual(result.dependencies, ['exports.ts']);
		});

		test('deterministic output - multiple runs produce same results', () => {
			const source_file = create_mock_source_file(
				'/home/user/project/src/lib/app.ts',
				[
					'/home/user/project/src/lib/c.ts',
					'/home/user/project/src/lib/a.ts',
					'/home/user/project/src/lib/b.ts',
				],
				[
					'/home/user/project/src/lib/z.ts',
					'/home/user/project/src/lib/x.ts',
					'/home/user/project/src/lib/y.ts',
				],
			);

			const result1 = library_gen_extract_dependencies(source_file, MODULE_SOURCE_DEFAULTS);
			const result2 = library_gen_extract_dependencies(source_file, MODULE_SOURCE_DEFAULTS);

			assert.deepStrictEqual(result1.dependencies, result2.dependencies);
			assert.deepStrictEqual(result1.dependents, result2.dependents);
			assert.deepStrictEqual(result1.dependencies, ['a.ts', 'b.ts', 'c.ts']);
			assert.deepStrictEqual(result1.dependents, ['x.ts', 'y.ts', 'z.ts']);
		});
	});
});

describe('library_gen_collect_source_files', () => {
	describe('basic functionality', () => {
		test('collects TypeScript files from src/lib', () => {
			const files: Array<SourceFileInfo> = [
				{id: '/home/user/project/src/lib/foo.ts'},
				{id: '/home/user/project/src/lib/bar.ts'},
				{id: '/home/user/project/src/lib/baz.ts'},
			];

			const result = library_gen_collect_source_files(files, MODULE_SOURCE_DEFAULTS);

			assert.strictEqual(result.length, 3);
			assert.ok(result.some((f) => f.id.endsWith('foo.ts')));
			assert.ok(result.some((f) => f.id.endsWith('bar.ts')));
			assert.ok(result.some((f) => f.id.endsWith('baz.ts')));
		});

		test('collects Svelte files from src/lib', () => {
			const files: Array<SourceFileInfo> = [
				{id: '/home/user/project/src/lib/Button.svelte'},
				{id: '/home/user/project/src/lib/Card.svelte'},
			];

			const result = library_gen_collect_source_files(files, MODULE_SOURCE_DEFAULTS);

			assert.strictEqual(result.length, 2);
			assert.ok(result.some((f) => f.id.endsWith('Button.svelte')));
			assert.ok(result.some((f) => f.id.endsWith('Card.svelte')));
		});

		test('collects JavaScript files from src/lib', () => {
			const files: Array<SourceFileInfo> = [
				{id: '/home/user/project/src/lib/utils.js'},
				{id: '/home/user/project/src/lib/helpers.js'},
			];

			const result = library_gen_collect_source_files(files, MODULE_SOURCE_DEFAULTS);

			assert.strictEqual(result.length, 2);
		});

		test('collects mixed file types', () => {
			const files: Array<SourceFileInfo> = [
				{id: '/home/user/project/src/lib/foo.ts'},
				{id: '/home/user/project/src/lib/Button.svelte'},
				{id: '/home/user/project/src/lib/utils.js'},
			];

			const result = library_gen_collect_source_files(files, MODULE_SOURCE_DEFAULTS);

			assert.strictEqual(result.length, 3);
		});
	});

	describe('filtering', () => {
		test('excludes test files', () => {
			const files: Array<SourceFileInfo> = [
				{id: '/home/user/project/src/lib/foo.ts'},
				{id: '/home/user/project/src/lib/foo.test.ts'},
				{id: '/home/user/project/src/lib/bar.ts'},
				{id: '/home/user/project/src/lib/bar.test.ts'},
			];

			const result = library_gen_collect_source_files(files, MODULE_SOURCE_DEFAULTS);

			assert.strictEqual(result.length, 2);
			assert.ok(result.every((f) => !f.id.includes('.test.ts')));
		});

		test('excludes files outside source paths', () => {
			const files: Array<SourceFileInfo> = [
				{id: '/home/user/project/src/lib/foo.ts'},
				{id: '/home/user/project/src/routes/page.svelte'},
				{id: '/home/user/project/src/test/helpers.ts'},
				{id: '/home/user/project/node_modules/pkg/index.ts'},
			];

			const result = library_gen_collect_source_files(files, MODULE_SOURCE_DEFAULTS);

			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0]!.id, '/home/user/project/src/lib/foo.ts');
		});

		test('excludes unsupported file types', () => {
			const files: Array<SourceFileInfo> = [
				{id: '/home/user/project/src/lib/foo.ts'},
				{id: '/home/user/project/src/lib/styles.css'},
				{id: '/home/user/project/src/lib/data.json'},
				{id: '/home/user/project/src/lib/readme.md'},
			];

			const result = library_gen_collect_source_files(files, MODULE_SOURCE_DEFAULTS);

			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0]!.id, '/home/user/project/src/lib/foo.ts');
		});

		test('excludes nested repo paths', () => {
			const files: Array<SourceFileInfo> = [
				{id: '/home/user/project/src/lib/foo.ts'},
				{id: '/home/user/project/src/fixtures/repos/repo_a/src/lib/index.ts'},
				{id: '/home/user/project/src/test/fixtures/repos/repo_b/src/lib/bar.ts'},
			];

			const result = library_gen_collect_source_files(files, MODULE_SOURCE_DEFAULTS);

			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0]!.id, '/home/user/project/src/lib/foo.ts');
		});
	});

	describe('custom options', () => {
		test('uses custom source_paths', () => {
			const files: Array<SourceFileInfo> = [
				{id: '/home/user/project/src/lib/foo.ts'},
				{id: '/home/user/project/src/routes/page.svelte'},
			];

			const options: ModuleSourceOptions = {
				...MODULE_SOURCE_DEFAULTS,
				source_root: '/src/routes/',
				source_paths: ['/src/routes/'],
			};

			const result = library_gen_collect_source_files(files, options);

			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0]!.id, '/home/user/project/src/routes/page.svelte');
		});

		test('uses custom extensions filter', () => {
			const files: Array<SourceFileInfo> = [
				{id: '/home/user/project/src/lib/foo.ts'},
				{id: '/home/user/project/src/lib/Button.svelte'},
				{id: '/home/user/project/src/lib/utils.js'},
			];

			const options: ModuleSourceOptions = {
				...MODULE_SOURCE_DEFAULTS,
				extensions: ['.ts'], // only TypeScript
			};

			const result = library_gen_collect_source_files(files, options);

			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0]!.id, '/home/user/project/src/lib/foo.ts');
		});

		test('uses custom exclude_patterns', () => {
			const files: Array<SourceFileInfo> = [
				{id: '/home/user/project/src/lib/foo.ts'},
				{id: '/home/user/project/src/lib/internal/secret.ts'},
				{id: '/home/user/project/src/lib/bar.ts'},
			];

			const options: ModuleSourceOptions = {
				...MODULE_SOURCE_DEFAULTS,
				exclude_patterns: [/\/internal\//],
			};

			const result = library_gen_collect_source_files(files, options);

			assert.strictEqual(result.length, 2);
			assert.ok(result.every((f) => !f.id.includes('/internal/')));
		});
	});

	describe('sorting and determinism', () => {
		test('returns files sorted alphabetically by id', () => {
			const files: Array<SourceFileInfo> = [
				{id: '/home/user/project/src/lib/zebra.ts'},
				{id: '/home/user/project/src/lib/alpha.ts'},
				{id: '/home/user/project/src/lib/beta.ts'},
			];

			const result = library_gen_collect_source_files(files, MODULE_SOURCE_DEFAULTS);

			assert.strictEqual(result[0]!.id, '/home/user/project/src/lib/alpha.ts');
			assert.strictEqual(result[1]!.id, '/home/user/project/src/lib/beta.ts');
			assert.strictEqual(result[2]!.id, '/home/user/project/src/lib/zebra.ts');
		});

		test('produces deterministic output on multiple calls', () => {
			const files: Array<SourceFileInfo> = [
				{id: '/home/user/project/src/lib/c.ts'},
				{id: '/home/user/project/src/lib/a.ts'},
				{id: '/home/user/project/src/lib/b.ts'},
			];

			const result1 = library_gen_collect_source_files(files, MODULE_SOURCE_DEFAULTS);
			const result2 = library_gen_collect_source_files(files, MODULE_SOURCE_DEFAULTS);

			assert.deepStrictEqual(
				result1.map((f) => f.id),
				result2.map((f) => f.id),
			);
		});
	});

	describe('edge cases', () => {
		test('returns empty array for empty input', () => {
			const result = library_gen_collect_source_files([], MODULE_SOURCE_DEFAULTS);

			assert.strictEqual(result.length, 0);
		});

		test('returns empty array when no files match', () => {
			const files: Array<SourceFileInfo> = [
				{id: '/home/user/project/src/routes/page.svelte'},
				{id: '/home/user/project/node_modules/pkg/index.ts'},
			];

			const result = library_gen_collect_source_files(files, MODULE_SOURCE_DEFAULTS);

			assert.strictEqual(result.length, 0);
		});

		test('preserves file content and metadata', () => {
			const files: Array<SourceFileInfo> = [
				{
					id: '/home/user/project/src/lib/foo.ts',
					content: 'export const foo = 42;',
					dependencies: ['/other/dep.ts'],
					dependents: ['/other/consumer.ts'],
				},
			];

			const result = library_gen_collect_source_files(files, MODULE_SOURCE_DEFAULTS);

			assert.strictEqual(result.length, 1);
			assert.strictEqual(result[0]!.content, 'export const foo = 42;');
			assert.deepStrictEqual([...result[0]!.dependencies!], ['/other/dep.ts']);
			assert.deepStrictEqual([...result[0]!.dependents!], ['/other/consumer.ts']);
		});

		test('works without logger (logger is optional)', () => {
			const files: Array<SourceFileInfo> = [{id: '/home/user/project/src/lib/foo.ts'}];

			// Should not throw
			const result = library_gen_collect_source_files(files, MODULE_SOURCE_DEFAULTS);

			assert.strictEqual(result.length, 1);
		});
	});
});
