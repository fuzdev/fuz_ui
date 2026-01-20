<script lang="ts">
	import {get_tome_by_name} from '$lib/tome.js';
	import TomeContent from '$lib/TomeContent.svelte';
	import TomeLink from '$lib/TomeLink.svelte';
	import MdnLink from '$lib/MdnLink.svelte';

	const LIBRARY_ITEM_NAME = 'theming';

	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);
</script>

<TomeContent {tome}>
	<section>
		<p>
			Fuz bases its theme support on <a href="https://css.fuz.dev/">fuz_css</a>, which is based on <MdnLink
				path="Web/CSS/--*">CSS custom properties</MdnLink
			>. For usage docs see <TomeLink name="Themed" />.
		</p>
	</section>
</TomeContent>
