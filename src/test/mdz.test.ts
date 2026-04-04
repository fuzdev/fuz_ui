import {test, assert, describe, beforeAll} from 'vitest';

import {mdz_parse, type MdzNode} from '$lib/mdz.js';
import {mdz_parse_lexer} from '$lib/mdz_token_parser.js';
import {MdzStreamParser} from '$lib/mdz_stream_parser.js';
import {mdz_opcodes_to_nodes} from '$lib/mdz_opcodes_to_nodes.js';
import {
	load_fixtures,
	validate_positions,
	type MdzFixture,
} from './fixtures/mdz/mdz_test_helpers.js';

/**
 * Strip position info from MdzNode trees for structural comparison.
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

const stream_parse = (text: string): Array<MdzNode> => {
	const parser = new MdzStreamParser();
	parser.feed(text);
	parser.finish();
	return mdz_opcodes_to_nodes(parser.take_opcodes());
};

let fixtures: Array<MdzFixture> = [];

beforeAll(async () => {
	fixtures = await load_fixtures();
});

// -- Parsers that produce positioned trees (compared with positions) --

const positioned_parsers = [
	{name: 'single-pass', parse: mdz_parse},
	{name: 'lexer-based', parse: mdz_parse_lexer},
];

for (const {name, parse} of positioned_parsers) {
	describe(`mdz parser (${name})`, () => {
		test('all fixtures parse correctly', () => {
			for (const fixture of fixtures) {
				const result = parse(fixture.input);
				assert.deepEqual(result, fixture.expected, `Fixture "${fixture.name}" failed`);
			}
		});

		test('all fixtures have valid positions', () => {
			for (const fixture of fixtures) {
				const result = parse(fixture.input);
				validate_positions(result);
			}
		});
	});
}

// -- Streaming parser (compared structurally, without positions) --

describe('mdz parser (streaming)', () => {
	test('all fixtures parse correctly (structural)', () => {
		for (const fixture of fixtures) {
			const result = strip_positions(stream_parse(fixture.input));
			const expected = strip_positions(fixture.expected);
			assert.deepEqual(result, expected, `Fixture "${fixture.name}" failed`);
		}
	});

	test('all three parsers agree on all fixtures', () => {
		for (const fixture of fixtures) {
			const single_pass = strip_positions(mdz_parse(fixture.input));
			const lexer = strip_positions(mdz_parse_lexer(fixture.input));
			const streaming = strip_positions(stream_parse(fixture.input));
			assert.deepEqual(
				lexer,
				single_pass,
				`Fixture "${fixture.name}": lexer differs from single-pass`,
			);
			assert.deepEqual(
				streaming,
				single_pass,
				`Fixture "${fixture.name}": streaming differs from single-pass`,
			);
		}
	});
});
