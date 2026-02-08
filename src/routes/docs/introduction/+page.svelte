<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';
	import TomeContent from '$lib/TomeContent.svelte';
	import TomeSection from '$lib/TomeSection.svelte';
	import TomeSectionHeader from '$lib/TomeSectionHeader.svelte';
	import TomeLink from '$lib/TomeLink.svelte';
	import {get_tome_by_name} from '$lib/tome.js';

	const LIBRARY_ITEM_NAME = 'introduction';

	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);
</script>

<TomeContent {tome}>
	<section>
		<p>
			fuz_ui is a Svelte UI library built on <a href="https://css.fuz.dev/">fuz_css</a>. It provides
			components, helpers, and a documentation system for building zippy websites. It's in early
			alpha with breaking changes ahead.
		</p>
	</section>
	<TomeSection>
		<TomeSectionHeader text="Usage" />
		<Code lang={null} content="npm i -D @fuzdev/fuz_ui" />
		<p>To import the Svelte components:</p>
		<Code
			lang="svelte"
			content={'<' +
				`script>
  import Alert from '@fuzdev/fuz_ui/Alert.svelte';
  import Card from '@fuzdev/fuz_ui/Card.svelte';
  import Dialog from '@fuzdev/fuz_ui/Dialog.svelte';
</script>`}
		/>
		<p>See the nav for the available components and other helpers.</p>
		<p>
			<TomeLink name="mdz" /> is a markdown dialect enhanced with Svelte components and other useful features.
			To compile static content at build time instead of parsing at runtime with slower dynamic rendering,
			use <TomeLink name="svelte_preprocess_mdz" />:
		</p>
		<Code
			lang="ts"
			content={`// svelte.config.js
import {svelte_preprocess_mdz} from '@fuzdev/fuz_ui/svelte_preprocess_mdz.js';

export default {
  preprocess: [
    svelte_preprocess_mdz(),
    // ...other preprocessors
  ],
};`}
		/>
	</TomeSection>
	<section>
		<p>
			fuz_ui is part of the <a href="https://www.fuz.dev/">Fuz stack</a>. See also the
			<a href="https://github.com/fuzdev/fuz_ui">repo</a>.
		</p>
	</section>
</TomeContent>
