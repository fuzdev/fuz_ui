/**
 * @vitest-environment jsdom
 */
import { describe, test, assert, afterEach } from 'vitest';
import { flushSync } from 'svelte';
import type { TypeJson } from 'svelte-docinfo/types.js';

import type { Library } from '#lib/library.svelte.ts';
import TypeLinkHarness from './TypeLinkHarness.svelte';
import { mount_component, unmount_component } from './test_helpers.ts';
import { fake_library } from './library_test_helpers.ts';

let mounted: { instance: any; container: HTMLElement } | null = null;

afterEach(async () => {
	if (mounted) {
		await unmount_component(mounted.instance, mounted.container);
		mounted = null;
	}
});

const mount_link = (
	props: { type: string; type_info?: TypeJson; hash?: string },
	library: Library = fake_library()
): HTMLElement => {
	mounted = mount_component(TypeLinkHarness as any, { ...props, library });
	flushSync();
	return mounted.container;
};

describe('TypeLink', () => {
	test('delegates to TypeJsonView when given type_info, with the flat string as hover text', () => {
		const container = mount_link(
			{
				type: '{ x: number; y: number; }',
				type_info: {
					kind: 'union',
					members: [
						{ kind: 'reference', name: 'A' },
						{ kind: 'intrinsic', text: 'null' }
					]
				}
			},
			fake_library(['A'])
		);
		// structured render, not the flat string
		assert.strictEqual(container.textContent, 'A | null');
		const wrapper = container.querySelector('code.type-json-view');
		assert.ok(wrapper, 'expected the structured wrapper');
		assert.strictEqual(wrapper.getAttribute('title'), '{ x: number; y: number; }');
		assert.ok(wrapper.querySelector('a'), 'expected a link inside the tree');
	});

	test('an absent tree falls through to the whole-string declaration match', () => {
		const container = mount_link({ type: 'A' }, fake_library(['A']));
		const link = container.querySelector('a');
		assert.ok(link, 'expected a link');
		assert.strictEqual(link.getAttribute('href'), '/docs/api/x.ts#A');
		assert.strictEqual(container.querySelector('code.type-json-view'), null);
	});

	test('a hash replaces the fragment of a declaration link', () => {
		const container = mount_link({ type: 'A', hash: 'A.field' }, fake_library(['A']));
		assert.strictEqual(
			container.querySelector('a')?.getAttribute('href'),
			'/docs/api/x.ts#A.field'
		);
	});

	test('a keyword type never links, even when the library exports the name', () => {
		const container = mount_link({ type: 'string' }, fake_library(['string']));
		assert.strictEqual(container.querySelector('a'), null);
		assert.strictEqual(container.querySelector('code')?.textContent, 'string');
	});

	test('an absent tree links the names found inside a composite string', () => {
		const container = mount_link({ type: 'Map<string, A>' }, fake_library(['A']));
		const wrapper = container.querySelector('code.type-link');
		assert.ok(wrapper, 'expected the one code wrapper');
		// whitespace-exact: the tokens render adjacent
		assert.strictEqual(wrapper.textContent, 'Map<string, A>');
		const links = Array.from(wrapper.querySelectorAll('a'));
		assert.deepEqual(
			links.map((a) => a.getAttribute('href')),
			['/docs/api/x.ts#A']
		);
	});

	test('an absent tree with an unresolvable string falls through to inline code', () => {
		const container = mount_link({ type: 'Map<string, A>' });
		assert.strictEqual(container.querySelector('a'), null);
		const code = container.querySelector('code');
		assert.ok(code, 'expected the code fallback');
		assert.strictEqual(code.textContent, 'Map<string, A>');
	});
});
