<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';
	import {pkg_json_keys} from '@fuzdev/fuz_util/pkg_json.js';

	import {tome_get_by_slug} from '$lib/tome.js';
	import TomeContent from '$lib/TomeContent.svelte';
	import TomeSection from '$lib/TomeSection.svelte';
	import TomeSectionHeader from '$lib/TomeSectionHeader.svelte';
	import DeclarationLink from '$lib/DeclarationLink.svelte';
	import ModuleLink from '$lib/ModuleLink.svelte';
	import TomeLink from '$lib/TomeLink.svelte';
	import GithubLink from '$lib/GithubLink.svelte';

	const TOME_SLUG = 'vite_plugin_pkg_json';
	const tome = tome_get_by_slug(TOME_SLUG);

	// Supplemental notes for the served keys; the set itself comes from `pkg_json_keys`
	// so the list can't drift from the source. New keys render without a note.
	const key_notes: Partial<Record<(typeof pkg_json_keys)[number], string>> = {
		name: 'package name',
		version: 'published version',
		private: "unpublished flag (feeds a library's published status)",
		description: 'short description',
		tagline: 'Fuz extension field',
		glyph: 'Fuz extension field (emoji or character icon)',
		logo: 'Fuz extension field (logo image path)',
		logo_alt: 'Fuz extension field (logo alt text)',
		license: 'SPDX license id',
		homepage: 'homepage URL',
		repository: 'source repository (feeds repo_url)',
		funding: 'funding info',
		exports: "package entry points (feeds a library's published status)",
	};
</script>

<TomeContent {tome}>
	<section>
		<p>
			<DeclarationLink name="vite_plugin_pkg_json" /> is a Vite plugin that serves a publish-safe subset
			of your <code>package.json</code> as the virtual module
			<Code lang="ts" content="'virtual:pkg.json'" inline />. The default export is typed
			<a href="https://util.fuz.dev/docs/api#PkgJson"><code>PkgJson</code></a>, containing package
			identity plus the Fuz extension fields, with everything else excluded.
		</p>
		<p>
			Apps can use package info like name/version/repository and the Fuz extension fields like logo
			for things like library docs, e.g. the <TomeLink slug="Breadcrumb" /> above uses it for the icon
			to avoid redeclaring data and threading props. The plugin strips <code>package.json</code> to the
			allowlist and serves only that.
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
			Plugin order is unconstrained. The plugin uses <code>enforce: 'pre'</code>, so it claims
			<code>virtual:pkg.json</code> before other plugins resolve it.
		</p>
		<p>
			The plugin call takes no required options. The served field set defaults to
			<a href="https://util.fuz.dev/docs/api#pkg_json_keys"><code>pkg_json_keys</code></a> (widen it
			via <code>keys</code>, see Custom keys below). It does still need an ambient declaration so
			the default export type-checks, in
			<code>src/app.d.ts</code>:
		</p>
		<Code
			lang="ts"
			content={`// src/app.d.ts\ndeclare module 'virtual:pkg.json' {
  import type {PkgJson} from '@fuzdev/fuz_util/pkg_json.js';
  const pkg_json: PkgJson;
  export default pkg_json;
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
			content={`import pkg_json from 'virtual:pkg.json';
import {SiteState, site_context} from '@fuzdev/fuz_ui/site.svelte.js';

// glyph + repo_url derive from pkg_json.glyph and pkg_json.repository
site_context.set(new SiteState({pkg_json}));`}
		/>
		<p>
			It's also the curated <code>pkg_json</code> half of a
			<a href="https://util.fuz.dev/docs/api#LibraryJson"><code>LibraryJson</code></a> (rendered by
			<TomeLink slug="LibraryDetail" />). The canonical pattern combines it with the analyzed
			<code>modules</code> from
			<code>virtual:svelte-docinfo</code>
			(<a href="https://svelte-docinfo.fuz.dev/">svelte-docinfo.fuz.dev</a>). Put this in
			<code>src/routes/library.ts</code>:
		</p>
		<Code
			lang="ts"
			content={`import {library_json_from_modules} from '@fuzdev/fuz_util/library_json.js';
import {modules} from 'virtual:svelte-docinfo';
import pkg_json from 'virtual:pkg.json';

export const library_json = library_json_from_modules(pkg_json, modules);`}
		/>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="What gets served" />
		<p>
			The plugin keeps only the keys in <a href="https://util.fuz.dev/docs/api#pkg_json_keys"
				><code>pkg_json_keys</code></a
			> (package identity and the Fuz extension fields). Everything else is dropped:
		</p>
		<ul>
			{#each pkg_json_keys as key (key)}
				<li>
					<code>{key}</code>{#if key_notes[key]}: {key_notes[key]}{/if}
				</li>
			{/each}
		</ul>
		<p>
			The type is strict and <code>Pick</code>ed from the same list, so the runtime strip and the
			type can't drift. Accessing a stripped field like <code>pkg_json.scripts</code> is a compile error.
		</p>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Custom keys" />
		<p>
			The kept field set defaults to <a href="https://util.fuz.dev/docs/api#pkg_json_keys"
				><code>pkg_json_keys</code></a
			>. To expose extra publish-safe fields, pass a wider <code>keys</code> list, composed from the default
			with a spread so the curated fields stay in:
		</p>
		<Code
			lang="ts"
			content={`// src/routes/pkg_json_keys.ts — one shared const for all three sites
import {pkg_json_keys} from '@fuzdev/fuz_util/pkg_json.js';

export const pkg_json_keys_custom = [...pkg_json_keys, 'keywords'] as const;`}
		/>
		<p>
			Because <code>library_json_from_modules</code> re-strips at runtime, the <em>same</em> list
			has to reach all three places (the plugin, that runtime call, and the
			<code>virtual:pkg.json</code> ambient type), or the extras get dropped:
		</p>
		<Code
			lang="ts"
			content={`// vite.config.ts
vite_plugin_pkg_json({keys: pkg_json_keys_custom});

// src/routes/library.ts
library_json_from_modules(pkg_json, modules, pkg_json_keys_custom);`}
		/>
		<p>
			The extra fields are served at runtime but stay outside the static <code>PkgJson</code> type;
			widen the <code>virtual:pkg.json</code> declaration in <code>src/app.d.ts</code> to type them.
		</p>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Build vs dev" />
		<ul>
			<li>
				fail-fast — a missing or malformed <code>package.json</code> surfaces as a named
				<code>vite_plugin_pkg_json</code> diagnostic immediately, not when something first imports
				the module. A missing <code>name</code> field is a non-fatal warning. The curated module still
				serves.
			</li>
			<li>
				dev — edits to <code>package.json</code> propagate through a reload; build serves a stable value.
			</li>
		</ul>
	</TomeSection>
	<aside>
		For more, see <ModuleLink module_path="vite_plugin_pkg_json.ts" />, the
		<GithubLink path="fuzdev/fuz_ui/blob/main/src/lib/vite_plugin_pkg_json.ts"
			>source code</GithubLink
		> and <GithubLink path="fuzdev/fuz_ui/blob/main/src/test/vite_plugin_pkg_json.test.ts"
			>tests</GithubLink
		>. See also <TomeLink slug="svelte_preprocess_mdz" />, the other build-time tool.
	</aside>
</TomeContent>
