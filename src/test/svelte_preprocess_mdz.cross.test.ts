import {test, assert, describe, beforeAll} from 'vitest';
import {parse} from 'svelte/compiler';

import {mdz_to_svelte, escape_js_string} from '$lib/mdz_to_svelte.js';
import type {SveltePreprocessMdzOptions} from '$lib/svelte_preprocess_mdz.js';
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
} satisfies SveltePreprocessMdzOptions;

let mdz_fixtures: Array<MdzFixture> = [];

beforeAll(async () => {
	mdz_fixtures = await load_mdz_fixtures();
});

describe('cross-test: mdz fixtures through preprocessor pipeline', () => {
	test('preprocessor output matches mdz_to_svelte for all mdz fixtures', async () => {
		let tested = 0;
		let skipped_unconfigured = 0;

		for (const fixture of mdz_fixtures) {
			const svelte_result = mdz_to_svelte(fixture.expected, {
				components: CROSS_TEST_OPTIONS.components,
				elements: CROSS_TEST_OPTIONS.elements,
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

			// Verify markup matches
			const expected_fragment = `<Mdz>${svelte_result.markup}</Mdz>`;
			assert.ok(
				output.includes(expected_fragment),
				`mdz fixture "${fixture.name}": markup mismatch.\n  Expected fragment: ${expected_fragment}\n  Full output: ${output}`,
			);

			// Verify required imports were added
			for (const [name, info] of svelte_result.imports) {
				if (info.kind === 'default') {
					assert.ok(
						output.includes(`import ${name} from '${info.path}'`),
						`mdz fixture "${fixture.name}": missing import for ${name} from '${info.path}'`,
					);
				} else {
					assert.ok(
						output.includes(name) && output.includes(info.path),
						`mdz fixture "${fixture.name}": missing named import {${name}} from '${info.path}'`,
					);
				}
			}

			// Verify output is parseable Svelte
			const ast = parse(output, {filename: `${fixture.name}.svelte`, modern: true});
			assert.ok(ast.fragment, `mdz fixture "${fixture.name}" produced unparseable Svelte output`);

			tested++;
		}

		// Sanity: we should test a meaningful number of fixtures
		assert.ok(tested > 50, `Only tested ${tested} fixtures (expected > 50)`);
		assert.ok(
			skipped_unconfigured < 10,
			`Skipped ${skipped_unconfigured} unconfigured fixtures (expected < 10)`,
		);
	});
});
