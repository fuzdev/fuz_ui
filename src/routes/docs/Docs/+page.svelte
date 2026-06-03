<script lang="ts">
	import GithubLink from '$lib/GithubLink.svelte';
	import {tome_get_by_slug} from '$lib/tome.js';
	import TomeContent from '$lib/TomeContent.svelte';
	import DeclarationLink from '$lib/DeclarationLink.svelte';

	const TOME_SLUG = 'Docs';
	const tome = tome_get_by_slug(TOME_SLUG);
</script>

<TomeContent {tome}>
	<section>
		The <DeclarationLink name="Docs" /> is the component behind these docs. Its docs are unfinished -
		for now see usage in
		<GithubLink path="fuzdev/fuz_ui/blob/main/src/routes/docs/%2Blayout.svelte">fuz_ui</GithubLink>
		or
		<GithubLink path="fuzdev/fuz_css/blob/main/src/routes/docs/%2Blayout.svelte">fuz_css</GithubLink
		>.
	</section>
</TomeContent>
