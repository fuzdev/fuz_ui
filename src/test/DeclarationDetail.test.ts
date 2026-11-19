/**
 * @vitest-environment jsdom
 */
import { describe, test, assert, afterEach } from 'vitest';
import { flushSync } from 'svelte';
import type { DeclarationJsonInput } from 'svelte-docinfo/types.js';

import { Declaration } from '#lib/declaration.svelte.ts';
import type { Module } from '#lib/module.svelte.ts';
import DeclarationDetailHarness from './DeclarationDetailHarness.svelte';
import { mount_component, unmount_component } from './test_helpers.ts';
import { fake_library } from './library_test_helpers.ts';

let mounted: { instance: any; container: HTMLElement } | null = null;

afterEach(async () => {
	if (mounted) {
		await unmount_component(mounted.instance, mounted.container);
		mounted = null;
	}
});

// `import_statement` reads the module's path and the library's package name;
// nothing else rendered here touches the module, and `ModuleLink` resolves
// against the fake library, finding nothing unless `names` supplies declarations
const mount_detail = (json: Record<string, unknown>, names: Array<string> = []): HTMLElement => {
	const module = { path: 'A.svelte', library: { pkg_json: { name: 'pkg' } } };
	const declaration = new Declaration(
		module as unknown as Module,
		json as unknown as DeclarationJsonInput
	);
	mounted = mount_component(DeclarationDetailHarness as any, {
		declaration,
		library: fake_library(names)
	});
	flushSync();
	return mounted.container;
};

const find_section = (container: HTMLElement, label: string): HTMLElement => {
	const heading = Array.from(container.querySelectorAll('h4')).find((h) => h.textContent === label);
	assert.ok(heading, `expected the ${label} section`);
	return heading.parentElement!;
};

const find_css_section = (container: HTMLElement): HTMLElement =>
	find_section(container, 'CSS custom properties');

const to_labels = (container: HTMLElement): Array<string> =>
	Array.from(container.querySelectorAll('h4')).map((h) => h.textContent);

// a field's signature line, exactly as rendered — `textContent` equality
// catches a stray space between tokens
const to_signatures = (section: HTMLElement): Array<string> =>
	Array.from(
		section.querySelectorAll(':scope > section > .field-header .declaration-signature')
	).map((el) => el.textContent);

describe('DeclarationDetail signature', () => {
	test('a function gets a composed signature with each type linked', () => {
		const container = mount_detail(
			{
				name: 'f',
				kind: 'function',
				typeSignature: '(a: A, b?: number | undefined): R',
				parameters: [
					{ name: 'a', type: 'A' },
					{ name: 'b', type: 'number', optional: true }
				],
				returnType: 'R'
			},
			['A', 'R']
		);
		const block = container.querySelector('code.signature-block');
		assert.ok(block, 'expected the composed signature');
		assert.strictEqual(block.textContent, 'f(a: A, b?: number): R');
		assert.strictEqual(block.getAttribute('title'), '(a: A, b?: number | undefined): R');
		assert.strictEqual(block.querySelector('strong')?.textContent, 'f');
		assert.deepEqual(
			Array.from(block.querySelectorAll('a')).map((a) => a.getAttribute('href')),
			['/docs/api/x.ts#A', '/docs/api/x.ts#R']
		);
	});

	test('a type predicate keeps the flat signature, which alone shows it', () => {
		const container = mount_detail({
			name: 'f',
			kind: 'function',
			typeSignature: '(value: object): value is A',
			parameters: [{ name: 'value', type: 'object' }],
			returnType: 'boolean'
		});
		assert.strictEqual(container.querySelector('.signature-block'), null);
		assert.include(container.textContent, '(value: object): value is A');
		// with no composed signature, every parameter keeps its row
		assert.deepEqual(to_signatures(find_section(container, 'parameters')), ['value: object']);
	});

	test('a snippet gets a composed signature ending at its parameters', () => {
		const container = mount_detail({
			name: 'row',
			kind: 'snippet',
			typeSignature: 'Snippet<[text: string]>',
			parameters: [{ name: 'text', type: 'string' }]
		});
		assert.strictEqual(
			container.querySelector('code.signature-block')?.textContent,
			'row(text: string)'
		);
	});

	test('overloads get composed signatures, their parameters a level under the label', () => {
		const container = mount_detail({
			name: 'f',
			kind: 'function',
			overloads: [
				{
					typeSignature: '(a: string): string',
					parameters: [{ name: 'a', type: 'string', description: 'the text' }],
					returnType: 'string'
				},
				{ typeSignature: '(a: unknown): a is A', returnType: 'boolean' }
			]
		});
		const section = find_section(container, 'overloads');
		const entries = Array.from(section.querySelectorAll(':scope > section'));
		assert.strictEqual(
			entries[0]!.querySelector('code.signature-block')?.textContent,
			'f(a: string): string'
		);
		assert.strictEqual(entries[0]!.querySelector('h5')?.textContent, 'a');
		// the predicate overload keeps its flat signature
		assert.strictEqual(entries[1]!.querySelector('.signature-block'), null);
		assert.include(entries[1]!.textContent, '(a: unknown): a is A');
	});

	test('a function whose extraction failed keeps the flat signature', () => {
		const container = mount_detail({
			name: 'f',
			kind: 'function',
			typeSignature: '(a: A): R',
			partial: true
		});
		assert.strictEqual(container.querySelector('.signature-block'), null);
		assert.include(container.textContent, '(a: A): R');
	});

	test('a signature that only repeats the name is dropped', () => {
		const container = mount_detail({ name: 'A', kind: 'interface', typeSignature: 'A' });
		// the import statement is the only code block left
		const blocks = Array.from(container.querySelectorAll('code[data-lang="ts"]'));
		assert.strictEqual(blocks.length, 1);
		assert.include(blocks[0]!.textContent, 'import');
	});

	test('a flat signature that says more than the name stays', () => {
		const container = mount_detail({ name: 'A', kind: 'type', typeSignature: '{ a: string; }' });
		assert.include(container.textContent, '{ a: string; }');
	});

	test('the description comes before the import statement', () => {
		const container = mount_detail({ name: 'A', kind: 'interface', docComment: 'Describes it.' });
		const text = container.textContent;
		assert.isBelow(text.indexOf('Describes it.'), text.indexOf('import'));
	});
});

describe('DeclarationDetail parameters', () => {
	test('only parameters with more to say than the signature get a row', () => {
		const container = mount_detail({
			name: 'f',
			kind: 'function',
			parameters: [
				{ name: 'a', type: 'string' },
				{ name: 'b', type: 'string', description: 'the second' },
				{ name: 'c', type: 'number', optional: true, defaultValue: '1' }
			],
			returnType: 'void'
		});
		const section = find_section(container, 'parameters');
		assert.deepEqual(to_signatures(section), ['b: string', 'c?: number = 1']);
		assert.include(section.textContent, 'the second');
	});

	test('a function whose parameters add nothing has no parameters section', () => {
		const container = mount_detail({
			name: 'f',
			kind: 'function',
			parameters: [{ name: 'a', type: 'string' }],
			returnType: 'void'
		});
		assert.notInclude(to_labels(container), 'parameters');
	});

	test('a parameter row lists its documented properties', () => {
		const container = mount_detail({
			name: 'f',
			kind: 'function',
			parameters: [
				{ name: 'options', type: 'Options', propertyDescriptions: { cache: 'reused', '[].id': '' } }
			]
		});
		const items = Array.from(find_section(container, 'parameters').querySelectorAll('li'));
		assert.deepEqual(
			items.map((li) => li.querySelector('code')?.textContent),
			['options.cache', 'options[].id']
		);
		assert.include(items[0]!.textContent, 'reused');
	});

	test('returns shows only with a description', () => {
		const bare = mount_detail({ name: 'f', kind: 'function', returnType: 'R' });
		assert.notInclude(to_labels(bare), 'returns');
	});

	test('a returns description gets its section', () => {
		const container = mount_detail({
			name: 'f',
			kind: 'function',
			returnType: 'R',
			returnDescription: 'the result'
		});
		assert.include(find_section(container, 'returns').textContent, 'the result');
	});
});

describe('DeclarationDetail fields', () => {
	test('members are headed by their signatures, under a label', () => {
		const container = mount_detail(
			{
				name: 'A',
				kind: 'class',
				members: [
					{ name: 'id', kind: 'variable', typeSignature: 'string | null', modifiers: ['readonly'] },
					{
						name: 'show',
						kind: 'variable',
						typeSignature: 'boolean',
						modifiers: ['getter'],
						reactivity: '$derived'
					},
					{
						name: 'constructor',
						kind: 'constructor',
						typeSignature: '(options?: Options | undefined): A',
						parameters: [{ name: 'options', type: 'Options', optional: true }]
					},
					{ name: 'toggle', kind: 'function', typeSignature: '(): void', returnType: 'void' }
				]
			},
			['Options']
		);
		const section = find_section(container, 'members');
		assert.deepEqual(to_signatures(section), [
			'readonly id: string | null',
			'show: boolean',
			'constructor(options?: Options)',
			'toggle(): void'
		]);
		const entries = Array.from(section.querySelectorAll(':scope > section'));
		// the field's heading is its name alone
		assert.deepEqual(
			entries.map((entry) => entry.querySelector('h5')?.textContent),
			['id', 'show', 'constructor', 'toggle']
		);
		// non-keyword modifiers and reactivity are chips
		assert.deepEqual(
			Array.from(entries[1]!.querySelectorAll('.field-header .chip')).map((c) => c.textContent),
			['getter', '$derived']
		);
		// the composed constructor links its parameter's type
		assert.strictEqual(
			entries[2]!.querySelector('.declaration-signature a')?.getAttribute('href'),
			'/docs/api/x.ts#Options'
		);
		assert.strictEqual(
			entries[2]!.querySelector('.declaration-signature')?.getAttribute('title'),
			'(options?: Options | undefined): A'
		);
		// a property's line is already its flat signature, so no hover text
		assert.isFalse(entries[0]!.querySelector('.declaration-signature')!.hasAttribute('title'));
		// the name's heading sits in a block-level wrapper, where a heading may be
		assert.strictEqual(entries[0]!.querySelector('h5')?.parentElement?.tagName, 'DIV');
	});

	test('a method lists only its parameters with detail, a level down, and its returns prose', () => {
		const container = mount_detail({
			name: 'A',
			kind: 'interface',
			members: [
				{
					name: 'repeat',
					kind: 'function',
					parameters: [
						{ name: 'fn', type: '() => void' },
						{ name: 'ms', type: 'number', description: 'the interval' }
					],
					returnType: '() => void',
					returnDescription: 'stops the loop'
				}
			]
		});
		const entry = find_section(container, 'members').querySelector(':scope > section')!;
		assert.deepEqual(
			Array.from(entry.querySelectorAll('h6')).map((h) => h.textContent),
			['ms']
		);
		assert.include(entry.textContent, 'the interval');
		assert.include(entry.textContent, 'stops the loop');
		// not a `p`, which block prose in the description would break out of
		const returns_label = Array.from(entry.querySelectorAll('strong')).find(
			(el) => el.textContent === 'returns'
		);
		assert.strictEqual(returns_label?.parentElement?.tagName, 'DIV');
	});

	test('an enum value is headed by its name alone', () => {
		const container = mount_detail({
			name: 'A',
			kind: 'enum',
			typeSignature: 'A',
			members: [{ name: 'a', kind: 'variable', typeSignature: 'A.a' }]
		});
		assert.deepEqual(to_signatures(find_section(container, 'members')), ['a']);
	});

	test('props are headed by their signatures, with bindable as a chip', () => {
		const container = mount_detail({
			name: 'A',
			kind: 'component',
			props: [
				{ name: 'status', type: 'Status', optional: true, defaultValue: "'inform'" },
				{ name: 'value', type: 'string', bindable: true }
			]
		});
		const section = find_section(container, 'props');
		assert.deepEqual(to_signatures(section), ["status?: Status = 'inform'", 'value: string']);
		const entries = Array.from(section.querySelectorAll(':scope > section'));
		assert.strictEqual(entries[0]!.querySelector('.chip'), null);
		assert.strictEqual(entries[1]!.querySelector('.chip')?.textContent, 'bindable');
	});

	test('members come before examples', () => {
		const container = mount_detail({
			name: 'A',
			kind: 'class',
			examples: ['an example'],
			members: [{ name: 'id', kind: 'variable', typeSignature: 'string' }]
		});
		const labels = to_labels(container);
		assert.isBelow(labels.indexOf('members'), labels.indexOf('examples'));
	});
});

describe('DeclarationDetail field anchors', () => {
	const to_ids = (container: HTMLElement): Array<string> =>
		Array.from(container.querySelectorAll('[id]')).map((el) => el.id);

	test('fields carry their `Declaration.field` fragment as an id, with a hashlink', () => {
		const container = mount_detail({
			name: 'A',
			kind: 'class',
			members: [
				{ name: 'id', kind: 'variable', typeSignature: 'string' },
				{
					name: 'toggle',
					kind: 'function',
					parameters: [{ name: 'event', type: 'Event', description: 'the trigger' }],
					returnType: 'void'
				}
			]
		});
		assert.deepEqual(to_ids(container), ['A.id', 'A.toggle', 'A.toggle.event']);
		assert.deepEqual(
			Array.from(container.querySelectorAll('a.hashlink')).map((a) => a.getAttribute('href')),
			['#A.id', '#A.toggle', '#A.toggle.event']
		);
	});

	test('a function addresses its parameters', () => {
		const fn = mount_detail({
			name: 'f',
			kind: 'function',
			parameters: [{ name: 'a', type: 'string', description: 'the first' }]
		});
		assert.deepEqual(to_ids(fn), ['f.a']);
	});

	test('a component addresses its props and CSS custom properties', () => {
		const container = mount_detail({
			name: 'A',
			kind: 'component',
			props: [{ name: 'status', type: 'string' }],
			cssCustomProperties: [{ name: '--a_color', fallback: 'red', sourceLine: 3 }]
		});
		assert.deepEqual(to_ids(container), ['A.status', 'A.--a_color']);
	});

	test('a name that cannot be a unique id gets none', () => {
		const container = mount_detail({
			name: 'A',
			kind: 'type',
			members: [
				{ name: '[key: string]', kind: 'variable', typeSignature: 'number' },
				{ name: '(call)', kind: 'function', returnType: 'void' }
			]
		});
		assert.deepEqual(to_ids(container), []);
	});
});

describe('DeclarationDetail flat type links', () => {
	test('heritage links the names inside a composite type', () => {
		const container = mount_detail({ name: 'A', kind: 'class', extends: ['Base<Options>'] }, [
			'Base',
			'Options'
		]);
		const section = find_section(container, 'inheritance');
		assert.include(section.textContent, 'Base<Options>');
		assert.deepEqual(
			Array.from(section.querySelectorAll('a')).map((a) => a.textContent),
			['Base', 'Options']
		);
	});

	test('a throws type links when it resolves', () => {
		const container = mount_detail(
			{ name: 'f', kind: 'function', throws: [{ type: 'AError', description: 'when it fails' }] },
			['AError']
		);
		const section = find_section(container, 'throws');
		assert.strictEqual(section.querySelector('a')?.getAttribute('href'), '/docs/api/x.ts#AError');
		assert.include(section.textContent, 'when it fails');
	});
});

describe('DeclarationDetail CSS custom properties', () => {
	test('an all-inferred list shows no chips and no legend', () => {
		const container = mount_detail({
			name: 'A',
			kind: 'component',
			cssCustomProperties: [
				{ name: '--a', fallback: 'red', sourceLine: 3 },
				{ name: '--b', fallback: '1px', sourceLine: 4 }
			]
		});
		const section = find_css_section(container);
		assert.strictEqual(section.querySelectorAll('.chip').length, 0);
		assert.strictEqual(section.querySelector('p'), null);
	});

	test('a mixed list marks the inferred entries and explains the chip', () => {
		const container = mount_detail({
			name: 'A',
			kind: 'component',
			cssCustomProperties: [
				{ name: '--a', syntax: '<color>', sourceLine: 2, documented: true },
				{ name: '--b', fallback: '1px', sourceLine: 4 }
			]
		});
		const section = find_css_section(container);
		const legend = section.querySelector(':scope > p');
		assert.ok(legend, 'expected the legend line');
		assert.include(legend.textContent, 'inferred');
		assert.include(legend.textContent, '@cssprop');
		const entries = Array.from(section.querySelectorAll(':scope > section'));
		assert.strictEqual(entries.length, 2);
		assert.strictEqual(entries[0]!.querySelectorAll('.chip').length, 0);
		assert.strictEqual(entries[1]!.querySelector('.chip')?.textContent, 'inferred');
		assert.strictEqual(section.querySelector('.chip[title]'), null);
	});

	test('an empty list renders no section', () => {
		const container = mount_detail({ name: 'A', kind: 'component', cssCustomProperties: [] });
		const headings = Array.from(container.querySelectorAll('h4')).map((h) => h.textContent);
		assert.notInclude(headings, 'CSS custom properties');
	});
});
