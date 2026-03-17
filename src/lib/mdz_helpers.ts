/**
 * Shared constants and pure helper functions for mdz parsers.
 *
 * Used by both the single-pass parser (`mdz.ts`) and the two-phase
 * lexer+parser (`mdz_lexer.ts` + `mdz_token_parser.ts`).
 *
 * @module
 */

import type {MdzNode, MdzComponentNode, MdzElementNode} from './mdz.js';
import {slugify} from '@fuzdev/fuz_util/path.js';

// Character codes for performance
export const BACKTICK = 96; // `
export const ASTERISK = 42; // *
export const UNDERSCORE = 95; // _
export const TILDE = 126; // ~
export const NEWLINE = 10; // \n
export const HYPHEN = 45; // -
export const HASH = 35; // #
export const SPACE = 32; // (space)
export const TAB = 9; // \t
export const LEFT_ANGLE = 60; // <
export const RIGHT_ANGLE = 62; // >
export const SLASH = 47; // /
export const LEFT_BRACKET = 91; // [
export const RIGHT_BRACKET = 93; // ]
export const LEFT_PAREN = 40; // (
export const RIGHT_PAREN = 41; // )
export const COLON = 58; // :
export const PERIOD = 46; // .
export const COMMA = 44; // ,
export const SEMICOLON = 59; // ;
export const EXCLAMATION = 33; // !
export const QUESTION = 63; // ?
// RFC 3986 URI characters
export const DOLLAR = 36; // $
export const PERCENT = 37; // %
export const AMPERSAND = 38; // &
export const APOSTROPHE = 39; // '
export const PLUS = 43; // +
export const EQUALS = 61; // =
export const AT = 64; // @
// Character ranges
export const A_UPPER = 65; // A
export const Z_UPPER = 90; // Z
export const A_LOWER = 97; // a
export const Z_LOWER = 122; // z
export const ZERO = 48; // 0
export const NINE = 57; // 9
// mdz specification constants
export const HR_HYPHEN_COUNT = 3; // Horizontal rule requires exactly 3 hyphens
export const MIN_CODEBLOCK_BACKTICKS = 3; // Code blocks require minimum 3 backticks
export const MAX_HEADING_LEVEL = 6; // Headings support levels 1-6
export const HTTPS_PREFIX_LENGTH = 8; // Length of "https://"
export const HTTP_PREFIX_LENGTH = 7; // Length of "http://"

/**
 * Check if character code is a letter (A-Z, a-z).
 */
export const is_letter = (char_code: number): boolean =>
	(char_code >= A_UPPER && char_code <= Z_UPPER) || (char_code >= A_LOWER && char_code <= Z_LOWER);

/**
 * Check if character code is valid for tag name (letter, number, hyphen, underscore).
 */
export const is_tag_name_char = (char_code: number): boolean =>
	is_letter(char_code) ||
	(char_code >= ZERO && char_code <= NINE) ||
	char_code === HYPHEN ||
	char_code === UNDERSCORE;

/**
 * Check if character is part of a word for word boundary detection.
 * Used to prevent intraword emphasis with `_` and `~` delimiters.
 *
 * Formatting delimiters (`*`, `_`, `~`) are NOT word characters - they're transparent.
 * Only alphanumeric characters (A-Z, a-z, 0-9) are considered word characters.
 *
 * This prevents false positives with snake_case identifiers while allowing
 * adjacent formatting like `**bold**_italic_`.
 */
export const is_word_char = (char_code: number): boolean => {
	if (char_code === ASTERISK || char_code === UNDERSCORE || char_code === TILDE) return false;
	return (
		(char_code >= A_UPPER && char_code <= Z_UPPER) ||
		(char_code >= A_LOWER && char_code <= Z_LOWER) ||
		(char_code >= ZERO && char_code <= NINE)
	);
};

/**
 * Check if character code is valid in URI path per RFC 3986.
 * Validates against the `pchar` production plus path/query/fragment separators.
 *
 * Valid characters:
 * - unreserved: A-Z a-z 0-9 - . _ ~
 * - sub-delims: ! $ & ' ( ) * + , ; =
 * - path allowed: : @
 * - separators: / ? #
 * - percent-encoding: %
 */
export const is_valid_path_char = (char_code: number): boolean =>
	(char_code >= A_UPPER && char_code <= Z_UPPER) ||
	(char_code >= A_LOWER && char_code <= Z_LOWER) ||
	(char_code >= ZERO && char_code <= NINE) ||
	char_code === HYPHEN ||
	char_code === PERIOD ||
	char_code === UNDERSCORE ||
	char_code === TILDE ||
	char_code === EXCLAMATION ||
	char_code === DOLLAR ||
	char_code === AMPERSAND ||
	char_code === APOSTROPHE ||
	char_code === LEFT_PAREN ||
	char_code === RIGHT_PAREN ||
	char_code === ASTERISK ||
	char_code === PLUS ||
	char_code === COMMA ||
	char_code === SEMICOLON ||
	char_code === EQUALS ||
	char_code === COLON ||
	char_code === AT ||
	char_code === SLASH ||
	char_code === QUESTION ||
	char_code === HASH ||
	char_code === PERCENT;

/**
 * Trim trailing punctuation from URL/path per RFC 3986 and GFM rules.
 * - Trims simple trailing: .,;:!?]
 * - Balanced logic for () only (valid in path components)
 * - Invalid chars like [] {} are already stopped by whitelist, but ] trimmed as fallback
 *
 * Optimized to avoid O(n²) string slicing - tracks end index and slices once at the end.
 */
export const trim_trailing_punctuation = (url: string): string => {
	let end = url.length;

	// Trim simple trailing punctuation (] as fallback - whitelist should prevent it)
	while (end > 0) {
		const last_char = url.charCodeAt(end - 1);
		if (
			last_char === PERIOD ||
			last_char === COMMA ||
			last_char === SEMICOLON ||
			last_char === COLON ||
			last_char === EXCLAMATION ||
			last_char === QUESTION ||
			last_char === RIGHT_BRACKET
		) {
			end--;
		} else {
			break;
		}
	}

	// Handle balanced parentheses ONLY (parens are valid in URI path components)
	// Count parentheses in the trimmed portion
	let open_count = 0;
	let close_count = 0;
	for (let i = 0; i < end; i++) {
		const char = url.charCodeAt(i);
		if (char === LEFT_PAREN) open_count++;
		if (char === RIGHT_PAREN) close_count++;
	}

	// Trim unmatched trailing closing parens
	while (end > 0 && close_count > open_count) {
		const last_char = url.charCodeAt(end - 1);
		if (last_char === RIGHT_PAREN) {
			end--;
			close_count--;
		} else {
			break;
		}
	}

	// Return original string if no trimming, otherwise slice once
	return end === url.length ? url : url.slice(0, end);
};

/**
 * Extract a single tag (component or element) if it's the only non-whitespace content.
 * Returns the tag node if paragraph wrapping should be skipped (MDX convention),
 * or null if the content should be wrapped in a paragraph.
 */
/**
 * Check if position in text is the start of an absolute path (starts with `/`).
 * Must be preceded by whitespace or be at the start of the string.
 * Rejects `//` (comments/protocol-relative) and `/ ` (bare slash).
 */
export const is_at_absolute_path = (text: string, index: number): boolean => {
	if (text.charCodeAt(index) !== SLASH) return false;
	if (index > 0) {
		const prev_char = text.charCodeAt(index - 1);
		if (prev_char !== SPACE && prev_char !== NEWLINE && prev_char !== TAB) return false;
	}
	if (index + 1 >= text.length) return false;
	const next_char = text.charCodeAt(index + 1);
	return next_char !== SLASH && next_char !== SPACE && next_char !== NEWLINE;
};

/**
 * Check if position in text is the start of a relative path (`./` or `../`).
 * Must be preceded by whitespace or be at the start of the string.
 * Requires at least one path character after the prefix.
 */
export const is_at_relative_path = (text: string, index: number): boolean => {
	if (text.charCodeAt(index) !== PERIOD) return false;
	if (index > 0) {
		const prev_char = text.charCodeAt(index - 1);
		if (prev_char !== SPACE && prev_char !== NEWLINE && prev_char !== TAB) return false;
	}
	const remaining = text.length - index;
	// Check for ../ (at least 4 chars: ../x)
	if (
		remaining >= 4 &&
		text.charCodeAt(index + 1) === PERIOD &&
		text.charCodeAt(index + 2) === SLASH
	) {
		const after = text.charCodeAt(index + 3);
		return after !== SPACE && after !== NEWLINE && after !== SLASH;
	}
	// Check for ./ (at least 3 chars: ./x)
	if (remaining >= 3 && text.charCodeAt(index + 1) === SLASH) {
		const after = text.charCodeAt(index + 2);
		return after !== SPACE && after !== NEWLINE && after !== SLASH;
	}
	return false;
};

/**
 * Extracts plain text content from an array of mdz nodes, recursing into children.
 */
export const mdz_text_content = (nodes: Array<MdzNode>): string =>
	nodes
		.map((n) => ('children' in n ? mdz_text_content(n.children) : 'content' in n ? n.content : ''))
		.join('');

/**
 * Generates a slug id for a heading from its child nodes.
 */
export const mdz_heading_id = (nodes: Array<MdzNode>): string =>
	slugify(mdz_text_content(nodes), false);

export const extract_single_tag = (
	nodes: Array<MdzNode>,
): MdzComponentNode | MdzElementNode | null => {
	let tag: MdzComponentNode | MdzElementNode | null = null;

	for (const node of nodes) {
		if (node.type === 'Component' || node.type === 'Element') {
			if (tag) return null; // Multiple tags
			tag = node;
		} else if (node.type === 'Text') {
			// Allow only whitespace-only text nodes
			if (node.content.trim() !== '') return null;
		} else {
			// Any other node type means not a single tag
			return null;
		}
	}

	return tag;
};
