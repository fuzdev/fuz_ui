/**
 * Pure helpers behind `TypeLink` and `TypeJsonView`.
 *
 * @module
 */

import type { TypeJsonToken } from 'svelte-docinfo/declaration-helpers.js';

/**
 * One run of a flat type string: a `name` that resolves to a declaration, or
 * the `text` between such names.
 */
export interface TypeTextToken {
	kind: 'name' | 'text';
	text: string;
}

const IDENTIFIER_START_MATCHER = /[\p{ID_Start}_$]/u;
const IDENTIFIER_PART_MATCHER = /[\p{ID_Continue}$]/u;

/**
 * Words that are TypeScript's own in a type string, never a reference to a
 * declaration — a library that exports `string` or `is` (a schema library's
 * builders) must not have its types link to them.
 */
const TYPE_KEYWORDS: ReadonlySet<string> = new Set([
	'any',
	'unknown',
	'never',
	'void',
	'undefined',
	'null',
	'object',
	'string',
	'number',
	'boolean',
	'bigint',
	'symbol',
	'true',
	'false',
	'this',
	'is',
	'asserts',
	'keyof',
	'typeof',
	'infer',
	'extends',
	'readonly',
	'unique',
	'in',
	'out',
	'new',
	'abstract',
	'const',
	'import',
	'get',
	'set'
]);

/**
 * Whether `name` is a TypeScript keyword in type position, which never links
 * to a declaration of the same name.
 */
export const type_name_is_keyword = (name: string): boolean => TYPE_KEYWORDS.has(name);

/**
 * Splits a flat type string into the names that resolve and the text around
 * them, for type text svelte-docinfo emits with no structure: a flat string
 * with no tree beside it, and a tree's terminal text (object and function
 * types, and source text such as `typeof a` or `keyof A`).
 * `(a: A) => B` can then link `A` and `B` independently.
 *
 * The scan is lexical, not a parse. It skips what plainly isn't a type
 * reference: TypeScript's keywords, string and template literals whole (so a
 * template's `${A}` doesn't link), comments, a property access's right side
 * (`ns.Name`, so `typeof a.b` links only `a`), and a property or parameter
 * name (`name:` and `name?:`, written with no space before the colon, unlike a
 * conditional type's `? A : B`). A name in another non-type position (a method
 * key, a binding name, a type parameter) still links when a declaration
 * happens to share it.
 *
 * @param type - the flat type string
 * @param resolves - whether a candidate name is a known declaration
 * @returns the tokens in order, adjacent text merged; their texts concatenate
 * back to `type`
 */
export const to_type_text_tokens = (
	type: string,
	resolves: (name: string) => boolean
): Array<TypeTextToken> => {
	const tokens: Array<TypeTextToken> = [];
	let text = '';
	const flush_text = (): void => {
		if (text) {
			tokens.push({ kind: 'text', text });
			text = '';
		}
	};
	let i = 0;
	while (i < type.length) {
		const char = type[i]!;
		if (char === '/' && (type[i + 1] === '/' || type[i + 1] === '*')) {
			// a comment, through its line's end or its close, so neither its words
			// link nor an apostrophe in it opens a string
			const close = type[i + 1] === '/' ? type.indexOf('\n', i) : type.indexOf('*/', i + 2);
			const end = close === -1 ? type.length : type[i + 1] === '/' ? close : close + 2;
			text += type.slice(i, end);
			i = end;
		} else if (char === '"' || char === "'" || char === '`') {
			// a string literal, through its closing quote
			let end = i + 1;
			while (end < type.length && type[end] !== char) {
				end += type[end] === '\\' ? 2 : 1;
			}
			end = Math.min(end + 1, type.length);
			text += type.slice(i, end);
			i = end;
		} else if (IDENTIFIER_START_MATCHER.test(char)) {
			let end = i + 1;
			while (end < type.length && IDENTIFIER_PART_MATCHER.test(type[end]!)) end++;
			const name = type.slice(i, end);
			const next = type[end];
			// a single `.` before the name is a property access; `...` is a spread
			const is_property = type[i - 1] === '.' && type[i - 2] !== '.';
			const is_reference =
				!is_property &&
				next !== ':' &&
				!(next === '?' && type[end + 1] === ':') &&
				!TYPE_KEYWORDS.has(name);
			if (is_reference && resolves(name)) {
				flush_text();
				tokens.push({ kind: 'name', text: name });
			} else {
				text += name;
			}
			i = end;
		} else {
			// a digit run swallows what follows it, so `2px` doesn't start a name
			let end = i + 1;
			if (/\d/.test(char)) {
				while (end < type.length && IDENTIFIER_PART_MATCHER.test(type[end]!)) end++;
			}
			text += type.slice(i, end);
			i = end;
		}
	}
	flush_text();
	return tokens;
};

/**
 * Splits each terminal `code` token of a rendered `TypeJson` tree at the names
 * `to_type_text_tokens` finds, so the names inside terminal text (`typeof A`,
 * `{ a: A; }`, `(a: A) => B`) link as the same text rendered flat does. `text`
 * tokens (punctuation, tuple labels) and `name` tokens pass through unscanned.
 * A split name carries no `module`, so it resolves by name, as a flat string's
 * names do.
 *
 * @param tokens - the tree's tokens, from svelte-docinfo's `typeJsonToTokens`
 * @param resolves - whether a candidate name is a known declaration
 * @returns the tokens with each linkable terminal split; their texts
 * concatenate back to the input's
 */
export const link_type_json_terminals = (
	tokens: Array<TypeJsonToken>,
	resolves: (name: string) => boolean
): Array<TypeJsonToken> =>
	tokens.flatMap((token): Array<TypeJsonToken> => {
		if (token.kind !== 'code') return [token];
		const pieces = to_type_text_tokens(token.text, resolves);
		if (!pieces.some((piece) => piece.kind === 'name')) return [token];
		return pieces.map((piece): TypeJsonToken =>
			piece.kind === 'name'
				? { kind: 'name', name: piece.text }
				: { kind: 'code', text: piece.text }
		);
	});
