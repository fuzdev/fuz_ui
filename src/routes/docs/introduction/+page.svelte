<script lang="ts">
	import GithubLink from '$lib/GithubLink.svelte';
	import TomeContent from '$lib/TomeContent.svelte';
	import {get_tome_by_name} from '$lib/tome.js';

	const LIBRARY_ITEM_NAME = 'introduction';

	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);
</script>

<TomeContent {tome}>
	<section>
		<p>
			Fuz UI is a Svelte UI library that builds on <a href="https://css.fuz.dev/">Fuz CSS</a>. It's
			in early alpha and there will be many breaking changes. I'm making it to support
			<a href="https://www.zzz.software/">Zzz</a>
			and
			<a href="https://www.ryanatkn.com/">my other projects</a> that focus on end-users, so it'll continue
			to grow slowly as I find the time and usecases.
		</p>
		<p>
			The goal is to make a fully-featured Svelte UI library, but it'll take extra time to get
			there. That lets us prioritize design above features, making it an interesting project for
			learning and experimentation. For more see the
			<GithubLink path="fuzdev/fuz_ui#readme">readme</GithubLink>, and to get involved see <GithubLink
				path="fuzdev/fuz_ui/blob/main/contributing.md"
			/>.
		</p>
	</section>
</TomeContent>
