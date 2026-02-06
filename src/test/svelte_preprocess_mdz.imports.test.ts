import {test, assert, describe} from 'vitest';

import {
	run_preprocess,
	DEFAULT_TEST_OPTIONS,
} from './fixtures/svelte_preprocess_mdz/svelte_preprocess_mdz_test_helpers.ts';

describe('import addition', () => {
	test('adds DocsLink import for inline code', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="\`some_fn\`" />`;

		const result = await run_preprocess(input);
		assert.ok(
			result.includes("import DocsLink from '@fuzdev/fuz_ui/DocsLink.svelte'"),
			'should add DocsLink import',
		);
	});

	test('adds Code import for codeblocks', async () => {
		const input =
			'<script lang="ts">\n\timport Mdz from \'@fuzdev/fuz_ui/Mdz.svelte\';\n</script>\n\n<Mdz content={`\\`\\`\\`ts\nconst x = 1;\n\\`\\`\\``} />';

		const result = await run_preprocess(input);
		assert.ok(
			result.includes("import Code from '@fuzdev/fuz_code/Code.svelte'"),
			'should add Code import',
		);
	});

	test('adds resolve import for internal links', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="[docs](/docs/foo)" />`;

		const result = await run_preprocess(input);
		assert.ok(result.includes("import {resolve} from '$app/paths'"), 'should add resolve import');
		assert.ok(result.includes("resolve('/docs/foo')"), 'should use resolve for internal link');
	});

	test('does not add resolve import for fragment links', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="[section](#foo)" />`;

		const result = await run_preprocess(input);
		assert.ok(result.includes("href={'#foo'}"), 'should use fragment href directly');
		assert.ok(!result.includes('resolve'), 'should not import resolve for fragment links');
	});

	test('adds component import from config', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="<Alert>warning</Alert>" />`;

		const result = await run_preprocess(input);
		assert.ok(result.includes("import Alert from '$lib/Alert.svelte'"), 'should add Alert import');
	});
});

describe('import deduplication', () => {
	test('does not duplicate existing imports', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	import DocsLink from '@fuzdev/fuz_ui/DocsLink.svelte';
</script>

<Mdz content="\`some_fn\`" />`;

		const result = await run_preprocess(input);
		const matches = result.match(/import DocsLink/g);
		assert.equal(matches?.length, 1, 'should not duplicate DocsLink import');
	});

	test('merges imports across multiple transformations', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="\`fn_a\`" />
<Mdz content="\`fn_b\`" />`;

		const result = await run_preprocess(input);
		const matches = result.match(/import DocsLink/g);
		assert.equal(matches?.length, 1, 'should add DocsLink only once');
	});

	test('skips silently on name collision from different source', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	import DocsLink from './local/DocsLink.svelte';
</script>

<Mdz content="\`some_fn\`" />`;

		const result = await run_preprocess(input);
		// DocsLink already imported from a different source — preprocessor should not add a duplicate
		const matches = result.match(/import DocsLink/g);
		assert.equal(matches?.length, 1, 'should not add conflicting DocsLink import');
		// The existing import from the different source should be preserved
		assert.ok(
			result.includes("import DocsLink from './local/DocsLink.svelte'"),
			'should keep existing DocsLink import',
		);
	});
});

describe('script handling', () => {
	test('handles module-only script by adding instance script', async () => {
		const input = `<script module>
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="\`some_fn\`" />`;

		const result = await run_preprocess(input);
		assert.ok(result.includes("<DocsLink reference={'some_fn'} />"), 'should render DocsLink');
		assert.ok(result.includes('import DocsLink'), 'should add DocsLink import');
		assert.ok(result.includes('<script lang="ts">'), 'should create instance script');
	});

	test('module-only: instance script appears after module script', async () => {
		const input = `<script module>
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="\`some_fn\`" />`;

		const result = await run_preprocess(input);
		const module_pos = result.indexOf('<script module>');
		const instance_pos = result.indexOf('<script lang="ts">');
		assert.ok(instance_pos > module_pos, 'instance script should come after module script');
	});

	test('bail out when file has no Mdz import string', async () => {
		// This tests the quick bail-out path — file doesn't even mention
		// the import source string, so no AST parsing happens.
		const input = `<Mdz content="**bold**" />`;
		const result = await run_preprocess(input);
		assert.equal(result, input, 'should be unchanged without Mdz import source');
	});
});

describe('import resolution', () => {
	test('handles renamed import', async () => {
		const input = `<script lang="ts">
	import Markdown from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Markdown content="**bold**" />`;

		const result = await run_preprocess(input);
		assert.ok(result.includes('<strong>bold</strong>'), 'should transform renamed Mdz');
	});

	test('handles import in module script block', async () => {
		const input = `<script module>
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="**bold**" />`;

		const result = await run_preprocess(input);
		assert.ok(result.includes('<strong>bold</strong>'), 'should transform');
	});

	test('respects custom component_imports', async () => {
		const input = `<script lang="ts">
	import Mdz from '$lib/Mdz.svelte';
</script>

<Mdz content="**bold**" />`;

		const result = await run_preprocess(input, {
			...DEFAULT_TEST_OPTIONS,
			component_imports: ['$lib/Mdz.svelte'],
		});
		assert.ok(result.includes('<strong>bold</strong>'), 'should transform with custom import');
	});

	test('handles multiple Mdz aliases in same file', async () => {
		const input = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	import {default as Markdown} from '@fuzdev/fuz_ui/Mdz.svelte';
</script>

<Mdz content="**bold**" />
<Markdown content="_italic_" />`;

		const result = await run_preprocess(input);
		assert.ok(result.includes('<strong>bold</strong>'), 'should transform Mdz');
		assert.ok(result.includes('<em>italic</em>'), 'should transform Markdown alias');
	});
});
