<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';
	import {resolve} from '$app/paths';

	import {get_tome_by_name} from '$lib/tome.js';
	import TomeContent from '$lib/TomeContent.svelte';
	import TomeSection from '$lib/TomeSection.svelte';
	import TomeSectionHeader from '$lib/TomeSectionHeader.svelte';
	import Mdz from '$lib/Mdz.svelte';
	import MdzStream from '$lib/MdzStream.svelte';
	import {MdzStreamParser} from '$lib/mdz_stream_parser.js';
	import {MdzStreamState} from '$lib/mdz_stream_state.svelte.js';
	import DeclarationLink from '$lib/DeclarationLink.svelte';
	import TomeLink from '$lib/TomeLink.svelte';
	import MdzRoot from '$lib/MdzRoot.svelte';
	import Alert from '$lib/Alert.svelte';

	const LIBRARY_ITEM_NAME = 'mdz';
	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);

	const mdz_components = new Map([['Alert', Alert]]);

	const mdz_elements = new Map<string, boolean>([
		['code', true],
		['aside', true],
		['marquee', true],
	]);

	const playground_initial = `**Bold** and _italic_ and ~strikethrough~ text.

Inline links to identifiers using backticks: \`mdz_parse\`, \`Mdz\`

#### A heading

A paragraph with links: [fuz homepage](https://fuz.dev), ./introduction

\`\`\`ts
const y = 1336;
\`\`\``;

	let playground_content = $state(playground_initial);

	const basic_example = '**Bold** and _italic_ and ~strikethrough~ text.';
	const nesting_example = '**~_All_ three~ combi**_ned_';
	const whitespace_example = ' see \n  how       \n   whitespace    \nis preserved ';
	const code_example = 'To parse markdown directly, use `mdz_parse` from module `mdz.ts`.';
	const code_plain_example = 'This `identifier` does not exist.';
	const link_external_example =
		'[Fuz API docs](https://fuz.dev/docs/api) and https://fuz.dev/docs/api and /docs/api';
	const link_relative_example = 'See ./grammar and ./spec and ../mdz for relative paths.';
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

	// streaming demo
	const stream_initial = `Streaming renders **bold text** as bold **immediately**, same with _italic_ and ~strikethrough~.

#### A heading

A paragraph with a link: https://fuz.dev, which linkifies once fully onscreen (lazily, not optimistically).

\`\`\`ts
const y = 1336;
\`\`\`

---

stream done~`;

	let stream_content = $state(stream_initial);
	let stream_parser = $state(new MdzStreamParser());
	let stream_state = $state(new MdzStreamState());
	let stream_pos = $state(0);
	let stream_running = $state(false);
	let stream_finished = $state(false);
	let stream_interval_ms = $state(100);
	let stream_timer: ReturnType<typeof setInterval> | undefined;

	const stream_step = (): void => {
		if (stream_pos >= stream_content.length) {
			stream_parser.finish();
			stream_state.apply_batch(stream_parser.take_opcodes());
			stream_running = false;
			stream_finished = true;
			if (stream_timer !== undefined) {
				clearInterval(stream_timer);
				stream_timer = undefined;
			}
			return;
		}
		stream_parser.feed(stream_content[stream_pos]!);
		stream_state.apply_batch(stream_parser.take_opcodes());
		stream_pos++;
	};

	const stream_start = (): void => {
		if (stream_finished) stream_reset();
		stream_running = true;
		stream_timer = setInterval(stream_step, stream_interval_ms);
	};

	const stream_pause = (): void => {
		stream_running = false;
		if (stream_timer !== undefined) {
			clearInterval(stream_timer);
			stream_timer = undefined;
		}
	};

	const stream_reset = (): void => {
		stream_pause();
		stream_parser = new MdzStreamParser();
		stream_state = new MdzStreamState();
		stream_pos = 0;
		stream_finished = false;
	};
</script>

<MdzRoot base="/docs/mdz/" components={mdz_components} elements={mdz_elements}>
	<TomeContent {tome}>
		<section>
			<p>
				mdz is a small markdown dialect that supports Svelte components, auto-detected URLs prefixed
				with <code>https://</code>, <code>/</code>, <code>./</code>, and <code>../</code>, and Fuz
				integration like linkifying <code>`backtick-wrapped`</code> declarations and modules. The goal
				is to securely integrate markdown with the environment's capabilities, while being simple and
				friendly to nontechnical users.
			</p>
			<p>
				mdz prioritizes predictability with one canonical pattern per feature, preferring false
				negatives over false positives to minimize surprise.
			</p>
			<p>
				For better performance, static mdz content can be compiled at build time with <TomeLink
					name="svelte_preprocess_mdz"
				/>.
			</p>
			<aside>
				⚠️ This is an early proof of concept with missing features. Next: attributes, lists,
				blockquotes
			</aside>
			<aside>
				<p>Possible changes?</p>
				<ul>
					<li>rethink any of the choices -- still feels experimental</li>
					<li>
						allow ending lines with <code class="white-space:pre"> \</code> to opt out of rendering the
						line break?
					</li>
					<li>is the newline-preserving whitespace design ideal?</li>
					<li>think through relative link rendering with <code>trailingSlash</code></li>
				</ul>
			</aside>
		</section>

		<TomeSection>
			<TomeSectionHeader text="Usage" />
			<Mdz content="import `Mdz` from `mdz.ts`:" />
			<Code lang="ts" content="import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';" />
		</TomeSection>

		<TomeSection>
			<TomeSectionHeader text="Playground" />
			<textarea bind:value={playground_content}></textarea>
			<div class="panel shade_05 mb_lg p_md">
				<Mdz content={playground_content} />
			</div>
			<Code content={`<Mdz content="${playground_content}" />`} />
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
			<p>mdz supports four kinds of links:</p>
			<ul>
				<li>standard markdown link syntax</li>
				<li>
					external URLs starting with <code>https://</code> or
					<code>http://</code>
				</li>
				<li>absolute paths starting with <code>/</code></li>
				<li>relative paths starting with <code>./</code> or <code>../</code></li>
			</ul>
			<Code content={link_external_example} />
			<Mdz content={link_external_example} class="mb_xl5" />
			<p>
				Relative paths are resolved against the <code>base</code> context (set via
				<code>MdzRoot</code>) when provided, producing correct absolute paths. Without
				<code>base</code>, they use raw hrefs (the browser resolves them against the current URL):
			</p>
			<Code content={link_relative_example} />
			<Mdz content={link_relative_example} base="/docs/mdz/" class="mb_xl5" />
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
			<TomeSectionHeader text="Headings" />
			<p>Use 1-6 hashes followed by a space:</p>
			<Code content={heading_example} />
			<Mdz content={heading_example} class="mb_xl5" />
			<p>
				Must start at column 0 and have a space after hashes. No blank lines are required around
				headings. Headings can include inline formatting.
			</p>
		</TomeSection>

		<TomeSection>
			<TomeSectionHeader text="Code blocks" />
			<p>Use three or more backticks with optional language hint:</p>
			<Code content={code_block_example} />
			<Mdz content={code_block_example} class="mb_xl5" />
			<p>
				Must start at column 0 and closing fence must match opening length. No blank lines are
				required around code blocks.
			</p>
		</TomeSection>

		<TomeSection>
			<TomeSectionHeader text="Horizontal rules" />
			<p>
				Use exactly three hyphens (<code>---</code>) at the start of a line to create a horizontal
				rule. No blank lines are required around it. mdz has no setext headings, so
				<code>---</code> after a paragraph is always an HR:
			</p>
			<Code content={hr_example} />
			<Mdz content={hr_example} class="mb_xl5" />
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
			<TomeSectionHeader text="HTML elements" />
			<p>mdz supports an opt-in set of HTML elements for semantic markup and styling.</p>
			<Code content={element_aside_example} />
			<Mdz content={element_aside_example} class="mb_xl5" />
			<Code content={element_marquee_example} />
			<Mdz content={element_marquee_example} class="mb_xl5" />
			<p>Elements must be registered:</p>
			<Code
				lang="svelte"
				content={`<MdzRoot elements={new Map([['code', true], ['aside', true], ['marquee', true]])}>
	<Mdz content="<aside>text</aside>" />
</MdzRoot>`}
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
				lang="svelte"
				content={`<MdzRoot components={new Map([['Alert', Alert]])}>
	<Mdz content="<Alert>warning</Alert>" />
</MdzRoot>`}
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
			<TomeSectionHeader text="Streaming" />
			<p>
				For streaming content (like LLM output), use <DeclarationLink name="MdzStreamParser" /> with
				<DeclarationLink name="MdzStreamState" /> and <DeclarationLink name="MdzStream" />. The
				parser emits opcodes as rendering instructions - never re-parsing - and the state applies
				them as fine-grained Svelte mutations. This is an implementation of the design described by
				<a href="https://pngwn.at/">pngwn</a> in
				<a href="https://bsky.app/profile/pngwn.at/post/3mi527zntb22n">this bluesky post</a>.
			</p>
			<p>
				Try it -- each character is fed one at a time to show how constructs build incrementally:
			</p>
			<textarea bind:value={stream_content} onchange={stream_reset}></textarea>
			<div class="row gap_md mb_md">
				<button type="button" onclick={() => (stream_running ? stream_pause() : stream_start())}>
					{stream_running ? 'pause' : stream_finished ? 'restart' : 'stream'}
				</button>
				<button type="button" onclick={stream_reset} disabled={stream_pos === 0}>reset</button>
				<label class="row gap_xs">
					<input
						type="range"
						min="10"
						max="200"
						step="10"
						bind:value={stream_interval_ms}
						onchange={() => {
							if (stream_running) {
								stream_pause();
								stream_start();
							}
						}}
					/>
					{stream_interval_ms}ms
				</label>
				<small class="ml_auto">{stream_pos}/{stream_content.length}</small>
			</div>
			<div class="panel shade_05 mb_lg p_md">
				<MdzStream state={stream_state} />
			</div>
			<Code
				lang="ts"
				content={`import {MdzStreamParser} from '@fuzdev/fuz_ui/mdz_stream_parser.js';
import {MdzStreamState} from '@fuzdev/fuz_ui/mdz_stream_state.svelte.js';

const parser = new MdzStreamParser();
const state = new MdzStreamState();

// feed chunks as they arrive
parser.feed(chunk);
state.apply_batch(parser.take_opcodes());

// when done
parser.finish();
state.apply_batch(parser.take_opcodes());`}
			/>
			<Code content={`<MdzStream {state} />`} />
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
				Block elements (headings, HR, codeblocks) can interrupt paragraphs without blank lines,
				while inline formatting prefers false negatives over false positives. For example,
				<code>```</code> must have no preceding spaces or characters to start a code block.
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
</MdzRoot>
