<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import GithubLink from '$lib/GithubLink.svelte';
	import {tome_get_by_slug} from '$lib/tome.js';
	import TomeContent from '$lib/TomeContent.svelte';
	import DeclarationLink from '$lib/DeclarationLink.svelte';

	const TOME_SLUG = 'Docs';
	const tome = tome_get_by_slug(TOME_SLUG);
</script>

<!-- eslint-disable svelte/no-useless-mustaches -->

<TomeContent {tome}>
	<section>
		<p>
			<DeclarationLink name="Docs" /> is the component behind these docs — a three-column responsive layout
			with managed navigation. It takes an array of <DeclarationLink name="Tome" /> and renders the current
			page as <code>children</code>, so it lives in a <code>+layout.svelte</code> wrapping your docs routes.
		</p>
		<p>
			It requires two contexts: <code>site_context</code> (a <DeclarationLink name="SiteState" /> for
			chrome like <DeclarationLink name="Breadcrumb" />) set once at the root layout, and
			<code>library_context</code> (a <DeclarationLink name="Library" />) set in the docs layout:
		</p>
		<Code
			lang="svelte"
			content={`<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import {SiteState, site_context} from '@fuzdev/fuz_ui/site.svelte.js';
  import pkg_json from 'virtual:pkg.json';

  site_context.set(new SiteState({pkg_json}));
<\/script>`}
		/>
		<Code
			lang="svelte"
			content={`<!-- src/routes/docs/+layout.svelte -->
<script lang="ts">
  import Docs from '@fuzdev/fuz_ui/Docs.svelte';
  import {Library, library_context} from '@fuzdev/fuz_ui/library.svelte.js';
  import {library_json} from '$routes/library.js';
  import {tomes} from '$routes/docs/tomes.js';

  const {children} = $props();

  library_context.set(new Library(library_json));
<\/script>

<Docs {tomes}>
  {@render children()}
</Docs>`}
		/>
		<p>
			For live and complete working examples, see the docs layouts in
			<GithubLink path="fuzdev/fuz_ui/blob/main/src/routes/docs/%2Blayout.svelte">fuz_ui</GithubLink
			>
			or
			<GithubLink path="fuzdev/fuz_css/blob/main/src/routes/docs/%2Blayout.svelte"
				>fuz_css</GithubLink
			>.
		</p>
	</section>
</TomeContent>
