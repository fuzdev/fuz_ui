<script lang="ts">
	import type { OmitStrict } from '@fuzdev/fuz_util/types.ts';
	import type { SvelteHTMLElements } from 'svelte/elements';

	/**
	 * Renders values as a small inline SVG line graph.
	 *
	 * Designed for comparable small multiples: pass a shared `max` so a set of
	 * sparklines renders at the same vertical scale instead of each stretching
	 * to fit. The stroke uses `currentColor`, so color it by setting `color` on
	 * the component or a parent (e.g. a fuz_css `color_*` class). Each point's
	 * stroke alpha scales with its value, from `alpha_floor` at 0 up to 1 at
	 * `max`, de-emphasizing quiet stretches.
	 *
	 * `scale` controls only the geometry: the nonlinear options compress the
	 * top of the range so small values stay legible under a large shared
	 * `max`, while the alpha fade keeps tracking the linear ratio so it still
	 * encodes true magnitude.
	 *
	 * @module
	 */

	const {
		values,
		max,
		scale = 'linear',
		width = 100,
		height = 24,
		stroke_width = 2,
		alpha_floor = 0.4,
		label,
		...rest
	}: OmitStrict<SvelteHTMLElements['svg'], 'values' | 'width' | 'height' | 'scale'> & {
		values: Array<number>;
		/**
		 * The value rendered at full height and full alpha.
		 * Pass a shared max across sparklines for comparable scales.
		 * Defaults to the local max of `values`.
		 */
		max?: number;
		/**
		 * Vertical scale for the line's geometry. The nonlinear options compress
		 * the top of the range so small values stay legible under a large shared
		 * `max` — increasingly so from `'sqrt'` to smaller power exponents (a
		 * number in `(0, 1]`, where `1` is linear and `1 / 3` is cube root) to
		 * `'log'`. The alpha fade always tracks the linear ratio regardless of
		 * `scale`.
		 */
		scale?: 'linear' | 'sqrt' | 'log' | number;
		/**
		 * Width of the svg in px.
		 */
		width?: number;
		/**
		 * Height of the svg in px.
		 */
		height?: number;
		stroke_width?: number;
		/**
		 * Stroke alpha at a value of 0, scaling linearly to 1 at `max`.
		 */
		alpha_floor?: number;
		/**
		 * Accessible label. When omitted the svg is `aria-hidden`.
		 */
		label?: string;
	} = $props();

	const gradient_id = $props.id();

	const scale_max = $derived.by(() => {
		const m = max ?? Math.max(0, ...values);
		return m > 0 ? m : 1;
	});

	// inset by half the stroke so the line isn't clipped at the extremes
	const pad = $derived(stroke_width / 2);
	const x_coord = (index: number): number =>
		values.length <= 1 ? width / 2 : pad + (index * (width - 2 * pad)) / (values.length - 1);
	const y_coord = (value: number): number => {
		const clamped = Math.min(value, scale_max);
		const ratio = clamped / scale_max;
		const scaled =
			scale === 'linear'
				? ratio
				: scale === 'sqrt'
					? Math.sqrt(ratio)
					: scale === 'log'
						? Math.log1p(clamped) / Math.log1p(scale_max)
						: ratio ** scale;
		return height - pad - scaled * (height - 2 * pad);
	};
	const alpha = (value: number): number =>
		alpha_floor + (1 - alpha_floor) * (Math.min(value, scale_max) / scale_max);

	const round = (n: number): number => Math.round(n * 100) / 100;

	const points = $derived(
		values.map((value, index) => `${round(x_coord(index))},${round(y_coord(value))}`).join(' ')
	);
</script>

<svg
	{...rest}
	{width}
	{height}
	viewBox="0 0 {width} {height}"
	role={label ? 'img' : undefined}
	aria-label={label}
	aria-hidden={label ? undefined : true}
>
	{#if values.length > 1}
		<defs>
			<linearGradient
				id={gradient_id}
				gradientUnits="userSpaceOnUse"
				x1="0"
				y1="0"
				x2={width}
				y2="0"
			>
				{#each values as value, index (index)}
					<stop
						offset={round(x_coord(index) / width)}
						stop-color="currentColor"
						stop-opacity={round(alpha(value))}
					/>
				{/each}
			</linearGradient>
		</defs>
		<polyline
			{points}
			fill="none"
			stroke="url(#{gradient_id})"
			stroke-width={stroke_width}
			stroke-linejoin="round"
			stroke-linecap="round"
		/>
	{/if}
</svg>
