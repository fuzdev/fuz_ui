<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import {tome_get_by_slug} from '$lib/tome.js';
	import TomeContent from '$lib/TomeContent.svelte';
	import TomeSection from '$lib/TomeSection.svelte';
	import TomeSectionHeader from '$lib/TomeSectionHeader.svelte';
	import DeclarationLink from '$lib/DeclarationLink.svelte';
	import ModuleLink from '$lib/ModuleLink.svelte';
	import GithubLink from '$lib/GithubLink.svelte';

	const TOME_SLUG = 'vite_plugin_pkg_json';
	const tome = tome_get_by_slug(TOME_SLUG);
</script>

<TomeContent {tome}>
	<section>
		<p>
			<DeclarationLink name="vite_plugin_pkg_json" /> is a Vite plugin that serves a curated, publish-safe
			subset of your <code>package.json</code> as the virtual module
			<code>virtual:pkg.json</code>. The default export is typed
			<code>PkgJson</code> (from <code>@fuzdev/fuz_util/pkg_json.js</code>) — package identity plus
			the Fuz extension fields, with everything else stripped out.
		</p>
		<p>
			Apps need package identity — name, version, repository, the Fuz extension fields — in the
			client for chrome like <DeclarationLink name="Breadcrumb" /> and library docs. Importing the root
			<code>package.json</code>
			directly inlines the
			<em>whole</em> file into the client bundle (<code>scripts</code>, <code>dependencies</code>,
			<code>devDependencies</code>, private config) and trips SvelteKit's
			<code>server.fs.allow</code> on cold HMR reloads. This plugin reads
			<code>package.json</code> once, strips it to the allowlist, and serves only that.
		</p>
	</section>

	<TomeSection>
		<TomeSectionHeader text="Setup" />
		<p>
			Register the plugin, <ModuleLink module_path="vite_plugin_pkg_json.ts" />, in
			<code>vite.config.ts</code>:
		</p>
		<Code
			lang="ts"
			content={`import {defineConfig} from 'vite';
import {sveltekit} from '@sveltejs/kit/vite';
import {vite_plugin_pkg_json} from '@fuzdev/fuz_ui/vite_plugin_pkg_json.js';

export default defineConfig({
  plugins: [vite_plugin_pkg_json(), sveltekit()],
});`}
		/>
		<p>
			It's zero-config — the publish-safe field set ships with <code>pkg_json_keys</code>. To make
			the default export type-check, the
			<code>virtual:pkg.json</code> module is declared in <code>src/app.d.ts</code>:
		</p>
		<Code
			lang="ts"
			content={`declare module 'virtual:pkg.json' {
  import type {PkgJson} from '@fuzdev/fuz_util/pkg_json.js';
  const package_json: PkgJson;
  export default package_json;
}`}
		/>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Usage" />
		<p>
			Import the default export anywhere in client or server code. A common use is deriving site
			identity for <DeclarationLink name="SiteState" /> at the root layout, so
			<code>glyph</code> and <code>repo_url</code> come from <code>package.json</code> instead of being
			hardcoded:
		</p>
		<Code
			lang="ts"
			content={`import package_json from 'virtual:pkg.json';
import {SiteState, site_context} from '@fuzdev/fuz_ui/site.svelte.js';

// glyph + repo_url derive from package_json.glyph and package_json.repository
site_context.set(new SiteState({pkg: package_json}));`}
		/>
		<p>
			It's also the source for <code>LibraryJson.package_json</code> — the package metadata rendered by
			the library and API docs.
		</p>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="What gets served" />
		<p>
			The plugin keeps only the keys in <code>pkg_json_keys</code> — package identity and the Fuz extension
			fields. Everything else is dropped:
		</p>
		<Code
			lang="ts"
			content={`name, version, private, description, tagline, glyph,
logo, logo_alt, license, homepage, repository, funding, exports`}
		/>
		<p>
			<code>exports</code> and <code>private</code> are kept because
			<code>library_json_parse</code> derives <code>published</code> from them. The type is strict
			and <code>Pick</code>ed from the same list, so the runtime strip and the type can't drift —
			accessing a stripped field like <code>package_json.scripts</code> is a compile error.
		</p>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Build vs dev" />
		<ul>
			<li>
				<strong>Fail-fast</strong> — <code>package.json</code> is read once at
				<code>buildStart</code> (build) or dev-server startup, so a missing or malformed file
				surfaces as a named <code>vite_plugin_pkg_json</code> diagnostic immediately rather than when
				something first imports the module.
			</li>
			<li>
				<strong>Build</strong> — the curated JSON is cached after the first read and reused for
				every
				<code>load</code>.
			</li>
			<li>
				<strong>Dev</strong> — <code>load</code> re-reads each time and registers
				<code>package.json</code> as a watch file, so edits to it propagate through a reload.
			</li>
		</ul>
		<p>
			The <code>.json</code> suffix on the virtual id is load-bearing: <code>load</code> returns raw
			JSON text and Vite's built-in <code>vite:json</code> plugin transforms it into an ES module
			(default export plus named exports). It mirrors how
			<code>vite_plugin_fuz_css</code> relies on the <code>.css</code> suffix of
			<code>virtual:fuz.css</code>.
		</p>
	</TomeSection>
	<aside>
		For more, see <ModuleLink module_path="vite_plugin_pkg_json.ts" /> and the
		<GithubLink path="fuzdev/fuz_ui/blob/main/src/lib/vite_plugin_pkg_json.ts"
			>source code</GithubLink
		>.
	</aside>
</TomeContent>
