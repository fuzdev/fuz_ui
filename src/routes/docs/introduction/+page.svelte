<script lang="ts">
	import TomeContent from '$lib/TomeContent.svelte';
	import {get_tome_by_name} from '$lib/tome.js';

	const LIBRARY_ITEM_NAME = 'introduction';

	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);
</script>

<TomeContent {tome}>
	<section>
		<p>
			Fuz UI is a Svelte UI library that builds on <a href="https://css.fuz.dev/">Fuz CSS</a>. It's
			in early alpha with breaking changes ahead.
		</p>
	</section>
</TomeContent>
