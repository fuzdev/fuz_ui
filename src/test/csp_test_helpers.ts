import {assert} from 'vitest';
import type {CspTrustLevel, CspSourceSpec, CspDirectives, CspDirective} from '$lib/csp.js';

// Test domain constants
export const TEST_SOURCES = {
	TRUSTED: 'trusted.domain',
	TRUSTED_A: 'a.trusted.domain',
	TRUSTED_2: 'trusted2.domain',
	STATIC_OVERRIDE: 'static-override.domain',
	FUNCTION_ADDED: 'function-added.domain',
	COMPLETE_OVERRIDE: 'complete-override.domain',
	DEFAULT_OVERRIDE: 'default-override.domain',
	SECONDARY_DEFAULT: 'secondary-default.domain',
	// Real-world sources
	GOOGLE_FONTS: 'fonts.googleapis.com',
	GOOGLE_FONTS_STATIC: 'fonts.gstatic.com',
	CLOUDFLARE_CDN: 'cdnjs.cloudflare.com',
	ANALYTICS: 'analytics.fuz.dev',
	STRIPE: 'js.stripe.com',
} as const;

/**
 * Creates a test source spec with a trust level.
 */
export const create_test_source = (source: string, trust: CspTrustLevel): CspSourceSpec => ({
	source: source as any,
	trust,
});

/**
 * Creates a test source spec with explicit directives.
 */
export const create_test_source_with_directives = (
	source: string,
	directives: Array<CspDirective>,
): CspSourceSpec => ({
	source: source as any,
	directives,
});

/**
 * Creates a test source spec with both trust and directives.
 */
export const create_test_source_with_both = (
	source: string,
	trust: CspTrustLevel,
	directives: Array<CspDirective>,
): CspSourceSpec => ({
	source: source as any,
	trust,
	directives,
});

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
 * Asserts that a directive exists in the CSP.
 */
export const assert_directive_exists = (
	csp: CspDirectives,
	directive: CspDirective,
	message?: string,
): void => {
	assert.property(csp, directive, message || `${directive} should exist in CSP`);
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

/**
 * Asserts that a directive has a specific value.
 */
export const assert_directive_equals = (
	csp: CspDirectives,
	directive: CspDirective,
	expected: any,
	message?: string,
): void => {
	assert.deepEqual(csp[directive], expected, message || `${directive} should equal expected value`);
};
