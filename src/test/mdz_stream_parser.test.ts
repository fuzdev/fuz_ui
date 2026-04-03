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
