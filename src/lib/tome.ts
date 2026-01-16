import {resolve} from '$app/paths';
import type {Component} from 'svelte';
import {z} from 'zod';
import {ensure_start} from '@fuzdev/fuz_util/string.js';

import {create_context} from './context_helpers.js';
import {DOCS_PATH_DEFAULT, docs_slugify} from './docs_helpers.svelte.js';

export const Tome = z.object({
	name: z.string(),
	// TODO maybe now this makes sense with mdz? summary: z.string(),
	category: z.string(),
	Component: z.custom<Component<any, any>>(),
	related_tomes: z.array(z.string()),
	related_modules: z.array(z.string()),
	related_declarations: z.array(z.string()),
});
export type Tome = z.infer<typeof Tome>;

/**
 * @param hash - URL fragment to append, with or without the `#`.
 */
export const to_tome_pathname = (
	item: Tome | string,
	docs_path = DOCS_PATH_DEFAULT,
	hash?: string,
): string => {
	const name = typeof item === 'string' ? item : item.name;
	const path = docs_path + '/' + docs_slugify(name);
	return resolve((hash ? path + ensure_start(hash, '#') : path) as any);
};

export const tomes_context = create_context<Map<string, Tome>>();

export const get_tome_by_name = (name: string): Tome => {
	const tomes = tomes_context.get();
	const tome = tomes.get(name);
	if (!tome) throw Error(`unable to find tome "${name}"`);
	return tome;
};

export const tome_context = create_context<Tome>();
