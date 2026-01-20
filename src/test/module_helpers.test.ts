import {test, assert, describe} from 'vitest';

import {
	module_extract_path,
	module_extract_dependencies,
	module_get_component_name,
	module_get_key,
	module_is_typescript,
	module_is_svelte,
	module_is_css,
	module_is_json,
	module_is_test,
	module_is_source,
	module_validate_source_options,
	module_get_analyzer_default,
	module_get_source_root,
	module_create_source_options,
	MODULE_SOURCE_PARTIAL,
	type ModuleSourceOptions,
	type SourceFileInfo,
} from '$lib/module_helpers.js';
import {TEST_PROJECT_ROOT, create_test_source_options} from './module_test_helpers.js';

// Local alias that uses the default project root
const test_options = (
	overrides?: Partial<Omit<ModuleSourceOptions, 'project_root'>>,
): ModuleSourceOptions => create_test_source_options(TEST_PROJECT_ROOT, overrides);

describe('module_extract_path', () => {
	test('extracts path from absolute source ID', () => {
		assert.strictEqual(
			module_extract_path('/home/user/project/src/lib/foo.ts', test_options()),
			'foo.ts',
		);
	});

	test('extracts nested path', () => {
		assert.strictEqual(
			module_extract_path('/home/user/project/src/lib/nested/bar.svelte', test_options()),
			'nested/bar.svelte',
		);
	});

	test('returns original path if project_root does not match', () => {
		assert.strictEqual(
			module_extract_path('/some/other/path.ts', test_options()),
			'/some/other/path.ts',
		);
	});

	test('extracts path with custom source_root', () => {
		const options = test_options({
			source_paths: ['src/routes'],
			source_root: 'src/routes',
		});
		assert.strictEqual(
			module_extract_path('/home/user/project/src/routes/page.ts', options),
			'page.ts',
		);
	});

	test('extracts nested path with custom source_root', () => {
		const options = module_create_source_options('/home/user/project', {
			source_paths: ['packages/core/src'],
			source_root: 'packages/core/src',
		});
		assert.strictEqual(
			module_extract_path('/home/user/project/packages/core/src/index.ts', options),
			'index.ts',
		);
	});

	test('returns original path if source_root does not match', () => {
		const options = test_options({
			source_paths: ['src/routes'],
			source_root: 'src/routes',
		});
		assert.strictEqual(
			module_extract_path('/home/user/project/src/lib/foo.ts', options),
			'/home/user/project/src/lib/foo.ts',
		);
	});

	test('extracts path with multiple source_paths', () => {
		const options = test_options({
			source_paths: ['src/lib', 'src/routes'],
			source_root: 'src',
		});
		assert.strictEqual(
			module_extract_path('/home/user/project/src/lib/foo.ts', options),
			'lib/foo.ts',
		);
		assert.strictEqual(
			module_extract_path('/home/user/project/src/routes/page.svelte', options),
			'routes/page.svelte',
		);
	});
});

describe('module_get_component_name', () => {
	test('extracts component name from simple path', () => {
		assert.strictEqual(module_get_component_name('Alert.svelte'), 'Alert');
	});

	test('extracts component name from nested path', () => {
		assert.strictEqual(module_get_component_name('components/Button.svelte'), 'Button');
	});

	test('handles deeply nested paths', () => {
		assert.strictEqual(module_get_component_name('a/b/c/Widget.svelte'), 'Widget');
	});
});

describe('module_get_key', () => {
	test('adds ./ prefix to module path', () => {
		assert.strictEqual(module_get_key('foo.ts'), './foo.ts');
	});

	test('handles nested paths', () => {
		assert.strictEqual(module_get_key('nested/bar.svelte'), './nested/bar.svelte');
	});
});

describe('module type predicates', () => {
	describe('module_is_typescript', () => {
		test('returns true for .ts files', () => {
			assert.isTrue(module_is_typescript('foo.ts'));
			assert.isTrue(module_is_typescript('path/to/bar.ts'));
		});

		test('returns true for .js files', () => {
			assert.isTrue(module_is_typescript('foo.js'));
			assert.isTrue(module_is_typescript('path/to/bar.js'));
		});

		test('returns false for .d.ts declaration files', () => {
			assert.isFalse(module_is_typescript('types.d.ts'));
			assert.isFalse(module_is_typescript('path/to/global.d.ts'));
			assert.isFalse(module_is_typescript('index.d.ts'));
		});

		test('returns false for other extensions', () => {
			assert.isFalse(module_is_typescript('foo.svelte'));
			assert.isFalse(module_is_typescript('foo.css'));
			assert.isFalse(module_is_typescript('foo.json'));
		});
	});

	describe('module_is_svelte', () => {
		test('returns true for .svelte files', () => {
			assert.isTrue(module_is_svelte('Alert.svelte'));
			assert.isTrue(module_is_svelte('components/Button.svelte'));
		});

		test('returns false for other extensions', () => {
			assert.isFalse(module_is_svelte('foo.ts'));
			assert.isFalse(module_is_svelte('foo.js'));
		});
	});

	describe('module_is_css', () => {
		test('returns true for .css files', () => {
			assert.isTrue(module_is_css('styles.css'));
			assert.isTrue(module_is_css('path/to/theme.css'));
		});

		test('returns false for other extensions', () => {
			assert.isFalse(module_is_css('foo.ts'));
			assert.isFalse(module_is_css('foo.svelte'));
		});
	});

	describe('module_is_json', () => {
		test('returns true for .json files', () => {
			assert.isTrue(module_is_json('data.json'));
			assert.isTrue(module_is_json('path/to/config.json'));
		});

		test('returns false for other extensions', () => {
			assert.isFalse(module_is_json('foo.ts'));
			assert.isFalse(module_is_json('foo.js'));
		});
	});

	describe('module_is_test', () => {
		test('returns true for .test.ts files', () => {
			assert.isTrue(module_is_test('foo.test.ts'));
			assert.isTrue(module_is_test('path/to/bar.test.ts'));
		});

		test('returns false for regular .ts files', () => {
			assert.isFalse(module_is_test('foo.ts'));
			assert.isFalse(module_is_test('test.ts')); // file named test.ts, not a test file
		});

		test('returns false for non-.ts test-like files', () => {
			assert.isFalse(module_is_test('foo.test.js')); // only .test.ts is matched
			assert.isFalse(module_is_test('foo.spec.ts')); // .spec.ts not matched
		});
	});
});

describe('module_get_analyzer_default', () => {
	test('returns typescript for .ts files', () => {
		assert.strictEqual(module_get_analyzer_default('/project/src/lib/foo.ts'), 'typescript');
		assert.strictEqual(module_get_analyzer_default('bar.ts'), 'typescript');
	});

	test('returns typescript for .js files', () => {
		assert.strictEqual(module_get_analyzer_default('/project/src/lib/foo.js'), 'typescript');
		assert.strictEqual(module_get_analyzer_default('utils.js'), 'typescript');
	});

	test('returns svelte for .svelte files', () => {
		assert.strictEqual(module_get_analyzer_default('/project/src/lib/Button.svelte'), 'svelte');
		assert.strictEqual(module_get_analyzer_default('Card.svelte'), 'svelte');
	});

	test('returns null for .d.ts declaration files', () => {
		assert.isNull(module_get_analyzer_default('/project/src/lib/types.d.ts'));
		assert.isNull(module_get_analyzer_default('global.d.ts'));
		assert.isNull(module_get_analyzer_default('path/to/index.d.ts'));
	});

	test('returns null for unsupported extensions', () => {
		assert.isNull(module_get_analyzer_default('/project/src/lib/styles.css'));
		assert.isNull(module_get_analyzer_default('data.json'));
		assert.isNull(module_get_analyzer_default('readme.md'));
	});
});

describe('MODULE_SOURCE_PARTIAL', () => {
	test('has expected default source_paths', () => {
		assert.deepStrictEqual(MODULE_SOURCE_PARTIAL.source_paths, ['src/lib']);
	});

	test('has expected default exclude_patterns', () => {
		assert.strictEqual(MODULE_SOURCE_PARTIAL.exclude_patterns.length, 1);
		assert.isTrue(MODULE_SOURCE_PARTIAL.exclude_patterns[0]!.test('foo.test.ts'));
		assert.isFalse(MODULE_SOURCE_PARTIAL.exclude_patterns[0]!.test('foo.ts'));
	});

	test('has no source_root (auto-derived from source_paths)', () => {
		assert.strictEqual(MODULE_SOURCE_PARTIAL.source_root, undefined);
	});
});

describe('module_create_source_options', () => {
	test('creates options with project_root', () => {
		const options = module_create_source_options('/my/project');
		assert.strictEqual(options.project_root, '/my/project');
		assert.deepStrictEqual(options.source_paths, ['src/lib']);
	});

	test('merges overrides', () => {
		const options = module_create_source_options('/my/project', {
			source_paths: ['packages/core'],
		});
		assert.strictEqual(options.project_root, '/my/project');
		assert.deepStrictEqual(options.source_paths, ['packages/core']);
	});
});

describe('module_get_source_root', () => {
	test('returns explicit source_root when provided', () => {
		const options = test_options({source_root: 'src'});
		assert.strictEqual(module_get_source_root(options), 'src');
	});

	test('returns first source_path for single-entry arrays', () => {
		const options = test_options({source_paths: ['src/lib']});
		assert.strictEqual(module_get_source_root(options), 'src/lib');
	});

	test('throws for multiple source_paths without explicit source_root', () => {
		const options: ModuleSourceOptions = {
			project_root: '/home/user/project',
			source_paths: ['src/lib', 'src/routes'],
			exclude_patterns: [],
			get_analyzer: module_get_analyzer_default,
		};
		assert.throws(() => module_get_source_root(options), /source_root is required/);
	});
});

describe('module_is_source', () => {
	describe('with default options', () => {
		test('matches src/lib TypeScript files', () => {
			assert.isTrue(module_is_source('/home/user/project/src/lib/foo.ts', test_options()));
		});

		test('matches src/lib JS files', () => {
			assert.isTrue(module_is_source('/home/user/project/src/lib/foo.js', test_options()));
		});

		test('matches src/lib Svelte files', () => {
			assert.isTrue(module_is_source('/home/user/project/src/lib/Button.svelte', test_options()));
		});

		test('excludes test files', () => {
			assert.isFalse(module_is_source('/home/user/project/src/lib/foo.test.ts', test_options()));
		});

		test('excludes files outside src/lib', () => {
			assert.isFalse(module_is_source('/home/user/project/src/routes/page.svelte', test_options()));
		});

		test('excludes non-analyzable file types', () => {
			// module_is_source combines all checks including get_analyzer
			assert.isFalse(module_is_source('/home/user/project/src/lib/styles.css', test_options()));
			assert.isFalse(module_is_source('/home/user/project/src/lib/data.json', test_options()));
		});
	});

	describe('with custom source_paths', () => {
		test('respects custom source paths', () => {
			const options = test_options({
				source_paths: ['src/routes'],
			});

			assert.isTrue(module_is_source('/home/user/project/src/routes/page.svelte', options));
			assert.isFalse(module_is_source('/home/user/project/src/lib/foo.ts', options));
		});

		test('supports multiple source paths', () => {
			const options = test_options({
				source_paths: ['src/lib', 'src/routes'],
				source_root: 'src',
			});

			assert.isTrue(module_is_source('/home/user/project/src/lib/foo.ts', options));
			assert.isTrue(module_is_source('/home/user/project/src/routes/page.svelte', options));
		});
	});

	describe('with custom exclude_patterns', () => {
		test('respects custom exclude patterns', () => {
			const options = test_options({
				exclude_patterns: [/\.test\.ts$/, /\.spec\.ts$/],
			});

			assert.isTrue(module_is_source('/home/user/project/src/lib/foo.ts', options));
			assert.isFalse(module_is_source('/home/user/project/src/lib/foo.test.ts', options));
			assert.isFalse(module_is_source('/home/user/project/src/lib/foo.spec.ts', options));
		});

		test('can exclude by directory pattern', () => {
			const options = test_options({
				exclude_patterns: [/\/internal\//],
			});

			assert.isTrue(module_is_source('/home/user/project/src/lib/foo.ts', options));
			assert.isFalse(module_is_source('/home/user/project/src/lib/internal/secret.ts', options));
		});

		test('empty exclude_patterns includes everything', () => {
			const options = test_options({
				exclude_patterns: [],
			});

			assert.isTrue(module_is_source('/home/user/project/src/lib/foo.ts', options));
			assert.isTrue(module_is_source('/home/user/project/src/lib/foo.test.ts', options));
		});
	});

	describe('nested directories', () => {
		test('rejects nested repo paths - proper prefix matching', () => {
			// Fixture repos nested in src/fixtures/ should be rejected because
			// they don't start with project_root/src/lib/
			assert.isFalse(
				module_is_source(
					'/home/user/project/src/fixtures/repos/repo_a/src/lib/index.ts',
					test_options(),
				),
			);
			assert.isFalse(
				module_is_source(
					'/home/user/project/src/test/fixtures/repos/repo_b/src/lib/foo.ts',
					test_options(),
				),
			);
		});

		test('rejects files from different project roots', () => {
			// Files from a different project should be rejected
			assert.isFalse(module_is_source('/home/user/other-project/src/lib/foo.ts', test_options()));
		});

		test('accepts deeply nested paths within src/lib/', () => {
			// Files deeply nested in src/lib/ should work
			assert.isTrue(
				module_is_source('/home/user/project/src/lib/utils/helpers/deep/file.ts', test_options()),
			);
		});
	});

	describe('non-src structures', () => {
		test('works with packages/ structure', () => {
			const options = module_create_source_options('/home/user/project', {
				source_paths: ['packages/core/lib'],
			});

			assert.isTrue(module_is_source('/home/user/project/packages/core/lib/foo.ts', options));
			assert.isFalse(module_is_source('/home/user/project/packages/other/lib/foo.ts', options));
		});
	});
});

describe('module_extract_dependencies', () => {
	describe('basic extraction', () => {
		test('extracts dependencies from source modules', () => {
			const source_file: SourceFileInfo = {
				id: '/home/user/project/src/lib/foo.ts',
				content: '',
				dependencies: ['/home/user/project/src/lib/bar.ts', '/home/user/project/src/lib/baz.ts'],
			};

			const result = module_extract_dependencies(source_file, test_options());

			assert.deepStrictEqual(result.dependencies, ['bar.ts', 'baz.ts']);
			assert.deepStrictEqual(result.dependents, []);
		});

		test('extracts dependents from source modules', () => {
			const source_file: SourceFileInfo = {
				id: '/home/user/project/src/lib/foo.ts',
				content: '',
				dependents: [
					'/home/user/project/src/lib/consumer1.ts',
					'/home/user/project/src/lib/consumer2.ts',
				],
			};

			const result = module_extract_dependencies(source_file, test_options());

			assert.deepStrictEqual(result.dependencies, []);
			assert.deepStrictEqual(result.dependents, ['consumer1.ts', 'consumer2.ts']);
		});

		test('extracts both dependencies and dependents', () => {
			const source_file: SourceFileInfo = {
				id: '/home/user/project/src/lib/foo.ts',
				content: '',
				dependencies: ['/home/user/project/src/lib/dep.ts'],
				dependents: ['/home/user/project/src/lib/consumer.ts'],
			};

			const result = module_extract_dependencies(source_file, test_options());

			assert.deepStrictEqual(result.dependencies, ['dep.ts']);
			assert.deepStrictEqual(result.dependents, ['consumer.ts']);
		});
	});

	describe('filtering', () => {
		test('excludes external packages (node_modules)', () => {
			const source_file: SourceFileInfo = {
				id: '/home/user/project/src/lib/foo.ts',
				content: '',
				dependencies: [
					'/home/user/project/src/lib/bar.ts',
					'/home/user/project/node_modules/svelte/index.js',
					'/home/user/project/node_modules/@fuzdev/fuz_util/index.js',
				],
			};

			const result = module_extract_dependencies(source_file, test_options());

			assert.deepStrictEqual(result.dependencies, ['bar.ts']);
		});

		test('excludes test files', () => {
			const source_file: SourceFileInfo = {
				id: '/home/user/project/src/lib/foo.ts',
				content: '',
				dependencies: [
					'/home/user/project/src/lib/bar.ts',
					'/home/user/project/src/lib/bar.test.ts',
				],
			};

			const result = module_extract_dependencies(source_file, test_options());

			assert.deepStrictEqual(result.dependencies, ['bar.ts']);
		});

		test('excludes files outside source paths', () => {
			const source_file: SourceFileInfo = {
				id: '/home/user/project/src/lib/foo.ts',
				content: '',
				dependencies: [
					'/home/user/project/src/lib/bar.ts',
					'/home/user/project/src/routes/page.svelte',
					'/home/user/project/src/test/helper.ts',
				],
			};

			const result = module_extract_dependencies(source_file, test_options());

			assert.deepStrictEqual(result.dependencies, ['bar.ts']);
		});
	});

	describe('sorting', () => {
		test('returns dependencies sorted alphabetically', () => {
			const source_file: SourceFileInfo = {
				id: '/home/user/project/src/lib/foo.ts',
				content: '',
				dependencies: [
					'/home/user/project/src/lib/zebra.ts',
					'/home/user/project/src/lib/alpha.ts',
					'/home/user/project/src/lib/beta.ts',
				],
			};

			const result = module_extract_dependencies(source_file, test_options());

			assert.deepStrictEqual(result.dependencies, ['alpha.ts', 'beta.ts', 'zebra.ts']);
		});

		test('returns dependents sorted alphabetically', () => {
			const source_file: SourceFileInfo = {
				id: '/home/user/project/src/lib/foo.ts',
				content: '',
				dependents: [
					'/home/user/project/src/lib/z.ts',
					'/home/user/project/src/lib/a.ts',
					'/home/user/project/src/lib/m.ts',
				],
			};

			const result = module_extract_dependencies(source_file, test_options());

			assert.deepStrictEqual(result.dependents, ['a.ts', 'm.ts', 'z.ts']);
		});
	});

	describe('edge cases', () => {
		test('handles undefined dependencies', () => {
			const source_file: SourceFileInfo = {
				id: '/home/user/project/src/lib/foo.ts',
				content: '',
			};

			const result = module_extract_dependencies(source_file, test_options());

			assert.deepStrictEqual(result.dependencies, []);
			assert.deepStrictEqual(result.dependents, []);
		});

		test('handles empty arrays', () => {
			const source_file: SourceFileInfo = {
				id: '/home/user/project/src/lib/foo.ts',
				content: '',
				dependencies: [],
				dependents: [],
			};

			const result = module_extract_dependencies(source_file, test_options());

			assert.deepStrictEqual(result.dependencies, []);
			assert.deepStrictEqual(result.dependents, []);
		});

		test('works with custom source options', () => {
			const options = test_options({
				source_paths: ['src/routes'],
				source_root: 'src/routes',
				exclude_patterns: [],
			});

			const source_file: SourceFileInfo = {
				id: '/home/user/project/src/routes/page.svelte',
				content: '',
				dependencies: [
					'/home/user/project/src/routes/Header.svelte',
					'/home/user/project/src/lib/util.ts', // excluded - wrong path
					'/home/user/project/src/routes/Footer.svelte',
				],
			};

			const result = module_extract_dependencies(source_file, options);

			assert.deepStrictEqual(result.dependencies, ['Footer.svelte', 'Header.svelte']);
		});
	});
});

describe('module_validate_source_options', () => {
	describe('valid configurations', () => {
		test('accepts single source_path with auto-derived source_root', () => {
			const options = test_options();
			// Should not throw
			module_validate_source_options(options);
		});

		test('accepts multiple source_paths with explicit source_root', () => {
			const options = test_options({
				source_paths: ['src/lib', 'src/routes'],
				source_root: 'src',
			});
			// Should not throw
			module_validate_source_options(options);
		});

		test('accepts source_root equal to source_path', () => {
			const options = test_options({
				source_paths: ['src/lib'],
				source_root: 'src/lib',
			});
			// Should not throw
			module_validate_source_options(options);
		});
	});

	describe('project_root validation', () => {
		test('throws when project_root is not absolute', () => {
			const options: ModuleSourceOptions = {
				project_root: 'relative/path',
				source_paths: ['src/lib'],
				exclude_patterns: [],
				get_analyzer: module_get_analyzer_default,
			};

			assert.throws(
				() => module_validate_source_options(options),
				/project_root must be an absolute path/,
			);
		});

		test('throws when project_root has trailing slash', () => {
			const options: ModuleSourceOptions = {
				project_root: '/home/user/project/',
				source_paths: ['src/lib'],
				exclude_patterns: [],
				get_analyzer: module_get_analyzer_default,
			};

			assert.throws(
				() => module_validate_source_options(options),
				/project_root should not have trailing slash/,
			);
		});
	});

	describe('source_paths validation', () => {
		test('throws when source_paths is empty', () => {
			const options: ModuleSourceOptions = {
				project_root: '/home/user/project',
				source_paths: [],
				exclude_patterns: [],
				get_analyzer: module_get_analyzer_default,
			};

			assert.throws(
				() => module_validate_source_options(options),
				/source_paths must have at least one entry/,
			);
		});

		test('throws when source_path has leading slash', () => {
			const options: ModuleSourceOptions = {
				project_root: '/home/user/project',
				source_paths: ['/src/lib'],
				exclude_patterns: [],
				get_analyzer: module_get_analyzer_default,
			};

			assert.throws(
				() => module_validate_source_options(options),
				/source_paths entry should not start with "\/"/,
			);
		});

		test('throws when source_path has trailing slash', () => {
			const options: ModuleSourceOptions = {
				project_root: '/home/user/project',
				source_paths: ['src/lib/'],
				exclude_patterns: [],
				get_analyzer: module_get_analyzer_default,
			};

			assert.throws(
				() => module_validate_source_options(options),
				/source_paths entry should not end with "\/"/,
			);
		});
	});

	describe('source_root validation', () => {
		test('throws when source_root has leading slash', () => {
			const options: ModuleSourceOptions = {
				project_root: '/home/user/project',
				source_paths: ['src/lib'],
				source_root: '/src',
				exclude_patterns: [],
				get_analyzer: module_get_analyzer_default,
			};

			assert.throws(
				() => module_validate_source_options(options),
				/source_root should not start with "\/"/,
			);
		});

		test('throws when source_root has trailing slash', () => {
			const options: ModuleSourceOptions = {
				project_root: '/home/user/project',
				source_paths: ['src/lib'],
				source_root: 'src/',
				exclude_patterns: [],
				get_analyzer: module_get_analyzer_default,
			};

			assert.throws(
				() => module_validate_source_options(options),
				/source_root should not end with "\/"/,
			);
		});

		test('throws when source_path does not start with source_root', () => {
			const options: ModuleSourceOptions = {
				project_root: '/home/user/project',
				source_paths: ['packages/core'],
				source_root: 'src',
				exclude_patterns: [],
				get_analyzer: module_get_analyzer_default,
			};

			assert.throws(
				() => module_validate_source_options(options),
				/source_paths entry "packages\/core" must start with source_root "src"/,
			);
		});
	});

	describe('multiple source_paths validation', () => {
		test('throws when multiple source_paths without source_root', () => {
			const options: ModuleSourceOptions = {
				project_root: '/home/user/project',
				source_paths: ['src/lib', 'src/routes'],
				exclude_patterns: [],
				get_analyzer: module_get_analyzer_default,
			};

			assert.throws(
				() => module_validate_source_options(options),
				/source_root is required when source_paths has multiple entries/,
			);
		});
	});
});
