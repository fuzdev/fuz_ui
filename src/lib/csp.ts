import type {ArrayElement, Defined} from '@fuzdev/fuz_util/types.js';

// TODO schemas, but I may be moving to ArkType from Zod if precompilation looks good

export interface CreateCspDirectivesOptions {
	/**
	 * Override or transform specific directives.
	 * Returning `null` or `undefined` from a transform function will remove the directive.
	 */
	directives?: {
		[K in CspDirective]?:
			| CspDirectiveValue<K> // Static value replacement
			| null // Removes the directive
			// Transform function returning one of the previous types
			| ((value: CspDirectiveValue<K>) => CspDirectiveValue<K> | null);
	};

	/**
	 * Sources to include based on their trust levels.
	 */
	trusted_sources?: Array<CspSourceSpec>;

	/**
	 * Override default values for specific directives,
	 * merging with `value_defaults_base` (or replacing if that directive is null in the base).
	 */
	value_defaults?: Partial<typeof csp_directive_value_defaults>;

	/**
	 * Base values for directive defaults.
	 * Set to `null` or `{}` to start with no defaults.
	 * Defaults to `csp_directive_value_defaults`.
	 */
	value_defaults_base?: Partial<typeof csp_directive_value_defaults> | null;

	/**
	 * Override trust requirements for specific directives,
	 * merging with `required_trust_defaults_base` (or replacing if that directive is null in the base).
	 */
	required_trust_defaults?: Partial<typeof csp_directive_required_trust_defaults>;

	/**
	 * Base values for directive trust requirements.
	 * Set to `null` or `{}` to start with no trust requirements.
	 * Defaults to `csp_directive_required_trust_defaults`.
	 */
	required_trust_defaults_base?: Partial<typeof csp_directive_required_trust_defaults> | null;
}

/**
 * This is designed for compatibility with SvelteKit
 * and maps to the `KitConfig` `directives` option.
 * The goal is to provide an ergonomic, modern, and safe API
 * for Content Security Policy (CSP) creation
 * that's simple to write and audit, and isn't error-prone.
 *
 * Things like validation and rendering to a string
 * are out of scope and left to SvelteKit.
 */
export function create_csp_directives(options: CreateCspDirectivesOptions = {}): CspDirectives {
	const {
		directives: directives_option,
		trusted_sources,
		value_defaults_base = csp_directive_value_defaults,
		value_defaults: value_defaults_option,
		required_trust_defaults_base = csp_directive_required_trust_defaults,
		required_trust_defaults: required_trust_defaults_option,
	} = options;

	const directives: CspDirectives = {};

	// Shallowly merge any provided defaults with the base defaults
	const value_defaults = {...value_defaults_base, ...value_defaults_option};

	// Merge required trust defaults with the base
	const required_trust_defaults = {
		...required_trust_defaults_base,
		...required_trust_defaults_option,
	};

	// Apply defaults from directive specs
	for (const spec of csp_directive_specs) {
		const default_value = value_defaults[spec.name];
		if (default_value == null) continue; // omit null and undefined

		directives[spec.name] = Array.isArray(default_value)
			? [...default_value]
			: (default_value as CspDirectiveValue<any>);
	}

	// Get trust requirements (with overrides applied)
	const trust_requirements: Map<CspDirective, CspTrustLevel | null> = new Map();
	for (const spec of csp_directive_specs) {
		const required_trust = required_trust_defaults[spec.name];
		if (required_trust == null) continue; // omit null and undefined

		trust_requirements.set(spec.name, required_trust);
	}

	// Validate trusted_sources directives
	if (trusted_sources?.length) {
		for (const spec of trusted_sources) {
			if (spec.directives) {
				for (const directive of spec.directives) {
					if (parse_csp_directive(directive) === null) {
						throw new Error(`Invalid directive in trusted_sources: ${directive}`);
					}
				}
			}
		}
	}

	// Apply trusted sources to directives
	if (trusted_sources?.length) {
		for (const [key, value] of Object.entries(directives)) {
			const directive = parse_csp_directive(key);
			if (directive === null) {
				throw new Error(`Invalid directive in options.directives: ${key}`);
			}

			// Skip if directive is ['none'] or not an array
			if (is_none_directive(value) || !Array.isArray(value)) {
				continue;
			}

			// Get required trust for this directive
			const required_trust = trust_requirements.get(directive);
			if (required_trust == null) continue;

			// Add matching sources - separate the filtering into trust-based and directive-based inclusion
			const sources_to_add = trusted_sources
				.filter((spec) => {
					// Check for explicit inclusion in directives list
					const explicitly_included = spec.directives?.includes(directive) ?? false;

					// Check for trust level based inclusion
					const has_trust_level = spec.trust !== undefined;
					const include_by_trust = has_trust_level && is_csp_trusted(required_trust, spec.trust);

					// Include the source if either condition is met
					return explicitly_included || include_by_trust;
				})
				.map((spec) => spec.source);

			if (sources_to_add.length > 0) {
				directives[directive] = [...value, ...sources_to_add] as CspDirectiveValue<any>;
			}
		}
	}

	// Apply directive overrides/transformations
	if (directives_option) {
		for (const [key, value_or_fn] of Object.entries(directives_option)) {
			const directive = parse_csp_directive(key);
			if (directive === null) {
				throw new Error(`Invalid directive in options.directives: ${key}`);
			}

			const current = directives[directive] as CspDirectiveValue<any>;

			const result = typeof value_or_fn === 'function' ? value_or_fn(current) : value_or_fn;

			// Handle `undefined` too just in case
			if (result == null) {
				delete directives[directive]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
			} else {
				directives[directive] = structuredClone(result) as CspDirectiveValue<any>;
			}
		}
	}

	return directives;
}

export type CspDirective = keyof CspDirectives;

export const parse_csp_directive = (directive: unknown): CspDirective | null =>
	typeof directive === 'string' && csp_directive_spec_by_name.has(directive as CspDirective)
		? (directive as CspDirective)
		: null;

export type CspDirectiveValue<T extends CspDirective> = Defined<CspDirectives[T]>;

export const csp_trust_levels = ['low', 'medium', 'high'] as const;

/**
 * Numeric values for CSP trust levels, `csp_trust_levels`.
 * Lower is less trusted.
 * Includes `undefined` in the type for safety.
 */
export const csp_trust_level_value: Record<CspTrustLevel, number | undefined> = {
	low: 0,
	medium: 1,
	high: 2,
};

/**
 * Trust levels for CSP sources.
 *
 * With the base defaults, trust levels roughly correspond to:
 *
 * - `low` – Passive resources only (no script execution, no styling or UI control).
 * 		Examples: `img-src`, `font-src`.
 * - `medium` – Content that may affect layout, styling, or embed external browsing contexts,
 *    but cannot directly run code in the page's JS execution environment or
 * 		perform other high-risk actions. Examples: `style-src`, `frame-src`, `frame-ancestors`.
 * - `high` – Sources that can execute code in the page's context or open powerful network
 *    channels. Examples: `script-src`, `connect-src`, `child-src`.
 * - `null` – No trust. This is used for directives that don't support sources.
 *
 */
export type CspTrustLevel = ArrayElement<typeof csp_trust_levels>;

/**
 * Validates and extracts a CSP trust level from an unknown value.
 */
export const parse_csp_trust_level = (trust: unknown): CspTrustLevel | null =>
	csp_trust_levels.includes(trust as any) ? (trust as CspTrustLevel) : null;

export interface CspSourceSpec {
	source: CspSource;
	trust?: CspTrustLevel;
	directives?: Array<CspDirective>;
}

export interface CspDirectiveSpec {
	name: CspDirective;
	fallback: Array<CspDirective> | null;
	fallback_of: Array<CspDirective> | null;
}

/**
 * Determines if a granted trust level is sufficient to satisfy a required trust level.
 *
 * Trust levels have the following hierarchy:
 * - 'high' sources can be used in high, medium, and low trust directives (highest privilege)
 * - 'medium' sources can be used in medium and low trust directives
 * - 'low' sources can only be used in low trust directives (lowest privilege)
 */
export const is_csp_trusted = (
	required_trust: CspTrustLevel | null | undefined,
	granted_trust: CspTrustLevel | null | undefined,
): boolean => {
	const required_value = required_trust && csp_trust_level_value[required_trust];
	const granted_value = granted_trust && csp_trust_level_value[granted_trust];

	if (required_value == null || granted_value == null) {
		return false;
	}

	// A source with higher trust privilege (higher value)
	// can be used in a directive with less privilege (lower value).
	return granted_value >= required_value;
};

/**
 * Helper to check if a directive value is `['none']`,
 * or more precisely for robustness with malformed values, checks for an array with `'none'`.
 */
const is_none_directive = (value: unknown): boolean =>
	Array.isArray(value) && value.includes('none');

export const COLOR_SCHEME_SCRIPT_HASH = 'sha256-QOxqn7EUzb3ydF9SALJoJGWSvywW9R0AfTDSenB83Z8=';

/**
 * The base CSP directive defaults.
 * Prioritizes safety but loosens around media and styles, relying on defense-in-depth.
 * Customizable via `CreateCspDirectivesOptions.defaults`.
 */
export const csp_directive_value_defaults: Record<
	CspDirective,
	CspDirectiveValue<CspDirective> | null
> = {
	'default-src': ['none'],
	'script-src': ['self', COLOR_SCHEME_SCRIPT_HASH], // Eval is opt-in, scripting is locked down except for self and the color scheme loader script
	'script-src-elem': ['self', COLOR_SCHEME_SCRIPT_HASH], // Block script elements except for self and the color scheme loader
	'script-src-attr': ['none'], // Block scripts in HTML attributes
	'style-src': ['self', 'unsafe-inline'], // Main style directive (uses unsafe-inline but network connections are disallowed by other directives)
	'style-src-elem': ['self', 'unsafe-inline'], // Style elements (standalone stylesheets)
	'style-src-attr': ['unsafe-inline'], // Style attributes
	'img-src': ['self', 'data:', 'blob:', 'filesystem:'], // Images
	'media-src': ['self', 'data:', 'blob:', 'mediastream:', 'filesystem:'], // Audio/video
	'font-src': ['self', 'data:'], // Fonts
	'manifest-src': ['self'], // Web app manifests
	'child-src': ['none'], // Not trusted, extends default-src so worker-src and frame-src are additionally blocked
	'connect-src': ['self'], // Fetch, WebSockets
	'frame-src': ['self'], // Frames/iframes
	'frame-ancestors': ['self'], // Control what can embed this page
	'form-action': ['self'], // Form submission targets
	'worker-src': ['self', 'blob:'], // Web workers
	'object-src': ['none'], // Block plugins (Flash, Java, etc.)
	'base-uri': ['none'], // Prevent base tag hijacking
	'upgrade-insecure-requests': true, // Upgrade http to https
	'report-to': null, // Report violations (e.g. `'/csp-violation-report'`)
	'require-trusted-types-for': null,
	'trusted-types': null,
	sandbox: null,
};

/**
 * Sources that meet this trust requirement are included for it by default.
 * If null, no trusted sources are added to the directive automatically.
 * Directives that don't support sources or default to `['none']` are null.
 *
 * Feedback is welcome, please see the issues - https://github.com/ryanatkn/fuz/issues
 */
export const csp_directive_required_trust_defaults: Record<CspDirective, CspTrustLevel | null> = {
	'default-src': null,
	'script-src': 'high',
	'script-src-elem': 'high',
	'script-src-attr': null,
	'style-src': 'medium',
	'style-src-elem': 'medium',
	'style-src-attr': 'medium',
	'img-src': 'low',
	'media-src': 'low',
	'font-src': 'low',
	'manifest-src': null,
	'child-src': null,
	'connect-src': 'medium',
	'frame-src': 'medium',
	'frame-ancestors': 'medium',
	'form-action': 'medium',
	'worker-src': 'medium',
	'object-src': null,
	'base-uri': null,
	'upgrade-insecure-requests': null,
	'report-to': null,
	'require-trusted-types-for': null,
	'trusted-types': null,
	sandbox: null,
};

/**
 * Static data descriptors for the CSP directives.
 * Fuz excludes deprecated directives, so those are intentionally omitted,
 * but any newer missing directives are bugs.
 *
 * Could be moved to `csp.ts` but is currently here to keep that module smaller.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy
 */
export const csp_directive_specs: Array<CspDirectiveSpec> = [
	{
		name: 'default-src',
		fallback: null,
		fallback_of: [
			'script-src',
			'script-src-elem',
			'script-src-attr',
			'style-src',
			'style-src-elem',
			'style-src-attr',
			'img-src',
			'media-src',
			'font-src',
			'manifest-src',
			'child-src',
			'connect-src',
			'worker-src',
			'object-src',
		],
	},
	{
		name: 'script-src',
		fallback: ['default-src'],
		fallback_of: ['script-src-elem', 'script-src-attr', 'worker-src'],
	},
	{
		name: 'script-src-elem',
		fallback: ['script-src', 'default-src'],
		fallback_of: null,
	},
	{
		name: 'script-src-attr',
		fallback: ['script-src', 'default-src'],
		fallback_of: null,
	},
	{
		name: 'style-src',
		fallback: ['default-src'],
		fallback_of: ['style-src-elem', 'style-src-attr'],
	},
	{
		name: 'style-src-elem',
		fallback: ['style-src', 'default-src'],
		fallback_of: null,
	},
	{
		name: 'style-src-attr',
		fallback: ['style-src', 'default-src'],
		fallback_of: null,
	},
	{
		name: 'img-src',
		fallback: ['default-src'],
		fallback_of: null,
	},
	{
		name: 'media-src',
		fallback: ['default-src'],
		fallback_of: null,
	},
	{
		name: 'font-src',
		fallback: ['default-src'],
		fallback_of: null,
	},
	{
		name: 'manifest-src',
		fallback: ['default-src'],
		fallback_of: null,
	},
	{
		name: 'child-src',
		fallback: ['default-src'],
		fallback_of: ['frame-src', 'worker-src'],
	},
	{
		name: 'connect-src',
		fallback: ['default-src'],
		fallback_of: null,
	},
	{
		name: 'frame-src',
		fallback: ['child-src'],
		fallback_of: null,
	},
	{
		name: 'frame-ancestors',
		fallback: null,
		fallback_of: null,
	},
	{
		name: 'form-action',
		fallback: null,
		fallback_of: null,
	},
	{
		name: 'worker-src',
		fallback: ['child-src', 'script-src', 'default-src'],
		fallback_of: null,
	},
	{
		name: 'object-src',
		fallback: ['default-src'],
		fallback_of: null,
	},
	{
		name: 'base-uri',
		fallback: null,
		fallback_of: null,
	},
	{
		name: 'upgrade-insecure-requests',
		fallback: null,
		fallback_of: null,
	},
	{
		name: 'report-to',
		fallback: null,
		fallback_of: null,
	},
	{
		name: 'require-trusted-types-for',
		fallback: null,
		fallback_of: null,
	},
	{
		name: 'trusted-types',
		fallback: null,
		fallback_of: null,
	},
	{
		name: 'sandbox',
		fallback: null,
		fallback_of: null,
	},
];

export const csp_directive_spec_by_name: Map<CspDirective, CspDirectiveSpec> = new Map(
	csp_directive_specs.map((s) => [s.name, s]),
);

// CSP types from SvelteKit, adapted with changes from @sveltejs/kit/src/types/private.d.ts
//
// Based on https://github.com/sveltejs/kit/blob/main/packages/kit/src/types/private.d.ts
//
// Based on https://github.com/josh-hemphill/csp-typed-directives/blob/latest/src/csp.types.ts
//
// MIT License
//
// Copyright (c) 2021-present, Joshua Hemphill
// Copyright (c) 2021, Tecnico Corporation
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
export type CspActionSource = 'strict-dynamic' | 'report-sample';
export type CspBaseSource =
	| 'self'
	| 'unsafe-eval'
	| 'unsafe-hashes'
	| 'unsafe-inline'
	| 'wasm-unsafe-eval'
	| 'none';
export type CspCryptoSource = `${'nonce' | 'sha256' | 'sha384' | 'sha512'}-${string}`;
export type CspFrameSource = CspHostSource | CspSchemeSource | 'self' | 'none';
export type CspHostNameScheme = `${string}.${string}` | 'localhost';
export type CspHostSource = `${CspHostProtocolSchemes}${CspHostNameScheme}${CspPortScheme}`;
export type CspHostProtocolSchemes = `${string}://` | '';
export type CspPortScheme = `:${number}` | '' | ':*';
export type CspSchemeSource =
	| 'http:'
	| 'https:'
	| 'data:'
	| 'mediastream:'
	| 'blob:'
	| 'filesystem:';
export type CspSource = CspHostSource | CspSchemeSource | CspCryptoSource | CspBaseSource;
export type CspSources = Array<CspSource>;

export interface CspDirectives {
	'default-src'?: Array<CspSource | CspActionSource>;
	'script-src'?: Array<CspSource | CspActionSource>;
	'script-src-elem'?: CspSources;
	'script-src-attr'?: CspSources;
	'style-src'?: Array<CspSource | CspActionSource>;
	'style-src-elem'?: CspSources;
	'style-src-attr'?: CspSources;
	'img-src'?: CspSources;
	'media-src'?: CspSources;
	'font-src'?: CspSources;
	'manifest-src'?: CspSources;
	'child-src'?: CspSources;
	'connect-src'?: CspSources;
	'frame-src'?: CspSources;
	'frame-ancestors'?: Array<CspFrameSource>;
	'form-action'?: Array<CspSource | CspActionSource>;
	'worker-src'?: CspSources;
	'object-src'?: CspSources;
	'base-uri'?: Array<CspSource | CspActionSource>;
	'upgrade-insecure-requests'?: boolean;
	'report-to'?: Array<string>;
	'require-trusted-types-for'?: Array<'script'>;
	'trusted-types'?: Array<'none' | 'allow-duplicates' | '*' | string>; // eslint-disable-line @typescript-eslint/no-redundant-type-constituents
	sandbox?: Array<
		| 'allow-downloads-without-user-activation'
		| 'allow-forms'
		| 'allow-modals'
		| 'allow-orientation-lock'
		| 'allow-pointer-lock'
		| 'allow-popups'
		| 'allow-popups-to-escape-sandbox'
		| 'allow-presentation'
		| 'allow-same-origin'
		| 'allow-scripts'
		| 'allow-storage-access-by-user-activation'
		| 'allow-top-navigation'
		| 'allow-top-navigation-by-user-activation'
	>;
}
