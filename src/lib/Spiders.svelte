<script module lang="ts">
	const minute_of_day = (): number => {
		const now = new Date();
		return now.getHours() * 60 + now.getMinutes();
	};
</script>

<script lang="ts">
	import {random_int, shuffle} from '@fuzdev/fuz_util/random.js';
	import {create_random_alea} from '@fuzdev/fuz_util/random_alea.js';

	import Svg from './Svg.svelte';
	import {logo_fuz} from './logos.js';

	const {
		spiders = [
			'var(--color_a_50)',
			'var(--color_b_50)',
			'var(--color_c_50)',
			'var(--color_d_50)',
			'var(--color_e_50)',
			'var(--color_f_50)',
			'var(--color_g_50)',
			'var(--color_h_50)',
			'var(--color_i_50)',
			'var(--color_j_50)',
		],
		seed = minute_of_day(),
		random = create_random_alea(seed),
	}: {
		spiders?: Array<string>; // for now, just colors
		seed?: unknown;
		random?: typeof Math.random;
	} = $props();

	const shuffled = $derived(shuffle(spiders.slice(), (min, max) => random_int(min, max, random)));
	const rotations = $derived(shuffled.map(() => random_int(0, 359, random)));
</script>

<!-- TODO animate each in randomly -->
<!-- TODO show when intersected in viewport, maybe inline `svelte-intersect` in Fuz? -->
<div class="spiders" style:--spider_count={spiders.length}>
	{#each shuffled as color, i (color)}
		<Svg data={logo_fuz} fill={color} style="transform: rotate(${rotations[i]}deg)" />
	{/each}
</div>

<style>
	.spiders {
		--width: calc(100% / var(--spider_count));
		position: relative;
		z-index: 1;
		overflow: hidden;
		display: grid;
		grid-template-columns: repeat(var(--spider_count), 1fr);
	}
</style>
