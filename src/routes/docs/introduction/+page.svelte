<script lang="ts">
	import {resolve} from '$app/paths';

	import TomeContent from '$lib/TomeContent.svelte';
	import {get_tome_by_name} from '$lib/tome.js';

	const LIBRARY_ITEM_NAME = 'introduction';

	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);
</script>

<TomeContent {tome}>
	<section>
		<p>
			fuz_ui is a Svelte UI library that builds on <a href="https://css.fuz.dev/">fuz_css</a>. It's
			in early alpha with breaking changes ahead.
		</p>
		<p>
			fuz_ui includes a
			<a href={resolve('/docs/svelte_preprocess_mdz')}>build-time preprocessor</a> that statically
			compiles <code>&lt;Mdz&gt;</code> content for better performance.
		</p>
	</section>
</TomeContent>
