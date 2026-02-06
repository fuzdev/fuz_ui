import {preprocess} from 'svelte/compiler';

import {
	svelte_preprocess_mdz,
	type SveltePreprocessMdzOptions,
} from '$lib/svelte_preprocess_mdz.js';
import {load_fixtures_generic} from '../../test_helpers.js';

/** Default options used by most fixture and behavioral tests. */
export const DEFAULT_TEST_OPTIONS: SveltePreprocessMdzOptions = {
	components: {Alert: '$lib/Alert.svelte', Card: '$lib/Card.svelte'},
	elements: ['aside', 'details', 'summary'],
};

export interface PreprocessMdzFixture {
	name: string;
	input: string;
	expected: {code: string};
}

/** Load all fixtures from the svelte_preprocess_mdz fixtures directory. */
export const load_fixtures = async (): Promise<Array<PreprocessMdzFixture>> =>
	load_fixtures_generic<{code: string}>({
		fixtures_dir: import.meta.dirname,
		input_extension: '.svelte',
	});

/** Run the preprocessor on input and return the transformed code. */
export const run_preprocess = async (
	input: string,
	options: SveltePreprocessMdzOptions = DEFAULT_TEST_OPTIONS,
	filename = 'Test.svelte',
): Promise<string> => {
	const result = await preprocess(input, [svelte_preprocess_mdz(options)], {filename});
	return result.code;
};
