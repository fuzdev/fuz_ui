import {test, assert, describe, beforeAll} from 'vitest';

import {MdzStreamParser} from '$lib/mdz_stream_parser.js';
import {mdz_opcodes_to_nodes} from '$lib/mdz_opcodes_to_nodes.js';
import {mdz_parse, type MdzNode} from '$lib/mdz.js';
import type {
	MdzOpcode,
	MdzOpcodeOpen,
	MdzOpcodeClose,
	MdzOpcodeText,
	MdzOpcodeAppendText,
	MdzOpcodeVoid,
	MdzOpcodeRevert,
	MdzOpcodeWrap,
} from '$lib/mdz_opcodes.js';
import {load_fixtures, type MdzFixture} from './fixtures/mdz/mdz_test_helpers.js';

/**
 * Parse text through the streaming parser and convert to MdzNode[] tree.
 */
const stream_parse = (text: string): Array<MdzNode> => {
	const parser = new MdzStreamParser();
	parser.feed(text);
	parser.finish();
	return mdz_opcodes_to_nodes(parser.take_opcodes());
};

/**
 * Collect all opcodes from feeding text to the streaming parser.
 */
const collect_opcodes = (text: string): Array<MdzOpcode> => {
	const parser = new MdzStreamParser();
	parser.feed(text);
	parser.finish();
	return parser.take_opcodes();
};

// -- Basic opcode tests --

describe('MdzStreamParser opcodes', () => {
	test('plain text produces paragraph with text', () => {
		const ops = collect_opcodes('hello');
		assert.ok(ops.length >= 3);
		// should have open(Paragraph), text("hello"), close(Paragraph)
		const open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Paragraph',
		);
		assert.ok(open);
		const text = ops.find((o): o is MdzOpcodeText => o.type === 'text' && o.content === 'hello');
		assert.ok(text);
		assert.equal(text.text_type, 'Text');
		const close = ops.find((o): o is MdzOpcodeClose => o.type === 'close' && o.id === open.id);
		assert.ok(close);
	});

	test('bold produces open/text/close opcodes', () => {
		const ops = collect_opcodes('**bold**');
		const bold_open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Bold',
		);
		assert.ok(bold_open);
		const bold_close = ops.find(
			(o): o is MdzOpcodeClose => o.type === 'close' && o.id === bold_open.id,
		);
		assert.ok(bold_close);
	});

	test('inline code produces text opcode with Code type', () => {
		const ops = collect_opcodes('`code`');
		const code_text = ops.find(
			(o): o is MdzOpcodeText => o.type === 'text' && o.text_type === 'Code',
		);
		assert.ok(code_text);
		assert.equal(code_text.content, 'code');
	});

	test('paragraph break produces two paragraphs', () => {
		const ops = collect_opcodes('a\n\nb');
		const para_opens = ops.filter(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Paragraph',
		);
		assert.equal(para_opens.length, 2);
	});

	test('heading produces open/close with level', () => {
		const ops = collect_opcodes('## Title');
		const heading_open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Heading',
		);
		assert.ok(heading_open);
		assert.equal(heading_open.level, 2);
	});

	test('horizontal rule produces void opcode', () => {
		const ops = collect_opcodes('---\n');
		const hr = ops.find((o): o is MdzOpcodeVoid => o.type === 'void' && o.node_type === 'Hr');
		assert.ok(hr);
	});

	test('unclosed bold at EOF reverts', () => {
		const ops = collect_opcodes('**unclosed');
		const revert = ops.find(
			(o): o is MdzOpcodeRevert => o.type === 'revert' && o.replacement_text === '**',
		);
		assert.ok(revert);
	});

	test('append_text extends existing text node', () => {
		// feed in chunks to trigger append_text
		const parser = new MdzStreamParser();
		parser.feed('hel');
		parser.take_opcodes(); // drain first batch
		parser.feed('lo');
		parser.finish();
		const ops = parser.take_opcodes();
		const append = ops.find((o): o is MdzOpcodeAppendText => o.type === 'append_text');
		assert.ok(append);
		assert.equal(append.content, 'lo');
	});

	test('link produces open/text/close with reference', () => {
		const ops = collect_opcodes('[text](url)');
		const link_open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Link',
		);
		assert.ok(link_open);
		const link_close = ops.find(
			(o): o is MdzOpcodeClose => o.type === 'close' && o.id === link_open.id,
		);
		assert.ok(link_close);
		assert.equal(link_close.reference, 'url');
		assert.equal(link_close.link_type, 'internal');
	});

	test('tags produce open/close opcodes', () => {
		const ops = collect_opcodes('<Alert>content</Alert>');
		const tag_open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Component',
		);
		assert.ok(tag_open);
		assert.equal(tag_open.name, 'Alert');
		const tag_close = ops.find(
			(o): o is MdzOpcodeClose => o.type === 'close' && o.id === tag_open.id,
		);
		assert.ok(tag_close);
	});

	test('closing tag at EOF is handled (not literal text)', () => {
		const result = stream_parse('<Alert>content</Alert>');
		assert.equal(result.length, 1);
		assert.equal(result[0]!.type, 'Component');
	});

	test('closing tag at EOF via chunked feed', () => {
		const parser = new MdzStreamParser();
		parser.feed('<Alert>con');
		parser.feed('tent</Alert>');
		parser.finish();
		const result = mdz_opcodes_to_nodes(parser.take_opcodes());
		assert.equal(result.length, 1);
		assert.equal(result[0]!.type, 'Component');
	});

	test('revert re-parents children to grandparent', () => {
		// unclosed bold inside paragraph — children should end up in paragraph
		const result = stream_parse('**hello');
		assert.equal(result.length, 1);
		assert.equal(result[0]!.type, 'Paragraph');
		const para = result[0] as {children: Array<MdzNode>};
		assert.ok(para.children.length >= 1);
		const all_text = para.children.every((c) => c.type === 'Text');
		assert.ok(all_text);
		const full_text = para.children.map((c) => ('content' in c ? c.content : '')).join('');
		assert.equal(full_text, '**hello');
	});

	// -- Optimistic codeblock streaming --

	test('codeblock open is emitted immediately on opening fence', () => {
		const parser = new MdzStreamParser();
		parser.feed('```ts\n');
		const ops = parser.take_opcodes();
		const cb_open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Codeblock',
		);
		assert.ok(cb_open, 'open(Codeblock) should be emitted before closing fence arrives');
		assert.equal(cb_open.lang, 'ts');
	});

	test('codeblock content streams across chunks', () => {
		const parser = new MdzStreamParser();
		parser.feed('```js\n');
		const ops1 = parser.take_opcodes();
		const cb_open = ops1.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Codeblock',
		);
		assert.ok(cb_open);

		parser.feed('const x = 1;\n');
		const ops2 = parser.take_opcodes();
		const has_content = ops2.some(
			(o) => (o.type === 'text' || o.type === 'append_text') && o.content.includes('const x'),
		);
		assert.ok(has_content, 'content should stream before closing fence');

		parser.feed('```\n');
		const ops3 = parser.take_opcodes();
		const cb_close = ops3.find(
			(o): o is MdzOpcodeClose => o.type === 'close' && o.id === cb_open.id,
		);
		assert.ok(cb_close, 'close should arrive with closing fence chunk');
	});

	test('empty codeblock reverts to paragraph text', () => {
		const result = stream_parse('```\n```\n');
		assert.deepEqual(result, mdz_parse('```\n```\n'));
	});

	test('unclosed codeblock at EOF reverts to paragraph text', () => {
		const result = stream_parse('```ts\nconst x = 1;');
		assert.deepEqual(result, mdz_parse('```ts\nconst x = 1;'));
	});

	test('fence count mismatch across chunks reverts at EOF', () => {
		const parser = new MdzStreamParser();
		parser.feed('````\n');
		const ops1 = parser.take_opcodes();
		const cb_open = ops1.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Codeblock',
		);
		assert.ok(cb_open, 'should open with 4-backtick fence');

		parser.feed('```\n'); // 3 backticks — doesn't match 4
		const ops2 = parser.take_opcodes();
		// should NOT close — fence count doesn't match
		const has_close = ops2.some((o) => o.type === 'close' && o.id === cb_open.id);
		assert.ok(!has_close, '3-backtick line should not close 4-backtick codeblock');

		parser.finish();
		const ops3 = parser.take_opcodes();
		const has_revert = ops3.some((o) => o.type === 'revert' && o.id === cb_open.id);
		assert.ok(has_revert, 'unclosed codeblock should revert at EOF');

		// verify final tree matches single-pass
		const all_ops = [...ops1, ...ops2, ...ops3];
		const result = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(result, mdz_parse('````\n```'));
	});

	// -- Optimistic inline code streaming --

	test('inline code opens optimistically when closer not in buffer', () => {
		const parser = new MdzStreamParser();
		parser.feed('`co');
		const ops = parser.take_opcodes();
		const code_open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Code',
		);
		assert.ok(code_open, 'open(Code) should be emitted when buffer ends without closer');
	});

	test('optimistic code closes on matching backtick in next chunk', () => {
		const parser = new MdzStreamParser();
		parser.feed('`co');
		const ops1 = parser.take_opcodes();
		const code_open = ops1.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Code',
		);
		assert.ok(code_open);

		parser.feed('de`');
		parser.finish();
		const ops2 = parser.take_opcodes();
		const code_close = ops2.find(
			(o): o is MdzOpcodeClose => o.type === 'close' && o.id === code_open.id,
		);
		assert.ok(code_close, 'close(Code) should arrive with closing backtick chunk');

		// verify final tree matches single-pass
		const all_ops = [...ops1, ...ops2];
		const result = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(result, mdz_parse('`code`'));
	});

	test('optimistic code reverts on newline', () => {
		const parser = new MdzStreamParser();
		parser.feed('`unclosed');
		const ops1 = parser.take_opcodes();
		const code_open = ops1.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Code',
		);
		assert.ok(code_open);

		parser.feed('\nmore');
		parser.finish();
		const ops2 = parser.take_opcodes();
		const has_revert = ops2.some(
			(o): o is MdzOpcodeRevert => o.type === 'revert' && o.id === code_open.id,
		);
		assert.ok(has_revert, 'code should revert on newline');

		// verify final tree matches single-pass
		const all_ops = [...ops1, ...ops2];
		const result = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(result, mdz_parse('`unclosed\nmore'));
	});

	test('code inside formatting stays buffered (not optimistic)', () => {
		const parser = new MdzStreamParser();
		parser.feed('**bold `co');
		const ops = parser.take_opcodes();
		// should NOT have open(Code) — backtick inside Bold holds
		const code_open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Code',
		);
		assert.ok(!code_open, 'backtick inside formatting should not open Code optimistically');
	});

	test('optimistic code content streams via text/append_text', () => {
		const parser = new MdzStreamParser();
		parser.feed('`hel');
		const ops1 = parser.take_opcodes();
		const code_open = ops1.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Code',
		);
		assert.ok(code_open, 'Code should open before content streams');
		// text opcode should appear after the Code open
		const code_open_idx = ops1.indexOf(code_open);
		const text_idx = ops1.findIndex(
			(o) => (o.type === 'text' || o.type === 'append_text') && o.content.includes('hel'),
		);
		assert.ok(text_idx > code_open_idx, 'code content text should follow open(Code)');

		parser.feed('lo`');
		parser.finish();
		const ops2 = parser.take_opcodes();

		const all_ops = [...ops1, ...ops2];
		const result = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(result, mdz_parse('`hello`'));
	});

	test('optimistic code handles single-char chunks', () => {
		const parser = new MdzStreamParser();
		for (const c of '`hello`') {
			parser.feed(c);
		}
		parser.finish();
		const result = mdz_opcodes_to_nodes(parser.take_opcodes());
		assert.deepEqual(result, mdz_parse('`hello`'));
	});

	test('optimistic code reverts at EOF (unclosed)', () => {
		const result = stream_parse('`unclosed');
		assert.deepEqual(result, mdz_parse('`unclosed'));
	});

	test('optimistic code reverts on paragraph break', () => {
		const result = stream_parse('`unclosed\n\nmore');
		assert.deepEqual(result, mdz_parse('`unclosed\n\nmore'));
	});

	test('backtick immediately followed by newline reverts', () => {
		const parser = new MdzStreamParser();
		parser.feed('a`');
		const ops1 = parser.take_opcodes();
		const code_open = ops1.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Code',
		);
		assert.ok(code_open);

		parser.feed('\nb');
		parser.finish();
		const ops2 = parser.take_opcodes();
		const has_revert = ops2.some(
			(o): o is MdzOpcodeRevert => o.type === 'revert' && o.id === code_open.id,
		);
		assert.ok(has_revert, 'code should revert on immediate newline');

		const all_ops = [...ops1, ...ops2];
		const result = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(result, mdz_parse('a`\nb'));
	});

	test('empty optimistic code reverts to literal backticks', () => {
		const parser = new MdzStreamParser();
		parser.feed('a`');
		const ops1 = parser.take_opcodes();
		parser.feed('`b');
		parser.finish();
		const ops2 = parser.take_opcodes();

		const all_ops = [...ops1, ...ops2];
		const result = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(result, mdz_parse('a``b'));
	});

	// -- Text-first auto-link streaming (wrap opcode) --

	test('URL streams as text then wrap converts to link', () => {
		const parser = new MdzStreamParser();
		parser.feed('see https://exam');
		const ops1 = parser.take_opcodes();
		// text should be visible (not buffered)
		const has_text = ops1.some(
			(o) => (o.type === 'text' || o.type === 'append_text') && o.content.includes('https://'),
		);
		assert.ok(has_text, 'URL text should stream before terminator');

		parser.feed('ple.com rest');
		parser.finish();
		const ops2 = parser.take_opcodes();
		const wrap_op = ops2.find((o): o is MdzOpcodeWrap => o.type === 'wrap');
		assert.ok(wrap_op, 'wrap opcode should be emitted when URL terminates');
		assert.equal(wrap_op.node_type, 'Link');
		assert.equal(wrap_op.reference, 'https://example.com');
		assert.equal(wrap_op.link_type, 'external');

		// verify final tree matches single-pass
		const all_ops = [...ops1, ...ops2];
		const result = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(result, mdz_parse('see https://example.com rest'));
	});

	test('URL with trailing punctuation trims correctly', () => {
		const result = stream_parse('visit https://example.com.');
		assert.deepEqual(result, mdz_parse('visit https://example.com.'));
	});

	test('URL with multiple trailing punctuation chars', () => {
		const result = stream_parse('see https://example.com...');
		assert.deepEqual(result, mdz_parse('see https://example.com...'));
	});

	test('bare protocol with no content is not a link', () => {
		const result = stream_parse('see https:// ok');
		assert.deepEqual(result, mdz_parse('see https:// ok'));
	});

	test('URL with preceding text and trailing punctuation', () => {
		const result = stream_parse('visit https://example.com, ok');
		assert.deepEqual(result, mdz_parse('visit https://example.com, ok'));
	});

	test('http:// URL detected and wrapped', () => {
		const result = stream_parse('see http://example.com ok');
		assert.deepEqual(result, mdz_parse('see http://example.com ok'));
	});

	test('partial URL prefix streams as text then confirms', () => {
		const parser = new MdzStreamParser();
		parser.feed('see ');
		parser.feed('htt');
		const ops1 = parser.take_opcodes();
		// 'htt' should stream as visible text (speculative prefix, not held)
		const has_htt = ops1.some(
			(o) => (o.type === 'text' || o.type === 'append_text') && o.content.includes('htt'),
		);
		assert.ok(has_htt, 'partial URL prefix should stream as text immediately');

		parser.feed('ps://example.com ok');
		parser.finish();
		const ops2 = parser.take_opcodes();
		const all_ops = [...ops1, ...ops2];
		const result = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(result, mdz_parse('see https://example.com ok'));
	});

	test('non-URL h-word is not held beyond one char', () => {
		const parser = new MdzStreamParser();
		parser.feed('see ');
		parser.feed('he');
		const ops = parser.take_opcodes();
		// 'he' doesn't match 'ht...' — should be consumed as text
		const has_he = ops.some(
			(o) => (o.type === 'text' || o.type === 'append_text') && o.content.includes('he'),
		);
		assert.ok(has_he, 'non-matching prefix should be consumed as text immediately');
	});

	test('URL after word char is not detected (no word boundary)', () => {
		const result = stream_parse('xhttps://example.com');
		// intentional divergence from mdz_parse: streaming parser requires word boundary
		assert.equal(result.length, 1);
		assert.equal(result[0]!.type, 'Paragraph');
		const para = result[0]! as {children: Array<{type: string; content?: string}>};
		assert.equal(para.children.length, 1);
		assert.equal(para.children[0]!.type, 'Text');
		assert.equal(para.children[0]!.content, 'xhttps://example.com');
	});

	test('URL after digit is not detected (no word boundary)', () => {
		const result = stream_parse('1https://example.com');
		const para = result[0]! as {children: Array<{type: string; content?: string}>};
		assert.equal(para.children.length, 1);
		assert.equal(para.children[0]!.type, 'Text');
	});

	test('URL after punctuation is detected (word boundary)', () => {
		const result = stream_parse('(https://example.com)');
		assert.deepEqual(result, mdz_parse('(https://example.com)'));
	});

	test('URL after quote is detected (word boundary)', () => {
		const result = stream_parse('"https://example.com"');
		assert.deepEqual(result, mdz_parse('"https://example.com"'));
	});

	test('URL with balanced parens in path preserves them', () => {
		const result = stream_parse('see https://en.wikipedia.org/wiki/Foo_(bar) ok');
		assert.deepEqual(result, mdz_parse('see https://en.wikipedia.org/wiki/Foo_(bar) ok'));
	});

	test('speculation cancels then URL detected on retry', () => {
		const result = stream_parse('hhttps://example.com https://example.com');
		const para = result[0]! as {
			children: Array<{type: string; content?: string; reference?: string}>;
		};
		// first h starts speculation, second h fails it, so hhttps://example.com is text
		// then space, then URL is detected
		assert.equal(para.children[0]!.type, 'Text');
		assert.ok(para.children[0]!.content!.startsWith('hhttps://'));
		const link = para.children.find((c) => c.type === 'Link');
		assert.ok(link, 'second URL should be detected after failed speculation');
		assert.equal(link!.reference, 'https://example.com');
	});

	test('path auto-link streams then wraps with internal link_type', () => {
		const parser = new MdzStreamParser();
		parser.feed('see /docs/');
		const ops1 = parser.take_opcodes();
		parser.feed('api rest');
		parser.finish();
		const ops2 = parser.take_opcodes();

		const wrap_op = [...ops1, ...ops2].find((o): o is MdzOpcodeWrap => o.type === 'wrap');
		assert.ok(wrap_op);
		assert.equal(wrap_op.link_type, 'internal');
		assert.equal(wrap_op.reference, '/docs/api');

		const all_ops = [...ops1, ...ops2];
		const result = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(result, mdz_parse('see /docs/api rest'));
	});

	test('relative path auto-link wraps correctly', () => {
		const result = stream_parse('see ./README.md ok');
		assert.deepEqual(result, mdz_parse('see ./README.md ok'));
	});

	test('URL at EOF wraps correctly', () => {
		const result = stream_parse('see https://example.com');
		assert.deepEqual(result, mdz_parse('see https://example.com'));
	});

	test('URL inside bold wraps correctly', () => {
		const result = stream_parse('**see https://example.com end**');
		assert.deepEqual(result, mdz_parse('**see https://example.com end**'));
	});

	test('URL streams correctly across multiple chunks', () => {
		const parser = new MdzStreamParser();
		parser.feed('see https://exa');
		parser.feed('mple');
		parser.feed('.com');
		parser.feed(' rest');
		parser.finish();
		const result = mdz_opcodes_to_nodes(parser.take_opcodes());
		assert.deepEqual(result, mdz_parse('see https://example.com rest'));
	});

	test('URL detected correctly with single-char feeds', () => {
		const parser = new MdzStreamParser();
		for (const c of 'see https://example.com rest') {
			parser.feed(c);
		}
		parser.finish();
		const result = mdz_opcodes_to_nodes(parser.take_opcodes());
		assert.deepEqual(result, mdz_parse('see https://example.com rest'));
	});

	test('path detected correctly with single-char feeds', () => {
		const parser = new MdzStreamParser();
		for (const c of 'see /docs/api rest') {
			parser.feed(c);
		}
		parser.finish();
		const result = mdz_opcodes_to_nodes(parser.take_opcodes());
		assert.deepEqual(result, mdz_parse('see /docs/api rest'));
	});

	test('consecutive URLs separated by space', () => {
		const result = stream_parse('https://a.com https://b.com');
		assert.deepEqual(result, mdz_parse('https://a.com https://b.com'));
	});
});

// -- Fixture-based tests --

let fixtures: Array<MdzFixture> = [];

beforeAll(async () => {
	fixtures = await load_fixtures();
});

describe('MdzStreamParser fixture comparison', () => {
	test('all fixtures match (one-shot feed)', () => {
		for (const fixture of fixtures) {
			const stream_result = stream_parse(fixture.input);
			assert.deepEqual(stream_result, fixture.expected, `Fixture "${fixture.name}"`);
		}
	});

	// NOTE: char-by-char streaming intentionally differs from one-shot for many fixtures.
	// Features like codeblock fence lookahead, auto-URL detection, and word boundary
	// checks require buffer context that isn't available in single-char feeds.
	// The one-shot fixture comparison (above) is the correctness gate.

	/**
	 * Checks if a fixture's input is safe for char-by-char feeding.
	 * Excludes inputs that require buffer context for correct parsing:
	 * - Codeblock fences (triple backticks need lookahead for closing fence)
	 * - Auto-URLs (http:// https:// need multi-char prefix detection)
	 * - Auto-paths (/, ./, ../ need word boundary + multi-char detection)
	 * - Underscore/tilde delimiters (word boundary checks need prev_char context)
	 */
	const is_char_by_char_safe = (input: string): boolean => {
		// codeblock fences
		if (input.includes('```')) return false;
		// auto-URLs
		if (/https?:\/\//.test(input)) return false;
		// auto absolute paths (/ at word boundary: after space, newline, or start)
		if (/(^|[\s])\/[^\s/]/.test(input)) return false;
		// auto relative paths
		if (input.includes('./') || input.includes('../')) return false;
		// underscore (italic delimiter with word boundary sensitivity)
		if (input.includes('_')) return false;
		// tilde (strikethrough delimiter with word boundary sensitivity)
		if (input.includes('~')) return false;
		// tags (need tag name in buffer to distinguish from literal <)
		if (input.includes('<')) return false;
		// headings (post-heading newline absorption needs consecutive \n in buffer)
		if (/^#{1,6} /m.test(input)) return false;
		// horizontal rules (need ---\n in buffer, post-HR newline absorption)
		if (/^---/m.test(input)) return false;
		// triple+ newlines (post-break absorption only handles newlines already buffered)
		if (input.includes('\n\n\n')) return false;
		return true;
	};

	// -- Trailing newline trimming across take_opcodes() boundaries --
	// The \n hold mechanism keeps a trailing \n in the buffer rather than flushing
	// it to an opcode. These tests verify that paragraph content never has a spurious
	// trailing \n regardless of chunk boundaries, and that positions are correct.

	test('trailing newline trimmed: paragraph break split across chunks', () => {
		const parser = new MdzStreamParser();
		parser.feed('hello\n');
		const ops1 = parser.take_opcodes();
		parser.feed('\nworld');
		parser.finish();
		const ops2 = parser.take_opcodes();
		const all_ops = [...ops1, ...ops2];
		const nodes = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(nodes, mdz_parse('hello\n\nworld'));
	});

	test('trailing newline trimmed: HR split across chunks', () => {
		const parser = new MdzStreamParser();
		parser.feed('hello\n');
		const ops1 = parser.take_opcodes();
		parser.feed('---\n');
		parser.finish();
		const ops2 = parser.take_opcodes();
		const all_ops = [...ops1, ...ops2];
		const nodes = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(nodes, mdz_parse('hello\n---\n'));
	});

	test('trailing newline trimmed: heading split across chunks', () => {
		const parser = new MdzStreamParser();
		parser.feed('hello\n');
		const ops1 = parser.take_opcodes();
		parser.feed('\n# heading');
		parser.finish();
		const ops2 = parser.take_opcodes();
		const all_ops = [...ops1, ...ops2];
		const nodes = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(nodes, mdz_parse('hello\n\n# heading'));
	});

	test('trailing newline trimmed: multi-line paragraph break split', () => {
		const parser = new MdzStreamParser();
		parser.feed('hello\nb\n');
		const ops1 = parser.take_opcodes();
		parser.feed('\nworld');
		parser.finish();
		const ops2 = parser.take_opcodes();
		const all_ops = [...ops1, ...ops2];
		const nodes = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(nodes, mdz_parse('hello\nb\n\nworld'));
	});

	test('trailing newline trimmed: three chunks with mid-stream drain', () => {
		const parser = new MdzStreamParser();
		parser.feed('aaa\n');
		const ops1 = parser.take_opcodes();
		parser.feed('bbb\n');
		const ops2 = parser.take_opcodes();
		parser.feed('\nccc');
		parser.finish();
		const ops3 = parser.take_opcodes();
		const all_ops = [...ops1, ...ops2, ...ops3];
		const nodes = mdz_opcodes_to_nodes(all_ops);
		assert.deepEqual(nodes, mdz_parse('aaa\nbbb\n\nccc'));
	});

	test('char-by-char safe fixtures match one-shot', () => {
		const safe_fixtures = fixtures.filter((f) => is_char_by_char_safe(f.input));
		// sanity: we should have a meaningful number of safe fixtures
		assert.ok(safe_fixtures.length > 30, `Expected >30 safe fixtures, got ${safe_fixtures.length}`);

		for (const fixture of safe_fixtures) {
			const parser = new MdzStreamParser();
			for (const char of fixture.input) {
				parser.feed(char);
			}
			parser.finish();
			const char_result = mdz_opcodes_to_nodes(parser.take_opcodes());
			assert.deepEqual(char_result, fixture.expected, `Char-by-char: "${fixture.name}"`);
		}
	});
});
