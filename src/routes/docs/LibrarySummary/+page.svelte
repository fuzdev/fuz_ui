<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import {tome_get_by_slug} from '$lib/tome.js';
	import LibrarySummary from '$lib/LibrarySummary.svelte';
	import TomeContent from '$lib/TomeContent.svelte';
	import {library_context} from '$lib/library.svelte.js';

	const TOME_SLUG = 'LibrarySummary';
	const tome = tome_get_by_slug(TOME_SLUG);

	const library = library_context.get();
</script>

<!-- eslint-disable svelte/no-useless-mustaches -->

<TomeContent {tome}>
	<section>
		<p>
			This is a component related to <a
				href="https://github.com/fuzdev/gro/blob/main/src/docs/package_json.md#public-packages"
				>Gro's public packages</a
			> features.
		</p>
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
