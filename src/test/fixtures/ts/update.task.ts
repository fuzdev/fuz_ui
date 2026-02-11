import type {Task} from '@fuzdev/gro';
import {join} from 'node:path';
import ts from 'typescript';

import {run_update_task} from '../../test_helpers.js';
import {
	create_test_program,
	extract_declaration_from_source,
	infer_category_from_name,
} from './ts_test_helpers.js';

export const task: Task = {
	summary: 'generate expected.json files for ts fixtures',
	run: async ({log}) => {
		await run_update_task(
			{
				fixtures_dir: join(import.meta.dirname),
				input_extension: '.ts',
				process: (input, name) => {
					const category = infer_category_from_name(name);
					const source_file = ts.createSourceFile(
						`${name}.ts`,
						input,
						ts.ScriptTarget.Latest,
						true,
						ts.ScriptKind.TS,
					);
					const {checker} = create_test_program(source_file, `${name}.ts`);
					return extract_declaration_from_source(source_file, checker, category);
				},
			},
			log,
		);
	},
};
