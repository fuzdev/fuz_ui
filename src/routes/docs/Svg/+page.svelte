<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import {get_tome_by_name} from '$lib/tome.js';
	import Svg from '$lib/Svg.svelte';
	import TomeContent from '$lib/TomeContent.svelte';
	import TomeSection from '$lib/TomeSection.svelte';
	import TomeSectionHeader from '$lib/TomeSectionHeader.svelte';
	import {logo_fuz, logo_github} from '$lib/logos.js';
	import DeclarationLink from '$lib/DeclarationLink.svelte';

	const LIBRARY_ITEM_NAME = 'Svg';
	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);
</script>

<!-- eslint-disable svelte/no-useless-mustaches -->

<TomeContent {tome}>
	<section>
		<!-- TODO make this a generic data-driven helper -->
		<Code lang="ts" content={`import Svg from '@fuzdev/fuz_ui/Svg.svelte';`} />
		<Code content={`<Svg data={logo_fuz} />`} />
		<aside>
			⚠️ <DeclarationLink name="Svg" /> currently uses <code>@html</code> but for security should not.
		</aside>
		<p>Fills available space by default:</p>
		<Svg data={logo_fuz} />
	</section>
	<TomeSection>
		<TomeSectionHeader text="With custom size" />
		<p>
			Set <code>size</code>: (see the
			<a href="https://css.fuz.dev/docs/typography#font-sizes">fuz_css typography docs</a>)
		</p>
		<Code content={`<Svg data={logo_fuz} size="var(--icon_size_xl)" />`} />
		<p><Svg data={logo_fuz} size="var(--icon_size_xl)" /></p>
		<Code content={`<Svg data={logo_fuz} size="var(--icon_size_sm)" />`} />
		<p><Svg data={logo_fuz} size="var(--icon_size_sm)" /></p>
		<p>
			Set <code>--font_size</code> on the component or a parent:
		</p>
		<Code
			content={`<span style:--font_size="var(--icon_size_xl)"><Svg data={logo_fuz} /></span>`}
		/>
		<p><span style:--font_size="var(--icon_size_xl)"><Svg data={logo_fuz} /></span></p>
	</TomeSection>
	<TomeSection>
		<TomeSectionHeader text="With custom color" />
		<p>
			Set <code>fill</code>: (see the
			<a href="https://css.fuz.dev/docs/colors#color-variables">fuz_css colors docs</a>)
		</p>
		<Code content={`<Svg data={logo_fuz} fill="var(--color_d_50)" />`} />
		<p class="width_atmost_sm">
			<Svg data={logo_fuz} fill="var(--color_d_50)" />
		</p>
		<Code content={`<Svg data={logo_fuz} fill="var(--color_b_50)" />`} />
		<p class="width_atmost_sm">
			<Svg data={logo_fuz} fill="var(--color_b_50)" />
		</p>
		<p>
			Set <code>--text_color</code> on the component or a parent, for svgs that have no default fill:
		</p>
		<Code
			content={`<span style:--text_color="var(--color_i_50)"><Svg data={logo_github} /></span>`}
		/>
		<p class="width_atmost_sm">
			<span style:--text_color="var(--color_i_50)"><Svg data={logo_github} /></span>
		</p>
	</TomeSection>
</TomeContent>
