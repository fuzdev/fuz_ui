/**
 * @vitest-environment jsdom
 */
import { describe, test, assert, afterEach } from 'vitest';
import { flushSync } from 'svelte';
import type { DeclarationJsonInput } from 'svelte-docinfo/types.js';

import { Declaration } from '#lib/declaration.svelte.ts';
import type { Library } from '#lib/library.svelte.ts';
import type { Module } from '#lib/module.svelte.ts';
import DocsLinkHarness from './DocsLinkHarness.svelte';
import { mount_component, unmount_component } from './test_helpers.ts';

let mounted: { instance: any; container: HTMLElement } | null = null;

afterEach(async () => {
	if (mounted) {
		await unmount_component(mounted.instance, mounted.container);
		mounted = null;
	}
});

// real `Declaration`s over a stub module, since field resolution reads the
// declaration's own members and props
const create_library = (declarations: Array<Record<string, unknown>>): Library => {
	const module = { path: 'a.ts', library: { pkg_json: { name: 'pkg' }, url_prefix: '' } };
	return {
		declaration_by_name: new Map(
			declarations.map((json) => [
				json.name as string,
				new Declaration(module as unknown as Module, json as unknown as DeclarationJsonInput)
			])
		),
		module_by_path: new Map()
	} as unknown as Library;
};

const library = create_library([
	{
		name: 'A',
		kind: 'class',
		members: [
			{ name: 'id', kind: 'variable', typeSignature: 'string' },
			{ name: 'toggle', kind: 'function', returnType: 'void' },
			{ name: '[key: string]', kind: 'variable', typeSignature: 'number' }
		]
	},
	{
		name: 'B',
		kind: 'component',
		props: [{ name: 'status', type: 'string' }],
		cssCustomProperties: [{ name: '--b_color', fallback: 'red', sourceLine: 1 }]
	}
]);

const mount_link = (reference: string): HTMLElement => {
	mounted = mount_component(DocsLinkHarness as any, { reference, library });
	flushSync();
	return mounted.container;
};

describe('DocsLink', () => {
	test('a declaration name links to the declaration', () => {
		const link = mount_link('A').querySelector('a');
		assert.ok(link, 'expected a link');
		assert.strictEqual(link.getAttribute('href'), '/docs/api/a.ts#A');
		assert.strictEqual(link.textContent.trim(), 'A');
	});

	const field_cases: Array<[label: string, reference: string, href: string]> = [
		['a member', 'A.id', '/docs/api/a.ts#A.id'],
		['a method written as a call', 'A.toggle()', '/docs/api/a.ts#A.toggle'],
		['a prop', 'B.status', '/docs/api/a.ts#B.status'],
		['a CSS custom property', 'B.--b_color', '/docs/api/a.ts#B.--b_color']
	];
	test.each(field_cases)('%s links to its field anchor', (_label, reference, href) => {
		const link = mount_link(reference).querySelector('a');
		assert.ok(link, 'expected a link');
		assert.strictEqual(link.getAttribute('href'), href);
		// the prose keeps what the author wrote
		assert.strictEqual(link.textContent.trim(), reference);
	});

	const code_cases: Array<[label: string, reference: string]> = [
		['a field the declaration lacks', 'A.missing'],
		['a nested path, which has an anchor only when its row renders', 'A.toggle.event'],
		['a field with no anchor', 'A.[key: string]'],
		['an unknown owner', 'Object.keys'],
		['a leading dot', '.id']
	];
	test.each(code_cases)('%s stays plain code', (_label, reference) => {
		const container = mount_link(reference);
		assert.strictEqual(container.querySelector('a'), null);
		assert.strictEqual(container.querySelector('code')?.textContent, reference);
	});
});
