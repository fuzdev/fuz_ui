import type {Task} from '@fuzdev/gro';
import {join} from 'node:path';
import ts from 'typescript';

import {run_update_task} from '../../test_helpers.js';
import {find_and_parse_tsdoc} from './tsdoc_test_helpers.js';

export const task: Task = {
	summary: 'generate expected.json files for tsdoc fixtures',
	run: async ({log}) => {
		await run_update_task(
			{
				fixtures_dir: join(import.meta.dirname),
				input_extension: '.ts',
				process: (input, name) => {
					const source_file = ts.createSourceFile(
						`${name}.ts`,
						input,
						ts.ScriptTarget.Latest,
						true,
						ts.ScriptKind.TS,
					);
					return find_and_parse_tsdoc(source_file);
				},
				json_replacer: (_key, value) => {
					// Convert Map to object for JSON serialization
					if (value instanceof Map) {
						return Object.fromEntries(value);
					}
					return value;
				},
			},
			log,
		);
	},
};
