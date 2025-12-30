import type {Task} from '@ryanatkn/gro';
import {join} from 'node:path';
import ts from 'typescript';
import {svelte2tsx} from 'svelte2tsx';

import {svelte_analyze_component} from '$lib/svelte_helpers.js';
import {ts_create_program} from '$lib/ts_helpers.js';
import {AnalysisContext} from '$lib/analysis_context.js';
import {run_update_task} from '../../test_helpers.js';
import {fixture_name_to_component_name} from './svelte_test_helpers.js';

export const task: Task = {
	summary: 'generate expected.json files for svelte fixtures',
	run: async ({log}) => {
		// Create a TypeScript program to get a type checker
		const program = ts_create_program(undefined, log);
		const checker = program.getTypeChecker();

		await run_update_task(
			{
				fixtures_dir: join(import.meta.dirname),
				input_extension: '.svelte',
				process: (svelte_source, name) => {
					// Check if component uses TypeScript
					const is_ts_file = svelte_source.includes('lang="ts"');

					// Transform Svelte to TS
					const ts_result = svelte2tsx(svelte_source, {
						filename: `${name}.svelte`,
						isTsFile: is_ts_file,
						emitOnTemplateError: true,
					});

					// Create a temporary source file from the original Svelte content for JSDoc extraction
					const temp_source = ts.createSourceFile(
						`${name}.svelte`,
						svelte_source,
						ts.ScriptTarget.Latest,
						true,
					);

					// Extract component name from fixture name
					const component_name = fixture_name_to_component_name(name);

					// Analyze the component
					const module_path = `${component_name}.svelte`;
					const ctx = new AnalysisContext();
					return svelte_analyze_component(
						ts_result.code,
						temp_source,
						checker,
						component_name,
						module_path,
						null,
						ctx,
					);
				},
			},
			log,
		);
	},
};
