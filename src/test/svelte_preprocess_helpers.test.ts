import {test, assert, describe} from 'vitest';
import {parse} from 'svelte/compiler';

import {
	should_exclude,
	find_attribute,
	evaluate_static_expr,
	extract_static_string,
	resolve_component_names,
	generate_import_lines,
	find_import_insert_position,
	type PreprocessImportInfo,
} from '$lib/svelte_preprocess_helpers.js';

describe('should_exclude', () => {
	test('returns false when filename is undefined', () => {
		assert.equal(should_exclude(undefined, ['foo']), false);
	});

	test('returns false when exclude list is empty', () => {
		assert.equal(should_exclude('src/Foo.svelte', []), false);
	});

	test('matches string pattern as substring', () => {
		assert.equal(should_exclude('src/routes/page.svelte', ['routes/']), true);
	});

	test('returns false when string pattern does not match', () => {
		assert.equal(should_exclude('src/lib/Mdz.svelte', ['routes/']), false);
	});

	test('matches regex pattern', () => {
		assert.equal(should_exclude('Test.svelte', [/Test\.svelte$/]), true);
	});

	test('returns false when regex does not match', () => {
		assert.equal(should_exclude('Other.svelte', [/Test\.svelte$/]), false);
	});

	test('matches second pattern when first does not match', () => {
		assert.equal(should_exclude('src/lib/Mdz.svelte', ['routes/', 'lib/']), true);
	});

	test('matches with mixed string and regex patterns', () => {
		assert.equal(should_exclude('src/Test.svelte', ['routes/', /Test\.svelte$/]), true);
	});
});

describe('evaluate_static_expr', () => {
	test('returns value for string literal', () => {
		assert.equal(evaluate_static_expr({type: 'Literal', value: 'hello'}), 'hello');
	});

	test('returns null for number literal', () => {
		assert.equal(evaluate_static_expr({type: 'Literal', value: 42}), null);
	});

	test('returns null for boolean literal', () => {
		assert.equal(evaluate_static_expr({type: 'Literal', value: true}), null);
	});

	test('returns null for null literal', () => {
		assert.equal(evaluate_static_expr({type: 'Literal', value: null}), null);
	});

	test('returns cooked value for template literal without interpolation', () => {
		assert.equal(
			evaluate_static_expr({
				type: 'TemplateLiteral',
				expressions: [],
				quasis: [{value: {cooked: 'hello', raw: 'hello'}}],
			}),
			'hello',
		);
	});

	test('returns null for template literal with interpolation', () => {
		assert.equal(
			evaluate_static_expr({
				type: 'TemplateLiteral',
				expressions: [{type: 'Identifier', name: 'x'}],
				quasis: [{value: {cooked: 'a', raw: 'a'}}, {value: {cooked: 'b', raw: 'b'}}],
			}),
			null,
		);
	});

	test('concatenates string literals with +', () => {
		assert.equal(
			evaluate_static_expr({
				type: 'BinaryExpression',
				operator: '+',
				left: {type: 'Literal', value: 'hello '},
				right: {type: 'Literal', value: 'world'},
			}),
			'hello world',
		);
	});

	test('handles nested concatenation', () => {
		assert.equal(
			evaluate_static_expr({
				type: 'BinaryExpression',
				operator: '+',
				left: {
					type: 'BinaryExpression',
					operator: '+',
					left: {type: 'Literal', value: 'a'},
					right: {type: 'Literal', value: 'b'},
				},
				right: {type: 'Literal', value: 'c'},
			}),
			'abc',
		);
	});

	test('returns null when left side of concat is dynamic', () => {
		assert.equal(
			evaluate_static_expr({
				type: 'BinaryExpression',
				operator: '+',
				left: {type: 'Identifier', name: 'x'},
				right: {type: 'Literal', value: 'b'},
			}),
			null,
		);
	});

	test('returns null for non-plus binary operator', () => {
		assert.equal(
			evaluate_static_expr({
				type: 'BinaryExpression',
				operator: '-',
				left: {type: 'Literal', value: 'a'},
				right: {type: 'Literal', value: 'b'},
			}),
			null,
		);
	});

	test('returns null when right side of concat is dynamic', () => {
		assert.equal(
			evaluate_static_expr({
				type: 'BinaryExpression',
				operator: '+',
				left: {type: 'Literal', value: 'a'},
				right: {type: 'Identifier', name: 'x'},
			}),
			null,
		);
	});

	test('concatenates string literal with template literal', () => {
		assert.equal(
			evaluate_static_expr({
				type: 'BinaryExpression',
				operator: '+',
				left: {type: 'Literal', value: 'hello '},
				right: {
					type: 'TemplateLiteral',
					expressions: [],
					quasis: [{value: {cooked: 'world', raw: 'world'}}],
				},
			}),
			'hello world',
		);
	});

	test('returns value for empty string literal', () => {
		assert.equal(evaluate_static_expr({type: 'Literal', value: ''}), '');
	});

	test('returns null for call expression', () => {
		assert.equal(
			evaluate_static_expr({type: 'CallExpression', callee: {type: 'Identifier', name: 'fn'}}),
			null,
		);
	});

	test('returns null for identifier', () => {
		assert.equal(evaluate_static_expr({type: 'Identifier', name: 'x'}), null);
	});

	test('falls back to raw when cooked is null', () => {
		assert.equal(
			evaluate_static_expr({
				type: 'TemplateLiteral',
				expressions: [],
				quasis: [{value: {cooked: null, raw: '\\x41'}}],
			}),
			'\\x41',
		);
	});
});

describe('extract_static_string', () => {
	test('returns null for boolean true', () => {
		assert.equal(extract_static_string(true), null);
	});

	test('returns text data for single Text array', () => {
		assert.equal(extract_static_string([{type: 'Text', data: 'hello'}] as any), 'hello');
	});

	test('returns empty string for single empty Text', () => {
		assert.equal(extract_static_string([{type: 'Text', data: ''}] as any), '');
	});

	test('returns null for empty array', () => {
		assert.equal(extract_static_string([] as any), null);
	});

	test('returns null for mixed Text and ExpressionTag', () => {
		assert.equal(
			extract_static_string([
				{type: 'Text', data: 'a '},
				{type: 'ExpressionTag', expression: {type: 'Identifier', name: 'x'}},
			] as any),
			null,
		);
	});

	test('evaluates ExpressionTag with string literal', () => {
		assert.equal(
			extract_static_string({
				type: 'ExpressionTag',
				expression: {type: 'Literal', value: 'hello'},
			} as any),
			'hello',
		);
	});

	test('returns null for ExpressionTag with null literal', () => {
		assert.equal(
			extract_static_string({
				type: 'ExpressionTag',
				expression: {type: 'Literal', value: null},
			} as any),
			null,
		);
	});

	test('returns null for ExpressionTag with dynamic expression', () => {
		assert.equal(
			extract_static_string({
				type: 'ExpressionTag',
				expression: {type: 'Identifier', name: 'x'},
			} as any),
			null,
		);
	});

	test('returns null for array with multiple Text nodes', () => {
		assert.equal(
			extract_static_string([
				{type: 'Text', data: 'a'},
				{type: 'Text', data: 'b'},
			] as any),
			null,
		);
	});
});

describe('find_attribute', () => {
	test('finds attribute by name', () => {
		const node = {
			attributes: [
				{type: 'Attribute', name: 'content', value: 'test'},
				{type: 'Attribute', name: 'class', value: 'foo'},
			],
		} as any;
		const result = find_attribute(node, 'content');
		assert.equal(result?.name, 'content');
	});

	test('returns undefined when attribute not found', () => {
		const node = {
			attributes: [{type: 'Attribute', name: 'class', value: 'foo'}],
		} as any;
		assert.equal(find_attribute(node, 'content'), undefined);
	});

	test('skips SpreadAttribute nodes', () => {
		const node = {
			attributes: [
				{type: 'SpreadAttribute', expression: {}},
				{type: 'Attribute', name: 'content', value: 'test'},
			],
		} as any;
		const result = find_attribute(node, 'content');
		assert.equal(result?.name, 'content');
	});

	test('returns undefined for empty attributes array', () => {
		const node = {attributes: []} as any;
		assert.equal(find_attribute(node, 'content'), undefined);
	});

	test('skips directive nodes', () => {
		const node = {
			attributes: [
				{type: 'BindDirective', name: 'value'},
				{type: 'Attribute', name: 'content', value: 'test'},
			],
		} as any;
		const result = find_attribute(node, 'content');
		assert.equal(result?.name, 'content');
	});
});

describe('generate_import_lines', () => {
	test('generates single default import', () => {
		const imports: Map<string, PreprocessImportInfo> = new Map([
			['DocsLink', {path: '@fuzdev/fuz_ui/DocsLink.svelte', kind: 'default'}],
		]);
		assert.equal(
			generate_import_lines(imports),
			"\timport DocsLink from '@fuzdev/fuz_ui/DocsLink.svelte';",
		);
	});

	test('generates single named import', () => {
		const imports: Map<string, PreprocessImportInfo> = new Map([
			['resolve', {path: '$app/paths', kind: 'named'}],
		]);
		assert.equal(generate_import_lines(imports), "\timport {resolve} from '$app/paths';");
	});

	test('groups multiple named imports from same path', () => {
		const imports: Map<string, PreprocessImportInfo> = new Map([
			['resolve', {path: '$app/paths', kind: 'named'}],
			['base', {path: '$app/paths', kind: 'named'}],
		]);
		assert.equal(generate_import_lines(imports), "\timport {resolve, base} from '$app/paths';");
	});

	test('handles mixed default and named imports', () => {
		const imports: Map<string, PreprocessImportInfo> = new Map([
			['DocsLink', {path: '@fuzdev/fuz_ui/DocsLink.svelte', kind: 'default'}],
			['resolve', {path: '$app/paths', kind: 'named'}],
		]);
		assert.equal(
			generate_import_lines(imports),
			"\timport DocsLink from '@fuzdev/fuz_ui/DocsLink.svelte';\n\timport {resolve} from '$app/paths';",
		);
	});

	test('returns empty string for empty map', () => {
		assert.equal(generate_import_lines(new Map()), '');
	});

	test('generates multiple default imports on separate lines', () => {
		const imports: Map<string, PreprocessImportInfo> = new Map([
			['DocsLink', {path: '@fuzdev/fuz_ui/DocsLink.svelte', kind: 'default'}],
			['Code', {path: '@fuzdev/fuz_code/Code.svelte', kind: 'default'}],
		]);
		assert.equal(
			generate_import_lines(imports),
			"\timport DocsLink from '@fuzdev/fuz_ui/DocsLink.svelte';\n\timport Code from '@fuzdev/fuz_code/Code.svelte';",
		);
	});

	test('generates separate lines for named imports from different paths', () => {
		const imports: Map<string, PreprocessImportInfo> = new Map([
			['resolve', {path: '$app/paths', kind: 'named'}],
			['getContext', {path: 'svelte', kind: 'named'}],
		]);
		assert.equal(
			generate_import_lines(imports),
			"\timport {resolve} from '$app/paths';\n\timport {getContext} from 'svelte';",
		);
	});
});

describe('resolve_component_names', () => {
	test('resolves default import', () => {
		const ast = parse(`<script lang="ts">import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';</script>`, {
			modern: true,
		});
		const names = resolve_component_names(ast, ['@fuzdev/fuz_ui/Mdz.svelte']);
		assert.ok(names.has('Mdz'));
		assert.equal(names.size, 1);
	});

	test('resolves renamed default import', () => {
		const ast = parse(
			`<script lang="ts">import Markdown from '@fuzdev/fuz_ui/Mdz.svelte';</script>`,
			{modern: true},
		);
		const names = resolve_component_names(ast, ['@fuzdev/fuz_ui/Mdz.svelte']);
		assert.ok(names.has('Markdown'));
		assert.equal(names.size, 1);
	});

	test('returns empty set for unrelated import', () => {
		const ast = parse(`<script lang="ts">import Foo from './Foo.svelte';</script>`, {modern: true});
		const names = resolve_component_names(ast, ['@fuzdev/fuz_ui/Mdz.svelte']);
		assert.equal(names.size, 0);
	});

	test('returns empty set when no script', () => {
		const ast = parse(`<p>No script</p>`, {modern: true});
		const names = resolve_component_names(ast, ['@fuzdev/fuz_ui/Mdz.svelte']);
		assert.equal(names.size, 0);
	});

	test('resolves from multiple import sources', () => {
		const ast = parse(
			`<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	import Markdown from '$lib/Mdz.svelte';
</script>`,
			{modern: true},
		);
		const names = resolve_component_names(ast, ['@fuzdev/fuz_ui/Mdz.svelte', '$lib/Mdz.svelte']);
		assert.ok(names.has('Mdz'));
		assert.ok(names.has('Markdown'));
		assert.equal(names.size, 2);
	});

	test('ignores namespace imports', () => {
		const ast = parse(
			`<script lang="ts">import * as Mdz from '@fuzdev/fuz_ui/Mdz.svelte';</script>`,
			{modern: true},
		);
		const names = resolve_component_names(ast, ['@fuzdev/fuz_ui/Mdz.svelte']);
		assert.equal(names.size, 0);
	});

	test('ignores non-matching imports from same file', () => {
		const ast = parse(
			`<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	import Foo from './Foo.svelte';
</script>`,
			{modern: true},
		);
		const names = resolve_component_names(ast, ['@fuzdev/fuz_ui/Mdz.svelte']);
		assert.ok(names.has('Mdz'));
		assert.ok(!names.has('Foo'));
		assert.equal(names.size, 1);
	});
});

describe('find_import_insert_position', () => {
	test('returns end of last import declaration', () => {
		const source = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	import {resolve} from '$app/paths';
	const x = 1;
</script>`;
		const ast = parse(source, {modern: true});
		const pos = find_import_insert_position(ast.instance!);
		// position should be after the resolve import, before const
		const before = source.slice(0, pos);
		assert.ok(before.includes("import {resolve} from '$app/paths';"));
		assert.ok(!before.includes('const x'));
	});

	test('returns script body start when no imports', () => {
		const source = `<script lang="ts">
	const x = 1;
</script>`;
		const ast = parse(source, {modern: true});
		const pos = find_import_insert_position(ast.instance!);
		// should be at the very start of script body content
		assert.equal(pos, (ast.instance!.content as any).start);
	});

	test('returns end of single import declaration', () => {
		const source = `<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	const x = 1;
</script>`;
		const ast = parse(source, {modern: true});
		const pos = find_import_insert_position(ast.instance!);
		const before = source.slice(0, pos);
		const after = source.slice(pos);
		assert.ok(before.endsWith("';"));
		assert.ok(after.trimStart().startsWith('const x'));
	});
});
