<script lang="ts">
	import Svg from './Svg.svelte';
	import type {SvgData} from './svg.ts';
	import {
		// TODO when fuz.dev is ready
		// logo_fuz,
		logo_fuz_ui,
		logo_fuz_code,
		logo_fuz_blog,
		logo_fuz_mastodon,
		logo_fuz_gitops,
		logo_fuz_template,
		logo_fuz_css,
		logo_fuz_util,
		logo_gro,
		logo_svelte_docinfo,
		logo_fuz_app,
		logo_tsv,
	} from './logos.ts';

	// TODO refactor
	interface ProjectItem {
		name: string;
		url: string;
		logo: SvgData;
		description: string;
		glyph: string;
		color_class: string;
	}

	// TODO ideally this wouldn't duplicate metadata like descriptions, but adding fuz_gitops to this repo is heavy
	// prettier-ignore
	const project_items: Array<ProjectItem> = [
		{name: 'fuz_app', url: 'https://app.fuz.dev/', logo: logo_fuz_app, description: '[pre-alpha] fullstack app library', glyph: '🗝', color_class: 'palette_j_50'},
		{name: 'fuz_css', url: 'https://css.fuz.dev/', logo: logo_fuz_css, description: 'CSS framework and design system for semantic HTML', glyph: '🌿', color_class: 'palette_b_50'},
		{name: 'fuz_ui', url: 'https://ui.fuz.dev/', logo: logo_fuz_ui, description: 'Svelte UI library', glyph: '🧶', color_class: 'palette_c_50'},
		{name: 'fuz_template', url: 'https://template.fuz.dev/', logo: logo_fuz_template, description: 'a web app template with TypeScript + SvelteKit + optional Rust for the fuz-stack', glyph: '❄', color_class: 'palette_h_50'},
		{name: 'fuz_blog', url: 'https://blog.fuz.dev/', logo: logo_fuz_blog, description: 'blog software from scratch with SvelteKit', glyph: '🖊️', color_class: 'palette_e_50'},
		{name: 'fuz_code', url: 'https://code.fuz.dev/', logo: logo_fuz_code, description: 'syntax styling utilities and components for TypeScript, Svelte, Markdown, and more', glyph: '🎨', color_class: 'palette_g_50'},
		{name: 'fuz_mastodon', url: 'https://mastodon.fuz.dev/', logo: logo_fuz_mastodon, description: 'Mastodon components and helpers for Svelte, SvelteKit, and Fuz', glyph: '🦣', color_class: 'palette_d_50'},
		{name: 'fuz_gitops', url: 'https://gitops.fuz.dev/', logo: logo_fuz_gitops, description: 'a tool for managing many repos', glyph: '🪄', color_class: 'palette_a_50'},
		{name: 'svelte-docinfo', url: 'https://svelte-docinfo.fuz.dev/', logo: logo_svelte_docinfo, description: 'static analysis for TypeScript and Svelte', glyph: '📜', color_class: 'palette_i_50'},
		{name: 'fuz_util', url: 'https://util.fuz.dev/', logo: logo_fuz_util, description: 'utility belt for JS', glyph: '🦕', color_class: 'palette_f_50'},
		{name: 'gro', url: 'https://github.com/fuzdev/gro', logo: logo_gro, description: 'task runner and toolkit extending SvelteKit', glyph: '🌰', color_class: 'palette_f_50'},
		{name: 'tsv', url: 'https://tsv.fuz.dev/', logo: logo_tsv, description: 'precise language tools for TypeScript/JS, CSS, and Svelte in Rust', glyph: '🪶', color_class: 'palette_h_50'},
	];
</script>

<h2 class="mt_0 mb_xl2">Packages</h2>
<menu class="unstyled font_size_lg">
	{#each project_items as project_item (project_item.name)}
		{@render package_thumbnail(project_item)}
	{/each}
</menu>

{#snippet package_thumbnail(project_item: ProjectItem)}
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a class="thumbnail row shade_00 px_md py_xs border_radius_sm mb_lg" href={project_item.url}
		><Svg shrink={false} data={project_item.logo} size="var(--icon_size_lg)" />
		<div class="pl_lg width_atmost_sm">
			<div class="thumbnail-name {project_item.color_class}">{project_item.name}</div>
			<div class="thumbnail-description font_size_md text_70 font-weight:500">
				{project_item.description}
				{project_item.glyph}
			</div>
		</div></a
	>
{/snippet}

<style>
	.thumbnail {
		box-shadow: var(--shadow_bottom_xs)
			color-mix(
				in hsl,
				var(--shadow_color, var(--shadow_color_umbra)) var(--shadow_alpha_30),
				transparent
			);
	}
	.thumbnail:hover {
		box-shadow: var(--shadow_bottom_sm)
			color-mix(
				in hsl,
				var(--shadow_color, var(--shadow_color_umbra)) var(--shadow_alpha_30),
				transparent
			);

		/* show the underline only on the name, not the description */
		text-decoration: none;
		.thumbnail-name {
			text-decoration: underline;
		}
		.thumbnail-description {
			text-decoration: none;
		}
	}
	.thumbnail:active {
		box-shadow: var(--shadow_top_xs)
			color-mix(
				in hsl,
				var(--shadow_color, var(--shadow_color_umbra)) var(--shadow_alpha_30),
				transparent
			);
	}
</style>
