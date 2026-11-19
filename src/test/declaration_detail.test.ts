import { describe, test, assert } from 'vitest';
import type {
	ComponentPropJsonInput,
	MemberJsonInput,
	ParameterJsonInput,
	TypeJson
} from 'svelte-docinfo/types.js';

import {
	parameter_has_detail,
	signature_is_composable,
	to_declaration_field_fragment,
	to_default_block,
	type SignatureCallable,
	to_function_signature_tokens,
	to_member_chip_modifiers,
	to_member_signature_tokens,
	to_parameter_signature_tokens,
	to_prop_signature_tokens,
	type SignatureToken
} from '#lib/declaration_detail.ts';

// a signature as the line a renderer produces: the tokens' text, adjacent
const to_line = (tokens: Array<SignatureToken>): string =>
	tokens.map((token) => (token.kind === 'type' ? token.type : token.text)).join('');

const to_kinds = (tokens: Array<SignatureToken>): Array<string> =>
	tokens.map((token) => token.kind);

const tree: TypeJson = { kind: 'reference', name: 'A' };

describe('to_function_signature_tokens', () => {
	test('composes the name, parameters, and return type', () => {
		const tokens = to_function_signature_tokens('f', {
			parameters: [
				{ name: 'a', type: 'A' },
				{ name: 'b', type: 'number', optional: true }
			],
			returnType: 'R'
		});
		assert.strictEqual(to_line(tokens), 'f(a: A, b?: number): R');
		assert.deepEqual(to_kinds(tokens), ['name', 'text', 'type', 'text', 'type', 'text', 'type']);
	});

	test('a function with no parameters keeps the empty list', () => {
		assert.strictEqual(
			to_line(to_function_signature_tokens('f', { returnType: 'void' })),
			'f(): void'
		);
	});

	test('a callable with no return type ends at the parameter list', () => {
		const tokens = to_function_signature_tokens('row', {
			parameters: [{ name: 'text', type: 'string' }]
		});
		assert.strictEqual(to_line(tokens), 'row(text: string)');
	});

	test('rest parameters carry the spread, and defaults stay out of the list', () => {
		const tokens = to_function_signature_tokens('f', {
			parameters: [
				{ name: 'a', type: 'number', optional: true, defaultValue: '0' },
				{ name: 'rest', type: 'string[]', rest: true }
			],
			returnType: 'void'
		});
		assert.strictEqual(to_line(tokens), 'f(a?: number, ...rest: string[]): void');
	});

	test('a generic keeps its default beside its constraint', () => {
		const tokens = to_function_signature_tokens('f', {
			genericParams: [{ name: 'T', constraint: 'A', defaultType: 'B' }]
		});
		assert.strictEqual(to_line(tokens), 'f<T extends A = B>()');
	});

	test('generics carry their constraints and defaults as types', () => {
		const tokens = to_function_signature_tokens('f', {
			genericParams: [
				{ name: 'T', constraint: 'Base' },
				{ name: 'U', defaultType: 'unknown' }
			],
			parameters: [{ name: 'x', type: 'T' }],
			returnType: 'U'
		});
		assert.strictEqual(to_line(tokens), 'f<T extends Base, U = unknown>(x: T): U');
		assert.deepInclude(tokens, { kind: 'type', type: 'Base' });
		assert.deepInclude(tokens, { kind: 'keyword', text: ' extends ' });
	});

	test('the unnamed-signature sentinels render as TypeScript writes them', () => {
		const callable = { parameters: [{ name: 'a', type: 'A' }], returnType: 'R' };
		assert.strictEqual(to_line(to_function_signature_tokens('(call)', callable)), '(a: A): R');
		const construct = to_function_signature_tokens('(construct)', callable);
		assert.strictEqual(to_line(construct), 'new (a: A): R');
		assert.deepEqual(construct[0], { kind: 'keyword', text: 'new ' });
	});

	test('types carry their structured tree when there is one', () => {
		const tokens = to_function_signature_tokens('f', {
			parameters: [{ name: 'a', type: 'A', typeInfo: tree }],
			returnType: 'A',
			returnTypeInfo: tree
		});
		const types = tokens.filter((token) => token.kind === 'type');
		assert.deepEqual(types, [
			{ kind: 'type', type: 'A', type_info: tree },
			{ kind: 'type', type: 'A', type_info: tree }
		]);
	});
});

describe('signature_is_composable', () => {
	const cases: Array<[label: string, callable: SignatureCallable, expected: boolean]> = [
		[
			'a plain signature',
			{ typeSignature: '(a: A): R', parameters: [{ name: 'a', type: 'A' }], returnType: 'R' },
			true
		],
		[
			'a type predicate return',
			{ typeSignature: '(value: object): value is A', returnType: 'boolean' },
			false
		],
		[
			'an assertion return',
			{ typeSignature: '(value: unknown): asserts value is A', returnType: 'void' },
			false
		],
		['a bare assertion return', { typeSignature: '(ok: boolean): asserts ok' }, false],
		[
			"a returned type guard is not the signature's own predicate",
			{ typeSignature: '(): (x: unknown) => x is A', returnType: '(x: unknown) => x is A' },
			true
		],
		[
			'a destructured parameter',
			{
				typeSignature: '(cb: T, { delay }?: Options): T',
				parameters: [
					{ name: 'cb', type: 'T' },
					{ name: '__1', type: 'Options', optional: true }
				]
			},
			false
		],
		['a this parameter', { typeSignature: '(this: A, a: number): void' }, false],
		['a this parameter after generics', { typeSignature: '<T>(this: T): void' }, false],
		['a const type parameter', { typeSignature: '<const T extends A>(a: T): T' }, false],
		['a later const type parameter', { typeSignature: '<A, const T>(a: T): T' }, false],
		[
			'nothing flat to fall back on',
			{ parameters: [{ name: '__0', type: 'Options' }], returnType: 'void' },
			true
		]
	];
	test.each(cases)('%s', (_label, callable, expected) => {
		assert.strictEqual(signature_is_composable(callable), expected);
	});
});

describe('to_parameter_signature_tokens', () => {
	const cases: Array<[label: string, param: ParameterJsonInput, expected: string]> = [
		['a required parameter', { name: 'a', type: 'string' }, 'a: string'],
		['an optional parameter', { name: 'a', type: 'string', optional: true }, 'a?: string'],
		['a rest parameter', { name: 'a', type: 'string[]', rest: true }, '...a: string[]'],
		[
			'a default',
			{ name: 'a', type: 'number', optional: true, defaultValue: '100' },
			'a?: number = 100'
		],
		[
			'a default that spans lines stays out of the line',
			{ name: 'a', type: 'A', optional: true, defaultValue: 'new A({\n\tb: 1\n})' },
			'a?: A'
		]
	];
	test.each(cases)('%s', (_label, param, expected) => {
		assert.strictEqual(to_line(to_parameter_signature_tokens(param)), expected);
	});

	test('the name and the default are their own tokens', () => {
		const tokens = to_parameter_signature_tokens({ name: 'a', type: 'number', defaultValue: '1' });
		assert.deepEqual(tokens, [
			{ kind: 'name', text: 'a' },
			{ kind: 'text', text: ': ' },
			{ kind: 'type', type: 'number' },
			{ kind: 'text', text: ' = ' },
			{ kind: 'value', text: '1' }
		]);
	});
});

describe('to_prop_signature_tokens', () => {
	const cases: Array<[label: string, prop: ComponentPropJsonInput, expected: string]> = [
		['a required prop', { name: 'children', type: 'Snippet' }, 'children: Snippet'],
		[
			'an optional prop with a default',
			{ name: 'status', type: 'AlertStatus', optional: true, defaultValue: "'inform'" },
			"status?: AlertStatus = 'inform'"
		],
		['a name that needs quotes', { name: 'aria-label', type: 'string' }, "'aria-label': string"],
		[
			'a callback is composed from its parameters and return type',
			{
				name: 'load',
				type: '(themes?: { name: string; }[], key?: string) => { name: string; }',
				optional: true,
				parameters: [
					{ name: 'themes', type: 'Theme[]', optional: true },
					{ name: 'key', type: 'string', optional: true }
				],
				returnType: 'Theme',
				defaultValue: 'default_load'
			},
			'load?: (themes?: Theme[], key?: string) => Theme = default_load'
		],
		[
			'a callback with no parameters',
			{ name: 'onclose', type: '() => void', returnType: 'void' },
			'onclose: () => void'
		],
		[
			'a callback in a union keeps its flat type',
			{
				name: 'onpick',
				type: '((value: string) => void) | null',
				parameters: [{ name: 'value', type: 'string' }],
				returnType: 'void'
			},
			'onpick: ((value: string) => void) | null'
		],
		[
			'a callback in an intersection keeps its flat type',
			{ name: 'onclick', type: 'Handler<HTMLElement> & (() => void)', returnType: 'void' },
			'onclick: Handler<HTMLElement> & (() => void)'
		],
		[
			'a type guard callback keeps its flat type',
			{
				name: 'guard',
				type: '(x: unknown) => x is A',
				parameters: [{ name: 'x', type: 'unknown' }],
				returnType: 'boolean'
			},
			'guard: (x: unknown) => x is A'
		],
		[
			'a snippet is not a callback',
			{
				name: 'row',
				type: 'Snippet<[text: string]>',
				parameters: [{ name: 'text', type: 'string' }]
			},
			'row: Snippet<[text: string]>'
		]
	];
	test.each(cases)('%s', (_label, prop, expected) => {
		assert.strictEqual(to_line(to_prop_signature_tokens(prop)), expected);
	});
});

describe('to_member_signature_tokens', () => {
	const cases: Array<[label: string, member: MemberJsonInput, expected: string]> = [
		[
			'a property',
			{ name: 'id', kind: 'variable', typeSignature: 'string | null' },
			'id: string | null'
		],
		[
			'an optional property with a default',
			{
				name: 'id',
				kind: 'variable',
				typeSignature: 'string',
				optional: true,
				defaultValue: "'a'"
			},
			"id?: string = 'a'"
		],
		[
			'keyword modifiers lead, in the order TypeScript writes them',
			{
				name: 'id',
				kind: 'variable',
				typeSignature: 'string',
				modifiers: ['readonly', 'static', 'protected']
			},
			'protected static readonly id: string'
		],
		[
			'every keyword modifier has its place',
			{
				name: 'id',
				kind: 'variable',
				typeSignature: 'string',
				modifiers: ['readonly', 'abstract', 'static', 'public']
			},
			'public static abstract readonly id: string'
		],
		[
			'accessor modifiers stay out of the line',
			{ name: 'show', kind: 'variable', typeSignature: 'boolean', modifiers: ['getter', 'setter'] },
			'show: boolean'
		],
		[
			'a name that is not an identifier is quoted',
			{ name: 'default-src', kind: 'variable', typeSignature: 'string', optional: true },
			"'default-src'?: string"
		],
		[
			'a quote inside a name is escaped',
			{ name: "it's", kind: 'variable', typeSignature: 'string' },
			"'it\\'s': string"
		],
		[
			'a numeric key stays bare',
			{ name: '0', kind: 'variable', typeSignature: 'string' },
			'0: string'
		],
		[
			'a dollar name is an identifier',
			{ name: '$state', kind: 'variable', typeSignature: 'string' },
			'$state: string'
		],
		[
			'an index signature',
			{ name: '[key: string]', kind: 'variable', typeSignature: 'number' },
			'[key: string]: number'
		],
		['a property with no extracted type', { name: 'id', kind: 'variable', partial: true }, 'id'],
		[
			'a method',
			{
				name: 'repeat',
				kind: 'function',
				typeSignature: '(fn: () => void, ms: number): () => void',
				parameters: [
					{ name: 'fn', type: '() => void' },
					{ name: 'ms', type: 'number' }
				],
				returnType: '() => void'
			},
			'repeat(fn: () => void, ms: number): () => void'
		],
		[
			'an optional method with a default',
			{
				name: 'enabled',
				kind: 'function',
				typeSignature: '(): boolean',
				optional: true,
				returnType: 'boolean',
				defaultValue: '() => true'
			},
			'enabled?(): boolean = () => true'
		],
		[
			'a generic method',
			{
				name: 'get',
				kind: 'function',
				genericParams: [{ name: 'T' }],
				parameters: [{ name: 'key', type: 'string' }],
				returnType: 'T'
			},
			'get<T>(key: string): T'
		],
		[
			'a call signature has no name',
			{
				name: '(call)',
				kind: 'function',
				typeSignature: '(state: State): void',
				parameters: [{ name: 'state', type: 'State' }],
				returnType: 'void'
			},
			'(state: State): void'
		],
		[
			'a method whose extraction failed keeps its flat signature',
			{ name: 'run', kind: 'function', typeSignature: '(): void', partial: true },
			'run(): void'
		],
		[
			'a type predicate method keeps its flat signature',
			{
				name: 'guard',
				kind: 'function',
				typeSignature: '(x: unknown): x is A',
				parameters: [{ name: 'x', type: 'unknown' }],
				returnType: 'boolean'
			},
			'guard(x: unknown): x is A'
		],
		[
			'a method with a destructured parameter keeps its flat signature',
			{
				name: 'run',
				kind: 'function',
				typeSignature: '({ a, b }: Options): void',
				parameters: [{ name: '__0', type: 'Options' }],
				returnType: 'void'
			},
			'run({ a, b }: Options): void'
		],
		[
			'a constructor whose extraction failed keeps its flat signature',
			{ name: 'constructor', kind: 'constructor', typeSignature: '(a: string): A', partial: true },
			'constructor(a: string): A'
		],
		[
			'a construct signature with nothing extracted is the bare keyword',
			{ name: '(construct)', kind: 'constructor', partial: true },
			'new'
		],
		[
			'a class constructor',
			{
				name: 'constructor',
				kind: 'constructor',
				typeSignature: '(options?: Options | undefined): A',
				parameters: [{ name: 'options', type: 'Options', optional: true }]
			},
			'constructor(options?: Options)'
		],
		[
			'a construct signature keeps its flat signature, for the return type',
			{ name: '(construct)', kind: 'constructor', typeSignature: '(x: number): A' },
			'new (x: number): A'
		]
	];
	test.each(cases)('%s', (_label, member, expected) => {
		assert.strictEqual(to_line(to_member_signature_tokens(member)), expected);
	});

	test('keyword modifiers are keyword tokens ahead of the name', () => {
		const tokens = to_member_signature_tokens({
			name: 'id',
			kind: 'variable',
			typeSignature: 'string',
			modifiers: ['readonly']
		});
		assert.deepEqual(tokens.slice(0, 2), [
			{ kind: 'keyword', text: 'readonly ' },
			{ kind: 'name', text: 'id' }
		]);
	});

	test('a construct signature leads with a keyword token', () => {
		const tokens = to_member_signature_tokens({
			name: '(construct)',
			kind: 'constructor',
			typeSignature: '(x: number): A'
		});
		assert.deepEqual(tokens[0], { kind: 'keyword', text: 'new ' });
	});

	test('a property carries its structured tree', () => {
		const tokens = to_member_signature_tokens({
			name: 'a',
			kind: 'variable',
			typeSignature: 'A',
			typeInfo: tree
		});
		assert.deepInclude(tokens, { kind: 'type', type: 'A', type_info: tree });
	});

	test('omit_type leaves an enum value as its name', () => {
		const tokens = to_member_signature_tokens(
			{ name: 'a', kind: 'variable', typeSignature: 'A.a' },
			{ omit_type: true }
		);
		assert.deepEqual(tokens, [{ kind: 'name', text: 'a' }]);
	});
});

describe('to_member_chip_modifiers', () => {
	test('keeps the modifiers that are not keywords in the signature', () => {
		assert.deepEqual(
			to_member_chip_modifiers({
				name: 'show',
				kind: 'variable',
				modifiers: ['public', 'protected', 'static', 'abstract', 'readonly', 'getter', 'setter']
			}),
			['getter', 'setter']
		);
	});

	test('a member with no modifiers has none', () => {
		assert.deepEqual(to_member_chip_modifiers({ name: 'show', kind: 'variable' }), []);
	});
});

describe('to_default_block', () => {
	const cases: Array<[label: string, value: string | undefined, expected: string | undefined]> = [
		['no default', undefined, undefined],
		['a single-line default', "'inform'", undefined],
		['a default that spans lines, dedented', 'new A({\n\t\tb: 1\n\t})', 'new A({\n\tb: 1\n})']
	];
	test.each(cases)('%s', (_label, value, expected) => {
		assert.strictEqual(to_default_block(value), expected);
	});
});

describe('parameter_has_detail', () => {
	const cases: Array<[label: string, param: ParameterJsonInput, expected: boolean]> = [
		['a bare parameter', { name: 'a', type: 'string' }, false],
		['an optional parameter', { name: 'a', type: 'string', optional: true }, false],
		['a description', { name: 'a', type: 'string', description: 'the thing' }, true],
		['a default', { name: 'a', type: 'string', defaultValue: "''" }, true],
		[
			'documented properties',
			{ name: 'a', type: 'Options', propertyDescriptions: { cache: 'reused' } },
			true
		],
		['an empty properties record', { name: 'a', type: 'Options', propertyDescriptions: {} }, false]
	];
	test.each(cases)('%s', (_label, param, expected) => {
		assert.strictEqual(parameter_has_detail(param), expected);
	});
});

describe('to_declaration_field_fragment', () => {
	const cases: Array<[label: string, path: Array<string>, expected: string | undefined]> = [
		['a field', ['toggle'], 'A.toggle'],
		['a nested parameter', ['toggle', 'event'], 'A.toggle.event'],
		['a hyphenated name', ['default-src'], 'A.default-src'],
		['a CSS custom property', ['--a_color'], 'A.--a_color'],
		['a dollar name', ['$state'], 'A.$state'],
		['a quoted key', ['peer/ping'], 'A.peer/ping'],
		['a non-ASCII name', ['café'], 'A.café'],
		['a name holding the separator', ['a.b'], undefined],
		['a computed name', ['[Symbol.iterator]'], undefined],
		['the construct sentinel', ['(construct)'], undefined],
		['an index signature', ['[key: string]'], undefined],
		['the call sentinel', ['(call)'], undefined],
		['a parameter of an unaddressable member', ['(call)', 'state'], undefined],
		['no field', [], undefined]
	];
	test.each(cases)('%s', (_label, path, expected) => {
		assert.strictEqual(to_declaration_field_fragment('A', ...path), expected);
	});
});
