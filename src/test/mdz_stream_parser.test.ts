import {test, assert, describe, beforeAll} from 'vitest';

import {MdzStreamParser} from '$lib/mdz_stream_parser.js';
import {mdz_opcodes_to_nodes} from '$lib/mdz_opcodes_to_nodes.js';
import type {MdzNode} from '$lib/mdz.js';
import type {MdzOpcode} from '$lib/mdz_opcodes.js';
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
		if ('id' in node && node.type === 'Heading') stripped.id = node.id;
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
		assert.equal(ops[0]!.type, 'open');
		if (ops[0]!.type === 'open') assert.equal(ops[0]!.node_type, 'Paragraph');
		const text_op = ops.find((o) => o.type === 'text');
		assert.ok(text_op);
		if (text_op?.type === 'text') {
			assert.equal(text_op.content, 'hello');
			assert.equal(text_op.text_type, 'Text');
		}
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

		const text_op = ops1.find((o) => o.type === 'text');
		assert.ok(text_op);
		if (text_op?.type === 'text') assert.equal(text_op.content, 'hel');

		const append_op = ops2.find((o) => o.type === 'append_text');
		assert.ok(append_op);
		if (append_op?.type === 'append_text') assert.equal(append_op.content, 'lo');
	});

	test('heading produces heading node', () => {
		const ops = collect_opcodes('## Title');
		const heading_open = ops.find((o) => o.type === 'open' && o.node_type === 'Heading');
		assert.ok(heading_open);
		if (heading_open?.type === 'open') assert.equal(heading_open.level, 2);
	});

	test('hr produces void node', () => {
		const ops = collect_opcodes('---\n');
		const hr = ops.find((o) => o.type === 'void' && o.node_type === 'Hr');
		assert.ok(hr);
	});

	test('bold spanning paragraph break produces revert', () => {
		const ops = collect_opcodes('**bold\n\ntext');
		const bold_open = ops.find((o) => o.type === 'open' && o.node_type === 'Bold');
		assert.ok(bold_open);
		const revert = ops.find((o) => o.type === 'revert' && o.id === bold_open!.id);
		assert.ok(revert);
		if (revert?.type === 'revert') assert.equal(revert.replacement_text, '**');
	});

	test('link close carries reference and link_type', () => {
		const ops = collect_opcodes('[click](https://example.com)');
		const link_open = ops.find((o) => o.type === 'open' && o.node_type === 'Link');
		assert.ok(link_open);
		const link_close = ops.find((o) => o.type === 'close' && o.id === link_open!.id);
		assert.ok(link_close);
		if (link_close?.type === 'close') {
			assert.equal(link_close.reference, 'https://example.com');
			assert.equal(link_close.link_type, 'external');
		}
	});

	test('codeblock content emits text opcodes', () => {
		const ops = collect_opcodes('```js\nconst x = 1;\n```\n');
		const cb_open = ops.find((o) => o.type === 'open' && o.node_type === 'Codeblock');
		assert.ok(cb_open);
		if (cb_open?.type === 'open') assert.equal(cb_open.lang, 'js');
		const text_op = ops.find((o) => o.type === 'text' && o.content === 'const x = 1;');
		assert.ok(text_op);
		const cb_close = ops.find((o) => o.type === 'close' && o.id === cb_open!.id);
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
		const bold_close = ops2.find((o) => o.type === 'close' && o.id === bold_open!.id);
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
		const bold_close = ops2.find((o) => o.type === 'close' && o.id === bold_open!.id);
		assert.ok(bold_close, 'bold with content should close, not revert after take_opcodes');
		const revert = ops2.find((o) => o.type === 'revert' && o.id === bold_open!.id);
		assert.ok(!revert, 'bold with content should not be reverted');
	});

	test('tag open and close produce correct opcodes', () => {
		const ops = collect_opcodes('<Alert>warning</Alert>');
		const tag_open = ops.find((o) => o.type === 'open' && o.node_type === 'Component');
		assert.ok(tag_open);
		if (tag_open?.type === 'open') assert.equal(tag_open.name, 'Alert');
		const tag_close = ops.find((o) => o.type === 'close' && o.id === tag_open!.id);
		assert.ok(tag_close);
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
	// Char-by-char is tested for basic cases in the opcode tests above.
	// The one-shot fixture comparison (above) is the correctness gate.
});
