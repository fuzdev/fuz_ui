<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';
	import {get_tome_by_name} from '$lib/tome.js';
	import TomeContent from '$lib/TomeContent.svelte';
	import TomeLink from '$lib/TomeLink.svelte';
	import Svg from '$lib/Svg.svelte';
	import {
		zzz_logo,
		gro_logo,
		fuz_logo,
		fuz_css_logo,
		fuz_code_logo,
		fuz_blog_logo,
		fuz_mastodon_logo,
		fuz_gitops_logo,
		webdevladder_logo,
		earbetter_logo,
		spiderspace_logo,
		github_logo,
		mdn_logo,
		fuz_template_logo,
		belt_logo,
		gemini_logo,
		claude_logo,
		chatgpt_logo,
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
			class="display_flex flex_wrap_wrap justify_content_center gap_lg text_align_center unstyled"
		>
			<li>
				<a href="https://www.zzz.software/"><Svg data={zzz_logo} size="var(--icon_size_xl3)" /></a>
				<Code content={`<Svg data={zzz_logo} />`} />
			</li>
			<li>
				<a href="https://css.fuz.dev/"><Svg data={fuz_css_logo} size="var(--icon_size_xl3)" /></a>
				<Code content={`<Svg data={fuz_css_logo} />`} />
			</li>
			<li>
				<a href="https://util.fuz.dev/"><Svg data={belt_logo} size="var(--icon_size_xl3)" /></a>
				<Code content={`<Svg data={belt_logo} />`} />
			</li>
			<li>
				<a href="https://gro.ryanatkn.com/"><Svg data={gro_logo} size="var(--icon_size_xl3)" /></a>
				<Code content={`<Svg data={gro_logo} />`} />
			</li>
			<li>
				<a href="https://www.fuz.dev/"><Svg data={fuz_logo} size="var(--icon_size_xl3)" /></a>
				<Code content={`<Svg data={fuz_logo} />`} />
			</li>
			<li>
				<a href="https://www.webdevladder.net/"
					><Svg data={webdevladder_logo} size="var(--icon_size_xl3)" /></a
				>
				<Code content={`<Svg data={webdevladder_logo} />`} />
			</li>
			<li>
				<a href="https://blog.fuz.dev/"><Svg data={fuz_blog_logo} size="var(--icon_size_xl3)" /></a>
				<Code content={`<Svg data={fuz_blog_logo} />`} />
			</li>
			<li>
				<a href="https://mastodon.fuz.dev/"
					><Svg data={fuz_mastodon_logo} size="var(--icon_size_xl3)" /></a
				>
				<Code content={`<Svg data={fuz_mastodon_logo} />`} />
			</li>
			<li>
				<a href="https://code.fuz.dev/"><Svg data={fuz_code_logo} size="var(--icon_size_xl3)" /></a>
				<Code content={`<Svg data={fuz_code_logo} />`} />
			</li>
			<li>
				<a href="https://gitops.fuz.dev/"
					><Svg data={fuz_gitops_logo} size="var(--icon_size_xl3)" /></a
				>
				<Code content={`<Svg data={fuz_gitops_logo} />`} />
			</li>
			<li>
				<a href="https://template.fuz.dev/"
					><Svg data={fuz_template_logo} size="var(--icon_size_xl3)" /></a
				>
				<Code content={`<Svg data={fuz_template_logo} />`} />
			</li>
			<li>
				<a href="https://earbetter.ryanatkn.com/"
					><Svg data={earbetter_logo} size="var(--icon_size_xl3)" /></a
				>
				<Code content={`<Svg data={earbetter_logo} />`} />
			</li>
			<li>
				<a href="https://www.spiderspace.org/"
					><Svg data={spiderspace_logo} size="var(--icon_size_xl3)" /></a
				>
				<Code content={`<Svg data={spiderspace_logo} />`} />
			</li>
			<li>
				<a href="https://github.com/"><Svg data={github_logo} size="var(--icon_size_xl3)" /></a>
				<Code content={`<Svg data={github_logo} />`} />
			</li>
			<li>
				<a href="https://developer.mozilla.org/"
					><Svg data={mdn_logo} size="var(--icon_size_xl3)" /></a
				>
				<Code content={`<Svg data={mdn_logo} />`} />
			</li>
			<li>
				<a href="https://chatgpt.com/"><Svg data={chatgpt_logo} size="var(--icon_size_xl3)" /></a>
				<Code content={`<Svg data={chatgpt_logo} />`} />
			</li>
			<li>
				<a href="https://claude.ai/"><Svg data={claude_logo} size="var(--icon_size_xl3)" /></a>
				<Code content={`<Svg data={claude_logo} />`} />
			</li>
			<li>
				<a href="https://gemini.google.com/"
					><Svg data={gemini_logo} size="var(--icon_size_xl3)" /></a
				>
				<Code content={`<Svg data={gemini_logo} />`} />
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
		--text_color: var(--text_color_1);
		margin-bottom: var(--space_lg);
	}
</style>
