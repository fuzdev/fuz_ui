/**
 * Inline-formatting handlers (bold, italic, strikethrough, inline code)
 * for the streaming mdz parser.
 *
 * @module
 */

import {ASTERISK, BACKTICK, NEWLINE, TILDE, UNDERSCORE, is_word_char} from './mdz_helpers.js';
import {
	type MdzStreamParserState,
	accumulate_text,
	alloc_id,
	emit,
	ensure_paragraph,
	flush_text,
	offset,
	push_stack_entry,
	revert_above,
} from './mdz_stream_parser_state.js';

// -- Bold --

export const try_bold = (state: MdzStreamParserState): boolean => {
	// we know we're at ** and there's no open Bold
	if (state.pos + 1 >= state.buffer.length) return false; // need more input

	// need at least one char after ** to avoid empty bold
	if (state.pos + 2 >= state.buffer.length) return false;

	flush_text(state);
	ensure_paragraph(state);

	const id = alloc_id(state);
	const bold_start = offset(state);
	emit(state, {type: 'open', id, node_type: 'Bold', start: bold_start});
	push_stack_entry(state, id, 'Bold', bold_start, true, '**');
	state.active_text_id = null;
	state.pos += 2;
	state.column += 2;
	state.prev_char = ASTERISK;
	return true;
};

/**
 * Close a `Bold` container at the given stack index. The caller in
 * `process_inline` already located the open via `find_open`, so we trust the
 * index rather than re-walking the stack.
 */
export const close_bold = (state: MdzStreamParserState, stack_idx: number): boolean => {
	flush_text(state);
	// revert anything between the bold and the top of the stack
	revert_above(state, stack_idx);
	const entry = state.stack.pop()!;
	// check for empty container — revert to literal text instead of closing
	if (!entry.has_children) {
		emit(state, {
			type: 'revert',
			id: entry.id,
			replacement_text: entry.delimiter,
			start: entry.start,
		});
		accumulate_text(state, '**', offset(state));
	} else {
		emit(state, {type: 'close', id: entry.id, end: offset(state) + 2});
	}
	state.active_text_id = null;
	state.pos += 2;
	state.column += 2;
	state.prev_char = ASTERISK;
	return true;
};

// -- Italic --

export const try_italic = (state: MdzStreamParserState, forced = false): boolean => {
	// check opening word boundary
	if (state.prev_char !== -1 && is_word_char(state.prev_char)) {
		// not at word boundary — emit as text
		ensure_paragraph(state);
		accumulate_text(state, '_', offset(state));
		state.prev_char = UNDERSCORE;
		state.column++;
		state.pos++;
		return true;
	}

	// need at least one char after _
	if (state.pos + 1 >= state.buffer.length) {
		if (forced) {
			// at EOF with only _ left — treat as text
			ensure_paragraph(state);
			accumulate_text(state, '_', offset(state));
			state.prev_char = UNDERSCORE;
			state.column++;
			state.pos++;
			return true;
		}
		return false;
	}

	// Italic is non-optimistic: require confirmed closer in the buffer.
	// This avoids flashing italic on common `_` usage (snake_case, identifiers).
	// When the closer isn't visible yet (`pending`), we treat `_` as text rather
	// than holding — holding would block all subsequent content from being
	// parsed in normal mode, and at EOF the parser can't distinguish "still
	// streaming" from "really done."
	//
	// Consequence: italic cannot span chunk boundaries when the closing `_`
	// arrives in a later chunk. The one-shot path (the correctness gate) is
	// always correct because the full buffer is visible. See the
	// `deliberate-divergence` block in `mdz_parser_parity.test.ts` for an
	// asserted gap.
	const closer = scan_closer_boundary(state, '_');
	if (closer !== 'confirmed') {
		ensure_paragraph(state);
		accumulate_text(state, '_', offset(state));
		state.prev_char = UNDERSCORE;
		state.column++;
		state.pos++;
		return true;
	}

	flush_text(state);
	ensure_paragraph(state);

	const id = alloc_id(state);
	const italic_start = offset(state);
	emit(state, {type: 'open', id, node_type: 'Italic', start: italic_start});
	push_stack_entry(state, id, 'Italic', italic_start, true, '_');
	state.active_text_id = null;
	state.pos++;
	state.column++;
	state.prev_char = UNDERSCORE;
	return true;
};

// -- Strikethrough --

export const try_strikethrough = (state: MdzStreamParserState): boolean => {
	// check opening word boundary
	if (state.prev_char !== -1 && is_word_char(state.prev_char)) {
		ensure_paragraph(state);
		accumulate_text(state, '~', offset(state));
		state.prev_char = TILDE;
		state.column++;
		state.pos++;
		return true;
	}

	if (state.pos + 1 >= state.buffer.length) return false;

	// strikethrough is optimistic: 'pending' proceeds, only 'rejected' aborts
	if (scan_closer_boundary(state, '~') === 'rejected') {
		ensure_paragraph(state);
		accumulate_text(state, '~', offset(state));
		state.prev_char = TILDE;
		state.column++;
		state.pos++;
		return true;
	}

	flush_text(state);
	ensure_paragraph(state);

	const id = alloc_id(state);
	const strike_start = offset(state);
	emit(state, {type: 'open', id, node_type: 'Strikethrough', start: strike_start});
	push_stack_entry(state, id, 'Strikethrough', strike_start, true, '~');
	state.active_text_id = null;
	state.pos++;
	state.column++;
	state.prev_char = TILDE;
	return true;
};

// -- Single delimiter close (italic/strikethrough) --

export const check_close_word_boundary = (state: MdzStreamParserState): boolean => {
	const next_pos = state.pos + 1;
	if (next_pos < state.buffer.length) {
		return !is_word_char(state.buffer.charCodeAt(next_pos));
	}
	// at end of buffer — we'll treat as boundary for now (finish() handles unclosed)
	return true;
};

export const close_single_delimiter = (state: MdzStreamParserState, stack_idx: number): boolean => {
	flush_text(state);
	revert_above(state, stack_idx);
	const entry = state.stack.pop()!;
	// check for empty container — revert to literal text instead of closing
	if (!entry.has_children) {
		emit(state, {
			type: 'revert',
			id: entry.id,
			replacement_text: entry.delimiter,
			start: entry.start,
		});
		accumulate_text(state, entry.delimiter, offset(state));
	} else {
		emit(state, {type: 'close', id: entry.id, end: offset(state) + 1});
	}
	state.active_text_id = null;
	state.pos++;
	state.column++;
	state.prev_char = state.buffer.charCodeAt(state.pos - 1);
	return true;
};

/**
 * Scan for the first potential closing delimiter and check its word boundary.
 * Returns a tri-state:
 * - `'confirmed'`: closer found in buffer with valid word boundary
 * - `'rejected'`: closer found but with invalid word boundary (greedy first-match fails)
 * - `'pending'`: no closer in buffer yet, or can't determine boundary
 *
 * Optimistic constructs (strikethrough) treat `'pending'` as proceed.
 * Non-optimistic constructs (italic) treat `'pending'` as text.
 *
 * Uses native `indexOf` instead of a manual char loop for faster scanning.
 */
export const scan_closer_boundary = (
	state: MdzStreamParserState,
	delimiter: string,
): 'confirmed' | 'rejected' | 'pending' => {
	const search_start = state.pos + 1;
	const delim_pos = state.buffer.indexOf(delimiter, search_start);
	if (delim_pos === -1) return 'pending'; // no closer in buffer
	// check for paragraph break before the delimiter
	const para_pos = state.buffer.indexOf('\n\n', search_start);
	if (para_pos !== -1 && para_pos < delim_pos) return 'pending'; // paragraph break first
	// check word boundary after the closer
	const after_pos = delim_pos + 1;
	if (after_pos < state.buffer.length) {
		return is_word_char(state.buffer.charCodeAt(after_pos)) ? 'rejected' : 'confirmed';
	}
	// closer at end of buffer — treat as confirmed, consistent with
	// check_close_word_boundary which also assumes boundary at buffer end
	return 'confirmed';
};

// -- Inline code --

export const try_code = (state: MdzStreamParserState): boolean => {
	const start = state.pos;
	let i = start + 1; // past opening backtick

	// compute search boundary: don't scan past open formatting delimiters
	const search_limit = code_search_limit(state, start + 1);

	// scan for closing backtick (must be before newline and search boundary)
	while (i < state.buffer.length && i < search_limit) {
		const c = state.buffer.charCodeAt(i);
		if (c === BACKTICK) {
			// found close
			const content = state.buffer.slice(start + 1, i);
			if (content.length === 0) {
				// empty code — treat as text
				ensure_paragraph(state);
				accumulate_text(state, '``', offset(state, start));
				state.pos = i + 1;
				state.column += 2;
				state.prev_char = BACKTICK;
				return true;
			}
			flush_text(state);
			ensure_paragraph(state);
			const id = alloc_id(state);
			emit(state, {
				type: 'text',
				id,
				content,
				text_type: 'Code',
				start: offset(state, start),
				end: offset(state, i + 1),
			});
			state.active_text_id = null;
			state.pos = i + 1;
			state.column += i + 1 - start;
			state.prev_char = BACKTICK;
			return true;
		}
		if (c === NEWLINE) {
			// inline code can't span lines — treat opening backtick as text
			ensure_paragraph(state);
			accumulate_text(state, '`', offset(state, start));
			state.pos = start + 1;
			state.column++;
			state.prev_char = BACKTICK;
			return true;
		}
		i++;
	}

	// hit search limit (open formatting delimiter boundary) — treat backtick as text
	if (i < state.buffer.length && i >= search_limit) {
		ensure_paragraph(state);
		accumulate_text(state, '`', offset(state, start));
		state.pos = start + 1;
		state.column++;
		state.prev_char = BACKTICK;
		return true;
	}

	// buffer ended without close or newline.
	// If formatting is on the stack, hold — the formatting delimiter might appear
	// in the next chunk between the backtick and its closer, and going optimistic
	// would make the code span consume the formatting closer as raw text.
	if (has_inline_formatting_on_stack(state)) {
		return false; // hold for more input
	}

	// no formatting on stack — open Code optimistically.
	// Content streams via text/append_text inside the container.
	// Closes on matching backtick, reverts on newline.
	flush_text(state);
	ensure_paragraph(state);
	const id = alloc_id(state);
	const code_start = offset(state, start);
	emit(state, {type: 'open', id, node_type: 'Code', start: code_start});
	push_stack_entry(state, id, 'Code', code_start, true, '`');
	state.in_code = true;
	state.active_text_id = null;
	state.pos = start + 1; // past opening backtick
	state.column++;
	state.prev_char = BACKTICK;
	return true;
};

/**
 * Compute search limit for inline code scanning.
 * Finds the closest closing delimiter for any open formatting on the stack.
 * This prevents backtick scanning from crossing bold/italic/etc boundaries.
 */
export const code_search_limit = (state: MdzStreamParserState, from: number): number => {
	let limit = state.buffer.length;
	for (let s = state.stack.length - 1; s >= 0; s--) {
		const entry = state.stack[s]!;
		if (entry.node_type === 'Paragraph' || entry.node_type === 'Heading') break;
		// find the closing delimiter in the buffer
		const delimiter = entry.delimiter;
		if (!delimiter) continue;
		const idx = state.buffer.indexOf(delimiter, from);
		if (idx !== -1 && idx < limit) {
			limit = idx;
		}
	}
	return limit;
};

/**
 * Check if any inline formatting container (Bold, Italic, Strikethrough, Link)
 * is on the stack above the current block boundary.
 * Used to decide whether backtick can go optimistic — when formatting is open,
 * the code span might cross the formatting boundary, so we hold instead.
 */
export const has_inline_formatting_on_stack = (state: MdzStreamParserState): boolean => {
	for (let s = state.stack.length - 1; s >= 0; s--) {
		const entry = state.stack[s]!;
		if (entry.node_type === 'Paragraph' || entry.node_type === 'Heading') return false;
		if (entry.delimiter) return true;
	}
	return false;
};

/**
 * Process content inside an optimistic inline Code container.
 * Scans raw text (no inline formatting) until closing backtick or newline.
 * Backtick closes (or reverts if empty). Newline reverts (code can't span lines).
 */
export const process_code_content = (state: MdzStreamParserState): void => {
	const char_code = state.buffer.charCodeAt(state.pos);

	if (char_code === BACKTICK) {
		flush_text(state);
		const entry = state.stack.pop()!;
		if (!entry.has_children) {
			// empty code `` — revert opener, accumulate closer as text
			emit(state, {type: 'revert', id: entry.id, replacement_text: '`', start: entry.start});
			accumulate_text(state, '`', offset(state));
		} else {
			emit(state, {type: 'close', id: entry.id, end: offset(state) + 1});
		}
		state.in_code = false;
		state.active_text_id = null;
		state.pos++;
		state.column++;
		state.prev_char = BACKTICK;
		return;
	}

	if (char_code === NEWLINE) {
		// code spans can't cross lines — revert
		flush_text(state);
		const entry = state.stack.pop()!;
		emit(state, {type: 'revert', id: entry.id, replacement_text: '`', start: entry.start});
		state.in_code = false;
		state.active_text_id = null;
		// don't consume newline — outer loop handles it
		return;
	}

	// scan raw text until backtick or newline (paragraph already ensured at code open)
	const start = state.pos;
	state.pos++;
	while (state.pos < state.buffer.length) {
		const c = state.buffer.charCodeAt(state.pos);
		if (c === BACKTICK || c === NEWLINE) break;
		state.pos++;
	}
	accumulate_text(state, state.buffer.slice(start, state.pos), offset(state, start));
	state.prev_char = state.buffer.charCodeAt(state.pos - 1);
	state.column += state.pos - start;
};
