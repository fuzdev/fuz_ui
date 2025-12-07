<script lang="ts">
	import GithubLink from '$lib/GithubLink.svelte';
	import {get_tome_by_name} from '$lib/tome.js';
	import TomeContent from '$lib/TomeContent.svelte';

	const LIBRARY_ITEM_NAME = 'Docs';
	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);
</script>

<TomeContent {tome}>
	<section>
		The <code>Docs</code> is the component behind these docs. Its docs are unfinished - for now see
		usage in
		<GithubLink path="ryanatkn/fuz/blob/main/src/routes/docs/%2Blayout.svelte">Fuz</GithubLink>
		or
		<GithubLink path="fuzdev/fuz_css/blob/main/src/routes/docs/%2Blayout.svelte">Moss</GithubLink>.
	</section>
</TomeContent>
