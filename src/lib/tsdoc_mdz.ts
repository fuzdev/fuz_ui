/**
 * Bridge between TSDoc format and mdz for rendering.
 *
 * This module converts raw TSDoc syntax (from the analysis library) to mdz format
 * (Fuz's documentation rendering dialect). It lives in fuz_ui, not the extracted
 * analysis library, to keep that library format-agnostic.
 *
 * @module
 */

import {mdz_is_url} from './mdz.js';

/** Format a reference as mdz: URLs pass through, identifiers get backticks. */
const format_reference = (ref: string): string => (mdz_is_url(ref) ? ref : `\`${ref}\``);

/**
 * Convert raw TSDoc `@see` content to mdz format for rendering.
 *
 * Handles TSDoc link syntax:
 * - `{@link url|text}` → `[text](url)` (markdown link)
 * - `{@link https://...}` → `https://...` (bare URL, auto-linked by mdz)
 * - `{@link identifier}` → `` `identifier` `` (code formatting)
 * - Bare URLs → returned as-is
 * - Bare identifiers → wrapped in backticks
 * - `identifier description text` → `` `identifier` description text `` (first token is the reference)
 *
 * @param content - raw `@see` tag content in TSDoc format
 * @returns mdz-formatted string ready for `Mdz` component
 *
 * @example
 * ```ts
 * tsdoc_see_to_mdz('{@link https://fuz.dev|API Docs}')
 * // → '[API Docs](https://fuz.dev)'
 *
 * tsdoc_see_to_mdz('{@link SomeType}')
 * // → '`SomeType`'
 *
 * tsdoc_see_to_mdz('https://example.com')
 * // → 'https://example.com'
 *
 * tsdoc_see_to_mdz('library_gen.ts for Gro-specific integration')
 * // → '`library_gen.ts` for Gro-specific integration'
 * ```
 */
export const tsdoc_see_to_mdz = (content: string): string => {
	const trimmed = content.trim();
	if (!trimmed) return '';

	// Check for {@link ...} or {@see ...} syntax
	const link_match = /^\{@(?:link|see)\s+([^}]+)\}$/.exec(trimmed);
	if (link_match) {
		const inner = link_match[1]!.trim();

		// Check for pipe separator (custom display text)
		const pipe_index = inner.indexOf('|');
		if (pipe_index !== -1) {
			const reference = inner.slice(0, pipe_index).trim();
			const display_text = inner.slice(pipe_index + 1).trim();
			return `[${display_text}](${reference})`;
		}

		return format_reference(inner);
	}

	// Split at first whitespace: first token is the reference, rest is description
	const space_index = trimmed.indexOf(' ');
	if (space_index === -1) {
		return format_reference(trimmed);
	}

	const reference = trimmed.slice(0, space_index);
	const description = trimmed.slice(space_index); // preserve leading space
	return format_reference(reference) + description;
};
