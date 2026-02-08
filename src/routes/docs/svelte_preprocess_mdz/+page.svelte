<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import {get_tome_by_name} from '$lib/tome.js';
	import TomeContent from '$lib/TomeContent.svelte';
	import TomeSection from '$lib/TomeSection.svelte';
	import TomeSectionHeader from '$lib/TomeSectionHeader.svelte';
	import DeclarationLink from '$lib/DeclarationLink.svelte';
	import ModuleLink from '$lib/ModuleLink.svelte';
	import TomeLink from '$lib/TomeLink.svelte';

	const LIBRARY_ITEM_NAME = 'svelte_preprocess_mdz';
	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);
</script>

<TomeContent {tome}>
	<section>
		<p>
			<DeclarationLink name="svelte_preprocess_mdz" /> is a Svelte preprocessor that compiles static
			<code>&lt;Mdz&gt;</code>
			content to Svelte markup at build time. Instead of parsing mdz at runtime, the preprocessor replaces
			<code>&lt;Mdz&gt;</code>
			with
			<DeclarationLink name="MdzPrecompiled" /> containing pre-rendered children.
		</p>
		<p>
			See <TomeLink name="mdz" /> for documentation on the mdz format itself.
		</p>
	</section>

	<TomeSection>
		<TomeSectionHeader text="Setup" />
		<p>Add the preprocessor to <code>svelte.config.js</code>:</p>
		<Code
			lang="ts"
			content={`import {svelte_preprocess_mdz} from '@fuzdev/fuz_ui/svelte_preprocess_mdz.js';

export default {
  preprocess: [
    svelte_preprocess_mdz({
      components: {Alert: '$lib/Alert.svelte'},
      elements: ['aside', 'details'],
    }),
    // ...other preprocessors
  ],
};`}
		/>
		<p>
			The preprocessor should run before other preprocessors like
			<code>vitePreprocess()</code> so it can parse the original Svelte source.
		</p>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Options" />
		<p>
			<DeclarationLink name="svelte_preprocess_mdz" /> accepts a
			<DeclarationLink name="SveltePreprocessMdzOptions" /> object:
		</p>
		<ul>
			<li>
				<code>components</code> — maps mdz component names to import paths (e.g.,
				<code>{'{'} Alert: '$lib/Alert.svelte' }</code>). Content referencing an unmapped component
				falls back to runtime.
			</li>
			<li>
				<code>elements</code> — allowed HTML element names in mdz content (e.g.,
				<code>['aside', 'details']</code>). Content referencing an unlisted element falls back to
				runtime.
			</li>
			<li>
				<code>exclude</code> — file patterns to skip (<code>Array&lt;string | RegExp&gt;</code>).
			</li>
			<li>
				<code>component_imports</code> — import sources that resolve to the Mdz component (default:
				<code>['@fuzdev/fuz_ui/Mdz.svelte']</code>).
			</li>
			<li>
				<code>compiled_component_import</code> — import path for MdzPrecompiled (default:
				<code>'@fuzdev/fuz_ui/MdzPrecompiled.svelte'</code>).
			</li>
			<li>
				<code>on_error</code> — <code>'log'</code> or <code>'throw'</code>
				(default: <code>'throw'</code> in CI, <code>'log'</code> otherwise).
			</li>
		</ul>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="How it works" />
		<p>The preprocessor transforms static content at build time:</p>
		<Code
			content={`<!-- Before -->
<Mdz content="**bold** and \`some_fn\`" />

<!-- After -->
<MdzPrecompiled><p><strong>bold</strong> and <DocsLink reference={'some_fn'} /></p></MdzPrecompiled>`}
		/>
		<p>For ternary expressions with static branches, it generates Svelte control flow:</p>
		<Code
			content={`<!-- Before -->
<Mdz content={show ? '**a**' : '**b**'} />

<!-- After -->
<MdzPrecompiled>{#if show}<p><strong>a</strong></p>{:else}<p><strong>b</strong></p>{/if}</MdzPrecompiled>`}
		/>
		<p>The preprocessor also manages imports automatically:</p>
		<ul>
			<li>
				adds imports required by the rendered content (e.g., <DeclarationLink name="DocsLink" />,
				<code>Code</code>, <code>resolve</code>, configured components)
			</li>
			<li>
				removes the <DeclarationLink name="Mdz" /> import when all usages are transformed
			</li>
			<li>removes dead <code>const</code> bindings consumed only by transformed content</li>
		</ul>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="What gets transformed" />
		<p>The preprocessor handles these static content patterns:</p>
		<ul>
			<li>string attributes: <Code content="content=&quot;**bold**&quot;" /></li>
			<li>JS string expressions: <Code content={`content={'**bold**'}`} /></li>
			<li>template literals without interpolation: <Code content={'content={`**bold**`}'} /></li>
			<li>const variable references: <Code content={`const msg = '**bold**'; content={msg}`} /></li>
			<li>ternary chains: <Code content={`content={show ? '**a**' : '**b**'}`} /></li>
			<li>nested ternaries: <Code content={`content={a ? 'x' : b ? 'y' : 'z'}`} /></li>
		</ul>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Skip conditions" />
		<p>The preprocessor falls back to runtime rendering when:</p>
		<ul>
			<li>the file is excluded via <code>exclude</code></li>
			<li>no matching import source is found for Mdz</li>
			<li>the import is <code>import type</code> (not a runtime import)</li>
			<li><DeclarationLink name="MdzPrecompiled" /> is already imported from a different source</li>
			<li>
				the <code>content</code> prop is dynamic (variable, function call, <code>$state</code>,
				<code>$derived</code>)
			</li>
			<li>spread attributes are present (<code>{'{'}...props}</code>)</li>
			<li>content references unconfigured components or elements</li>
			<li>a ternary branch has dynamic content or unconfigured tags</li>
		</ul>
	</TomeSection>
	<aside>
		See also <TomeLink name="mdz" /> for the mdz format,
		<ModuleLink module_path="svelte_preprocess_mdz.ts" /> and
		<ModuleLink module_path="mdz_to_svelte.ts" /> for full API docs.
	</aside>
</TomeContent>
