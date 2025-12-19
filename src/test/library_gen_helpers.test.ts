import {test, assert, describe} from 'vitest';
import type {Logger} from '@fuzdev/fuz_util/log.js';
import type {PackageJson} from '@fuzdev/fuz_util/package_json.js';
import type {SourceJson, ModuleJson, DeclarationKind} from '@fuzdev/fuz_util/source_json.js';
import type {Disknode} from '@ryanatkn/gro/disknode.js';

import {
	library_gen_validate_no_duplicates,
	library_gen_sort_modules,
	library_gen_generate_json,
	library_gen_extract_dependencies,
} from '$lib/library_gen_helpers.js';

/**
 * Create a mock logger that captures log calls for testing validation output.
 *
 * Returns a logger with arrays to inspect logged messages:
 * - `errors` - array of error messages
 * - `warnings` - array of warning messages
 * - `infos` - array of info messages
 */
const create_mock_logger = (): Logger & {
	errors: Array<string>;
	warnings: Array<string>;
	infos: Array<string>;
} => {
	const errors: Array<string> = [];
	const warnings: Array<string> = [];
	const infos: Array<string> = [];

	return {
		errors,
		warnings,
		infos,
		error: (...args: Array<any>) => {
			errors.push(args.join(' '));
		},
		warn: (...args: Array<any>) => {
			warnings.push(args.join(' '));
		},
		info: (...args: Array<any>) => {
			infos.push(args.join(' '));
		},
	} as any;
};

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
 * Create a mock Disknode for testing dependency extraction.
 *
 * Simulates filer's disknode structure with dependencies/dependents maps.
 *
 * @param id absolute path to the file
 * @param deps array of absolute paths this file imports
 * @param dependents_ids array of absolute paths that import this file
 * @returns Disknode with populated dependencies and dependents maps
 */
const create_mock_disknode = (
	id: string,
	deps: Array<string> = [],
	dependents_ids: Array<string> = [],
): Disknode => {
	const disknode: Disknode = {
		id,
		contents: '// mock contents',
		external: false,
		ctime: Date.now(),
		mtime: Date.now(),
		dependencies: new Map(),
		dependents: new Map(),
	};

	// Add dependencies
	for (const dep_id of deps) {
		const dep_disknode: Disknode = {
			id: dep_id,
			contents: '// mock dependency',
			external: false,
			ctime: Date.now(),
			mtime: Date.now(),
			dependencies: new Map(),
			dependents: new Map(),
		};
		disknode.dependencies.set(dep_id, dep_disknode);
	}

	// Add dependents
	for (const dependent_id of dependents_ids) {
		const dependent_disknode: Disknode = {
			id: dependent_id,
			contents: '// mock dependent',
			external: false,
			ctime: Date.now(),
			mtime: Date.now(),
			dependencies: new Map(),
			dependents: new Map(),
		};
		disknode.dependents.set(dependent_id, dependent_disknode);
	}

	return disknode;
};

describe('library_gen_validate_no_duplicates', () => {
	describe('happy path - validation passes', () => {
		test('no duplicates - validation passes', () => {
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

			const logger = create_mock_logger();

			// Should not throw
			assert.doesNotThrow(() => {
				library_gen_validate_no_duplicates(source_json, logger);
			});

			assert.strictEqual(logger.errors.length, 0);
		});

		test('empty modules array', () => {
			const source_json = create_mock_source_json([]);
			const logger = create_mock_logger();

			assert.doesNotThrow(() => {
				library_gen_validate_no_duplicates(source_json, logger);
			});

			assert.strictEqual(logger.errors.length, 0);
		});

		test('modules with no declarations', () => {
			const source_json = create_mock_source_json([
				{path: 'empty.ts', declarations: []},
				{path: 'also_empty.ts', declarations: []},
			]);

			const logger = create_mock_logger();

			assert.doesNotThrow(() => {
				library_gen_validate_no_duplicates(source_json, logger);
			});

			assert.strictEqual(logger.errors.length, 0);
		});

		test('undefined modules array', () => {
			const source_json: SourceJson = {
				name: '@test/package',
				version: '1.0.0',
			};

			const logger = create_mock_logger();

			assert.doesNotThrow(() => {
				library_gen_validate_no_duplicates(source_json, logger);
			});

			assert.strictEqual(logger.errors.length, 0);
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

			const logger = create_mock_logger();

			assert.doesNotThrow(() => {
				library_gen_validate_no_duplicates(source_json, logger);
			});

			assert.strictEqual(logger.errors.length, 0);
		});
	});

	describe('error cases - validation fails', () => {
		test('single duplicate across two modules', () => {
			const source_json = create_mock_source_json([
				create_mock_module('foo.ts', [{name: 'Duplicate', kind: 'type'}]),
				create_mock_module('bar.ts', [{name: 'Duplicate', kind: 'component'}]),
			]);

			const logger = create_mock_logger();

			assert.throws(
				() => {
					library_gen_validate_no_duplicates(source_json, logger);
				},
				/Found 1 duplicate declaration name across modules/,
				'should throw error for single duplicate',
			);

			// Check error logging
			assert.ok(logger.errors.length > 0);
			assert.ok(logger.errors.some((e) => e.includes('Duplicate')));
			assert.ok(logger.errors.some((e) => e.includes('foo.ts')));
			assert.ok(logger.errors.some((e) => e.includes('bar.ts')));
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

			const logger = create_mock_logger();

			assert.throws(
				() => {
					library_gen_validate_no_duplicates(source_json, logger);
				},
				/Found 2 duplicate declaration names across modules/,
				'should throw error for multiple duplicates',
			);

			// Check error logging mentions both duplicates
			const all_errors = logger.errors.join(' ');
			assert.ok(all_errors.includes('Dup1'));
			assert.ok(all_errors.includes('Dup2'));
		});

		test('same name in 3+ modules', () => {
			const source_json = create_mock_source_json([
				create_mock_module('a.ts', [{name: 'Common', kind: 'type'}]),
				create_mock_module('b.ts', [{name: 'Common', kind: 'function'}]),
				create_mock_module('c.ts', [{name: 'Common', kind: 'class'}]),
			]);

			const logger = create_mock_logger();

			assert.throws(() => {
				library_gen_validate_no_duplicates(source_json, logger);
			}, /Found 1 duplicate declaration name across modules/);

			// Check all three modules are mentioned
			const all_errors = logger.errors.join(' ');
			assert.ok(all_errors.includes('a.ts'));
			assert.ok(all_errors.includes('b.ts'));
			assert.ok(all_errors.includes('c.ts'));
		});

		test('duplicate with different kinds shows both kinds', () => {
			const source_json = create_mock_source_json([
				create_mock_module('helpers.ts', [{name: 'Foo', kind: 'function'}]),
				create_mock_module('Foo.svelte', [{name: 'Foo', kind: 'component'}]),
			]);

			const logger = create_mock_logger();

			assert.throws(() => {
				library_gen_validate_no_duplicates(source_json, logger);
			});

			const all_errors = logger.errors.join(' ');
			assert.ok(all_errors.includes('function'));
			assert.ok(all_errors.includes('component'));
		});

		test('duplicate with different kinds', () => {
			const source_json = create_mock_source_json([
				create_mock_module('a.ts', [{name: 'Unknown', kind: 'variable'}]),
				create_mock_module('b.ts', [{name: 'Unknown', kind: 'type'}]),
			]);

			const logger = create_mock_logger();

			assert.throws(() => {
				library_gen_validate_no_duplicates(source_json, logger);
			});

			const all_errors = logger.errors.join(' ');
			assert.ok(all_errors.includes('variable'));
			assert.ok(all_errors.includes('type'));
		});
	});

	describe('edge cases', () => {
		test('real-world scenario - DocsLink collision', () => {
			const source_json = create_mock_source_json([
				create_mock_module('docs_helpers.svelte.ts', [{name: 'DocsLink', kind: 'type'}]),
				create_mock_module('DocsLink.svelte', [{name: 'DocsLink', kind: 'component'}]),
			]);

			const logger = create_mock_logger();

			assert.throws(() => {
				library_gen_validate_no_duplicates(source_json, logger);
			}, /duplicate declaration name/i);

			const all_errors = logger.errors.join(' ');
			assert.ok(all_errors.includes('DocsLink'));
			assert.ok(all_errors.includes('docs_helpers.svelte.ts'));
			assert.ok(all_errors.includes('DocsLink.svelte'));
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
		assert.ok(result.ts_content.includes('// generated by library.gen.json.ts - do not edit'));
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

describe('library_gen_validate_no_duplicates - error message format', () => {
	test('singular error message for one duplicate', () => {
		const source_json = create_mock_source_json([
			create_mock_module('a.ts', [{name: 'Dup', kind: 'type'}]),
			create_mock_module('b.ts', [{name: 'Dup', kind: 'function'}]),
		]);

		const logger = create_mock_logger();

		try {
			library_gen_validate_no_duplicates(source_json, logger);
			assert.fail('Should have thrown');
		} catch (err: any) {
			// Check singular form
			assert.ok(err.message.includes('1 duplicate declaration name across'));
			assert.ok(!err.message.includes('1 duplicate declaration names'));
		}
	});

	test('plural error message for multiple duplicates', () => {
		const source_json = create_mock_source_json([
			create_mock_module('a.ts', [
				{name: 'Dup1', kind: 'type'},
				{name: 'Dup2', kind: 'type'},
			]),
			create_mock_module('b.ts', [
				{name: 'Dup1', kind: 'function'},
				{name: 'Dup2', kind: 'function'},
			]),
		]);

		const logger = create_mock_logger();

		try {
			library_gen_validate_no_duplicates(source_json, logger);
			assert.fail('Should have thrown');
		} catch (err: any) {
			// Check plural form
			assert.ok(err.message.includes('2 duplicate declaration names across'));
		}
	});

	test('error message includes CLAUDE.md reference', () => {
		const source_json = create_mock_source_json([
			create_mock_module('a.ts', [{name: 'Dup', kind: 'type'}]),
			create_mock_module('b.ts', [{name: 'Dup', kind: 'function'}]),
		]);

		const logger = create_mock_logger();

		try {
			library_gen_validate_no_duplicates(source_json, logger);
			assert.fail('Should have thrown');
		} catch (err: any) {
			assert.ok(err.message.includes('CLAUDE.md'));
			assert.ok(err.message.includes('Declaration namespacing'));
		}
	});

	test('error message mentions @nodocs as resolution option', () => {
		const source_json = create_mock_source_json([
			create_mock_module('a.ts', [{name: 'Dup', kind: 'type'}]),
			create_mock_module('b.ts', [{name: 'Dup', kind: 'function'}]),
		]);

		const logger = create_mock_logger();

		try {
			library_gen_validate_no_duplicates(source_json, logger);
			assert.fail('Should have thrown');
		} catch (err: any) {
			// Error message should mention both resolution options
			assert.ok(err.message.includes('rename'), 'should mention renaming');
			assert.ok(err.message.includes('@nodocs'), 'should mention @nodocs');
		}
	});

	test('log output includes all duplicate details', () => {
		const source_json = create_mock_source_json([
			create_mock_module('foo/bar.ts', [{name: 'Widget', kind: 'class'}]),
			create_mock_module('baz/Widget.svelte', [{name: 'Widget', kind: 'component'}]),
		]);

		const logger = create_mock_logger();

		try {
			library_gen_validate_no_duplicates(source_json, logger);
			assert.fail('Should have thrown');
		} catch (_err: any) {
			const all_errors = logger.errors.join('\n');

			// Check structured error output
			assert.ok(all_errors.includes('Duplicate declaration names detected'));
			assert.ok(all_errors.includes('"Widget" found in:'));
			assert.ok(all_errors.includes('foo/bar.ts'));
			assert.ok(all_errors.includes('class'));
			assert.ok(all_errors.includes('baz/Widget.svelte'));
			assert.ok(all_errors.includes('component'));
		}
	});
});

describe('library_gen_extract_dependencies', () => {
	describe('basic functionality', () => {
		test('extracts both dependencies and dependents from source modules', () => {
			const disknode = create_mock_disknode(
				'/home/user/project/src/lib/foo.ts',
				['/home/user/project/src/lib/bar.ts', '/home/user/project/src/lib/baz.svelte'],
				['/home/user/project/src/lib/qux.ts', '/home/user/project/src/lib/Quux.svelte'],
			);

			const result = library_gen_extract_dependencies(disknode);

			assert.deepStrictEqual(result.dependencies, ['bar.ts', 'baz.svelte']);
			assert.deepStrictEqual(result.dependents, ['Quux.svelte', 'qux.ts']);
		});

		test('returns empty arrays when no dependencies or dependents', () => {
			const disknode = create_mock_disknode('/home/user/project/src/lib/standalone.ts');

			const result = library_gen_extract_dependencies(disknode);

			assert.deepStrictEqual(result.dependencies, []);
			assert.deepStrictEqual(result.dependents, []);
		});

		test('handles module with only dependencies', () => {
			const disknode = create_mock_disknode(
				'/home/user/project/src/lib/consumer.ts',
				['/home/user/project/src/lib/dependency.ts'],
				[],
			);

			const result = library_gen_extract_dependencies(disknode);

			assert.deepStrictEqual(result.dependencies, ['dependency.ts']);
			assert.deepStrictEqual(result.dependents, []);
		});

		test('handles module with only dependents', () => {
			const disknode = create_mock_disknode(
				'/home/user/project/src/lib/provider.ts',
				[],
				['/home/user/project/src/lib/consumer.ts'],
			);

			const result = library_gen_extract_dependencies(disknode);

			assert.deepStrictEqual(result.dependencies, []);
			assert.deepStrictEqual(result.dependents, ['consumer.ts']);
		});
	});

	describe('filtering - only includes src/lib modules', () => {
		test('excludes external node_modules dependencies', () => {
			const disknode = create_mock_disknode(
				'/home/user/project/src/lib/app.ts',
				[
					'/home/user/project/src/lib/local.ts',
					'/home/user/project/node_modules/svelte/index.js',
					'/home/user/project/node_modules/@fuzdev/fuz_util/object.js',
				],
				[],
			);

			const result = library_gen_extract_dependencies(disknode);

			// Should only include src/lib modules
			assert.deepStrictEqual(result.dependencies, ['local.ts']);
		});

		test('excludes test files from dependencies', () => {
			const disknode = create_mock_disknode(
				'/home/user/project/src/lib/component.svelte',
				['/home/user/project/src/lib/helpers.ts', '/home/user/project/src/test/fixtures/mock.ts'],
				[],
			);

			const result = library_gen_extract_dependencies(disknode);

			// Should exclude src/test
			assert.deepStrictEqual(result.dependencies, ['helpers.ts']);
		});

		test('excludes test files from dependents', () => {
			const disknode = create_mock_disknode(
				'/home/user/project/src/lib/utils.ts',
				[],
				['/home/user/project/src/lib/app.ts', '/home/user/project/src/test/utils.test.ts'],
			);

			const result = library_gen_extract_dependencies(disknode);

			// Should exclude test files
			assert.deepStrictEqual(result.dependents, ['app.ts']);
		});

		test('excludes routes directory', () => {
			const disknode = create_mock_disknode(
				'/home/user/project/src/lib/component.svelte',
				[],
				['/home/user/project/src/lib/other.svelte', '/home/user/project/src/routes/index.svelte'],
			);

			const result = library_gen_extract_dependencies(disknode);

			// Should only include src/lib modules
			assert.deepStrictEqual(result.dependents, ['other.svelte']);
		});
	});

	describe('path extraction', () => {
		test('extracts relative module paths correctly', () => {
			const disknode = create_mock_disknode(
				'/home/user/project/src/lib/components/Button.svelte',
				['/home/user/project/src/lib/styles/theme.ts'],
				['/home/user/project/src/lib/layouts/Layout.svelte'],
			);

			const result = library_gen_extract_dependencies(disknode);

			assert.deepStrictEqual(result.dependencies, ['styles/theme.ts']);
			assert.deepStrictEqual(result.dependents, ['layouts/Layout.svelte']);
		});

		test('handles deeply nested module paths', () => {
			const disknode = create_mock_disknode(
				'/home/user/project/src/lib/deep/nested/module.ts',
				['/home/user/project/src/lib/deep/nested/sibling.ts'],
				['/home/user/project/src/lib/other/path/consumer.ts'],
			);

			const result = library_gen_extract_dependencies(disknode);

			assert.deepStrictEqual(result.dependencies, ['deep/nested/sibling.ts']);
			assert.deepStrictEqual(result.dependents, ['other/path/consumer.ts']);
		});
	});

	describe('sorting', () => {
		test('sorts dependencies alphabetically', () => {
			const disknode = create_mock_disknode(
				'/home/user/project/src/lib/app.ts',
				[
					'/home/user/project/src/lib/zebra.ts',
					'/home/user/project/src/lib/alpha.ts',
					'/home/user/project/src/lib/beta.ts',
				],
				[],
			);

			const result = library_gen_extract_dependencies(disknode);

			assert.deepStrictEqual(result.dependencies, ['alpha.ts', 'beta.ts', 'zebra.ts']);
		});

		test('sorts dependents alphabetically', () => {
			const disknode = create_mock_disknode(
				'/home/user/project/src/lib/utils.ts',
				[],
				[
					'/home/user/project/src/lib/zoo.ts',
					'/home/user/project/src/lib/aardvark.ts',
					'/home/user/project/src/lib/middle.ts',
				],
			);

			const result = library_gen_extract_dependencies(disknode);

			assert.deepStrictEqual(result.dependents, ['aardvark.ts', 'middle.ts', 'zoo.ts']);
		});

		test('sorts case-insensitively for consistency', () => {
			const disknode = create_mock_disknode(
				'/home/user/project/src/lib/app.ts',
				[
					'/home/user/project/src/lib/Zebra.svelte',
					'/home/user/project/src/lib/alpha.ts',
					'/home/user/project/src/lib/Beta.svelte',
				],
				[],
			);

			const result = library_gen_extract_dependencies(disknode);

			// Standard localeCompare should handle case properly
			assert.strictEqual(result.dependencies.length, 3);
			assert.ok(result.dependencies.includes('alpha.ts'));
			assert.ok(result.dependencies.includes('Beta.svelte'));
			assert.ok(result.dependencies.includes('Zebra.svelte'));
		});
	});

	describe('edge cases', () => {
		test('handles svelte components with .svelte extension', () => {
			const disknode = create_mock_disknode(
				'/home/user/project/src/lib/App.svelte',
				['/home/user/project/src/lib/Button.svelte'],
				['/home/user/project/src/lib/Layout.svelte'],
			);

			const result = library_gen_extract_dependencies(disknode);

			assert.deepStrictEqual(result.dependencies, ['Button.svelte']);
			assert.deepStrictEqual(result.dependents, ['Layout.svelte']);
		});

		test('handles mixed file types', () => {
			const disknode = create_mock_disknode(
				'/home/user/project/src/lib/component.svelte',
				[
					'/home/user/project/src/lib/utils.ts',
					'/home/user/project/src/lib/types.ts',
					'/home/user/project/src/lib/Other.svelte',
				],
				[],
			);

			const result = library_gen_extract_dependencies(disknode);

			assert.deepStrictEqual(result.dependencies, ['Other.svelte', 'types.ts', 'utils.ts']);
		});

		test('handles modules at src/lib root', () => {
			const disknode = create_mock_disknode(
				'/home/user/project/src/lib/index.ts',
				['/home/user/project/src/lib/exports.ts'],
				[],
			);

			const result = library_gen_extract_dependencies(disknode);

			assert.deepStrictEqual(result.dependencies, ['exports.ts']);
		});

		test('deterministic output - multiple runs produce same results', () => {
			const disknode = create_mock_disknode(
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

			const result1 = library_gen_extract_dependencies(disknode);
			const result2 = library_gen_extract_dependencies(disknode);

			assert.deepStrictEqual(result1.dependencies, result2.dependencies);
			assert.deepStrictEqual(result1.dependents, result2.dependents);
			assert.deepStrictEqual(result1.dependencies, ['a.ts', 'b.ts', 'c.ts']);
			assert.deepStrictEqual(result1.dependents, ['x.ts', 'y.ts', 'z.ts']);
		});
	});
});
