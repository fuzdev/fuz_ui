import {assert} from 'vitest';
import type {CspDirectives, CspDirective} from '$lib/csp.js';

/**
 * Test domain constants used across CSP test files.
 */
export const TEST_SOURCES = {
	TRUSTED: 'trusted.domain',
	TRUSTED_A: 'a.trusted.domain',
	TRUSTED_2: 'trusted2.domain',
	TRUSTED_3: 'trusted3.domain',
	GOOGLE_FONTS: 'fonts.googleapis.com',
	GOOGLE_FONTS_STATIC: 'fonts.gstatic.com',
	CLOUDFLARE_CDN: 'cdnjs.cloudflare.com',
	ANALYTICS: 'analytics.fuz.dev',
	STRIPE: 'js.stripe.com',
} as const;

/**
 * Asserts that a source is included in a directive.
 */
export const assert_source_in_directive = (
	csp: CspDirectives,
	directive: CspDirective,
	source: string,
	message?: string,
): void => {
	const directive_value = csp[directive];
	assert.isArray(directive_value, message || `${directive} should be an array`);
	assert.include(
		directive_value as Array<any>,
		source,
		message || `${source} should be in ${directive}`,
	);
};

/**
 * Asserts that a source is not included in a directive.
 */
export const assert_source_not_in_directive = (
	csp: CspDirectives,
	directive: CspDirective,
	source: string,
	message?: string,
): void => {
	const directive_value = csp[directive];
	if (Array.isArray(directive_value)) {
		assert.notInclude(
			directive_value as Array<any>,
			source,
			message || `${source} should not be in ${directive}`,
		);
	}
};

/**
 * Asserts that a directive does not exist in the CSP.
 */
export const assert_directive_not_exists = (
	csp: CspDirectives,
	directive: CspDirective,
	message?: string,
): void => {
	assert.notProperty(csp, directive, message || `${directive} should not exist in CSP`);
};
