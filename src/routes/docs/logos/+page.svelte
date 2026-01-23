<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';
	import {get_tome_by_name} from '$lib/tome.js';
	import TomeContent from '$lib/TomeContent.svelte';
	import TomeLink from '$lib/TomeLink.svelte';
	import Svg from '$lib/Svg.svelte';
	import {
		logo_gro,
		logo_fuz,
		logo_fuz_css,
		logo_fuz_code,
		logo_fuz_blog,
		logo_fuz_mastodon,
		logo_fuz_gitops,
		logo_github,
		logo_mdn,
		logo_fuz_template,
		logo_fuz_util,
		logo_fuz_ui,
	} from '$lib/logos.js';

	const LIBRARY_ITEM_NAME = 'logos';

	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);
</script>

<TomeContent {tome}>
	<section>
		<p>
			Fuz includes a number of logos available as data that can be mounted with the <TomeLink
				name="Svg"
			/>
			component. Only the ones you use are included in your bundle.
		</p>
	</section>
	<section>
		<ul
			class="display:flex flex-wrap:wrap justify-content:center gap_lg text-align:center unstyled"
		>
			<li>
				<a href="https://www.fuz.dev/"><Svg data={logo_fuz} size="var(--icon_size_xl3)" /></a>
				<Code content={`<Svg data={logo_fuz} />`} />
			</li>
			<li>
				<a href="https://ui.fuz.dev/"><Svg data={logo_fuz_ui} size="var(--icon_size_xl3)" /></a>
				<Code content={`<Svg data={logo_fuz_ui} />`} />
			</li>
			<li>
				<a href="https://css.fuz.dev/"><Svg data={logo_fuz_css} size="var(--icon_size_xl3)" /></a>
				<Code content={`<Svg data={logo_fuz_css} />`} />
			</li>
			<li>
				<a href="https://template.fuz.dev/"
					><Svg data={logo_fuz_template} size="var(--icon_size_xl3)" /></a
				>
				<Code content={`<Svg data={logo_fuz_template} />`} />
			</li>
			<li>
				<a href="https://code.fuz.dev/"><Svg data={logo_fuz_code} size="var(--icon_size_xl3)" /></a>
				<Code content={`<Svg data={logo_fuz_code} />`} />
			</li>
			<li>
				<a href="https://blog.fuz.dev/"><Svg data={logo_fuz_blog} size="var(--icon_size_xl3)" /></a>
				<Code content={`<Svg data={logo_fuz_blog} />`} />
			</li>
			<li>
				<a href="https://mastodon.fuz.dev/"
					><Svg data={logo_fuz_mastodon} size="var(--icon_size_xl3)" /></a
				>
				<Code content={`<Svg data={logo_fuz_mastodon} />`} />
			</li>
			<li>
				<a href="https://gitops.fuz.dev/"
					><Svg data={logo_fuz_gitops} size="var(--icon_size_xl3)" /></a
				>
				<Code content={`<Svg data={logo_fuz_gitops} />`} />
			</li>
			<li>
				<a href="https://util.fuz.dev/"><Svg data={logo_fuz_util} size="var(--icon_size_xl3)" /></a>
				<Code content={`<Svg data={logo_fuz_util} />`} />
			</li>
			<li>
				<a href="https://gro.ryanatkn.com/"><Svg data={logo_gro} size="var(--icon_size_xl3)" /></a>
				<Code content={`<Svg data={logo_gro} />`} />
			</li>
			<li>
				<a href="https://github.com/"><Svg data={logo_github} size="var(--icon_size_xl3)" /></a>
				<Code content={`<Svg data={logo_github} />`} />
			</li>
			<li>
				<a href="https://developer.mozilla.org/"
					><Svg data={logo_mdn} size="var(--icon_size_xl3)" /></a
				>
				<Code content={`<Svg data={logo_mdn} />`} />
			</li>
		</ul>
	</section>
</TomeContent>

<style>
	li {
		margin-bottom: var(--space_xl7);
	}

	a {
		display: block;
		--text_color: var(--text_90);
		margin-bottom: var(--space_lg);
	}
</style>
