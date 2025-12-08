<script lang="ts">
	import {resolve} from '$app/paths';

	import DocsFooter from '$lib/DocsFooter.svelte';
	import Card from '$lib/Card.svelte';
	import GithubLink from '$lib/GithubLink.svelte';
	import {library_context} from '$lib/library.svelte.js';
	import Svg, {type SvgData} from '$lib/Svg.svelte';
	import {
		logo_fuz_ui,
		logo_fuz_code,
		logo_fuz_blog,
		logo_fuz_mastodon,
		logo_fuz_gitops,
		logo_fuz_template,
		logo_fuz_css,
		logo_fuz_util,
	} from '$lib/logos.js';
	import {MAIN_HEADER_MARGIN_TOP} from '$lib/constants.js';
	import {DOCS_PATH} from '$lib/docs_helpers.svelte.js';

	const library = library_context.get();

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
		{name: 'fuz_css', url: 'https://css.fuz.dev/', logo: logo_fuz_css, description: 'CSS framework and design system', glyph: '🌿', color_class: 'color_b_5'},
		{name: 'fuz_template', url: 'https://template.fuz.dev/', logo: logo_fuz_template, description: 'a static web app and Node library template with TypeScript, Svelte, SvelteKit, Vite, esbuild, Fuz, and Gro', glyph: '❄', color_class: 'color_h_5'},
		{name: 'fuz_util', url: 'https://util.fuz.dev/', logo: logo_fuz_util, description: 'utility belt for JS', glyph: '🦕', color_class: 'color_f_5'},
		{name: 'fuz_code', url: 'https://code.fuz.dev/', logo: logo_fuz_code, description: 'syntax styling utilities and components for TypeScript, Svelte, SvelteKit', glyph: '🎨', color_class: 'color_g_5'},
		{name: 'fuz_blog', url: 'https://blog.fuz.dev/', logo: logo_fuz_blog, description: 'blog software from scratch with SvelteKit', glyph: '🖊️', color_class: 'color_e_5'},
		{name: 'fuz_mastodon', url: 'https://mastodon.fuz.dev/', logo: logo_fuz_mastodon, description: 'Mastodon components and helpers for Svelte, SvelteKit, and Fuz', glyph: '🦣', color_class: 'color_d_5'},
		{name: 'fuz_gitops', url: 'https://gitops.fuz.dev/', logo: logo_fuz_gitops, description: 'a tool for managing many repos', glyph: '🪄', color_class: 'color_a_5'},
	];
</script>

<main class="box width_100">
	<div class="box width_upto_md mb_xl9">
		<section class="box">
			<h1 class="mb_sm" style:margin-top={MAIN_HEADER_MARGIN_TOP}>fuz_ui</h1>
			<div class="box mb_lg"><Svg data={logo_fuz_ui} size="var(--icon_size_xl2)" /></div>
			<blockquote class="shadow_bottom_sm px_xl bg">friendly user zystem 🧶</blockquote>
			<div class="mb_lg p_xs2 shadow_md border_radius_sm">
				<div class="width_upto_sm panel p_lg shadow_inset_xs bg">
					<p>
						Fuz UI is a Svelte UI library with components and helpers for making modern websites. It
						builds on my CSS framework <a href="https://css.fuz.dev/">Fuz CSS</a>, which is based on
						CSS custom properties, and Fuz continues those patterns. It's in early alpha and will
						have many breaking changes.
					</p>
					<p>
						Fuz UI is being made to support <a href="https://www.zzz.software/">Zzz</a> and
						<a href="https://www.ryanatkn.com/table">my other projects</a>
						that focus on end-users. Fuz emphasizes capability and efficiency and tries to be simple
						for those goals. Compared to most UI libraries, Fuz has fewer features and more opinions,
						but the eventual goal is to be fully-featured with high flexibility.
					</p>
					<p>
						<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
						To learn more see <a href={DOCS_PATH}>the docs</a>
						and <GithubLink path="fuzdev/fuz_ui#readme">readme</GithubLink>. Feel free to take the
						ideas and <GithubLink path="fuzdev/fuz_ui">code</GithubLink> for your own purposes.
					</p>
				</div>
			</div>
		</section>
		<section>
			<!-- TODO add color variants -->
			<Card href={DOCS_PATH}>docs{#snippet icon()}🧶{/snippet}</Card>
		</section>
		<section class="panel p_lg shadow_inset_xs">
			<h2 class="mt_0 mb_xl2 px_md">other fuz packages</h2>
			<menu class="unstyled font_size_lg">
				{#each project_items as project_item (project_item.name)}
					{@render package_thumbnail(project_item)}
				{/each}
			</menu>
		</section>
		<section>
			<DocsFooter {library}>
				{#snippet logo_header()}
					<a href={resolve('/about')} class="mb_xs">about</a>
				{/snippet}
			</DocsFooter>
		</section>
	</div>
</main>

{#snippet package_thumbnail(project_item: ProjectItem)}
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a class="thumbnail row bg px_md py_xs border_radius_sm mb_lg" href={project_item.url}
		><Svg shrink={false} data={project_item.logo} size="var(--icon_size_lg)" />
		<div class="pl_lg width_upto_sm">
			<div class="thumbnail_name {project_item.color_class}">{project_item.name}</div>
			<div class="thumbnail_description font_size_md text_color_3 font_weight_500">
				{project_item.description}
				{project_item.glyph}
			</div>
		</div></a
	>
{/snippet}

<style>
	.thumbnail {
		box-shadow: var(--shadow_bottom_xs)
			color-mix(in hsl, var(--shadow_color) var(--shadow_alpha_1), transparent);
	}
	.thumbnail:hover {
		box-shadow: var(--shadow_bottom_sm)
			color-mix(in hsl, var(--shadow_color) var(--shadow_alpha_1), transparent);

		/* show the underline only on the name, not the description */
		text-decoration: none;
		.thumbnail_name {
			text-decoration: underline;
		}
		.thumbnail_description {
			text-decoration: none;
		}
	}
	.thumbnail:active {
		box-shadow: var(--shadow_top_xs)
			color-mix(in hsl, var(--shadow_color) var(--shadow_alpha_1), transparent);
	}
</style>
