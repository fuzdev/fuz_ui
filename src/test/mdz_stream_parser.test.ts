import {test, assert, describe, beforeAll} from 'vitest';

import {MdzStreamParser} from '$lib/mdz_stream_parser.js';
import {mdz_opcodes_to_nodes} from '$lib/mdz_opcodes_to_nodes.js';
import type {MdzNode} from '$lib/mdz.js';
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

/**
 * Strip position info from MdzNode trees for structural comparison.
 * The streaming parser doesn't track source positions.
 */
const strip_positions = (nodes: Array<MdzNode>): Array<unknown> =>
	nodes.map((node) => {
		const stripped: Record<string, unknown> = {type: node.type};
		if ('content' in node) stripped.content = node.content;
		if ('children' in node) stripped.children = strip_positions(node.children);
		if ('level' in node) stripped.level = node.level;
		if ('id' in node) stripped.id = node.id;
		if ('reference' in node) stripped.reference = node.reference;
		if ('link_type' in node) stripped.link_type = node.link_type;
		if ('lang' in node) stripped.lang = node.lang;
		if ('name' in node) stripped.name = node.name;
		return stripped;
	});

// -- Basic opcode tests --

describe('MdzStreamParser opcodes', () => {
	test('plain text produces paragraph with text', () => {
		const ops = collect_opcodes('hello');
		assert.ok(ops.length >= 3);
		const open_op = ops.find((o): o is MdzOpcodeOpen => o.type === 'open');
		assert.ok(open_op);
		assert.equal(open_op.node_type, 'Paragraph');
		const text_op = ops.find((o): o is MdzOpcodeText => o.type === 'text');
		assert.ok(text_op);
		assert.equal(text_op.content, 'hello');
		assert.equal(text_op.text_type, 'Text');
	});

	test('bold produces open/close pair', () => {
		const ops = collect_opcodes('**bold**');
		const bold_opens = ops.filter((o) => o.type === 'open' && o.node_type === 'Bold');
		assert.equal(bold_opens.length, 1);
	});

	test('unclosed bold produces revert', () => {
		const ops = collect_opcodes('**unclosed');
		assert.ok(ops.some((o) => o.type === 'revert'));
	});

	test('append_text across chunks', () => {
		const parser = new MdzStreamParser();
		parser.feed('hel');
		const ops1 = parser.take_opcodes();
		parser.feed('lo');
		const ops2 = parser.take_opcodes();
		parser.finish();
		parser.take_opcodes();

		const text_op = ops1.find((o): o is MdzOpcodeText => o.type === 'text');
		assert.ok(text_op);
		assert.equal(text_op.content, 'hel');

		const append_op = ops2.find((o): o is MdzOpcodeAppendText => o.type === 'append_text');
		assert.ok(append_op);
		assert.equal(append_op.content, 'lo');
	});

	test('heading produces heading node', () => {
		const ops = collect_opcodes('## Title');
		const heading_open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Heading',
		);
		assert.ok(heading_open);
		assert.equal(heading_open.level, 2);
	});

	test('heading close carries heading_id', () => {
		const ops = collect_opcodes('## My Heading');
		const heading_open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Heading',
		);
		assert.ok(heading_open);
		const heading_close = ops.find(
			(o): o is MdzOpcodeClose => o.type === 'close' && o.id === heading_open.id,
		);
		assert.ok(heading_close);
		assert.equal(heading_close.heading_id, 'my-heading');
	});

	test('heading ID with inline formatting uses text content only', () => {
		const ops = collect_opcodes('# **Bold** and _italic_');
		const heading_open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Heading',
		);
		assert.ok(heading_open);
		const heading_close = ops.find(
			(o): o is MdzOpcodeClose => o.type === 'close' && o.id === heading_open.id,
		);
		assert.ok(heading_close);
		assert.equal(heading_close.heading_id, 'bold-and-italic');
	});

	test('hr produces void node', () => {
		const ops = collect_opcodes('---\n');
		const hr = ops.find((o): o is MdzOpcodeVoid => o.type === 'void');
		assert.ok(hr);
	});

	test('bold spanning paragraph break produces revert', () => {
		const ops = collect_opcodes('**bold\n\ntext');
		const bold_open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Bold',
		);
		assert.ok(bold_open);
		const revert = ops.find(
			(o): o is MdzOpcodeRevert => o.type === 'revert' && o.id === bold_open.id,
		);
		assert.ok(revert);
		assert.equal(revert.replacement_text, '**');
	});

	test('link close carries reference and link_type', () => {
		const ops = collect_opcodes('[click](https://example.com)');
		const link_open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Link',
		);
		assert.ok(link_open);
		const link_close = ops.find(
			(o): o is MdzOpcodeClose => o.type === 'close' && o.id === link_open.id,
		);
		assert.ok(link_close);
		assert.equal(link_close.reference, 'https://example.com');
		assert.equal(link_close.link_type, 'external');
	});

	test('codeblock content emits text opcodes', () => {
		const ops = collect_opcodes('```js\nconst x = 1;\n```\n');
		const cb_open = ops.find(
			(o): o is MdzOpcodeOpen => o.type === 'open' && o.node_type === 'Codeblock',
		);
		assert.ok(cb_open);
		assert.equal(cb_open.lang, 'js');
		const text_op = ops.find(
			(o): o is MdzOpcodeText => o.type === 'text' && o.content === 'const x = 1;',
		);
		assert.ok(text_op);
		const cb_close = ops.find(
			(o): o is MdzOpcodeClose => o.type === 'close' && o.id === cb_open.id,
		);
		assert.ok(cb_close);
	});

	test('multi-chunk bold open/content/close', () => {
		const parser = new MdzStreamParser();
		parser.feed('**he');
		const ops1 = parser.take_opcodes();
		parser.feed('llo**');
		const ops2 = parser.take_opcodes();
		parser.finish();
		parser.take_opcodes();

		const bold_open = ops1.find((o) => o.type === 'open' && o.node_type === 'Bold');
		assert.ok(bold_open, 'bold should open in first chunk');
		const bold_close = ops2.find((o) => o.type === 'close' && o.id === bold_open.id);
		assert.ok(bold_close, 'bold should close in second chunk');
	});

	test('multi-chunk bold with take_opcodes between does not false-revert', () => {
		const parser = new MdzStreamParser();
		parser.feed('**a');
		const ops1 = parser.take_opcodes();
		// opcodes drained — opcode array is now empty
		parser.feed('**');
		const ops2 = parser.take_opcodes();
		parser.finish();
		parser.take_opcodes();

		const bold_open = ops1.find((o) => o.type === 'open' && o.node_type === 'Bold');
		assert.ok(bold_open);
		// should close, not revert — the bold has content "a"
		const bold_close = ops2.find((o) => o.type === 'close' && o.id === bold_open.id);
		assert.ok(bold_close, 'bold with content should close, not revert after take_opcodes');
		const revert = ops2.find((o) => o.type === 'revert' && o.id === bold_open.id);
		assert.ok(!revert, 'bold with content should not be reverted');
	});

	test('tag open and close produce correct opcodes', () => {
		const ops = collect_opcodes('<Alert>warning</Alert>');
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
		// </Tag> at exact buffer end should still close the tag, not become literal
		// When a single tag is the only child, extract_single_tag unwraps it from the paragraph
		const result = strip_positions(stream_parse('<Alert>content</Alert>'));
		assert.equal(result.length, 1);
		assert.equal((result[0] as Record<string, unknown>).type, 'Component');
	});

	test('closing tag at EOF via chunked feed', () => {
		// feed </Alert> as the final chunk — exercises forced close tag handling
		const parser = new MdzStreamParser();
		parser.feed('<Alert>con');
		parser.feed('tent</Alert>');
		parser.finish();
		const result = strip_positions(mdz_opcodes_to_nodes(parser.take_opcodes()));
		assert.equal(result.length, 1);
		assert.equal((result[0] as Record<string, unknown>).type, 'Component');
	});

	test('revert re-parents children to grandparent', () => {
		// unclosed bold inside paragraph — children should end up in paragraph
		const result = strip_positions(stream_parse('**hello'));
		// should produce Paragraph with text "**hello" (reverted bold + re-parented text)
		assert.equal(result.length, 1);
		const para = result[0] as Record<string, unknown>;
		assert.equal(para.type, 'Paragraph');
		const children = para.children as Array<Record<string, unknown>>;
		assert.ok(children.length >= 1);
		// all content should be text
		const all_text = children.every((c) => c.type === 'Text');
		assert.ok(all_text);
		const full_text = children.map((c) => c.content).join('');
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
		const result = strip_positions(stream_parse('```\n```\n'));
		assert.equal(result.length, 1);
		const para = result[0] as Record<string, unknown>;
		assert.equal(para.type, 'Paragraph');
		const children = para.children as Array<Record<string, unknown>>;
		const text = children.map((c) => c.content).join('');
		assert.equal(text, '```\n```');
	});

	test('unclosed codeblock at EOF reverts to paragraph text', () => {
		const result = strip_positions(stream_parse('```ts\nconst x = 1;'));
		assert.equal(result.length, 1);
		const para = result[0] as Record<string, unknown>;
		assert.equal(para.type, 'Paragraph');
		const children = para.children as Array<Record<string, unknown>>;
		const text = children.map((c) => c.content).join('');
		assert.equal(text, '```ts\nconst x = 1;');
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

		// verify final tree
		const all_ops = [...ops1, ...ops2, ...ops3];
		const result = strip_positions(mdz_opcodes_to_nodes(all_ops));
		assert.equal(result.length, 1);
		const para = result[0] as Record<string, unknown>;
		assert.equal(para.type, 'Paragraph');
		const children = para.children as Array<Record<string, unknown>>;
		const text = children.map((c) => c.content).join('');
		assert.equal(text, '````\n```');
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
			const stream_result = strip_positions(stream_parse(fixture.input));
			const expected = strip_positions(fixture.expected);
			assert.deepEqual(stream_result, expected, `Fixture "${fixture.name}"`);
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
			const char_result = strip_positions(mdz_opcodes_to_nodes(parser.take_opcodes()));
			const expected = strip_positions(fixture.expected);
			assert.deepEqual(char_result, expected, `Char-by-char: "${fixture.name}"`);
		}
	});
});
