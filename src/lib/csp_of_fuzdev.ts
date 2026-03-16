import type {CspSourceSpec} from './csp.ts';

/**
 * Trusted sources owned by fuz.dev.
 */
export const csp_trusted_sources_of_fuzdev: Array<CspSourceSpec> = [
	{source: 'https://*.fuz.dev/', trust: 'low'},
	{source: 'https://*.zzz.software/', trust: 'low'},
	// if needed
	// {source: 'https://fuzdev.github.io/', trust: 'low'},
];
