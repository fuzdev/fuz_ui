import {test, assert, describe, beforeAll} from 'vitest';
import {parse} from 'svelte/compiler';

import {mdz_to_svelte, escape_js_string} from '$lib/mdz_to_svelte.js';
import {
	load_fixtures as load_mdz_fixtures,
	type MdzFixture,
} from './fixtures/mdz/mdz_test_helpers.js';
import {
	run_preprocess,
	DEFAULT_TEST_OPTIONS,
} from './fixtures/svelte_preprocess_mdz/svelte_preprocess_mdz_test_helpers.js';

/* eslint-disable no-await-in-loop */

// Extend default options with elements used in mdz fixtures
const CROSS_TEST_OPTIONS = {
	...DEFAULT_TEST_OPTIONS,
	elements: [...(DEFAULT_TEST_OPTIONS.elements ?? []), 'div', 'span'],
};

let mdz_fixtures: Array<MdzFixture> = [];

beforeAll(async () => {
	mdz_fixtures = await load_mdz_fixtures();
});

describe('cross-test: mdz fixtures through preprocessor pipeline', () => {
	test('preprocessor output matches mdz_to_svelte for all mdz fixtures', async () => {
		let tested = 0;
		let skipped_unconfigured = 0;
		let skipped_empty = 0;

		for (const fixture of mdz_fixtures) {
			const svelte_result = mdz_to_svelte(fixture.expected, {
				components: CROSS_TEST_OPTIONS.components!,
				elements: CROSS_TEST_OPTIONS.elements!,
			});

			// Skip fixtures whose content has unconfigured tags
			if (svelte_result.has_unconfigured_tags) {
				skipped_unconfigured++;
				continue;
			}

			// Embed the mdz content in a Svelte file via expression syntax
			const escaped = escape_js_string(fixture.input);
			const svelte_input = `<script lang="ts">\n\timport Mdz from '@fuzdev/fuz_ui/Mdz.svelte';\n</script>\n\n<Mdz content={'${escaped}'} />\n`;

			const output = await run_preprocess(svelte_input, CROSS_TEST_OPTIONS);

			// The expected markup from mdz_to_svelte(fixture.expected_nodes)
			const expected_fragment = `<Mdz>${svelte_result.markup}</Mdz>`;

			assert.ok(
				output.includes(expected_fragment),
				`mdz fixture "${fixture.name}": preprocessor output doesn't contain expected markup.\n  Expected fragment: ${expected_fragment}\n  Full output: ${output}`,
			);

			tested++;
		}

		// Empty input produces empty markup — verify it was tested
		if (mdz_fixtures.some((f) => f.expected.length === 0)) {
			skipped_empty++;
		}

		// Sanity: we should test a meaningful number of fixtures
		assert.ok(tested > 50, `Only tested ${tested} fixtures (expected > 50)`);
		assert.ok(
			skipped_unconfigured < 10,
			`Skipped ${skipped_unconfigured} unconfigured fixtures (expected < 10)`,
		);
	});

	test('all cross-test outputs produce parseable Svelte', async () => {
		for (const fixture of mdz_fixtures) {
			const svelte_result = mdz_to_svelte(fixture.expected, {
				components: CROSS_TEST_OPTIONS.components!,
				elements: CROSS_TEST_OPTIONS.elements!,
			});
			if (svelte_result.has_unconfigured_tags) continue;

			const escaped = escape_js_string(fixture.input);
			const svelte_input = `<script lang="ts">\n\timport Mdz from '@fuzdev/fuz_ui/Mdz.svelte';\n</script>\n\n<Mdz content={'${escaped}'} />\n`;

			const output = await run_preprocess(svelte_input, CROSS_TEST_OPTIONS);
			const ast = parse(output, {filename: `${fixture.name}.svelte`, modern: true});
			assert.ok(ast.fragment, `mdz fixture "${fixture.name}" produced unparseable Svelte output`);
		}
	});
});
