import type {CspDirectives} from './csp.ts';

/**
 * Per-directive sources owned by fuz.dev.
 *
 * Pass into `create_csp_directives({extend: [csp_directives_of_fuzdev]})`.
 * Scoped narrowly to actually-served resources — widen on demand, not by default.
 */
export const csp_directives_of_fuzdev: Partial<CspDirectives> = {
	'img-src': ['https://*.fuz.dev/', 'https://*.zzz.software/'],
};
