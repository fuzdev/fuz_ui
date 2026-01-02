import {test, assert, describe, beforeAll} from 'vitest';
import ts from 'typescript';

import {tsdoc_clean_comment} from '$lib/tsdoc_helpers.js';
import {
	load_fixtures,
	validate_tsdoc_structure,
	find_and_parse_tsdoc,
	type TsdocFixture,
} from './fixtures/tsdoc/tsdoc_test_helpers.js';
import {normalize_json} from './test_helpers.js';

let fixtures: Array<TsdocFixture> = [];

beforeAll(async () => {
	fixtures = await load_fixtures();
});

describe('tsdoc parser (fixture-based)', () => {
	test('all fixtures parse correctly', () => {
		for (const fixture of fixtures) {
			// Create a source file from the input
			const source_file = ts.createSourceFile(
				`${fixture.name}.ts`,
				fixture.input,
				ts.ScriptTarget.Latest,
				true,
				ts.ScriptKind.TS,
			);

			// Find and parse the exported declaration
			const result = find_and_parse_tsdoc(source_file);

			// Compare with expected (normalize to match JSON serialization)
			assert.deepEqual(
				normalize_json(result),
				normalize_json(fixture.expected),
				`Fixture "${fixture.name}" failed`,
			);
		}
	});

	test('all fixtures have valid structure', () => {
		for (const fixture of fixtures) {
			if (fixture.expected !== null) {
				validate_tsdoc_structure(fixture.expected);
			}
		}
	});
});

describe('tsdoc_clean_comment', () => {
	test('cleans basic JSDoc comment', () => {
		const result = tsdoc_clean_comment('/** Hello world */');
		assert.strictEqual(result, 'Hello world');
	});

	test('cleans multiline JSDoc comment', () => {
		const result = tsdoc_clean_comment(`/**
 * First line.
 * Second line.
 */`);
		assert.strictEqual(result, 'First line.\nSecond line.');
	});

	test('handles comment with only asterisks', () => {
		const result = tsdoc_clean_comment(`/**
 *
 */`);
		assert.isUndefined(result);
	});

	test('returns undefined for empty comment', () => {
		const result = tsdoc_clean_comment('/***/');
		assert.isUndefined(result);
	});

	test('preserves indentation within content', () => {
		const result = tsdoc_clean_comment(`/**
 * Example:
 *   indented code
 *   more code
 */`);
		assert.include(result!, '  indented code');
		assert.include(result!, '  more code');
	});

	test('handles JSDoc with tags', () => {
		const result = tsdoc_clean_comment(`/**
 * Description here.
 * @param x - the value
 * @returns something
 */`);
		assert.include(result!, 'Description here.');
		assert.include(result!, '@param x - the value');
		assert.include(result!, '@returns something');
	});

	test('handles single-line JSDoc', () => {
		const result = tsdoc_clean_comment('/** Single line comment */');
		assert.strictEqual(result, 'Single line comment');
	});

	test('handles comment with no space after asterisk', () => {
		const result = tsdoc_clean_comment(`/**
 *No space here
 */`);
		assert.strictEqual(result, 'No space here');
	});
});
