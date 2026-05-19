/**
 * Shared constants and pure helper functions for mdz parsers.
 *
 * Used by both the single-pass parser (`mdz.ts`) and the two-phase
 * lexer+parser (`mdz_lexer.ts` + `mdz_token_parser.ts`).
 *
 * @module
 */

import type {MdzNode, MdzTextNode, MdzComponentNode, MdzElementNode} from './mdz.js';
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
export const H_LOWER = 104; // h
export const H_UPPER = 72; // H

/**
 * Lowercase an ASCII letter code; passes other chars through.
 * Mirrors the `[A-Z] → [a-z]` shift without touching non-ASCII.
 */
export const ascii_to_lower = (char_code: number): number =>
	char_code >= A_UPPER && char_code <= Z_UPPER ? char_code + 32 : char_code;

/**
 * Case-insensitive URL scheme prefix check. Returns the prefix length
 * (8 for `https://`, 7 for `http://`) or 0 if neither matches at `pos`.
 *
 * URI schemes are case-insensitive per RFC 3986 §3.1, and mobile keyboards
 * routinely auto-capitalize the first letter of a sentence, producing
 * `Https://` etc. The original case is preserved in the emitted reference —
 * browsers normalize schemes themselves.
 */
export const match_url_prefix_case_insensitive = (s: string, pos: number): 0 | 7 | 8 => {
	if (pos + HTTP_PREFIX_LENGTH > s.length) return 0;
	// h | H
	if (ascii_to_lower(s.charCodeAt(pos)) !== H_LOWER) return 0;
	// 'ttps://' (7 chars) or 'ttp://' (6 chars)
	if (
		ascii_to_lower(s.charCodeAt(pos + 1)) === 116 /* t */ &&
		ascii_to_lower(s.charCodeAt(pos + 2)) === 116 /* t */ &&
		ascii_to_lower(s.charCodeAt(pos + 3)) === 112 /* p */
	) {
		if (
			pos + HTTPS_PREFIX_LENGTH <= s.length &&
			ascii_to_lower(s.charCodeAt(pos + 4)) === 115 /* s */ &&
			s.charCodeAt(pos + 5) === COLON &&
			s.charCodeAt(pos + 6) === SLASH &&
			s.charCodeAt(pos + 7) === SLASH
		) {
			return HTTPS_PREFIX_LENGTH;
		}
		if (
			s.charCodeAt(pos + 4) === COLON &&
			s.charCodeAt(pos + 5) === SLASH &&
			s.charCodeAt(pos + 6) === SLASH
		) {
			return HTTP_PREFIX_LENGTH;
		}
	}
	return 0;
};

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
 * Only alphanumeric characters (A-Z, a-z, 0-9) are word characters.
 * Formatting delimiters (`*`, `_`, `~`) fall outside all three ranges,
 * so they're naturally excluded without explicit checks.
 *
 * This prevents false positives with snake_case identifiers while allowing
 * adjacent formatting like `**bold**_italic_`.
 */
export const is_word_char = (char_code: number): boolean =>
	(char_code >= A_UPPER && char_code <= Z_UPPER) ||
	(char_code >= A_LOWER && char_code <= Z_LOWER) ||
	(char_code >= ZERO && char_code <= NINE);

/**
 * Lookup table for valid URI path characters per RFC 3986.
 * Replaces a 16-comparison chain with a single array access.
 *
 * Valid characters:
 * - unreserved: A-Z a-z 0-9 - . _ ~
 * - sub-delims: ! $ & ' ( ) * + , ; =
 * - path allowed: : @
 * - separators: / ? #
 * - percent-encoding: %
 */
const PATH_CHAR_TABLE: Uint8Array = (() => {
	const t = new Uint8Array(128);
	for (let i = A_UPPER; i <= Z_UPPER; i++) t[i] = 1;
	for (let i = A_LOWER; i <= Z_LOWER; i++) t[i] = 1;
	for (let i = ZERO; i <= NINE; i++) t[i] = 1;
	// unreserved: - . _ ~
	t[HYPHEN] = 1;
	t[PERIOD] = 1;
	t[UNDERSCORE] = 1;
	t[TILDE] = 1;
	// sub-delims: ! $ & ' ( ) * + , ; =
	t[EXCLAMATION] = 1;
	t[DOLLAR] = 1;
	t[AMPERSAND] = 1;
	t[APOSTROPHE] = 1;
	t[LEFT_PAREN] = 1;
	t[RIGHT_PAREN] = 1;
	t[ASTERISK] = 1;
	t[PLUS] = 1;
	t[COMMA] = 1;
	t[SEMICOLON] = 1;
	t[EQUALS] = 1;
	// path allowed: : @
	t[COLON] = 1;
	t[AT] = 1;
	// separators: / ? #
	t[SLASH] = 1;
	t[QUESTION] = 1;
	t[HASH] = 1;
	// percent-encoding: %
	t[PERCENT] = 1;
	return t;
})();

export const is_valid_path_char = (char_code: number): boolean =>
	char_code < 128 && PATH_CHAR_TABLE[char_code] === 1;

/**
 * Trim trailing punctuation from URL/path per RFC 3986 and GFM rules.
 * - Trims simple trailing: .,;:!?]
 * - Balanced logic for () only (valid in path components)
 *
 * Note on `]`: the mdz parsers (`mdz.ts`, `mdz_stream_parser_url.ts`,
 * `mdz_lexer.ts`) scan URL/path chars through `is_valid_path_char`, which
 * already rejects `]` — so it can never reach this function via parser flow.
 * The `]` branch here is for external callers using this helper directly on
 * arbitrary URL-ish input (it is part of the published `@fuzdev/fuz_ui`
 * surface, see `mdz_helpers.test.ts` for direct coverage).
 *
 * Optimized to avoid O(n²) string slicing - tracks end index and slices once at the end.
 */
export const trim_trailing_punctuation = (url: string): string => {
	let end = url.length;

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
	// Only count parens when the trimmed URL ends with ')' — otherwise the
	// trailing-paren loop below can't trim anything.
	if (end > 0 && url.charCodeAt(end - 1) === RIGHT_PAREN) {
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
 * Rejects `//` (comments/protocol-relative) and slash followed by whitespace.
 */
export const is_at_absolute_path = (text: string, index: number): boolean => {
	if (text.charCodeAt(index) !== SLASH) return false;
	if (index > 0) {
		const prev_char = text.charCodeAt(index - 1);
		if (prev_char !== SPACE && prev_char !== NEWLINE && prev_char !== TAB) return false;
	}
	if (index + 1 >= text.length) return false;
	const next_char = text.charCodeAt(index + 1);
	return next_char !== SLASH && next_char !== SPACE && next_char !== NEWLINE && next_char !== TAB;
};

/**
 * Check if position in text is the start of a relative path (`./` or `../`).
 * Must be preceded by whitespace or be at the start of the string.
 * Rejects prefix followed by whitespace, slash, or end of string.
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
		return after !== SPACE && after !== NEWLINE && after !== TAB && after !== SLASH;
	}
	// Check for ./ (at least 3 chars: ./x)
	if (remaining >= 3 && text.charCodeAt(index + 1) === SLASH) {
		const after = text.charCodeAt(index + 2);
		return after !== SPACE && after !== NEWLINE && after !== TAB && after !== SLASH;
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
 * Generates a lowercase slug id for a heading from its child nodes.
 * Follows standard markdown conventions (GitHub, etc.) where heading IDs are lowercased.
 * For case-preserving IDs (e.g. API declarations), see `docs_slugify` in `docs_helpers.svelte.ts`.
 */
export const mdz_heading_id = (nodes: Array<MdzNode>): string =>
	slugify(mdz_text_content(nodes), false);

/**
 * Generates a lowercase slug id for a heading from plain text content.
 * Used by the streaming parser which tracks text content directly
 * rather than building `MdzNode[]` trees.
 */
export const mdz_heading_id_from_text = (text: string): string => slugify(text, false);

/**
 * Check if a string is a URL (`https://` or `http://`).
 * Requires at least one valid character after the protocol.
 * Rejects whitespace and characters that can't start a valid hostname.
 */
const URL_PATTERN = /^https?:\/\/[^\s)\]}<>.,:/?#!]/i;
export const mdz_is_url = (s: string): boolean => URL_PATTERN.test(s);

/**
 * Check if a link reference is safe to use as an `href` attribute.
 * References without a colon are always safe (paths, fragments, queries).
 * References with a colon must use `http(s)://` — rejects `javascript:`, `data:`, etc.
 */
const SAFE_PROTOCOL_PATTERN = /^https?:\/\//i;
export const mdz_is_safe_reference = (reference: string): boolean =>
	!reference.includes(':') || SAFE_PROTOCOL_PATTERN.test(reference);

/**
 * Resolves a relative path (`./` or `../`) against a base path.
 * The base is treated as a directory regardless of trailing slash
 * (`'/docs/mdz'` and `'/docs/mdz/'` behave identically).
 * Handles embedded `.` and `..` segments within the reference
 * (e.g., `'./a/../b'` → navigates up then down).
 * Clamps at root — excess `..` segments stop at `/` rather than escaping.
 *
 * @param reference - a relative path starting with `./` or `../`
 * @param base - An absolute base path (e.g., `'/docs/mdz/'`). Empty string is treated as root.
 * @returns an absolute resolved path (e.g., `'/docs/mdz/grammar'`)
 */
export const resolve_relative_path = (reference: string, base: string): string => {
	const segments = base.split('/');
	// Remove trailing empty from split (e.g., '/docs/mdz/' → ['', 'docs', 'mdz', ''])
	// but keep the root segment ([''] from '' base or ['', ''] from '/').
	if (segments.length > 1 && segments.at(-1) === '') segments.pop();
	const trailing = reference.endsWith('/');
	for (const segment of reference.split('/')) {
		if (segment === '.' || segment === '') continue;
		if (segment === '..') {
			if (segments.length > 1) segments.pop(); // clamp at root
		} else {
			segments.push(segment);
		}
	}
	if (trailing) segments.push('');
	return segments.join('/');
};

/**
 * Push a node into a children array, coalescing with the previous Text node.
 * Mutates `prev.content` and `prev.end` when both are Text, avoiding array growth
 * and an extra allocation. Callers must own `dest` and not retain references to
 * the prior last element across the call.
 */
export const mdz_push_merging_text = (dest: Array<MdzNode>, node: MdzNode): void => {
	if (node.type === 'Text') {
		const last = dest[dest.length - 1];
		if (last?.type === 'Text') {
			last.content += node.content;
			last.end = node.end;
			return;
		}
	}
	dest.push(node);
};

/**
 * Return a new array with adjacent Text nodes merged into single nodes.
 * Fast path: returns the original array when no merging is needed.
 */
export const mdz_merge_adjacent_text = (nodes: Array<MdzNode>): Array<MdzNode> => {
	if (nodes.length <= 1) return nodes;

	let needs_merge = false;
	for (let i = 1; i < nodes.length; i++) {
		if (nodes[i - 1]!.type === 'Text' && nodes[i]!.type === 'Text') {
			needs_merge = true;
			break;
		}
	}
	if (!needs_merge) return nodes;

	const merged: Array<MdzNode> = [];
	let pending: MdzTextNode | null = null;

	for (const node of nodes) {
		if (node.type === 'Text') {
			if (pending) {
				pending = {
					type: 'Text',
					content: pending.content + node.content,
					start: pending.start,
					end: node.end,
				};
			} else {
				pending = {...node};
			}
		} else {
			if (pending) {
				merged.push(pending);
				pending = null;
			}
			merged.push(node);
		}
	}

	if (pending) merged.push(pending);

	return merged;
};

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
