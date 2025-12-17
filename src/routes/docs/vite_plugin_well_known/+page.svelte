<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import {get_tome_by_name} from '$lib/tome.js';
	import TomeContent from '$lib/TomeContent.svelte';
	import TomeSection from '$lib/TomeSection.svelte';
	import TomeSectionHeader from '$lib/TomeSectionHeader.svelte';

	const LIBRARY_ITEM_NAME = 'vite_plugin_well_known';
	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);
</script>

<TomeContent {tome}>
	<section>
		<p>
			A Vite plugin that publishes <code>package.json</code> and <code>source.json</code>
			to <code>.well-known/</code> in your build output.
		</p>
		<p>
			Requires a generated <code>library.ts</code> file (created by
			<code>library_gen</code> from <code>gro gen</code>).
		</p>
	</section>

	<TomeSection>
		<TomeSectionHeader text="Setup" />
		<p>1. Create <code>src/routes/library.gen.ts</code>:</p>
		<Code
			content={`import {library_gen} from '@fuzdev/fuz_ui/library_gen.js';

export const gen = library_gen();`}
			lang="ts"
		/>
		<p>2. Run <code>gro gen</code> to generate <code>src/routes/library.ts</code></p>
		<p>3. Add plugin to <code>vite.config.ts</code>:</p>
		<Code
			content={`import {sveltekit} from '@sveltejs/kit/vite';
import {vite_plugin_well_known} from '@fuzdev/fuz_ui/vite_plugin_well_known.js';

export default {
  plugins: [sveltekit(), vite_plugin_well_known()],
};`}
			lang="ts"
		/>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Output" />
		<p>The plugin emits two files to <code>.well-known/</code>:</p>
		<ul>
			<li><code>package.json</code> - Package metadata</li>
			<li><code>source.json</code> - Library metadata with declarations, JSDoc, type signatures</li>
		</ul>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Options" />
		<p>
			By default, the plugin looks for <code>./src/routes/library.ts</code>. Customize with the
			<code>library_path</code> option:
		</p>
		<Code
			content={`vite_plugin_well_known({
  library_path: './src/lib/library.ts',
})`}
			lang="ts"
		/>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Why `.well-known`?" />
		<p>
			Writing to <code>.well-known/package.json</code>
			extends <a href="https://wikipedia.org/wiki/Well-known_URIs">Well-known URIs</a> for Node
			packages to provide conventional metadata for deployed websites. Mastodon uses WebFinger which
			uses <code>.well-known</code> for discovery.
		</p>
		<p>
			SvelteKit outputs static files relative to the configured <code>base</code> path, so the
			<code>.well-known</code> directory may not be in the root <code>/</code>. This enables
			websites to provide metadata even when hosted in a namespaced path like
			<code>username.github.io/projectname/.well-known</code>.
		</p>
		<p>Why publish this metadata to the web instead of relying on the git repo?</p>
		<ul>
			<li>Give all web users and tools access to discoverable package metadata</li>
			<li>Metadata is a much lighter dependency than an entire repo</li>
			<li>Some repos are deployed to multiple websites with metadata differences</li>
			<li>Some repos like monorepos have multiple <code>package.json</code> files</li>
			<li>No dependency on git or the bespoke URLs of forge hosts like GitHub</li>
			<li>
				The git repo is still the source of truth, but the build step gives devs full control over
				the published artifacts
			</li>
		</ul>
	</TomeSection>
</TomeContent>
