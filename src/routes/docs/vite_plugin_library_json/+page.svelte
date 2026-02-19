<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import {get_tome_by_name} from '$lib/tome.js';
	import TomeContent from '$lib/TomeContent.svelte';
	import TomeSection from '$lib/TomeSection.svelte';
	import TomeSectionHeader from '$lib/TomeSectionHeader.svelte';
	import DeclarationLink from '$lib/DeclarationLink.svelte';
	import TomeLink from '$lib/TomeLink.svelte';

	const LIBRARY_ITEM_NAME = 'vite_plugin_library_json';
	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);

	/* eslint-disable svelte/no-useless-mustaches */
</script>

<TomeContent {tome}>
	<section>
		<p>
			<DeclarationLink name="vite_plugin_library_json" /> generates library metadata with the
			<Code lang="ts" inline content="'virtual:library.json'" /> import. It is an alternative to the Gro
			genfile (<DeclarationLink name="library_gen" />) for projects that do not use Gro, or for
			those who don't like how it writes
			<code>library.json</code> to the filesystem.
		</p>
		<p>
			The plugin scans source files from the filesystem, analyzes them with the TypeScript compiler,
			and serves the result as an importable module. In dev mode it watches for changes and
			regenerates automatically.
		</p>
	</section>

	<TomeSection>
		<TomeSectionHeader text="Setup" />
		<p>1. Add the plugin to <code>vite.config.ts</code>:</p>
		<Code
			lang="ts"
			content={`import {defineConfig} from 'vite';
import {sveltekit} from '@sveltejs/kit/vite';
import {vite_plugin_library_json} from '@fuzdev/fuz_ui/vite_plugin_library_json.js';
import {library_throw_on_duplicates} from '@fuzdev/fuz_ui/library_generate.js';

export default defineConfig({
  plugins: [
    vite_plugin_library_json({on_duplicates: library_throw_on_duplicates}),
    sveltekit(),
  ],
});`}
		/>
		<p>2. Add TypeScript support in your <code>app.d.ts</code>:</p>
		<Code lang="ts" content={`/// <reference types="@fuzdev/fuz_ui/virtual_library_json.js" />`} />
		<p>3. Import the library metadata:</p>
		<Code lang="ts" content={`import {library_json} from 'virtual:library.json';`} />
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Options" />
		<Code
			lang="ts"
			content={`vite_plugin_library_json({
  // Strict flat namespace enforcement (throws on duplicate declaration names).
  on_duplicates: library_throw_on_duplicates,

  // Custom source options (defaults to src/lib).
  source: {source_paths: ['src/lib'], exclude_patterns: [/\\.test\\.ts$/]},

  // Path to package.json relative to project root.
  package_json_path: 'package.json',
})`}
		/>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="How it works" />
		<ol>
			<li>
				<strong>buildStart</strong> — scans source directories with
				<DeclarationLink name="library_collect_source_files_from_fs" />, reads file contents, and
				calls <DeclarationLink name="library_generate" /> to produce the full metadata
			</li>
			<li>
				<strong>resolveId / load</strong> — serves the metadata as
				<code>virtual:library.json</code>, a JavaScript module exporting <code>library_json</code>
			</li>
			<li>
				<strong>configureServer</strong> — watches source files for changes and regenerates with debouncing,
				triggering a full page reload when metadata changes
			</li>
		</ol>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Comparison with Gro genfile" />
		<p>
			The Gro genfile (<DeclarationLink name="library_gen" />) benefits from Gro's filer which
			provides pre-loaded file contents and a dependency graph. The Vite plugin scans the filesystem
			directly, so dependency and dependent metadata is not included in the output. Both call the
			same <DeclarationLink name="library_generate" /> core.
		</p>
		<p>
			Use the Vite plugin when you want library metadata without a Gro dependency. Use the genfile
			when you already use Gro and want the richer dependency information.
		</p>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Combining with well-known" />
		<p>
			To also publish metadata to <code>.well-known/</code>, use
			<TomeLink name="vite_plugin_library_well_known" /> alongside this plugin. Note that
			<DeclarationLink name="vite_plugin_library_well_known" /> currently reads
			<code>library.json</code> from disk, so it requires the Gro genfile. A future update will allow
			it to consume the virtual module directly.
		</p>
	</TomeSection>
</TomeContent>
