<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';
	import {resolve} from '$app/paths';

	import {get_tome_by_name} from '$lib/tome.js';
	import TomeContent from '$lib/TomeContent.svelte';
	import TomeSection from '$lib/TomeSection.svelte';
	import TomeSectionHeader from '$lib/TomeSectionHeader.svelte';
	import Mdz from '$lib/Mdz.svelte';
	import DeclarationLink from '$lib/DeclarationLink.svelte';
	import TomeLink from '$lib/TomeLink.svelte';
	import {mdz_components_context, mdz_elements_context} from '$lib/mdz_components.js';
	import Alert from '$lib/Alert.svelte';

	const LIBRARY_ITEM_NAME = 'mdz';
	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);

	mdz_components_context.set(new Map([['Alert', Alert]]));

	mdz_elements_context.set(
		new Map([
			['code', true],
			['aside', true],
			['marquee', true],
		]),
	);

	const basic_example = '**Bold** and _italic_ and ~strikethrough~ text.';
	const nesting_example = '**~_All_ three~ combi**_ned_';
	const whitespace_example = ' see \n  how       \n   whitespace    \nis preserved ';
	const code_example = 'To parse markdown directly, use `mdz_parse` from module `mdz.ts`.';
	const code_plain_example = 'This `identifier` does not exist.';
	const link_external_example =
		'[Fuz API docs](https://fuz.dev/docs/api) and https://fuz.dev/docs/api and /docs/api';
	const linebreak_example = 'First line.\nSecond line.\nThird line.';
	const paragraph_example = 'First paragraph.\n\nSecond paragraph.\nLinebreak in second paragraph.';
	const triple_linebreak_example =
		'First paragraph.\n\n\nSecond paragraph separated by an extra newline.';
	const hr_example = 'Section one.\n\n---\n\nSection two.';
	const heading_example = '#### h4 ~with~ _italic_';
	const code_block_example = '```ts\nconst z: number = 43;\n```';
	const element_aside_example =
		'<aside>This is _italicized <code>code</code>_ inside an `aside`.</aside>';
	const element_marquee_example = '<marquee>use it or lose it</marquee>';
	const component_example =
		'<Alert>This is an `Alert` with _italicized <code>code</code>_ inside.</Alert>';

	let whitespace_example_el: HTMLDivElement;
</script>

<TomeContent {tome}>
	<section>
		<p>
			mdz is a small markdown dialect that supports Svelte components, auto-detected URLs prefixed
			with <code>https://</code> and <code>/</code>, and Fuz integration like linkified identifiers
			and modules in <code>`backticks`</code>. The goal is to securely integrate markdown with the
			environment's capabilities, while being simple and friendly to nontechnical users.
		</p>
		<p>
			mdz prioritizes predictability: strict syntax with one canonical pattern per feature,
			preferring false negatives over false positives to minimize surprise.
		</p>
		<p>
			For better performance, static mdz content can be compiled at build time with the
			<TomeLink name="svelte_preprocess_mdz" />.
		</p>
		<aside>
			⚠️ This is an early proof of concept with missing features. Next: attributes, lists,
			blockquotes
		</aside>
		<aside>
			<p>Possible changes?</p>
			<ul>
				<li>
					allow ending lines with <code class="white-space:pre"> \</code> to opt out of rendering the
					line break?
				</li>
				<li>loosen/tighten some restrictions like requiring blank newline separators?</li>
			</ul>
		</aside>
	</section>

	<TomeSection>
		<TomeSectionHeader text="Usage" />
		<Mdz content="import `Mdz` from `mdz.ts`:" />
		<Code lang="ts" content="import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';" />
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Basic formatting" />
		<p>Supports <strong>bold</strong>, <em>italic</em>, and strikethrough:</p>
		<Code content={`<Mdz content="${basic_example}" />`} />
		<Mdz content={basic_example} class="mb_xl5" />
		<p>All inline formatting can nest:</p>
		<Code content={`<Mdz content="${nesting_example}" />`} />
		<Mdz content={nesting_example} class="mb_xl5" />
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Preserves whitespace" />
		<p>
			mdz preserves and renders all whitespace exactly as written, minimizing surprise for
			nontechnical users:
		</p>
		<Code content={`<Mdz content="${whitespace_example}" />`} />
		<div class="mb_lg" bind:this={whitespace_example_el}>
			<Mdz content={whitespace_example} />
		</div>
		<button
			type="button"
			onclick={() => {
				const selection = window.getSelection();
				const range = document.createRange();
				range.selectNodeContents(whitespace_example_el);
				selection?.removeAllRanges();
				selection?.addRange(range);
			}}
		>
			select text to reveal whitespace
		</button>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Line breaks and paragraphs" />
		<p>Single newlines create line breaks:</p>
		<Code content={linebreak_example} />
		<Mdz content={linebreak_example} class="mb_xl5" />
		<p>Double newlines create paragraph breaks:</p>
		<Code content={paragraph_example} />
		<Mdz content={paragraph_example} class="mb_xl5" />
		<p>Triple newlines create paragraphs with a blank line between:</p>
		<Code content={triple_linebreak_example} />
		<Mdz content={triple_linebreak_example} class="mb_xl5" />
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Horizontal rules" />
		<p>
			Use exactly three hyphens (<code>---</code>) at the start of a line to create a horizontal
			rule. Must be separated from other content by blank lines (paragraph breaks), except at
			document start/end:
		</p>
		<Code content={hr_example} />
		<Mdz content={hr_example} class="mb_xl5" />
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Inline code auto-linking" />
		<p>Backtick code automatically links to identifiers and modules:</p>
		<Code content={code_example} />
		<Mdz content={code_example} class="mb_xl5" />
		<p>Non-identifiers become plain code elements:</p>
		<Code content={code_plain_example} />
		<Mdz content={code_plain_example} class="mb_xl5" />
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Links" />
		<p>mdz supports three kinds of links:</p>
		<ul>
			<li>standard markdown link syntax</li>
			<li>
				external URLs starting with <code>https://</code> or
				<code>http://</code>
			</li>
			<li>internal paths starting with <code>/</code></li>
		</ul>
		<Code content={link_external_example} />
		<Mdz content={link_external_example} class="mb_xl5" />
		<p>
			<strong>Note:</strong> Relative paths (<code>./</code>, <code>../</code>) are not supported
			(currently, I think this will be changed). mdz content may be rendered at different URLs than
			where source files live (e.g., TSDoc comments from <code>src/lib/foo.ts</code> render at
			<code>/docs/api/foo.ts</code>). Root-relative paths (<code>/docs/...</code>) have unambiguous
			meaning regardless of render location, making them more portable. However it seems very useful
			to make
			<code>../</code> and <code>./</code> links work, maybe we can support it and make the renderer accept
			a custom base path?
		</p>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="HTML elements" />
		<p>mdz supports an opt-in set of HTML elements for semantic markup and styling.</p>
		<Code content={element_aside_example} />
		<Mdz content={element_aside_example} class="mb_xl5" />
		<Code content={element_marquee_example} />
		<Mdz content={element_marquee_example} class="mb_xl5" />
		<p>Elements must be registered:</p>
		<Code
			lang="ts"
			content={`import {mdz_elements_context} from '@fuzdev/fuz_ui/mdz_components.js';

mdz_elements_context.set(new Map([
	['code', true],
	['aside', true],
	['marquee', true],
]));`}
		/>
		<p>
			Unregistered elements render as <Mdz content="<tag-name />" inline /> placeholders for security.
		</p>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Svelte components" />
		<p>
			mdz supports Svelte components to a minimal (and possibly expanding) degree. Components are
			distinguished from HTML elements by their uppercase first letter:
		</p>
		<Code content={component_example} />
		<Mdz content={component_example} class="mb_xl5" />
		<p>Components must be registered:</p>
		<Code
			lang="ts"
			content={`import {mdz_components_context} from '@fuzdev/fuz_ui/mdz_components.js';
import Alert from '@fuzdev/fuz_ui/Alert.svelte';

mdz_components_context.set(new Map([
	['Alert', Alert],
]));`}
		/>
		<p>
			Unregistered components render as <Mdz content="<ComponentName />" inline />
			placeholders.
		</p>
		<aside>
			tip: You can put a <code>SvelteMap</code> in the component and element registries.
		</aside>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Advanced usage" />
		<p>
			For more control, use <DeclarationLink name="mdz_parse" /> directly with <DeclarationLink
				name="MdzNodeView"
			/>:
		</p>
		<Code
			content={`import {mdz_parse} from '@fuzdev/fuz_ui/mdz.js';
import MdzNodeView from '@fuzdev/fuz_ui/MdzNodeView.svelte';

const nodes = mdz_parse(content);`}
			lang="ts"
		/>
		<Code
			content={`<div class="custom white-space:pre-wrap">
	{#each nodes as node}
		<MdzNodeView {node} />
	{/each}
</div>`}
		/>
		<p>
			For example you may want <code>white-space:pre</code> to avoid wrapping in some circumstances.
		</p>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Headings" />
		<p>Use 1-6 hashes followed by a space:</p>
		<Code content={heading_example} />
		<Mdz content={heading_example} class="mb_xl5" />
		<p>
			Must start at column 0, have a space after hashes, and be followed by a blank line or EOF.
			Headings can include inline formatting.
		</p>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Code blocks" />
		<p>Use three or more backticks with optional language hint:</p>
		<Code content={code_block_example} />
		<Mdz content={code_block_example} class="mb_xl5" />
		<p>
			Must start at column 0, closing fence must match opening length, and be followed by a blank
			line or EOF.
		</p>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Compatibility with other markdowns" />
		<p>mdz supports fewer syntax variants than CommonMark/GFM:</p>
		<ul>
			<li>bold: <code>**text**</code> only</li>
			<li>italic: <code>_text_</code> only</li>
		</ul>
		<p>
			In CommonMark, <code>*text*</code> is italic. In mdz, single <code>*</code> has no special meaning
			and renders as literal text. This choice creates a clear visual distinction between bold and italics.
		</p>
		<p>
			In general, mdz wants to minimize surprise to nontechnical users, so it's strict in what it
			accepts and prefers false negatives over false positives. For example, it requires a
			separating blank line and <code>```</code> with no preceding spaces or characters to start a code
			block.
		</p>
	</TomeSection>

	<TomeSection>
		<TomeSectionHeader text="Generated docs" />
		<p>For more see the generated mdz docs:</p>
		<ul>
			<li>
				<strong>
					<a href={resolve('/docs/mdz/spec')}>mdz specification</a>
				</strong>
			</li>
			<li>
				<strong>
					<a href={resolve('/docs/mdz/grammar')}>mdz grammar</a>
				</strong>
			</li>
			<li>
				<strong>
					<a href={resolve('/docs/mdz/fixtures')}>fixtures debug page</a>
				</strong>
			</li>
		</ul>
	</TomeSection>
</TomeContent>
