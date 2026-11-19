/**
 * Server-render tests for `Docs` — the `layout` prop's class on its shell,
 * the rule that class carries (from the compiler's CSS output, which
 * `render` omits), and the nested mode, which renders no shell of its own.
 *
 * @module
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, test, assert, vi } from 'vitest';
import { createRawSnippet } from 'svelte';
import { compile } from 'svelte/compiler';
import { render } from 'svelte/server';

import DocsHarness from './DocsHarness.svelte';

// `Docs` and its breadcrumb read the page's URL
vi.mock('$app/state', () => ({ page: { url: new URL('https://fuz.test/docs') } }));

const docs_path = fileURLToPath(new URL('../lib/Docs.svelte', import.meta.url));

const children = createRawSnippet(() => ({ render: () => '<p>page</p>' }));

/** The class tokens of the first element carrying `class_name`. */
const get_classes = (html: string, class_name: string): Array<string> => {
	for (const match of html.matchAll(/\sclass="([^"]*)"/g)) {
		const classes = match[1]!.split(/\s+/);
		if (classes.includes(class_name)) return classes;
	}
	throw new Error(`expected an element with class ${class_name}`);
};

describe('Docs layout', () => {
	test('centered by default', () => {
		const { body } = render(DocsHarness, { props: { tomes: [], children } });
		assert.include(get_classes(body, 'docs-shell'), 'docs-shell-centered');
	});

	test('flush drops the centered class', () => {
		const { body } = render(DocsHarness, { props: { tomes: [], layout: 'flush', children } });
		assert.notInclude(get_classes(body, 'docs-shell'), 'docs-shell-centered');
	});

	test('nested renders no shell of its own', () => {
		const { body } = render(DocsHarness, { props: { tomes: [], nested: true, children } });
		assert.notInclude(body, 'docs-shell');
		assert.include(get_classes(body, 'docs'), 'nested');
		assert.include(body, '<p>page</p>');
	});

	test('the centered class sets `--sidebar_left` and nothing else does', () => {
		const { css } = compile(readFileSync(docs_path, 'utf-8'), {
			filename: docs_path,
			generate: 'server'
		});
		assert.ok(css);
		const code = css.code.replace(/\/\*[\s\S]*?\*\//g, '');
		const rules = Array.from(code.matchAll(/([^{}]+)\{[^{}]*--sidebar_left:([^;}]+)/g), (m) => [
			m[1]!.trim(),
			m[2]!.replace(/\s+/g, ' ').trim()
		]);
		// the page is centered in the viewport, so the menu ends where it starts
		assert.deepEqual(rules, [
			[
				'.docs-shell.app-shell.docs-shell-centered',
				'max( 0px, calc((100% - var(--docs_content_max_width)) / 2 - var(--sidebar_width)) )'
			]
		]);
	});
});
