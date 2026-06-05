<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import {tome_get_by_slug} from '$lib/tome.js';
	import LibraryDetail from '$lib/LibraryDetail.svelte';
	import TomeContent from '$lib/TomeContent.svelte';
	import DeclarationLink from '$lib/DeclarationLink.svelte';
	import TomeLink from '$lib/TomeLink.svelte';
	import {library_context} from '$lib/library.svelte.js';

	const TOME_SLUG = 'LibraryDetail';
	const tome = tome_get_by_slug(TOME_SLUG);

	const library = library_context.get();
</script>

<!-- eslint-disable svelte/no-useless-mustaches -->

<TomeContent {tome}>
	<section>
		<p>
			<DeclarationLink name="LibraryDetail" /> renders the full metadata for a library and its repo, including
			its module and declaration index. See the <TomeLink slug="Library">Library docs</TomeLink> for how
			to construct one from <TomeLink slug="vite_plugin_pkg_json" />
			and <a href="https://svelte-docinfo.fuz.dev/"><code>virtual:svelte-docinfo</code></a>:
		</p>
		<Code lang="ts" content={`import LibraryDetail from '@fuzdev/fuz_ui/LibraryDetail.svelte';`} />
		<Code content={`<LibraryDetail {library} />`} />
	</section>
	<section>
		<LibraryDetail {library} />
	</section>
</TomeContent>
