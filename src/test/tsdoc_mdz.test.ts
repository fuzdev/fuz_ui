import {test, expect, describe} from 'vitest';
import {tsdoc_see_to_mdz} from '$lib/tsdoc_mdz.js';

describe('tsdoc_see_to_mdz', () => {
	test('converts {@link url|text} to markdown link', () => {
		expect(tsdoc_see_to_mdz('{@link https://example.com|Example}')).toBe(
			'[Example](https://example.com)',
		);
	});

	test('converts {@link url} to bare URL', () => {
		expect(tsdoc_see_to_mdz('{@link https://example.com}')).toBe('https://example.com');
	});

	test('converts {@link identifier} to backticks', () => {
		expect(tsdoc_see_to_mdz('{@link SomeType}')).toBe('`SomeType`');
	});

	test('passes through bare URL', () => {
		expect(tsdoc_see_to_mdz('https://example.com')).toBe('https://example.com');
	});

	test('wraps bare identifier in backticks', () => {
		expect(tsdoc_see_to_mdz('SomeType')).toBe('`SomeType`');
	});

	test('handles {@see ...} syntax same as {@link ...}', () => {
		expect(tsdoc_see_to_mdz('{@see SomeType}')).toBe('`SomeType`');
	});

	test('trims whitespace', () => {
		expect(tsdoc_see_to_mdz('  {@link Foo}  ')).toBe('`Foo`');
	});

	test('handles http:// URLs in {@link}', () => {
		expect(tsdoc_see_to_mdz('{@link http://example.com}')).toBe('http://example.com');
	});

	test('handles bare http:// URLs', () => {
		expect(tsdoc_see_to_mdz('http://example.com')).toBe('http://example.com');
	});

	test('handles {@link} with http:// URL and text', () => {
		expect(tsdoc_see_to_mdz('{@link http://example.com|Docs}')).toBe('[Docs](http://example.com)');
	});

	test('handles complex identifiers like Foo<Bar>', () => {
		expect(tsdoc_see_to_mdz('{@link Foo<Bar>}')).toBe('`Foo<Bar>`');
	});

	test('handles malformed {@link with unclosed brace as bare identifier', () => {
		expect(tsdoc_see_to_mdz('{@link SomeType')).toBe('`{@link SomeType`');
	});

	test('returns empty string for empty input', () => {
		expect(tsdoc_see_to_mdz('')).toBe('');
	});

	test('returns empty string for whitespace-only input', () => {
		expect(tsdoc_see_to_mdz('   ')).toBe('');
	});

	test('trims whitespace inside {@link}', () => {
		expect(tsdoc_see_to_mdz('{@link   SomeType   }')).toBe('`SomeType`');
	});

	test('handles spaces around pipe', () => {
		expect(tsdoc_see_to_mdz('{@link https://example.com | Example Site }')).toBe(
			'[Example Site](https://example.com)',
		);
	});

	test('handles multiple pipes by using first as separator', () => {
		expect(tsdoc_see_to_mdz('{@link https://example.com|Text|More}')).toBe(
			'[Text|More](https://example.com)',
		);
	});

	test('handles identifiers with dots', () => {
		expect(tsdoc_see_to_mdz('{@link module.function}')).toBe('`module.function`');
	});

	test('handles bare identifiers with dots', () => {
		expect(tsdoc_see_to_mdz('some_module.some_function')).toBe('`some_module.some_function`');
	});
});
