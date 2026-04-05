import {test, assert, describe, beforeAll} from 'vitest';

import {mdz_parse} from '$lib/mdz.js';
import {mdz_parse_lexer} from '$lib/mdz_token_parser.js';
import {
	load_fixtures,
	validate_positions,
	type MdzFixture,
} from './fixtures/mdz/mdz_test_helpers.js';

let fixtures: Array<MdzFixture> = [];

beforeAll(async () => {
	fixtures = await load_fixtures();
});

const parsers = [
	{name: 'single-pass', parse: mdz_parse},
	{name: 'lexer-based', parse: mdz_parse_lexer},
];

for (const {name, parse} of parsers) {
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
