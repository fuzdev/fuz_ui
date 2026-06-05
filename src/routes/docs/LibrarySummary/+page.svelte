<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import {tome_get_by_slug} from '$lib/tome.js';
	import LibrarySummary from '$lib/LibrarySummary.svelte';
	import TomeContent from '$lib/TomeContent.svelte';
	import DeclarationLink from '$lib/DeclarationLink.svelte';
	import TomeLink from '$lib/TomeLink.svelte';
	import {library_context} from '$lib/library.svelte.js';

	const TOME_SLUG = 'LibrarySummary';
	const tome = tome_get_by_slug(TOME_SLUG);

	const library = library_context.get();
</script>

<!-- eslint-disable svelte/no-useless-mustaches -->

<TomeContent {tome}>
	<section>
		<p>
			<DeclarationLink name="LibrarySummary" /> renders a compact card for a library. It takes a <DeclarationLink
				name="Library"
			/>, built from the curated
			<code>pkg_json</code> served by <TomeLink slug="vite_plugin_pkg_json" /> combined with the analyzed
			<code>modules</code>
			from <a href="https://svelte-docinfo.fuz.dev/"><code>virtual:svelte-docinfo</code></a>:
		</p>
		<Code
			lang="ts"
			content={`import {library_json_from_modules} from '@fuzdev/fuz_util/library_json.js';
import {Library} from '@fuzdev/fuz_ui/library.svelte.js';
import {modules} from 'virtual:svelte-docinfo';
import pkg_json from 'virtual:pkg.json';

const library_json = library_json_from_modules(pkg_json, modules);
const library = new Library(library_json);`}
		/>
		<Code
			lang="ts"
			content={`import LibrarySummary from '@fuzdev/fuz_ui/LibrarySummary.svelte';`}
		/>
		<Code content={`<LibrarySummary {library} />`} />
	</section>
	<section>
		<LibrarySummary {library} />
	</section>
</TomeContent>
