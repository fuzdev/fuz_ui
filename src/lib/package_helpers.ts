/**
 * Package and repository URL helpers.
 *
 * Generic utilities for building URLs and parsing package/repository metadata.
 * These functions have no framework dependencies and can be used at build-time or runtime.
 *
 * URL builders:
 * - `url_github_file` - GitHub file permalink
 * - `url_github_org` - GitHub organization page
 * - `url_npm_package` - npm package page
 * - `url_well_known` - .well-known metadata file
 *
 * Parsers:
 * - `repo_url_parse` - extract repo URL from package.json repository field
 * - `repo_name_parse` - extract repo name from scoped package name
 * - `repo_url_github_owner` - extract GitHub owner from repo URL
 *
 * Predicates:
 * - `package_is_published` - check if package is published to npm
 *
 * @module
 */

import {ensure_end, strip_end, strip_start} from '@fuzdev/fuz_util/string.js';
import type {PackageJson} from '@fuzdev/fuz_util/package_json.js';

/**
 * Build GitHub file URL for a repository.
 *
 * @param repo_url Repository URL (e.g., 'https://github.com/owner/repo')
 * @param file_path Path to the file (leading './' is stripped)
 * @param line Optional line number for deep linking
 * @returns Full GitHub URL to the file on the main branch
 *
 * @example
 * url_github_file('https://github.com/foo/bar', 'src/index.ts')
 * // => 'https://github.com/foo/bar/blob/main/src/index.ts'
 *
 * @example
 * url_github_file('https://github.com/foo/bar', './src/index.ts', 42)
 * // => 'https://github.com/foo/bar/blob/main/src/index.ts#L42'
 */
export const url_github_file = (repo_url: string, file_path: string, line?: number): string => {
	const clean_path = file_path.replace(/^\.\//, '');
	const base = `${repo_url}/blob/main/${clean_path}`;
	return line ? `${base}#L${line}` : base;
};

/**
 * Build GitHub organization URL from repo URL and repo name.
 *
 * @param repo_url Repository URL (e.g., 'https://github.com/owner/repo')
 * @param repo_name Repository name to strip from the URL
 * @returns Organization URL, or null if repo_url doesn't end with repo_name
 *
 * @example
 * url_github_org('https://github.com/fuzdev/fuz_ui', 'fuz_ui')
 * // => 'https://github.com/fuzdev'
 */
export const url_github_org = (repo_url: string, repo_name: string): string | null => {
	return repo_url.endsWith('/' + repo_name) ? strip_end(repo_url, '/' + repo_name) : null;
};

/**
 * Extract GitHub owner/org name from repository URL.
 *
 * @param repo_url Repository URL (e.g., 'https://github.com/owner/repo')
 * @returns Owner name, or null if not a valid GitHub URL
 *
 * @example
 * repo_url_github_owner('https://github.com/fuzdev/fuz_ui')
 * // => 'fuzdev'
 *
 * @example
 * repo_url_github_owner('https://gitlab.com/foo/bar')
 * // => null (not a GitHub URL)
 */
export const repo_url_github_owner = (repo_url: string): string | null => {
	const stripped = strip_start(repo_url, 'https://github.com/');
	if (stripped === repo_url) return null;
	const parts = stripped.split('/');
	return parts[0] || null;
};

/**
 * Build npm package URL.
 *
 * @param package_name Package name (can be scoped like '@org/package')
 * @returns Full npm package page URL
 *
 * @example
 * url_npm_package('@fuzdev/fuz_ui')
 * // => 'https://www.npmjs.com/package/@fuzdev/fuz_ui'
 */
export const url_npm_package = (package_name: string): string =>
	'https://www.npmjs.com/package/' + package_name;

/**
 * Check if a package is published to npm.
 *
 * A package is considered published if:
 * - It's not marked as private
 * - It has exports defined
 * - Its version is not the initial '0.0.1'
 *
 * @param package_json The package.json object to check
 * @returns True if the package appears to be published
 */
export const package_is_published = (package_json: PackageJson): boolean => {
	return !package_json.private && !!package_json.exports && package_json.version !== '0.0.1';
};

/**
 * Extract repository name without scope from package name.
 *
 * @param name Package name (can be scoped like '@org/package')
 * @returns Repository name without scope
 * @throws Error if scoped package name is malformed
 *
 * @example
 * repo_name_parse('@fuzdev/fuz_ui')
 * // => 'fuz_ui'
 *
 * @example
 * repo_name_parse('lodash')
 * // => 'lodash'
 */
export const repo_name_parse = (name: string): string => {
	if (name[0] === '@') {
		const parts = name.split('/');
		if (parts.length < 2) {
			throw new Error(`invalid scoped package name: "${name}" (expected format: @org/package)`);
		}
		return parts[1]!;
	}
	return name;
};

/**
 * Parse repository URL from package.json format.
 *
 * Handles both string format and object format with `url` property.
 * Strips common prefixes ('git+') and suffixes ('.git', '/').
 *
 * @param repository The repository field from package.json
 * @returns Clean repository URL, or null if not provided
 *
 * @example
 * repo_url_parse('https://github.com/foo/bar')
 * // => 'https://github.com/foo/bar'
 *
 * @example
 * repo_url_parse({url: 'git+https://github.com/foo/bar.git'})
 * // => 'https://github.com/foo/bar'
 *
 * @example
 * repo_url_parse(undefined)
 * // => null
 */
export const repo_url_parse = (repository: PackageJson['repository']): string | null => {
	if (!repository) return null;
	const url = typeof repository === 'string' ? repository : repository.url;
	if (!url) return null;
	return strip_end(strip_start(strip_end(url, '.git'), 'git+'), '/');
};

/**
 * Build .well-known URL for package metadata files.
 *
 * @param homepage_url Package homepage URL
 * @param filename Filename in .well-known directory
 * @returns Full URL to the .well-known file
 *
 * @example
 * url_well_known('https://fuz.dev', 'package.json')
 * // => 'https://fuz.dev/.well-known/package.json'
 */
export const url_well_known = (homepage_url: string, filename: string): string => {
	return `${ensure_end(homepage_url, '/')}.well-known/${filename}`;
};
