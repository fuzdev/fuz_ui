import {test, assert, describe} from 'vitest';

import {
	module_extract_path,
	module_get_component_name,
	module_get_key,
	module_is_typescript,
	module_is_svelte,
	module_is_css,
	module_is_json,
	module_is_test,
	module_matches_source,
	MODULE_SOURCE_DEFAULTS,
	type ModuleSourceOptions,
} from '$lib/module_helpers.js';

describe('module_extract_path', () => {
	test('extracts path from absolute source ID', () => {
		assert.strictEqual(
			module_extract_path('/home/user/project/src/lib/foo.ts', MODULE_SOURCE_DEFAULTS),
			'foo.ts',
		);
	});

	test('extracts nested path', () => {
		assert.strictEqual(
			module_extract_path('/home/user/project/src/lib/nested/bar.svelte', MODULE_SOURCE_DEFAULTS),
			'nested/bar.svelte',
		);
	});

	test('returns original path if no /src/lib/ found', () => {
		assert.strictEqual(
			module_extract_path('/some/other/path.ts', MODULE_SOURCE_DEFAULTS),
			'/some/other/path.ts',
		);
	});

	test('extracts path with custom options', () => {
		const options: ModuleSourceOptions = {
			...MODULE_SOURCE_DEFAULTS,
			source_root: '/src/routes/',
		};
		assert.strictEqual(
			module_extract_path('/home/user/project/src/routes/page.ts', options),
			'page.ts',
		);
	});

	test('extracts nested path with custom options', () => {
		const options: ModuleSourceOptions = {
			...MODULE_SOURCE_DEFAULTS,
			source_root: '/packages/core/src/',
		};
		assert.strictEqual(
			module_extract_path('/home/user/project/packages/core/src/index.ts', options),
			'index.ts',
		);
	});

	test('returns original path if source_root not found', () => {
		const options: ModuleSourceOptions = {
			...MODULE_SOURCE_DEFAULTS,
			source_root: '/src/routes/',
		};
		assert.strictEqual(
			module_extract_path('/home/user/project/src/lib/foo.ts', options),
			'/home/user/project/src/lib/foo.ts',
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
	});
});

describe('MODULE_SOURCE_DEFAULTS', () => {
	test('has expected default source_root', () => {
		assert.strictEqual(MODULE_SOURCE_DEFAULTS.source_root, '/src/lib/');
	});

	test('has expected default source_paths', () => {
		assert.deepStrictEqual(MODULE_SOURCE_DEFAULTS.source_paths, ['/src/lib/']);
	});

	test('has expected default extensions', () => {
		assert.deepStrictEqual(MODULE_SOURCE_DEFAULTS.extensions, ['.ts', '.js', '.svelte']);
	});

	test('has expected default exclude_patterns', () => {
		assert.strictEqual(MODULE_SOURCE_DEFAULTS.exclude_patterns.length, 1);
		assert.isTrue(MODULE_SOURCE_DEFAULTS.exclude_patterns[0]!.test('foo.test.ts'));
		assert.isFalse(MODULE_SOURCE_DEFAULTS.exclude_patterns[0]!.test('foo.ts'));
	});
});

describe('module_matches_source', () => {
	describe('with default options', () => {
		test('matches src/lib TypeScript files', () => {
			assert.isTrue(
				module_matches_source('/home/user/project/src/lib/foo.ts', MODULE_SOURCE_DEFAULTS),
			);
		});

		test('matches src/lib JavaScript files', () => {
			assert.isTrue(
				module_matches_source('/home/user/project/src/lib/foo.js', MODULE_SOURCE_DEFAULTS),
			);
		});

		test('matches src/lib Svelte files', () => {
			assert.isTrue(
				module_matches_source('/home/user/project/src/lib/Button.svelte', MODULE_SOURCE_DEFAULTS),
			);
		});

		test('excludes test files', () => {
			assert.isFalse(
				module_matches_source('/home/user/project/src/lib/foo.test.ts', MODULE_SOURCE_DEFAULTS),
			);
		});

		test('excludes files outside src/lib', () => {
			assert.isFalse(
				module_matches_source('/home/user/project/src/routes/page.svelte', MODULE_SOURCE_DEFAULTS),
			);
		});

		test('excludes unsupported extensions', () => {
			assert.isFalse(
				module_matches_source('/home/user/project/src/lib/styles.css', MODULE_SOURCE_DEFAULTS),
			);
			assert.isFalse(
				module_matches_source('/home/user/project/src/lib/data.json', MODULE_SOURCE_DEFAULTS),
			);
		});
	});

	describe('with custom source_paths', () => {
		test('respects custom source paths', () => {
			const options: ModuleSourceOptions = {
				...MODULE_SOURCE_DEFAULTS,
				source_paths: ['/src/routes/'],
			};

			assert.isTrue(module_matches_source('/home/user/project/src/routes/page.svelte', options));
			assert.isFalse(module_matches_source('/home/user/project/src/lib/foo.ts', options));
		});

		test('supports multiple source paths', () => {
			const options: ModuleSourceOptions = {
				...MODULE_SOURCE_DEFAULTS,
				source_paths: ['/src/lib/', '/src/routes/'],
			};

			assert.isTrue(module_matches_source('/home/user/project/src/lib/foo.ts', options));
			assert.isTrue(module_matches_source('/home/user/project/src/routes/page.svelte', options));
		});
	});

	describe('with custom extensions', () => {
		test('respects custom extensions', () => {
			const options: ModuleSourceOptions = {
				...MODULE_SOURCE_DEFAULTS,
				extensions: ['.ts'],
			};

			assert.isTrue(module_matches_source('/home/user/project/src/lib/foo.ts', options));
			assert.isFalse(module_matches_source('/home/user/project/src/lib/foo.js', options));
			assert.isFalse(module_matches_source('/home/user/project/src/lib/Button.svelte', options));
		});

		test('supports additional extensions like css', () => {
			const options: ModuleSourceOptions = {
				...MODULE_SOURCE_DEFAULTS,
				extensions: ['.ts', '.css'],
			};

			assert.isTrue(module_matches_source('/home/user/project/src/lib/foo.ts', options));
			assert.isTrue(module_matches_source('/home/user/project/src/lib/styles.css', options));
			assert.isFalse(module_matches_source('/home/user/project/src/lib/Button.svelte', options));
		});
	});

	describe('with custom exclude_patterns', () => {
		test('respects custom exclude patterns', () => {
			const options: ModuleSourceOptions = {
				...MODULE_SOURCE_DEFAULTS,
				exclude_patterns: [/\.test\.ts$/, /\.spec\.ts$/],
			};

			assert.isTrue(module_matches_source('/home/user/project/src/lib/foo.ts', options));
			assert.isFalse(module_matches_source('/home/user/project/src/lib/foo.test.ts', options));
			assert.isFalse(module_matches_source('/home/user/project/src/lib/foo.spec.ts', options));
		});

		test('can exclude by directory pattern', () => {
			const options: ModuleSourceOptions = {
				...MODULE_SOURCE_DEFAULTS,
				exclude_patterns: [/\/internal\//],
			};

			assert.isTrue(module_matches_source('/home/user/project/src/lib/foo.ts', options));
			assert.isFalse(
				module_matches_source('/home/user/project/src/lib/internal/secret.ts', options),
			);
		});

		test('empty exclude_patterns includes everything', () => {
			const options: ModuleSourceOptions = {
				...MODULE_SOURCE_DEFAULTS,
				exclude_patterns: [],
			};

			assert.isTrue(module_matches_source('/home/user/project/src/lib/foo.ts', options));
			assert.isTrue(module_matches_source('/home/user/project/src/lib/foo.test.ts', options));
		});
	});

	describe('edge cases', () => {
		test('rejects nested repo paths with /src/lib/ inside other src directories', () => {
			// Fixture repos nested in src/fixtures/ should be rejected even though they have src/lib/
			assert.isFalse(
				module_matches_source(
					'/home/user/project/src/fixtures/repos/repo_a/src/lib/index.ts',
					MODULE_SOURCE_DEFAULTS,
				),
			);
			assert.isFalse(
				module_matches_source(
					'/home/user/project/src/test/fixtures/repos/repo_b/src/lib/foo.ts',
					MODULE_SOURCE_DEFAULTS,
				),
			);
		});

		test('accepts monorepo paths where first /src/ leads to /lib/', () => {
			// Monorepo structure with packages outside src/
			assert.isTrue(
				module_matches_source(
					'/home/user/monorepo/packages/core/src/lib/foo.ts',
					MODULE_SOURCE_DEFAULTS,
				),
			);
		});

		test('accepts deeply nested paths within src/lib/', () => {
			// Files deeply nested in src/lib/ should work
			assert.isTrue(
				module_matches_source(
					'/home/user/project/src/lib/utils/helpers/deep/file.ts',
					MODULE_SOURCE_DEFAULTS,
				),
			);
		});
	});
});
