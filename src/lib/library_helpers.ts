/**
 * Library documentation URL helpers.
 *
 * Runtime UI helpers for building URLs in the library documentation system.
 * These depend on fuz_ui's documentation paths and SvelteKit's runtime state.
 *
 * For generic package/repository URL helpers, see `package_helpers.ts`.
 *
 * @module
 */

import {ensure_end, strip_start} from '@fuzdev/fuz_util/string.js';
import {page} from '$app/state';

import {DOCS_API_PATH, DOCS_PATH_DEFAULT} from './docs_helpers.svelte.js';

/**
 * Build project-relative API documentation URL with hash anchor.
 *
 * @param declaration_name Name of the declaration to link to
 * @returns URL path like '/docs/api#declaration_name'
 */
export const url_api_declaration = (declaration_name: string): string =>
	`${DOCS_API_PATH}#${encodeURIComponent(declaration_name)}`;

/**
 * Build full API documentation URL with domain and hash anchor.
 *
 * @param homepage Package homepage URL
 * @param declaration_name Name of the declaration to link to
 * @returns Full URL like 'https://example.com/docs/api#declaration_name'
 */
export const url_api_declaration_full = (homepage: string, declaration_name: string): string =>
	`${homepage}${DOCS_PATH_DEFAULT}/api#${encodeURIComponent(declaration_name)}`;

/**
 * Build project-relative module documentation URL.
 *
 * @param module_path Module path (e.g., 'helpers.ts')
 * @returns URL path like '/docs/api/helpers.ts'
 */
export const url_api_module = (module_path: string): string => `${DOCS_API_PATH}/${module_path}`;

/**
 * Build package logo URL with favicon.png fallback.
 *
 * @param homepage_url Package homepage URL, or null
 * @param logo_path Optional custom logo path (defaults to 'favicon.png')
 * @returns Full URL to the logo, or null if no homepage
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
 * Convert a full URL to root-relative format by removing the origin.
 *
 * Uses SvelteKit's page state for the current origin by default.
 *
 * @param url Full URL to convert
 * @param origin Origin to strip (defaults to current page origin)
 * @returns Root-relative URL starting with '/'
 *
 * @example
 * // Assuming page.url.origin is 'https://example.com'
 * url_to_root_relative('https://example.com/docs/api')
 * // => '/docs/api'
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
