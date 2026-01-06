import type {Task} from '@ryanatkn/gro';

export const task: Task = {
	summary: 'generate all fixture expected.json files (mdz + tsdoc + ts + svelte)',
	run: async ({invoke_task, log}) => {
		log.info('updating mdz fixtures...');
		await invoke_task('src/test/fixtures/mdz/update');

		log.info('all fixtures updated!');
	},
};
