import {library_gen} from '$lib/library_gen.js';
import {library_throw_on_duplicates} from '@fuzdev/svelte-docinfo/library_generate.js';

export const gen = library_gen({on_duplicates: library_throw_on_duplicates});
