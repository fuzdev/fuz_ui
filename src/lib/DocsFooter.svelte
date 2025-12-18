<script lang="ts">
	import {format_url, type Url} from '@fuzdev/fuz_util/url.js';
	import type {Snippet} from 'svelte';
	import type {SvelteHTMLElements} from 'svelte/elements';

	import type {Library} from './library.svelte.js';
	import Svg from './Svg.svelte';
	import {logo_github} from './logos.js';

	const {
		library,
		root_url = null,
		logo,
		logo_header,
		logo_footer,
		children,
		...rest
	}: SvelteHTMLElements['footer'] & {
		library: Library;
		root_url?: Url | null;
		logo?: Snippet;
		logo_header?: Snippet;
		logo_footer?: Snippet;
	} = $props();
</script>

<footer {...rest} class="box {rest.class}">
	{@render children?.()}
	<div class="logo box panel p_lg shadow_inset_xs">
		{@render logo_header?.()}
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<a href={library.repo_url} rel="me" title="source code on GitHub"
			>{#if logo}{@render logo()}{:else}<Svg
					data={logo_github}
					size="var(--icon_size_lg)"
				/>{/if}</a
		>
		{@render logo_footer?.()}
	</div>
	{#if root_url}
		<div class="root_url">
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a href={root_url}>{format_url(root_url)}</a>
		</div>
	{/if}
</footer>

<style>
	/* TODO probably extract */
	.logo a {
		--border_width: var(--border_width_4);
		--border_color: transparent;
		text-decoration: none;
		display: flex;
		border-radius: 50%;
		border: var(--border_width) double var(--border_color);
	}
	.logo a:hover {
		--border_color: var(--color_a_5);
	}
	.root_url {
		/* TODO messy */
		margin-top: var(--space_md);
	}
</style>
