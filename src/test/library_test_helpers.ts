import type { Library } from '$lib/library.svelte.ts';

/**
 * A minimal fake `Library` for mounting docs components in tests:
 * `TypeJsonView`/`TypeLink` read only `declaration_by_name`, and
 * `DeclarationLink` reads the mapped declaration's `url_api`/`url_github`.
 */
export const fake_library = (names: Array<string> = []): Library =>
	({
		declaration_by_name: new Map(
			names.map((name) => [name, { url_api: `/docs/api/x.ts#${name}`, url_github: undefined }])
		)
	}) as unknown as Library;
