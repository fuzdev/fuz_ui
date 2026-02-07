import {test, assert, describe} from 'vitest';

import {escape_svelte_text} from '@fuzdev/fuz_util/svelte_preprocess_helpers.js';

import {mdz_parse} from '$lib/mdz.js';
import {mdz_to_svelte, type MdzToSvelteResult} from '$lib/mdz_to_svelte.js';

/** Parses mdz content and converts to Svelte markup in one step. */
const convert = (
	content: string,
	components: Record<string, string> = {},
	elements: ReadonlySet<string> = new Set(),
): MdzToSvelteResult => mdz_to_svelte(mdz_parse(content), components, elements);

/** Asserts that an import exists with the expected path and kind. */
const assert_import = (
	result: MdzToSvelteResult,
	name: string,
	path: string,
	kind: 'default' | 'named',
): void => {
	assert.ok(result.imports.has(name), `expected import '${name}'`);
	const info = result.imports.get(name)!;
	assert.equal(info.path, path);
	assert.equal(info.kind, kind);
};

describe('escape_svelte_text', () => {
	test('escapes opening curly brace', () => {
		assert.equal(escape_svelte_text('{'), "{'{'}");
	});

	test('escapes closing curly brace', () => {
		assert.equal(escape_svelte_text('}'), "{'}'}");
	});

	test('escapes less-than sign', () => {
		assert.equal(escape_svelte_text('<'), '&lt;');
	});

	test('escapes ampersand', () => {
		assert.equal(escape_svelte_text('&'), '&amp;');
	});

	test('escapes mixed special characters', () => {
		assert.equal(escape_svelte_text('{foo} < bar & baz'), "{'{'}foo{'}'} &lt; bar &amp; baz");
	});

	test('returns empty string unchanged', () => {
		assert.equal(escape_svelte_text(''), '');
	});

	test('returns string without special chars unchanged', () => {
		assert.equal(escape_svelte_text('hello world'), 'hello world');
	});

	test('regression: single-pass prevents sequential replace corruption', () => {
		// With sequential .replace() calls, {foo} would corrupt to {'{'{'}'} foo{'}'}
		// because the } in {'{'} from the first replace gets caught by the second replace.
		// Single-pass correctly produces {'{'}foo{'}'}.
		assert.equal(escape_svelte_text('{foo}'), "{'{'}foo{'}'}");
	});

	test('handles Svelte-like syntax in text', () => {
		assert.equal(
			escape_svelte_text('Use {#if} for conditionals'),
			"Use {'{'}#if{'}'} for conditionals",
		);
	});

	test('handles multiple adjacent special characters', () => {
		assert.equal(escape_svelte_text('{}'), "{'{'}{'}'}");
		assert.equal(escape_svelte_text('<<'), '&lt;&lt;');
		assert.equal(escape_svelte_text('&&'), '&amp;&amp;');
	});

	test('preserves whitespace including newlines', () => {
		assert.equal(escape_svelte_text('line 1\nline 2'), 'line 1\nline 2');
		assert.equal(escape_svelte_text('\t\tindented'), '\t\tindented');
	});

	test('does not escape greater-than sign', () => {
		assert.equal(escape_svelte_text('a > b'), 'a > b');
	});

	test('handles HTML entity-like content', () => {
		// If mdz text contains &amp; literally, it must be escaped to &amp;amp;
		// so the browser renders &amp; (matching runtime behavior).
		assert.equal(escape_svelte_text('&amp;'), '&amp;amp;');
		assert.equal(escape_svelte_text('&lt;'), '&amp;lt;');
	});
});

describe('mdz_to_svelte', () => {
	describe('text nodes', () => {
		test('renders plain text', () => {
			const result = convert('hello world');
			assert.equal(result.markup, '<p>hello world</p>');
			assert.equal(result.imports.size, 0);
			assert.equal(result.has_unconfigured_tags, false);
		});

		test('escapes special characters in text', () => {
			const result = convert('Use {#if} for conditionals');
			assert.equal(result.markup, "<p>Use {'{'}#if{'}'} for conditionals</p>");
		});

		test('escapes ampersand in text', () => {
			const result = convert('a & b');
			assert.equal(result.markup, '<p>a &amp; b</p>');
		});
	});

	describe('code nodes', () => {
		test('renders inline code as DocsLink', () => {
			const result = convert('`some_fn`');
			assert.ok(result.markup.includes("<DocsLink reference={'some_fn'} />"));
			assert_import(result, 'DocsLink', '@fuzdev/fuz_ui/DocsLink.svelte', 'default');
		});

		test('escapes special chars in code reference', () => {
			const result = convert("`it's`");
			assert.ok(result.markup.includes("reference={'it\\'s'}"));
		});

		test('deduplicates DocsLink import across multiple code nodes', () => {
			const result = convert('`fn_a` and `fn_b`');
			assert_import(result, 'DocsLink', '@fuzdev/fuz_ui/DocsLink.svelte', 'default');
			assert.equal(result.imports.size, 1);
		});
	});

	describe('codeblock nodes', () => {
		test('renders codeblock with lang as Code component', () => {
			const result = convert('```ts\nconst x = 1;\n```');
			assert.ok(result.markup.includes('<Code'));
			assert.ok(result.markup.includes("lang={'ts'}"));
			assert.ok(result.markup.includes("content={'const x = 1;'}"));
			assert_import(result, 'Code', '@fuzdev/fuz_code/Code.svelte', 'default');
		});

		test('renders codeblock with null lang', () => {
			const result = convert('```\nsome code\n```');
			assert.ok(result.markup.includes('lang={null}'));
			assert.ok(result.markup.includes("content={'some code'}"));
		});

		test('escapes special chars in codeblock content', () => {
			const result = convert("```ts\nconst x = 'hello';\n```");
			assert.ok(result.markup.includes("content={'const x = \\'hello\\';'}"));
		});

		test('escapes newlines in codeblock content', () => {
			const result = convert('```ts\nline 1\nline 2\n```');
			assert.ok(result.markup.includes('line 1\\nline 2'));
		});

		test('escapes backslashes in codeblock content', () => {
			const result = convert('```ts\nconst re = /a\\b/;\n```');
			assert.ok(result.markup.includes('a\\\\b'));
		});
	});

	describe('formatting nodes', () => {
		test('renders bold', () => {
			const result = convert('**bold**');
			assert.equal(result.markup, '<p><strong>bold</strong></p>');
		});

		test('renders italic', () => {
			const result = convert('_italic_');
			assert.equal(result.markup, '<p><em>italic</em></p>');
		});

		test('renders strikethrough', () => {
			const result = convert('~struck~');
			assert.equal(result.markup, '<p><s>struck</s></p>');
		});

		test('renders nested formatting', () => {
			const result = convert('**bold _italic_ bold**');
			assert.equal(result.markup, '<p><strong>bold <em>italic</em> bold</strong></p>');
		});
	});

	describe('link nodes', () => {
		test('renders internal link with resolve', () => {
			const result = convert('[docs](/docs/foo)');
			assert.ok(result.markup.includes("href={resolve('/docs/foo')}"));
			assert.ok(result.markup.includes('>docs</a>'));
			assert_import(result, 'resolve', '$app/paths', 'named');
		});

		test('renders fragment link without resolve', () => {
			const result = convert('[section](#foo)');
			assert.ok(result.markup.includes("href={'#foo'}"));
			assert.ok(!result.imports.has('resolve'));
		});

		test('renders query link without resolve', () => {
			const result = convert('[tab](?tab=1)');
			assert.ok(result.markup.includes("href={'?tab=1'}"));
			assert.ok(!result.imports.has('resolve'));
		});

		test('renders external link', () => {
			const result = convert('[link](https://example.com)');
			assert.ok(result.markup.includes("href={'https://example.com'}"));
			assert.ok(result.markup.includes('target="_blank"'));
			assert.ok(result.markup.includes('rel="noopener"'));
			assert.ok(!result.imports.has('resolve'));
		});

		test('renders auto-detected URL', () => {
			const result = convert('visit https://example.com today');
			assert.ok(result.markup.includes("href={'https://example.com'}"));
			assert.ok(result.markup.includes('target="_blank"'));
		});

		test('renders auto-detected internal path', () => {
			const result = convert('see /docs/api');
			assert.ok(result.markup.includes("href={resolve('/docs/api')}"));
			assert_import(result, 'resolve', '$app/paths', 'named');
		});

		test('escapes special chars in link reference', () => {
			const result = convert("[docs](/docs/it's)");
			assert.ok(result.markup.includes("resolve('/docs/it\\'s')"));
		});

		test('renders link with formatted children', () => {
			const result = convert('[**bold** text](/path)');
			assert.ok(result.markup.includes('<strong>bold</strong> text</a>'));
			assert_import(result, 'resolve', '$app/paths', 'named');
		});

		test('escapes special chars in link children', () => {
			const result = convert('[a & b](/path)');
			assert.ok(result.markup.includes('>a &amp; b</a>'));
		});
	});

	describe('block nodes', () => {
		test('renders paragraph', () => {
			const result = convert('hello');
			assert.equal(result.markup, '<p>hello</p>');
		});

		test('renders hr', () => {
			const result = convert('---');
			assert.equal(result.markup, '<hr />');
		});

		test('renders headings at all levels', () => {
			for (let level = 1; level <= 6; level++) {
				const hashes = '#'.repeat(level);
				const result = convert(`${hashes} Title`);
				assert.equal(result.markup, `<h${level}>Title</h${level}>`);
			}
		});

		test('renders heading with inline formatting', () => {
			const result = convert('## **Bold** title');
			assert.equal(result.markup, '<h2><strong>Bold</strong> title</h2>');
		});

		test('renders multiple paragraphs', () => {
			const result = convert('first\n\nsecond');
			assert.equal(result.markup, '<p>first</p><p>second</p>');
		});

		test('renders heading with inline code', () => {
			const result = convert('## The `api` method');
			assert.equal(result.markup, "<h2>The <DocsLink reference={'api'} /> method</h2>");
			assert_import(result, 'DocsLink', '@fuzdev/fuz_ui/DocsLink.svelte', 'default');
		});
	});

	describe('element and component nodes', () => {
		test('renders configured element', () => {
			const result = convert('<aside>note</aside>', {}, new Set(['aside']));
			assert.equal(result.markup, '<aside>note</aside>');
			assert.equal(result.has_unconfigured_tags, false);
		});

		test('flags unconfigured element', () => {
			const result = convert('<aside>note</aside>');
			assert.equal(result.has_unconfigured_tags, true);
		});

		test('unconfigured element produces empty markup', () => {
			const result = convert('<aside>note</aside>');
			assert.equal(result.markup, '');
			assert.equal(result.has_unconfigured_tags, true);
		});

		test('renders configured component with import', () => {
			const result = convert('<Alert>warning</Alert>', {Alert: '$lib/Alert.svelte'});
			assert.equal(result.markup, '<Alert>warning</Alert>');
			assert_import(result, 'Alert', '$lib/Alert.svelte', 'default');
			assert.equal(result.has_unconfigured_tags, false);
		});

		test('flags unconfigured component', () => {
			const result = convert('<Foo>text</Foo>');
			assert.equal(result.has_unconfigured_tags, true);
		});

		test('unconfigured component produces empty markup', () => {
			const result = convert('<Foo>text</Foo>');
			assert.equal(result.markup, '');
			assert.equal(result.has_unconfigured_tags, true);
		});

		test('renders self-closing configured element', () => {
			const result = convert('<hr />', {}, new Set(['hr']));
			// mdz parser may handle <hr /> as an Element with no children
			assert.equal(result.has_unconfigured_tags, false);
		});

		test('renders configured component with formatted children', () => {
			const result = convert('<Alert>**bold** note</Alert>', {Alert: '$lib/Alert.svelte'});
			assert.ok(result.markup.includes('<strong>bold</strong>'));
			assert.ok(result.markup.includes('<Alert>'));
		});

		test('renders configured element with formatted children', () => {
			const result = convert('<aside>**bold** note</aside>', {}, new Set(['aside']));
			assert.ok(result.markup.includes('<strong>bold</strong>'));
			assert.ok(result.markup.includes('<aside>'));
		});
	});

	describe('import tracking', () => {
		test('adds DocsLink for Code nodes', () => {
			const result = convert('`some_fn`');
			assert_import(result, 'DocsLink', '@fuzdev/fuz_ui/DocsLink.svelte', 'default');
		});

		test('adds Code for Codeblock nodes', () => {
			const result = convert('```ts\ncode\n```');
			assert_import(result, 'Code', '@fuzdev/fuz_code/Code.svelte', 'default');
		});

		test('adds resolve for internal links', () => {
			const result = convert('[docs](/docs/foo)');
			assert_import(result, 'resolve', '$app/paths', 'named');
		});

		test('does not add resolve for fragment links', () => {
			const result = convert('[section](#foo)');
			assert.ok(!result.imports.has('resolve'));
		});

		test('does not add resolve for query links', () => {
			const result = convert('[tab](?tab=1)');
			assert.ok(!result.imports.has('resolve'));
		});

		test('does not add resolve for external links', () => {
			const result = convert('[link](https://example.com)');
			assert.ok(!result.imports.has('resolve'));
		});

		test('adds configured component imports', () => {
			const result = convert('<Alert>warning</Alert>', {Alert: '$lib/Alert.svelte'});
			assert_import(result, 'Alert', '$lib/Alert.svelte', 'default');
		});

		test('collects multiple imports', () => {
			const result = convert('`fn` and [link](/path) and <Alert>hi</Alert>', {
				Alert: '$lib/Alert.svelte',
			});
			assert.ok(result.imports.has('DocsLink'));
			assert.ok(result.imports.has('resolve'));
			assert.ok(result.imports.has('Alert'));
		});

		test('no imports for plain text', () => {
			const result = convert('just text');
			assert.equal(result.imports.size, 0);
		});
	});

	describe('edge cases', () => {
		test('handles empty node array', () => {
			const result = mdz_to_svelte([], {}, new Set());
			assert.equal(result.markup, '');
			assert.equal(result.imports.size, 0);
			assert.equal(result.has_unconfigured_tags, false);
		});

		test('handles deeply nested formatting', () => {
			const result = convert('**bold _italic `code` italic_ bold**');
			assert.ok(result.markup.includes('<strong>'));
			assert.ok(result.markup.includes('<em>'));
			assert.ok(result.markup.includes('<DocsLink'));
		});

		test('handles content with all special characters', () => {
			const result = convert('{}<>&');
			assert.ok(result.markup.includes("{'{'}"));
			assert.ok(result.markup.includes("{'}'}"));
			assert.ok(result.markup.includes('&lt;'));
			assert.ok(result.markup.includes('&amp;'));
		});

		test('handles single component without paragraph wrapper', () => {
			// mdz parser wraps single components directly (MDX convention)
			const result = convert('<Alert>text</Alert>', {Alert: '$lib/Alert.svelte'});
			// Should NOT be wrapped in <p>
			assert.ok(!result.markup.includes('<p>'));
			assert.equal(result.markup, '<Alert>text</Alert>');
		});

		test('handles empty content string', () => {
			const result = convert('');
			assert.equal(result.markup, '');
		});

		test('handles mixed content with unconfigured tag', () => {
			// If any tag is unconfigured, has_unconfigured_tags is set
			const result = convert('text\n\n<Unknown>hi</Unknown>');
			assert.equal(result.has_unconfigured_tags, true);
		});

		test('renders configured content alongside unconfigured tags', () => {
			const result = convert('hello\n\n<Unknown>hi</Unknown>');
			assert.equal(result.has_unconfigured_tags, true);
			// configured text still renders
			assert.ok(result.markup.includes('<p>hello</p>'));
			// unconfigured tag produces empty output
			assert.ok(!result.markup.includes('Unknown'));
		});
	});
});
