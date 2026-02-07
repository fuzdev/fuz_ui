import {test, assert, describe, vi} from 'vitest';

import {
	run_preprocess,
	DEFAULT_TEST_OPTIONS,
} from './fixtures/svelte_preprocess_mdz/svelte_preprocess_mdz_test_helpers.js';

describe('dynamic content preservation', () => {
	test('preserves variable reference', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	let content = $state('**bold**');
</script>

<Mdz content={content} />`;

		const result = await run_preprocess(input);
		assert.equal(result, input, 'should be unchanged for dynamic content');
	});

	test('preserves template literal with interpolation', async () => {
		const input =
			"<script lang=\"ts\">\n\timport Mdz from '@fuzdev/fuz_ui/Mdz.svelte';\n\tlet value = 'x';\n</script>\n\n<Mdz content={`**${value}**`} />";

		const result = await run_preprocess(input);
		assert.equal(result, input, 'should be unchanged for dynamic content');
	});

	test('preserves ternary expression', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	let show = $state(true);
</script>

<Mdz content={show ? '**a**' : '**b**'} />`;

		const result = await run_preprocess(input);
		assert.equal(result, input, 'should be unchanged for dynamic content');
	});

	test('preserves function call expression', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	const get_content = () => '**bold**';
</script>

<Mdz content={get_content()} />`;

		const result = await run_preprocess(input);
		assert.equal(result, input, 'should be unchanged for dynamic content');
	});

	test('preserves $state rune const', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	const content = $state('**bold**');
</script>

<Mdz content={content} />`;

		const result = await run_preprocess(input);
		assert.equal(result, input, 'should be unchanged for $state rune');
	});

	test('preserves $derived rune const', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	const base = $state('**bold**');
	const content = $derived(base);
</script>

<Mdz content={content} />`;

		const result = await run_preprocess(input);
		assert.equal(result, input, 'should be unchanged for $derived rune');
	});
});

describe('const variable tracing', () => {
	test('transforms const variable reference', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	const msg = '**bold**';
</script>

<Mdz content={msg} />`;

		const result = await run_preprocess(input);
		assert.ok(result.includes('<strong>bold</strong>'), 'should transform const variable');
	});

	test('transforms template with const interpolation', async () => {
		const input =
			"<script lang=\"ts\">\n\timport Mdz from '@fuzdev/fuz_ui/Mdz.svelte';\n\tconst name = 'world';\n</script>\n\n<Mdz content={`hello ${name}`} />";

		const result = await run_preprocess(input);
		assert.ok(result.includes('hello world'), 'should resolve const interpolation');
	});
});

describe('spread attributes', () => {
	test('skips usage with spread attributes', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	const props = { content: '**bold**' };
</script>

<Mdz {...props} />`;

		const result = await run_preprocess(input);
		assert.equal(result, input, 'should be unchanged with spread attributes');
	});

	test('skips when spread and static content coexist', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	const props = { class: 'foo' };
</script>

<Mdz {...props} content="**bold**" />`;

		const result = await run_preprocess(input);
		assert.equal(result, input, 'should be unchanged with spread attributes');
	});
});

describe('unconfigured tags', () => {
	test('skips usage with unconfigured component', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="<Unknown>text</Unknown>" />`;

		const result = await run_preprocess(input);
		assert.equal(result, input, 'should be unchanged for unconfigured component');
	});

	test('skips usage with unconfigured element', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="<blockquote>text</blockquote>" />`;

		const result = await run_preprocess(input);
		assert.equal(result, input, 'should be unchanged for unconfigured element');
	});

	test('transforms configured but skips unconfigured in same file', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="**bold**" />
<Mdz content="<Unknown>text</Unknown>" />`;

		const result = await run_preprocess(input);
		assert.ok(result.includes('<strong>bold</strong>'), 'should transform configured content');
		assert.ok(
			result.includes('content="<Unknown>text</Unknown>"'),
			'should keep unconfigured content',
		);
	});

	test('skips unconfigured components with empty config', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="<Alert>text</Alert>" />`;

		const result = await run_preprocess(input, {});
		assert.equal(result, input, 'should be unchanged for unconfigured component with empty config');
	});

	test('transforms plain markup with empty config', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="**bold** text" />`;

		const result = await run_preprocess(input, {});
		assert.ok(result.includes('<strong>bold</strong>'), 'should transform without config');
	});
});

describe('missing or wrong imports', () => {
	test('skips Mdz without content attribute', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz />`;

		const result = await run_preprocess(input);
		assert.equal(result, input, 'should be unchanged');
	});

	test('skips files without Mdz import', async () => {
		const input = `<p>Hello</p>`;
		const result = await run_preprocess(input);
		assert.equal(result, input, 'should be unchanged');
	});

	test('skips files without matching import source', async () => {
		const input = `<script lang="ts">
	import Mdz from 'other-package/Mdz.svelte';
</script>

<Mdz content="**bold**" />`;

		const result = await run_preprocess(input);
		assert.equal(result, input, 'should be unchanged');
	});

	test('skips namespace import', async () => {
		const input = `<script lang="ts">
	import * as Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="**bold**" />`;

		const result = await run_preprocess(input);
		assert.equal(result, input, 'should be unchanged for namespace import');
	});

	test('import type is not treated as component import', async () => {
		const input = `<script lang="ts">
	import type Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="**bold**" />`;

		// The preprocessor doesn't distinguish `import type` from `import` —
		// resolve_component_names treats both as ImportDeclaration.
		// It transforms the content; the Svelte compiler catches the runtime error downstream.
		const result = await run_preprocess(input);
		assert.ok(
			result.includes('<strong>bold</strong>'),
			'should still transform (import type not filtered)',
		);
	});
});

describe('excluded files', () => {
	test('skips excluded files with regex', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="**bold**" />`;

		const result = await run_preprocess(
			input,
			{...DEFAULT_TEST_OPTIONS, exclude: [/Test\.svelte$/]},
			'Test.svelte',
		);
		assert.equal(result, input, 'should be unchanged');
	});

	test('skips excluded files with string pattern', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="**bold**" />`;

		const result = await run_preprocess(
			input,
			{...DEFAULT_TEST_OPTIONS, exclude: ['fixtures/']},
			'src/test/fixtures/Test.svelte',
		);
		assert.equal(result, input, 'should be unchanged for excluded file');
	});
});

describe('nesting depth', () => {
	test('transforms Mdz deeply nested in control flow and components', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	import Wrapper from './Wrapper.svelte';
	const items = ['a'];
	const show = true;
</script>

<Wrapper>
	{#if show}
		{#each items as item}
			<Mdz content="**bold**" />
		{/each}
	{/if}
</Wrapper>`;

		const result = await run_preprocess(input);
		assert.ok(result.includes('<strong>bold</strong>'), 'should transform deeply nested Mdz');
		assert.ok(result.includes('<MdzPrecompiled>'), 'should use MdzPrecompiled');
	});
});

describe('empty children', () => {
	test('transforms component with empty children in mdz content', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="<Alert></Alert>" />`;

		const result = await run_preprocess(input);
		assert.ok(result.includes('<Alert></Alert>'), 'should render empty component');
		assert.ok(result.includes('<MdzPrecompiled>'), 'should use MdzPrecompiled');
	});

	test('transforms element with empty children in mdz content', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="<aside></aside>" />`;

		const result = await run_preprocess(input);
		assert.ok(result.includes('<aside></aside>'), 'should render empty element');
		assert.ok(result.includes('<MdzPrecompiled>'), 'should use MdzPrecompiled');
	});
});

describe('on_error', () => {
	test('throw mode throws on parse failure', async () => {
		const mdz_module = await import('$lib/mdz.js');
		const spy = vi.spyOn(mdz_module, 'mdz_parse').mockImplementation(() => {
			throw new Error('mock parse failure');
		});

		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="**bold**" />`;

		try {
			let threw = false;
			try {
				await run_preprocess(input, {...DEFAULT_TEST_OPTIONS, on_error: 'throw'});
			} catch (error) {
				threw = true;
				assert.ok(error instanceof Error);
				assert.ok(error.message.includes('[fuz-mdz]'));
				assert.ok(error.message.includes('mock parse failure'));
			}
			assert.ok(threw, 'should have thrown');
		} finally {
			spy.mockRestore();
		}
	});

	test('log mode skips failed transformation and logs error', async () => {
		const mdz_module = await import('$lib/mdz.js');
		const parse_spy = vi.spyOn(mdz_module, 'mdz_parse').mockImplementation(() => {
			throw new Error('mock parse failure');
		});
		const error_spy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="**bold**" />`;

		try {
			const result = await run_preprocess(input, {...DEFAULT_TEST_OPTIONS, on_error: 'log'});
			assert.equal(result, input, 'should be unchanged when parse fails in log mode');
			assert.equal(error_spy.mock.calls.length, 1, 'should log exactly one error');
			assert.ok(
				(error_spy.mock.calls[0]![0] as string).includes('[fuz-mdz]'),
				'error message should include preprocessor prefix',
			);
			assert.ok(
				(error_spy.mock.calls[0]![0] as string).includes('mock parse failure'),
				'error message should include original error',
			);
		} finally {
			parse_spy.mockRestore();
			error_spy.mockRestore();
		}
	});
});
