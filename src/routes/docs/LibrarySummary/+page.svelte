<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import {get_tome_by_name} from '$lib/tome.js';
	import LibrarySummary from '$lib/LibrarySummary.svelte';
	import TomeContent from '$lib/TomeContent.svelte';
	import {library_context} from '$lib/library.svelte.js';

	const LIBRARY_ITEM_NAME = 'LibrarySummary';
	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);

	const library = library_context.get();
</script>

<!-- eslint-disable svelte/no-useless-mustaches -->

<TomeContent {tome}>
	<section>
		<p>
			This is a component related to <a
				href="https://github.com/ryanatkn/gro/blob/main/src/docs/package_json.md#public-packages"
				>Gro's public packages</a
			> features.
		</p>
		<Code content={`import LibrarySummary from '@ryanatkn/fuz/LibrarySummary.svelte';`} lang="ts" />
		<Code content={`<LibrarySummary {library} />`} />
	</section>
	<section>
		<LibrarySummary {library} />
	</section>
</TomeContent>
