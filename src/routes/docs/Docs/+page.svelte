<script lang="ts">
	import GithubLink from '$lib/GithubLink.svelte';
	import {tome_get_by_slug} from '$lib/tome.js';
	import TomeContent from '$lib/TomeContent.svelte';

	const TOME_SLUG = 'Docs';
	const tome = tome_get_by_slug(TOME_SLUG);
</script>

<TomeContent {tome}>
	<section>
		The <code>Docs</code> is the component behind these docs. Its docs are unfinished - for now see
		usage in
		<GithubLink path="fuzdev/fuz_ui/blob/main/src/routes/docs/%2Blayout.svelte">Fuz</GithubLink>
		or
		<GithubLink path="fuzdev/fuz_css/blob/main/src/routes/docs/%2Blayout.svelte">fuz_css</GithubLink
		>.
	</section>
</TomeContent>
