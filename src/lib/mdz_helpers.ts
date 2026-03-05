/**
 * Shared pure helper functions for mdz parsers.
 *
 * Used by both the single-pass parser (`mdz.ts`) and the two-phase
 * lexer+parser (`mdz_lexer.ts` + `mdz_token_parser.ts`).
 *
 * @module
 */

import type {MdzNode, MdzComponentNode, MdzElementNode} from './mdz.js';
import {
	ASTERISK,
	UNDERSCORE,
	TILDE,
	HYPHEN,
	PERIOD,
	COMMA,
	SEMICOLON,
	COLON,
	EXCLAMATION,
	QUESTION,
	DOLLAR,
	PERCENT,
	AMPERSAND,
	APOSTROPHE,
	PLUS,
	EQUALS,
	AT,
	SLASH,
	HASH,
	LEFT_PAREN,
	RIGHT_PAREN,
	RIGHT_BRACKET,
	A_UPPER,
	Z_UPPER,
	A_LOWER,
	Z_LOWER,
	ZERO,
	NINE,
} from './mdz_constants.js';

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
