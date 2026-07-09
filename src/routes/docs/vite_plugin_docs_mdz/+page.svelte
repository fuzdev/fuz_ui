<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import {tome_get_by_slug} from '$lib/tome.ts';
	import TomeContent from '$lib/TomeContent.svelte';
	import TomeSection from '$lib/TomeSection.svelte';
	import TomeSectionHeader from '$lib/TomeSectionHeader.svelte';
	import DeclarationLink from '$lib/DeclarationLink.svelte';
	import ModuleLink from '$lib/ModuleLink.svelte';
	import TomeLink from '$lib/TomeLink.svelte';
	import GithubLink from '$lib/GithubLink.svelte';

	const TOME_SLUG = 'vite_plugin_docs_mdz';
	const tome = tome_get_by_slug(TOME_SLUG);
</script>

<TomeContent {tome}>
	<section>
		<p>
			<DeclarationLink name="vite_plugin_docs_mdz" /> is a Vite plugin that pre-parses the
			markdown-bearing fields of <code>virtual:svelte-docinfo</code> at build time, so the
			auto-generated API-docs pages render pre-parsed
			<a href="https://mdz.fuz.dev/docs/api#MdzNode"><code>MdzNode</code></a> trees instead of
			calling
			<code>mdz_parse</code> on every <code>&lt;Mdz&gt;</code> mount in the browser.
		</p>
		<p>
			A single module's docs page mounts tens to a hundred-plus <code>&lt;Mdz&gt;</code> instances
			-- one per declaration doc comment, per <code>@param</code>/<code>@returns</code> description,
			per
			<code>@example</code>, per <code>@see</code>. Without the plugin each one parses its markdown
			string on hydration <em>and</em> on every client-side navigation (the
			<code>virtual:svelte-docinfo</code> payload is bundled into the client chunk). This plugin
			moves all of that parsing to build time.
		</p>
	</section>

	<TomeSection>
		<TomeSectionHeader text="Setup" />
		<p>
			Register the plugin, <ModuleLink module_path="vite_plugin_docs_mdz.ts" />,
			<strong>after</strong>
			<code>svelte_docinfo()</code> so its <code>transform</code> sees the loaded virtual module:
		</p>
		<Code
			lang="ts"
			content={`// vite.config.ts\nimport {defineConfig} from 'vite';
import {sveltekit} from '@sveltejs/kit/vite';
import svelte_docinfo from 'svelte-docinfo/vite.js';
import {vite_plugin_docs_mdz} from '@fuzdev/fuz_ui/vite_plugin_docs_mdz.js';

export default defineConfig({
	plugins: [
		sveltekit(),
		svelte_docinfo(),
		vite_plugin_docs_mdz(), // after svelte_docinfo()
	],
});`}
		/>
		<p>
			It's zero-config and uses <code>enforce: 'pre'</code> so it transforms svelte-docinfo's raw
			module source before Vite's core transforms touch it. Because it augments svelte-docinfo's
			<em>own</em> resolved module in place -- rather than deriving a separate module -- HMR needs
			no extra wiring: when svelte-docinfo invalidates the module on a source edit, Vite re-runs its
			<code>load</code> and then this <code>transform</code> with the fresh data, so the pre-parsed
			trees never go stale.
		</p>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Sibling trees, with a runtime fallback" />
		<p>
			For each markdown string field (<code>docComment</code>, <code>description</code>,
			<code>returnDescription</code>, <code>moduleComment</code>) the plugin adds a
			<code>*Nodes</code> sibling (<code>docCommentNodes</code>, ...) next to the raw string; for
			the string-array fields (<code>examples</code>, <code>seeAlso</code>) it adds
			<code>examplesNodes</code> and <code>seeAlsoNodes</code>. The raw strings stay in place, so
			code that reads them as strings -- like search -- keeps working.
		</p>
		<p>
			The docs components read the trees through a small <code>DocMdz</code> wrapper that prefers
			the pre-parsed <code>nodes</code> and falls back to parsing <code>content</code> at runtime.
			So a plain <code>vite dev</code> without the plugin registered still renders -- it just parses
			on the client, exactly as before.
		</p>
		<Code
			lang="svelte"
			content={`<!-- DocMdz: pre-parsed tree if present, else parse the raw string -->
{#if nodes}
	<Mdz {nodes} />
{:else if content}
	<Mdz {content} />
{/if}`}
		/>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Payload trade-off" />
		<p>
			Pre-parsed JSON is larger than the raw markdown string it replaces -- roughly double
			uncompressed, and the trees ship in the same client chunk as the rest of the library metadata.
			The win is trading that payload for zero client-side parse work across every declaration on
			every page load and every client-side navigation. For a docs-heavy library the parse savings
			are worth the bytes; if they aren't for your case, the plugin is opt-in -- drop it and the
			<code>DocMdz</code> fallback parses at runtime instead.
		</p>
	</TomeSection>

	<aside>
		For more, see <ModuleLink module_path="vite_plugin_docs_mdz.ts" />, the sibling
		<TomeLink slug="vite_plugin_pkg_json" /> plugin, the
		<GithubLink path="fuzdev/fuz_ui/blob/main/src/lib/vite_plugin_docs_mdz.ts"
			>source code</GithubLink
		>, and <a href="https://mdz.fuz.dev/">mdz</a>.
	</aside>
</TomeContent>
