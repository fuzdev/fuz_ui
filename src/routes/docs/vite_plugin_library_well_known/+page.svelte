<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';
	import {asset} from '$app/paths';

	import {get_tome_by_name} from '$lib/tome.js';
	import TomeContent from '$lib/TomeContent.svelte';
	import TomeSection from '$lib/TomeSection.svelte';
	import TomeSectionHeader from '$lib/TomeSectionHeader.svelte';
	import DeclarationLink from '$lib/DeclarationLink.svelte';

	const LIBRARY_ITEM_NAME = 'vite_plugin_library_well_known';
	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);

	const package_json_url = asset('/.well-known/package.json');
	const library_json_url = asset('/.well-known/library.json');
</script>

<TomeContent {tome}>
	<section>
		<p>
			<DeclarationLink name="vite_plugin_library_well_known" /> publishes metadata to
			<code>.well-known/</code>
			in your build output: <a href={package_json_url}><code>package.json</code></a>
			and
			<a href={library_json_url}><code>library.json</code></a>.
		</p>
		<p>
			Requires a generated <code>library.json</code> file, as created by
			<DeclarationLink name="library_gen" /> via <code>gro gen</code>.
		</p>
	</section>

	<TomeSection>
		<TomeSectionHeader text="Setup" />
		<p>1. Create <code>src/routes/library.gen.ts</code>:</p>
		<Code
			lang="ts"
			content={`import {library_gen} from '@fuzdev/fuz_ui/library_gen.js';

export const gen = library_gen();`}
		/>
		<p>
			2. Run <code>gro gen</code> to generate <code>src/routes/library.json</code> (or run the dev server,
			or build)
		</p>
		<p>3. Add plugin to <code>vite.config.ts</code>:</p>
		<Code
			lang="ts"
			content={`import {defineConfig} from 'vite';
import {sveltekit} from '@sveltejs/kit/vite';
import {vite_plugin_library_well_known} from '@fuzdev/fuz_ui/vite_plugin_library_well_known.js';

export default defineConfig({
  plugins: [sveltekit(), vite_plugin_library_well_known()],
});`}
		/>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Output" />
		<p>The plugin emits two files to <code>.well-known/</code>:</p>
		<ul>
			<li>
				<a href={package_json_url}><code>{package_json_url}</code></a> - package metadata only, much
				smaller than <code>library.json</code> for lightweight usage
			</li>
			<li>
				<a href={library_json_url}><code>{library_json_url}</code></a> - full library metadata
				including <code>package.json</code>, modules, declarations, JSDoc, and type signatures
			</li>
		</ul>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Options" />
		<p>
			By default, the plugin looks for <code>./src/routes/library.json</code>. Customize with the
			<code>library_path</code> option:
		</p>
		<Code
			lang="ts"
			content={`vite_plugin_library_well_known({
  library_path: './src/lib/library.json',
})`}
		/>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Why `.well-known/`?">
			Why <code>.well-known/</code>?
		</TomeSectionHeader>
		<p>
			Writing to <code>.well-known/package.json</code> and <code>.well-known/library.json</code>
			extends <a href="https://en.wikipedia.org/wiki/Well-known_URI">Well-known URIs</a> (<a
				href="https://www.rfc-editor.org/rfc/rfc8615">RFC 8615</a
			>) for JS packages to provide conventional metadata for deployed websites. A popular example
			is how Mastodon uses WebFinger, which uses <code>.well-known/</code> for user identity discovery.
		</p>
		<p>
			SvelteKit outputs static files relative to the configured <code>base</code> path, so the
			<code>.well-known</code> directory may not be in the root <code>/</code>. This enables
			websites to provide metadata even when hosted in a namespaced path like
			<code>username.github.io/projectname/.well-known</code>. This breaks from the RFC but
			hopefully not in the bad-citizen kind of way; the alternative would be to ignore the standard
			and do something bespoke, which seems worse.
		</p>
		<p>Why publish this metadata to the web instead of relying on the git repo?</p>
		<ul>
			<li>give all web users and tools access to discoverable package metadata</li>
			<li>metadata is a much lighter dependency than an entire repo</li>
			<li>some repos are deployed to multiple websites with metadata differences</li>
			<li>some repos like monorepos have multiple <code>package.json</code> files</li>
			<li>no dependency on git or the URL patterns of forge hosts like GitHub</li>
			<li>
				the git repo remains the source of truth, the build step gives control over the published
				artifacts
			</li>
		</ul>
	</TomeSection>
</TomeContent>
