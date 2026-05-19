import {test, assert, describe} from 'vitest';
import {tsdoc_see_to_mdz} from '$lib/tsdoc_mdz.js';

describe('tsdoc_see_to_mdz', () => {
	test('converts {@link url|text} to markdown link', () => {
		assert.equal(
			tsdoc_see_to_mdz('{@link https://fuz.dev|Example}'),
			'[Example](https://fuz.dev)',
		);
	});

	test('converts {@link url} to bare URL', () => {
		assert.equal(tsdoc_see_to_mdz('{@link https://fuz.dev}'), 'https://fuz.dev');
	});

	test('converts {@link identifier} to backticks', () => {
		assert.equal(tsdoc_see_to_mdz('{@link SomeType}'), '`SomeType`');
	});

	test('passes through bare URL', () => {
		assert.equal(tsdoc_see_to_mdz('https://fuz.dev'), 'https://fuz.dev');
	});

	test('wraps bare identifier in backticks', () => {
		assert.equal(tsdoc_see_to_mdz('SomeType'), '`SomeType`');
	});

	test('handles {@see ...} syntax same as {@link ...}', () => {
		assert.equal(tsdoc_see_to_mdz('{@see SomeType}'), '`SomeType`');
	});

	test('trims whitespace', () => {
		assert.equal(tsdoc_see_to_mdz('  {@link Foo}  '), '`Foo`');
	});

	test('handles http:// URLs in {@link}', () => {
		assert.equal(tsdoc_see_to_mdz('{@link http://fuz.dev}'), 'http://fuz.dev');
	});

	test('handles bare http:// URLs', () => {
		assert.equal(tsdoc_see_to_mdz('http://fuz.dev'), 'http://fuz.dev');
	});

	test('handles {@link} with http:// URL and text', () => {
		assert.equal(tsdoc_see_to_mdz('{@link http://fuz.dev|Docs}'), '[Docs](http://fuz.dev)');
	});

	test('handles complex identifiers like Foo<Bar>', () => {
		assert.equal(tsdoc_see_to_mdz('{@link Foo<Bar>}'), '`Foo<Bar>`');
	});

	test('handles malformed {@link with unclosed brace', () => {
		// Malformed input: unclosed brace splits at first space
		assert.equal(tsdoc_see_to_mdz('{@link SomeType'), '`{@link` SomeType');
	});

	test('returns empty string for empty input', () => {
		assert.equal(tsdoc_see_to_mdz(''), '');
	});

	test('returns empty string for whitespace-only input', () => {
		assert.equal(tsdoc_see_to_mdz('   '), '');
	});

	test('trims whitespace inside {@link}', () => {
		assert.equal(tsdoc_see_to_mdz('{@link   SomeType   }'), '`SomeType`');
	});

	test('handles spaces around pipe', () => {
		assert.equal(
			tsdoc_see_to_mdz('{@link https://fuz.dev | Example Site }'),
			'[Example Site](https://fuz.dev)',
		);
	});

	test('handles multiple pipes by using first as separator', () => {
		assert.equal(
			tsdoc_see_to_mdz('{@link https://fuz.dev|Text|More}'),
			'[Text|More](https://fuz.dev)',
		);
	});

	test('handles identifiers with dots', () => {
		assert.equal(tsdoc_see_to_mdz('{@link module.function}'), '`module.function`');
	});

	test('handles bare identifiers with dots', () => {
		assert.equal(tsdoc_see_to_mdz('some_module.some_function'), '`some_module.some_function`');
	});

	test('splits identifier from description text', () => {
		assert.equal(
			tsdoc_see_to_mdz('library_gen.ts for Gro-specific integration'),
			'`library_gen.ts` for Gro-specific integration',
		);
	});

	test('splits module filename from description', () => {
		assert.equal(
			tsdoc_see_to_mdz('library_pipeline.ts for pipeline helpers'),
			'`library_pipeline.ts` for pipeline helpers',
		);
	});

	test('passes through URL with description as-is', () => {
		assert.equal(
			tsdoc_see_to_mdz('https://fuz.dev for more info'),
			'https://fuz.dev for more info',
		);
	});
});
