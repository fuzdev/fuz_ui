/**
 * Pure helpers behind `TypeLink`.
 *
 * @module
 */

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
	'import'
]);

/**
 * Whether `name` is a TypeScript keyword in type position, which never links
 * to a declaration of the same name.
 */
export const type_name_is_keyword = (name: string): boolean => TYPE_KEYWORDS.has(name);

/**
 * Splits a flat type string into the names that resolve and the text around
 * them, for the types svelte-docinfo emits with no structured tree beside
 * them: the object and function types it leaves flat
 * (`{ a: A; }`, `(a: A) => B`), and source text (heritage clauses, generic
 * constraints, `@throws` types) in data that carries no trees for it. `(a: A) => B` can then link `A`
 * and `B` independently.
 *
 * The scan is lexical, not a parse. It skips what plainly isn't a type
 * reference: TypeScript's keywords, string literal contents, a property
 * access's right side (`ns.Name`), and a property or parameter name (`name:`
 * and `name?:`, written with no space before the colon, unlike a conditional
 * type's `? A : B`). A name in another non-type position (a method key, a
 * binding name) still links when a declaration happens to share it.
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
		if (char === '"' || char === "'" || char === '`') {
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
