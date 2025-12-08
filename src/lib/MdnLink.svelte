<script lang="ts">
	import {strip_end, strip_start} from '@fuzdev/fuz_util/string.js';
	import type {SvelteHTMLElements} from 'svelte/elements';

	import Svg from './Svg.svelte';
	import {logo_mdn} from './logos.js';

	const {
		path,
		children,
		class: class_prop,
		...rest
	}: SvelteHTMLElements['a'] & {
		path: string;
	} = $props();

	const href = $derived(
		path.startsWith('https://')
			? path
			: `https://developer.mozilla.org/en-US/docs/${strip_start(path, '/')}`,
	);

	const final_children = $derived(children ?? strip_end(path, '/').split('/').at(-1)!);
</script>

<!-- TODO -next-line doesnt work? -->
<!-- eslint-disable svelte/no-navigation-without-resolve -->
<a {...rest} {href} class="mdn_link chip white_space_nowrap {class_prop}" rel="noopener"
	><Svg
		data={logo_mdn}
		inline
		size="var(--icon_size_xs)"
		attrs={{class: 'mx_xs3 vertical_align_middle'}}
	/>
	{#if typeof final_children === 'string'}
		<span class="font_family_mono">{final_children}</span>
	{:else}
		{@render final_children()}
	{/if}</a
>
