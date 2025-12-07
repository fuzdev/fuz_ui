import {ensure_end, strip_end, strip_start} from '@fuzdev/fuz_util/string.js';
import type {PackageJson} from '@fuzdev/fuz_util/package_json.js';
import {page} from '$app/state';

import {DOCS_API_PATH, DOCS_PATH_DEFAULT} from './docs_helpers.svelte.js';

/**
 * Build project-relative API documentation URL with hash anchor.
 */
export const url_api_declaration = (declaration_name: string): string =>
	`${DOCS_API_PATH}#${encodeURIComponent(declaration_name)}`;

/**
 * Build full API documentation URL with domain and hash anchor.
 */
export const url_api_declaration_full = (homepage: string, declaration_name: string): string =>
	`${homepage}${DOCS_PATH_DEFAULT}/api#${encodeURIComponent(declaration_name)}`;

/**
 * Build project-relative module documentation URL.
 */
export const url_api_module = (module_path: string): string => `${DOCS_API_PATH}/${module_path}`;

/**
 * Build GitHub file URL for a repository.
 */
export const url_github_file = (repo_url: string, file_path: string, line?: number): string => {
	const clean_path = file_path.replace(/^\.\//, '');
	const base = `${repo_url}/blob/main/${clean_path}`;
	return line ? `${base}#L${line}` : base;
};

/**
 * Build GitHub organization URL from repo URL and repo name.
 */
export const url_github_org = (repo_url: string, repo_name: string): string | null => {
	return repo_url.endsWith('/' + repo_name) ? strip_end(repo_url, '/' + repo_name) : null;
};

/**
 * Parse GitHub owner/org name from repository URL.
 */
export const github_owner_parse = (repo_url: string): string | null => {
	const stripped = strip_start(repo_url, 'https://github.com/');
	if (stripped === repo_url) return null;
	const parts = stripped.split('/');
	return parts[0] || null;
};

/**
 * Build npm package URL.
 */
export const url_npm_package = (package_name: string): string =>
	'https://www.npmjs.com/package/' + package_name;

/**
 * Check if a package is published to npm.
 */
export const package_is_published = (package_json: PackageJson): boolean => {
	return !package_json.private && !!package_json.exports && package_json.version !== '0.0.1';
};

/**
 * Build package logo URL with favicon.png fallback.
 */
export const url_package_logo = (
	homepage_url: string | null,
	logo_path?: string,
): string | null => {
	if (!homepage_url) return null;
	const path = logo_path ? strip_start(logo_path, '/') : 'favicon.png';
	return ensure_end(homepage_url, '/') + path;
};

/**
 * Extract repository name without scope from package name.
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
 */
export const repo_url_parse = (repository: PackageJson['repository']): string | null => {
	if (!repository) return null;
	const url = typeof repository === 'string' ? repository : repository.url;
	if (!url) return null;
	return strip_end(strip_start(strip_end(url, '.git'), 'git+'), '/');
};

/**
 * Build .well-known URL for package metadata files.
 */
export const url_well_known = (homepage_url: string, filename: string): string => {
	return `${ensure_end(homepage_url, '/')}.well-known/${filename}`;
};

/**
 * Convert a full URL to root-relative format by removing the origin.
 */
export const url_to_root_relative = (url: string, origin: string = page.url.origin): string => {
	const origin_with_slash = ensure_end(origin, '/');

	if (url === origin || url === origin_with_slash) {
		return '/';
	}

	const stripped = strip_start(url, origin_with_slash);

	if (stripped === url) {
		return url;
	}

	return '/' + stripped;
};
