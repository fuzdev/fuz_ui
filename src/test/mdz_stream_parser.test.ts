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
