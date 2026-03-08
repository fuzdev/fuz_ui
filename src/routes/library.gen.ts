import {library_gen} from '$lib/library_gen.js';
import {throwOnDuplicates} from '@fuzdev/svelte-docinfo/analyze.js';

export const gen = library_gen({on_duplicates: throwOnDuplicates});
