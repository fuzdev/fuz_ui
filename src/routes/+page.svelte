<script lang="ts">
	import {resolve} from '$app/paths';

	import DocsFooter from '$lib/DocsFooter.svelte';
	import Card from '$lib/Card.svelte';
	import GithubLink from '$lib/GithubLink.svelte';
	import ProjectLinks from '$lib/ProjectLinks.svelte';
	import {library_context} from '$lib/library.svelte.js';
	import Svg from '$lib/Svg.svelte';
	import {logo_fuz_ui} from '$lib/logos.js';
	import {MAIN_HEADER_MARGIN_TOP} from '$lib/constants.js';
	import {DOCS_PATH} from '$lib/docs_helpers.svelte.js';

	const library = library_context.get();
</script>

<main class="box width:100%">
	<div class="box width_upto_md mb_xl9">
		<section class="box">
			<h1 class="mb_sm" style:margin-top={MAIN_HEADER_MARGIN_TOP}>fuz_ui</h1>
			<div class="box mb_lg"><Svg data={logo_fuz_ui} size="var(--icon_size_xl2)" /></div>
			<blockquote class="shadow_bottom_sm px_xl bg">friendly user zystem 🧶</blockquote>
			<div class="mb_lg p_xs2 shadow_md border_radius_sm">
				<div class="width_upto_sm panel p_lg shadow_inset_xs bg">
					<p>
						fuz_ui is a Svelte UI library with components and helpers for making zippy websites. It
						builds on <a href="https://css.fuz.dev/">fuz_css</a>, which is based on CSS custom
						properties, and fuz_ui continues those patterns. It's in early alpha and will have many
						breaking changes.
					</p>
					<p>
						Compared to most UI libraries, fuz_ui has fewer features and more opinions, but the
						eventual goal is to be fully-featured with high flexibility. Fuz emphasizes capability
						and efficiency and tries to be simple for those goals.
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
			<ProjectLinks />
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
