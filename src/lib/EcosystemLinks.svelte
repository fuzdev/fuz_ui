<script lang="ts">
	const {
		selected,
	}: {
		selected?: 'www.fuz.dev';
	} = $props();
</script>

<ul>
	<li>
		<a rel="me" href="https://www.fuz.dev/" class:selected={selected === 'www.fuz.dev'}>fuz.dev</a>
		- the Fuz project homepage{#if selected === 'www.fuz.dev'}, you are here{/if}
	</li>
	<li>
		GitHub as <a rel="me" href="https://github.com/fuzdev">@fuzdev</a>
	</li>
	<!-- TODO socials -->
	<!-- <li>
		Mastodon as
		<a rel="me" href="https://fosstodon.org/@fuzdev">@fuzdev@fosstodon.org</a> and Bluesky as
		<a href="https://bsky.app/profile/fuz.dev">@fuz.dev</a>
	</li> -->
</ul>
