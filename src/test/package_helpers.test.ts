import {test, expect, describe} from 'vitest';

import {
	url_github_file,
	url_github_org,
	repo_url_github_owner,
	url_npm_package,
	package_is_published,
	repo_name_parse,
	repo_url_parse,
	url_well_known,
} from '$lib/package_helpers.js';

describe('url_github_file', () => {
	test('builds basic file URL', () => {
		expect(url_github_file('https://github.com/foo/bar', 'src/index.ts')).toBe(
			'https://github.com/foo/bar/blob/main/src/index.ts',
		);
	});

	test('strips leading ./ from file path', () => {
		expect(url_github_file('https://github.com/foo/bar', './src/index.ts')).toBe(
			'https://github.com/foo/bar/blob/main/src/index.ts',
		);
	});

	test('includes line number when provided', () => {
		expect(url_github_file('https://github.com/foo/bar', 'src/index.ts', 42)).toBe(
			'https://github.com/foo/bar/blob/main/src/index.ts#L42',
		);
	});

	test('handles nested paths', () => {
		expect(url_github_file('https://github.com/foo/bar', 'src/lib/utils/helpers.ts')).toBe(
			'https://github.com/foo/bar/blob/main/src/lib/utils/helpers.ts',
		);
	});

	test('handles root-level files', () => {
		expect(url_github_file('https://github.com/foo/bar', 'README.md')).toBe(
			'https://github.com/foo/bar/blob/main/README.md',
		);
	});
});

describe('url_github_org', () => {
	test('extracts org URL from repo URL', () => {
		expect(url_github_org('https://github.com/fuzdev/fuz_ui', 'fuz_ui')).toBe(
			'https://github.com/fuzdev',
		);
	});

	test('returns null when repo name does not match', () => {
		expect(url_github_org('https://github.com/fuzdev/fuz_ui', 'other_repo')).toBe(null);
	});

	test('returns null for partial match', () => {
		expect(url_github_org('https://github.com/fuzdev/fuz_ui_extra', 'fuz_ui')).toBe(null);
	});

	test('handles single-word org names', () => {
		expect(url_github_org('https://github.com/org/repo', 'repo')).toBe('https://github.com/org');
	});
});

describe('repo_url_github_owner', () => {
	test('extracts owner from GitHub URL', () => {
		expect(repo_url_github_owner('https://github.com/fuzdev/fuz_ui')).toBe('fuzdev');
	});

	test('returns null for non-GitHub URL', () => {
		expect(repo_url_github_owner('https://gitlab.com/foo/bar')).toBe(null);
	});

	test('returns null for malformed GitHub URL', () => {
		expect(repo_url_github_owner('https://github.com/')).toBe(null);
	});

	test('handles URLs with trailing content', () => {
		expect(repo_url_github_owner('https://github.com/owner/repo/tree/main')).toBe('owner');
	});

	test('returns null for http (non-https) URL', () => {
		expect(repo_url_github_owner('http://github.com/foo/bar')).toBe(null);
	});
});

describe('url_npm_package', () => {
	test('builds URL for unscoped package', () => {
		expect(url_npm_package('lodash')).toBe('https://www.npmjs.com/package/lodash');
	});

	test('builds URL for scoped package', () => {
		expect(url_npm_package('@fuzdev/fuz_ui')).toBe('https://www.npmjs.com/package/@fuzdev/fuz_ui');
	});
});

describe('package_is_published', () => {
	test('returns true for published package', () => {
		expect(
			package_is_published({
				name: 'my-package',
				version: '1.0.0',
				exports: {'.': './index.js'},
			}),
		).toBe(true);
	});

	test('returns false for private package', () => {
		expect(
			package_is_published({
				name: 'my-package',
				version: '1.0.0',
				private: true,
				exports: {'.': './index.js'},
			}),
		).toBe(false);
	});

	test('returns false for package without exports', () => {
		expect(
			package_is_published({
				name: 'my-package',
				version: '1.0.0',
			}),
		).toBe(false);
	});

	test('returns false for initial version 0.0.1', () => {
		expect(
			package_is_published({
				name: 'my-package',
				version: '0.0.1',
				exports: {'.': './index.js'},
			}),
		).toBe(false);
	});

	test('returns true for version 0.0.2', () => {
		expect(
			package_is_published({
				name: 'my-package',
				version: '0.0.2',
				exports: {'.': './index.js'},
			}),
		).toBe(true);
	});
});

describe('repo_name_parse', () => {
	test('returns name for unscoped package', () => {
		expect(repo_name_parse('lodash')).toBe('lodash');
	});

	test('extracts name from scoped package', () => {
		expect(repo_name_parse('@fuzdev/fuz_ui')).toBe('fuz_ui');
	});

	test('throws for malformed scoped package', () => {
		expect(() => repo_name_parse('@fuzdev')).toThrow('invalid scoped package name');
	});

	test('handles package names with hyphens', () => {
		expect(repo_name_parse('@org/my-package-name')).toBe('my-package-name');
	});
});

describe('repo_url_parse', () => {
	test('returns null for undefined', () => {
		expect(repo_url_parse(undefined)).toBe(null);
	});

	test('handles string URL directly', () => {
		expect(repo_url_parse('https://github.com/foo/bar')).toBe('https://github.com/foo/bar');
	});

	test('extracts URL from object format', () => {
		expect(repo_url_parse({type: 'git', url: 'https://github.com/foo/bar'})).toBe(
			'https://github.com/foo/bar',
		);
	});

	test('strips git+ prefix', () => {
		expect(repo_url_parse('git+https://github.com/foo/bar')).toBe('https://github.com/foo/bar');
	});

	test('strips .git suffix', () => {
		expect(repo_url_parse('https://github.com/foo/bar.git')).toBe('https://github.com/foo/bar');
	});

	test('strips both git+ prefix and .git suffix', () => {
		expect(repo_url_parse({type: 'git', url: 'git+https://github.com/foo/bar.git'})).toBe(
			'https://github.com/foo/bar',
		);
	});

	test('strips trailing slash', () => {
		expect(repo_url_parse('https://github.com/foo/bar/')).toBe('https://github.com/foo/bar');
	});

	test('returns null for object without url', () => {
		expect(repo_url_parse({type: 'git'} as any)).toBe(null);
	});
});

describe('url_well_known', () => {
	test('builds .well-known URL', () => {
		expect(url_well_known('https://fuz.dev', 'package.json')).toBe(
			'https://fuz.dev/.well-known/package.json',
		);
	});

	test('handles homepage with trailing slash', () => {
		expect(url_well_known('https://fuz.dev/', 'package.json')).toBe(
			'https://fuz.dev/.well-known/package.json',
		);
	});

	test('handles various filenames', () => {
		expect(url_well_known('https://example.com', 'security.txt')).toBe(
			'https://example.com/.well-known/security.txt',
		);
	});
});
