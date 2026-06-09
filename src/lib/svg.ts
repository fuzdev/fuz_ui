import type {SvelteHTMLElements} from 'svelte/elements';

export interface SvgData {
	/**
	 * Raw svg markup string that's inserted unsafely as a child of the `svg` element.
	 * This is an escape hatch for non-`path` markup -
	 * generally, you should instead use the `paths` property to avoid security/CSP implications.
	 */
	raw?: string | null;
	/**
	 * List of svg `path` attribute objects. The `d` attribute is required.
	 */
	paths?: Array<{d: string} & SvelteHTMLElements['path']> | null;
	attrs?: SvelteHTMLElements['svg'] | null;
	fill?: string | null;
	width?: string | null;
	height?: string | null;
	label?: string | null;
	/**
	 * Defaults to `"0 0 100 100"`.
	 */
	viewBox?: string | null;
}
