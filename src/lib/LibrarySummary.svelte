<script lang="ts">
	import {page} from '$app/state';
	import type {Snippet} from 'svelte';
	import {format_url} from '@fuzdev/fuz_util/url.js';

	import type {Library} from './library.svelte.js';
	import ImgOrSvg from './ImgOrSvg.svelte';

	const {
		library,
		repo_name,
		logo,
		motto,
		description,
		npm_url,
		homepage_url,
		children,
	}: {
		library: Library;
		repo_name?: Snippet<[repo_name: string]>;
		logo?: Snippet<[logo_url: string, logo_alt: string]>;
		motto?: Snippet<[motto: string, glyph?: string]>;
		description?: Snippet<[description: string, glyph?: string]>;
		npm_url?: Snippet<[npm_url: string]>;
		homepage_url?: Snippet<[homepage_url: string]>;
		children?: Snippet;
	} = $props();

	const {package_json} = $derived(library);
</script>

<div class="library_summary">
	<!-- TODO maybe continue this snippet pattern, or maybe simplify? -->
	<header class="box">
		{#if repo_name}
			{@render repo_name(library.repo_name)}
		{:else}
			<div class="repo_name">{library.repo_name}</div>
		{/if}
		<!-- TODO maybe add `icon_alt` to package.json -->
		<!-- TODO what about svg logos? maybe a package.json logo url that defaults to favicon? -->
		{#if library.logo_url}
			{#if logo}
				{@render logo(library.logo_url, library.logo_alt)}
			{:else}
				<ImgOrSvg
					src={library.logo_url}
					label={library.logo_alt}
					size="var(--font_size, var(--icon_size_xl2))"
				/>
			{/if}
		{/if}
	</header>
	{#if package_json.motto}
		{#if motto}
			{@render motto(package_json.motto, package_json.glyph)}
		{:else}
			<blockquote class="px_xl">
				{package_json.motto}
				{package_json.glyph}
			</blockquote>
		{/if}
	{/if}
	{#if package_json.description}
		{#if description}
			{@render description(package_json.description, package_json.glyph)}
		{:else}
			<p class="text-align:center">
				{package_json.description}
				{#if !package_json.motto}
					{package_json.glyph}
				{/if}
			</p>
		{/if}
	{/if}
	{@render children?.()}
	{#if library.homepage_url}
		{#if homepage_url}
			{@render homepage_url(library.homepage_url)}
		{:else}
			<div class="homepage_url">
				<!-- eslint-disable svelte/no-navigation-without-resolve -->
				<a
					class="chip"
					class:selected={library.homepage_url === page.url.href}
					href={library.homepage_url}>{format_url(library.homepage_url)}</a
				>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
			</div>
		{/if}
	{/if}
	<div class="links">
		{#if library.repo_url}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a class="chip" href={library.repo_url}>repo</a>
		{/if}
		{#if library.changelog_url}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a class="chip" title="version" href={library.changelog_url}>{package_json.version}</a>
		{/if}
		{#if library.npm_url}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
			<a class="chip" href={library.npm_url}>npm</a>
		{/if}
	</div>
	{#if library.npm_url}
		{#if npm_url}
			{@render npm_url(library.npm_url)}
		{:else}
			<blockquote class="npm_url">npm i -D {package_json.name}</blockquote>
		{/if}
	{/if}
	<!-- TODO more details behind a `<details>`, including author -->
</div>

<!-- TODO better rendering, also show author, etc -->

<style>
	.library_summary {
		padding: var(--space_lg);
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: var(--max_width, var(--distance_sm));
	}
	header {
		margin-bottom: var(--space_lg);
	}
	.links {
		display: flex;
		margin-bottom: var(--space_lg);
	}
	.homepage_url {
		margin-bottom: var(--space_lg);
	}
	.repo_name {
		font-family: var(--font_family_serif);
		font-size: var(--font_size_xl2);
		font-weight: 400;
		text-align: center;
		margin-bottom: var(--space_lg);
	}
	.npm_url {
		font-family: var(--font_family_mono);
		text-align: center;
	}
	.chip {
		margin-left: var(--space_xs2);
		margin-right: var(--space_xs2);
	}
</style>
