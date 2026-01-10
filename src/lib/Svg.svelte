<script lang="ts" module>
	import {ensure_end} from '@fuzdev/fuz_util/string.js';
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
</script>

<script lang="ts">
	const {
		data,
		fill,
		size = 'var(--font_size, auto)',
		width,
		height,
		label,
		inline,
		shrink = true,
		...rest
	}: SvelteHTMLElements['svg'] & {
		data: SvgData;
		/**
		 * Overrides `data.fill`.
		 */
		fill?: string | null;
		/**
		 * Sets both the `width` and `height` of the svg. Overridden by the `width` and `height` props.
		 */
		size?: string;
		/**
		 * Sets the `width` of the svg. Overrides `size`.
		 */
		width?: string;
		/**
		 * Sets the `height` of the svg. Overrides `size`.
		 */
		height?: string;
		label?: string;
		/**
		 * Renders the SVG as an inline block with spacing appropriate for text. Defaults to `false`.
		 */
		inline?: boolean;
		shrink?: boolean;
	} = $props();

	const final_fill = $derived(fill ?? data.fill ?? 'var(--text_color, #000)'); // can be overridden by each path's `fill` attribute
	const final_width = $derived(width ?? size); // TODO @many default value? `100%` or omitted or something else?
	const final_height = $derived(height ?? size); // TODO @many default value? `100%` or omitted or something else?

	// merge `style` so users don't accidentally clobber any style data - maybe support other attrs or somehow clean this up?
	const style = $derived(
		data.attrs?.style && rest.style
			? ensure_end(data.attrs.style, ';') + ' ' + rest.style
			: (data.attrs?.style ?? rest.style),
	);

	// TODO dont use @html
</script>

<svg
	viewBox={data.viewBox ?? '0 0 100 100'}
	{...data.attrs}
	{...rest}
	aria-label={label ?? data.label}
	class="{data.attrs?.class} {rest.class} {inline ? 'display:inline-block position:relative' : ''}"
	style:width={final_width}
	style:height={final_height}
	style:top={inline ? '0.1em' : undefined}
	style:flex-shrink={shrink ? 1 : 0}
	{style}
>
	{#if data.raw}{@html data.raw}{/if}<!-- eslint-disable-line svelte/no-at-html-tags -->
	{#if data.paths}
		{#each data.paths as path (path)}
			<path fill={final_fill} {...path} />
		{/each}
	{/if}
</svg>
