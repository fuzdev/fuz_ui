import {throwOnDuplicates} from 'svelte-docinfo/analyze.js';

import {library_gen} from '$lib/library_gen.js';

export const gen = library_gen({on_duplicates: throwOnDuplicates});
