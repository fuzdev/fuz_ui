import { describe, test, assert } from 'vitest';

import type { TypeJsonToken } from 'svelte-docinfo/declaration-helpers.js';

import {
	link_type_json_terminals,
	to_type_text_tokens,
	type_name_is_keyword,
	type TypeTextToken
} from '#lib/type_link.ts';

const to_tokens = (type: string, names: Array<string>): Array<TypeTextToken> =>
	to_type_text_tokens(type, (name) => names.includes(name));

// the resolved names, in order
const to_names = (type: string, names: Array<string>): Array<string> =>
	to_tokens(type, names)
		.filter((token) => token.kind === 'name')
		.map((token) => token.text);

describe('to_type_text_tokens', () => {
	test('splits resolving names from the text around them', () => {
		assert.deepEqual(to_tokens('Base<Options>', ['Base', 'Options']), [
			{ kind: 'name', text: 'Base' },
			{ kind: 'text', text: '<' },
			{ kind: 'name', text: 'Options' },
			{ kind: 'text', text: '>' }
		]);
	});

	test('names that do not resolve stay in the text, merged', () => {
		assert.deepEqual(to_tokens('Map<string, A>', ['A']), [
			{ kind: 'text', text: 'Map<string, ' },
			{ kind: 'name', text: 'A' },
			{ kind: 'text', text: '>' }
		]);
	});

	test('a string with no resolving name is one text token', () => {
		assert.deepEqual(to_tokens('Map<string, A>', []), [{ kind: 'text', text: 'Map<string, A>' }]);
	});

	test('an empty string has no tokens', () => {
		assert.deepEqual(to_tokens('', ['A']), []);
	});

	const cases: Array<[label: string, type: string, names: Array<string>, expected: Array<string>]> =
		[
			['a whole-word match only', 'Abc | A', ['A'], ['A']],
			['string literal contents are skipped', `Omit<A, 'B' | "B">`, ['A', 'B'], ['A']],
			['an escaped quote stays inside its literal', `'a\\' | B' | C`, ['B', 'C'], ['C']],
			['a template literal is skipped', '`B${string}` | A', ['A', 'B', 'string'], ['A']],
			['a property name is not a reference', '{ a: A; b?: A }', ['a', 'b', 'A'], ['A', 'A']],
			['a parameter name is not a reference', '(a: A) => a', ['a', 'A'], ['A', 'a']],
			[
				'a conditional type branch is a reference',
				'T extends A ? B : C',
				['A', 'B', 'C'],
				['A', 'B', 'C']
			],
			['a property access keeps only its left side', 'ns.A | A', ['ns', 'A'], ['ns', 'A']],
			['a name does not start inside a number', '2px | px', ['px'], ['px']],
			['an unterminated literal runs to the end', `'A | A`, ['A'], []],
			[
				'a keyword never links, whatever the library exports',
				'Schema<number, string> | unknown',
				['Schema', 'number', 'string', 'unknown'],
				['Schema']
			],
			['a predicate keyword never links', '(x: unknown) => x is A', ['is', 'A'], ['A']],
			['a spread element is a reference', '[string, ...A[]]', ['A'], ['A']],
			['an optional tuple element is a reference', '[A?]', ['A'], ['A']],
			['dollar and underscore names', '$A | _B', ['$A', '_B'], ['$A', '_B']],
			['a non-ASCII name is one identifier', 'Ünicode | nicode', ['nicode'], ['nicode']]
		];
	test.each(cases)('%s', (_label, type, names, expected) => {
		assert.deepEqual(to_names(type, names), expected);
	});

	test('type_name_is_keyword knows intrinsics and type operators, not ordinary names', () => {
		for (const name of ['string', 'unknown', 'is', 'keyof', 'readonly']) {
			assert.isTrue(type_name_is_keyword(name), name);
		}
		for (const name of ['String', 'Tome', 'more']) {
			assert.isFalse(type_name_is_keyword(name), name);
		}
	});

	test('the tokens concatenate back to the input', () => {
		for (const type of ['Base<Options>', `Omit<A, 'b'>`, '{ a: A; b?: B }', `'A | A`, '']) {
			const tokens = to_tokens(type, ['A', 'B', 'Base']);
			assert.strictEqual(tokens.map((token) => token.text).join(''), type);
		}
	});
});

describe('to_type_text_tokens source text', () => {
	test('comments link nothing, and an apostrophe in one opens no string', () => {
		assert.deepEqual(to_names('{ /* A */ a: B }', ['A', 'B']), ['B']);
		assert.deepEqual(to_names("{\n\t// don't use A\n\ta: B;\n}", ['A', 'B']), ['B']);
	});

	test('a template literal stays whole', () => {
		assert.deepEqual(to_names('`prefix-${A}` | B', ['A', 'B']), ['B']);
	});

	test('a typeof chain links its first name when that resolves', () => {
		assert.deepEqual(to_names('typeof a.b', ['a', 'b']), ['a']);
	});

	test('a chain whose head resolves nowhere links its last name', () => {
		assert.deepEqual(to_tokens('typeof specs.a.b_spec | C', ['b_spec', 'C']), [
			{ kind: 'text', text: 'typeof specs.a.' },
			{ kind: 'name', text: 'b_spec' },
			{ kind: 'text', text: ' | ' },
			{ kind: 'name', text: 'C' }
		]);
		assert.deepEqual(to_names('ns.Middle.Last', ['Middle']), []);
		assert.deepEqual(to_names('typeof ns.missing', ['ns2']), []);
		// keywords and every module's or function's members never link
		assert.deepEqual(to_names('typeof z.infer | ns.string', ['infer', 'string']), []);
		assert.deepEqual(to_names('typeof mod.default | Foo.prototype', ['default', 'prototype']), []);
		// a spread is not a chain
		assert.deepEqual(to_names('[...A]', ['A']), ['A']);
	});

	test('accessor keywords never link', () => {
		assert.deepEqual(to_names('{ get a(): A }', ['get', 'A']), ['A']);
	});
});

describe('link_type_json_terminals', () => {
	const link = (tokens: Array<TypeJsonToken>, names: Array<string>): Array<TypeJsonToken> =>
		link_type_json_terminals(tokens, (name) => names.includes(name));

	const to_text = (tokens: Array<TypeJsonToken>): string =>
		tokens.map((token) => (token.kind === 'name' ? token.name : token.text)).join('');

	test('splits a typeof query at its name', () => {
		assert.deepEqual(link([{ kind: 'code', text: 'typeof A' }], ['A']), [
			{ kind: 'code', text: 'typeof ' },
			{ kind: 'name', name: 'A' }
		]);
	});

	test('links the types in an object type, not its property names', () => {
		const tokens = link([{ kind: 'code', text: '{ a: B; c?: D; }' }], ['a', 'B', 'c', 'D']);
		assert.deepEqual(
			tokens.filter((token) => token.kind === 'name').map((token) => token.name),
			['B', 'D']
		);
		assert.strictEqual(to_text(tokens), '{ a: B; c?: D; }');
	});

	test('links the parameter and return types of a function type', () => {
		const tokens = link([{ kind: 'code', text: '(a: A) => B' }], ['a', 'A', 'B']);
		assert.deepEqual(
			tokens.filter((token) => token.kind === 'name').map((token) => token.name),
			['A', 'B']
		);
	});

	test('a whole-text name becomes one name token', () => {
		assert.deepEqual(link([{ kind: 'code', text: 'A' }], ['A']), [{ kind: 'name', name: 'A' }]);
	});

	test('text and name tokens pass through unscanned', () => {
		const tokens: Array<TypeJsonToken> = [
			{ kind: 'text', text: '[A: ' },
			{ kind: 'name', name: 'B', module: 'b.ts' },
			{ kind: 'text', text: ']' }
		];
		assert.deepEqual(link(tokens, ['A', 'B']), tokens);
	});

	test('a terminal with nothing that resolves stays one token', () => {
		const token: TypeJsonToken = { kind: 'code', text: '{ a: string; }' };
		assert.deepEqual(link([token], ['A', 'string']), [token]);
	});

	test('literals, keywords, and property access stay unlinked', () => {
		const tokens = link([{ kind: 'code', text: '"A" | string | E.A' }], ['A', 'E', 'string']);
		assert.deepEqual(
			tokens.filter((token) => token.kind === 'name').map((token) => token.name),
			['E']
		);
	});
});
