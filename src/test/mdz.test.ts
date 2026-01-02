import {test, assert, describe, beforeAll} from 'vitest';

import {mdz_parse, mdz_is_url} from '$lib/mdz.js';
import {
	load_fixtures,
	validate_positions,
	type MdzFixture,
} from './fixtures/mdz/mdz_test_helpers.js';

let fixtures: Array<MdzFixture> = [];

beforeAll(async () => {
	fixtures = await load_fixtures();
});

describe('mdz parser', () => {
	test('all fixtures parse correctly', () => {
		for (const fixture of fixtures) {
			const result = mdz_parse(fixture.input);
			assert.deepEqual(result, fixture.expected, `Fixture "${fixture.name}" failed`);
		}
	});

	test('all fixtures have valid positions', () => {
		for (const fixture of fixtures) {
			const result = mdz_parse(fixture.input);
			validate_positions(result);
		}
	});
});

describe('mdz_is_url', () => {
	test('returns true for valid URLs', () => {
		assert.equal(mdz_is_url('https://example.com'), true);
		assert.equal(mdz_is_url('https://a'), true);
		assert.equal(mdz_is_url('http://example.com'), true);
		assert.equal(mdz_is_url('http://a'), true);
		assert.equal(mdz_is_url('https://example.com/path?query=1#hash'), true);
	});

	test('returns true for IPv6 URLs', () => {
		assert.equal(mdz_is_url('https://[::1]'), true);
		assert.equal(mdz_is_url('https://[2001:db8::1]:8080/path'), true);
		assert.equal(mdz_is_url('http://[::1]/'), true);
	});

	test('returns true for internationalized domain names', () => {
		assert.equal(mdz_is_url('https://例え.jp'), true);
		assert.equal(mdz_is_url('https://münchen.de'), true);
		assert.equal(mdz_is_url('https://пример.рф'), true);
	});

	test('returns false for bare protocols', () => {
		assert.equal(mdz_is_url('https://'), false);
		assert.equal(mdz_is_url('http://'), false);
	});

	test('returns false for protocols followed by whitespace', () => {
		assert.equal(mdz_is_url('https:// '), false);
		assert.equal(mdz_is_url('https://\n'), false);
		assert.equal(mdz_is_url('https://\t'), false);
		assert.equal(mdz_is_url('http:// '), false);
		assert.equal(mdz_is_url('http://\n'), false);
	});

	test('returns false for protocols followed by invalid start chars', () => {
		// closing brackets/parens
		assert.equal(mdz_is_url('https://)'), false);
		assert.equal(mdz_is_url('https://]'), false);
		assert.equal(mdz_is_url('https://}'), false);
		assert.equal(mdz_is_url('https://<'), false);
		assert.equal(mdz_is_url('https://>'), false);
		// punctuation that can't start a hostname
		assert.equal(mdz_is_url('https://.'), false);
		assert.equal(mdz_is_url('https://,'), false);
		assert.equal(mdz_is_url('https://:'), false);
		assert.equal(mdz_is_url('https:///'), false);
		assert.equal(mdz_is_url('https://?'), false);
		assert.equal(mdz_is_url('https://#'), false);
		assert.equal(mdz_is_url('https://!'), false);
		// invalid char followed by valid content
		assert.equal(mdz_is_url('http://)foo'), false);
		assert.equal(mdz_is_url('https://.com'), false);
	});

	test('returns false for non-URLs', () => {
		assert.equal(mdz_is_url(''), false);
		assert.equal(mdz_is_url('example.com'), false);
		assert.equal(mdz_is_url('/path'), false);
		assert.equal(mdz_is_url('ftp://example.com'), false);
	});
});
