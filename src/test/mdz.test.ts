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

// -- All three parsers compared with full positions --

const all_parsers = [
	{name: 'single-pass', parse: mdz_parse},
	{name: 'lexer-based', parse: mdz_parse_lexer},
	{name: 'streaming', parse: stream_parse},
];

for (const {name, parse} of all_parsers) {
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

describe('mdz parsers agree', () => {
	test('all three parsers produce identical output on all fixtures', () => {
		for (const fixture of fixtures) {
			const single_pass = mdz_parse(fixture.input);
			const lexer = mdz_parse_lexer(fixture.input);
			const streaming = stream_parse(fixture.input);
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
