import {test, assert, describe} from 'vitest';

import {mdz_parse} from '@fuzdev/mdz/mdz.ts';
import {mdz_from_tsdoc} from '@fuzdev/mdz/tsdoc_mdz.ts';

import {vite_plugin_docs_mdz} from '$lib/vite_plugin_docs_mdz.ts';

// The `transform` hook reads `this.warn` (a Rollup plugin context). Cast the
// returned plugin to just that hook and hand it a minimal mock context — no real
// Vite/Rollup instance needed (same approach as vite_plugin_pkg_json.test.ts).
interface MockCtx {
	warn: (msg: string) => void;
}
interface PluginHooks {
	transform: (this: MockCtx, code: string, id: string) => {code: string; map: null} | undefined;
}

const create_mock_ctx = (): MockCtx & {warnings: Array<string>} => {
	const warnings: Array<string> = [];
	return {warnings, warn: (msg) => warnings.push(msg)};
};

const RESOLVED_DOCINFO_ID = '\0virtual:svelte-docinfo';

// Build a svelte-docinfo-shaped virtual module around a `modules` array, matching
// the emit the plugin slices (`export const modules = …;\nexport const diagnostics = …`).
const make_module_code = (modules: unknown): string =>
	`export const modules = ${JSON.stringify(
		modules,
	)};\nexport const diagnostics = [];\nexport default {modules, diagnostics};`;

// Re-extract the augmented `modules` array from the plugin's output using the
// same anchors, so tests assert on structure rather than substrings.
const extract_modules = (code: string): any => {
	const prefix = 'export const modules = ';
	const start = code.indexOf(prefix) + prefix.length;
	const end = code.indexOf(';\nexport const diagnostics =', start);
	return JSON.parse(code.slice(start, end));
};

const run = (modules: unknown): {out: any; warnings: Array<string>} => {
	const plugin = vite_plugin_docs_mdz() as unknown as PluginHooks;
	const ctx = create_mock_ctx();
	const result = plugin.transform.call(ctx, make_module_code(modules), RESOLVED_DOCINFO_ID);
	assert.ok(result, 'transform returned a result');
	return {out: extract_modules(result.code), warnings: ctx.warnings};
};

describe('augment', () => {
	test('adds *Nodes siblings for every rendered markdown field, at any depth', () => {
		const {out} = run([
			{
				path: 'Foo.ts',
				moduleComment: 'Module **docs**.',
				declarations: [
					{
						name: 'foo',
						kind: 'function',
						docComment: 'Does `foo`.',
						returnDescription: 'a number',
						parameters: [{name: 'x', type: 'number', description: 'the _x_'}],
						examples: ['const a = foo(1);'],
						seeAlso: ['`bar`'],
					},
				],
			},
		]);
		const decl = out[0].declarations[0];
		// module-level coverage (the gap this plugin's key set was extended to close)
		assert.deepEqual(out[0].moduleCommentNodes, mdz_parse('Module **docs**.'));
		// declaration-level string fields
		assert.deepEqual(decl.docCommentNodes, mdz_parse('Does `foo`.'));
		assert.deepEqual(decl.returnDescriptionNodes, mdz_parse('a number'));
		// nested parameter description (arbitrary depth, same field name)
		assert.deepEqual(decl.parameters[0].descriptionNodes, mdz_parse('the _x_'));
		// list fields → arrays of trees
		assert.deepEqual(decl.examplesNodes, [mdz_parse('const a = foo(1);')]);
	});

	test('seeAlso goes through the @see bridge (not raw mdz_parse)', () => {
		const {out} = run([
			{path: 'Foo.ts', declarations: [{name: 'foo', kind: 'function', seeAlso: ['`bar`']}]},
		]);
		const nodes = out[0].declarations[0].seeAlsoNodes[0];
		// the bridge turns `` `bar` `` into a doc link, which differs from parsing the raw string
		assert.deepEqual(nodes, mdz_parse(mdz_from_tsdoc('`bar`')));
		assert.notDeepEqual(nodes, mdz_parse('`bar`'));
	});

	test('keeps the raw strings (sibling, not replace)', () => {
		const {out} = run([{path: 'Foo.ts', moduleComment: 'Module **docs**.', declarations: []}]);
		assert.strictEqual(out[0].moduleComment, 'Module **docs**.');
	});

	test('does not pre-parse fields nothing renders as markdown (propertyDescriptions)', () => {
		const {out} = run([
			{
				path: 'Foo.ts',
				declarations: [{name: 'foo', kind: 'function', propertyDescriptions: {a: 'the **a**'}}],
			},
		]);
		assert.notProperty(out[0].declarations[0], 'propertyDescriptionsNodes');
	});

	test('skips empty strings and empty arrays', () => {
		const {out} = run([
			{
				path: 'Foo.ts',
				moduleComment: '',
				declarations: [{name: 'foo', kind: 'function', examples: []}],
			},
		]);
		assert.notProperty(out[0], 'moduleCommentNodes');
		assert.notProperty(out[0].declarations[0], 'examplesNodes');
	});
});

describe('robustness', () => {
	test('passes through modules it does not own', () => {
		const plugin = vite_plugin_docs_mdz() as unknown as PluginHooks;
		const ctx = create_mock_ctx();
		assert.strictEqual(
			plugin.transform.call(ctx, 'export const x = 1;', '\0some-other-id'),
			undefined,
		);
		assert.strictEqual(ctx.warnings.length, 0);
	});

	test('warns and degrades to runtime parsing when the modules anchor is gone', () => {
		const plugin = vite_plugin_docs_mdz() as unknown as PluginHooks;
		const ctx = create_mock_ctx();
		const result = plugin.transform.call(ctx, 'export const nope = [];\n', RESOLVED_DOCINFO_ID);
		assert.strictEqual(result, undefined, 'no transform → svelte-docinfo output serves as-is');
		assert.ok(ctx.warnings.some((w) => w.includes('could not locate the `modules` export')));
	});

	test('warns and degrades when the sliced JSON is malformed', () => {
		const plugin = vite_plugin_docs_mdz() as unknown as PluginHooks;
		const ctx = create_mock_ctx();
		// valid anchors, but the value between them is not valid JSON
		const code = 'export const modules = {oops;\nexport const diagnostics = [];';
		const result = plugin.transform.call(ctx, code, RESOLVED_DOCINFO_ID);
		assert.strictEqual(result, undefined);
		assert.ok(ctx.warnings.some((w) => w.includes('failed to pre-parse')));
	});
});
