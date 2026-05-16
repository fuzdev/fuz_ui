/**
 * Block-element handlers for the streaming mdz parser.
 *
 * Each `try_*` returns {@link TryResult} so the orchestrator in
 * {@link ./mdz_stream_parser.ts} can fall through or wait for more input.
 *
 * @module
 */

import {
	BACKTICK,
	HASH,
	HR_HYPHEN_COUNT,
	HYPHEN,
	MAX_HEADING_LEVEL,
	MIN_CODEBLOCK_BACKTICKS,
	NEWLINE,
	SPACE,
} from './mdz_helpers.js';
import {
	type CodeblockState,
	type MdzStreamParserState,
	type TryResult,
	accumulate_text,
	alloc_id,
	close_paragraph,
	emit,
	flush_text,
	offset,
} from './mdz_stream_parser_state.js';

/**
 * Try to parse a heading at column 0.
 * Returns true if consumed, false if needs more input, null if definitely not a heading.
 */
export const try_heading = (state: MdzStreamParserState): TryResult => {
	const start = state.pos;
	let i = start;

	// count hashes
	let hash_count = 0;
	while (
		i < state.buffer.length &&
		state.buffer.charCodeAt(i) === HASH &&
		hash_count <= MAX_HEADING_LEVEL
	) {
		hash_count++;
		i++;
	}

	if (hash_count === 0 || hash_count > MAX_HEADING_LEVEL) return 'not_match';

	// need at least one more char to check for space
	if (i >= state.buffer.length) return 'need_more';

	// must have space after hashes
	if (state.buffer.charCodeAt(i) !== SPACE) return 'not_match';
	i++; // consume space

	// must have at least one non-whitespace char (but we might not have it yet)
	// for streaming, we'll open the heading optimistically when we see `# `
	// if the content turns out empty, that's an edge case we can handle on close

	// close any open paragraph first
	flush_text(state);
	close_paragraph(state);

	const id = alloc_id(state);
	const heading_start = offset(state, start);
	emit(state, {
		type: 'open',
		id,
		node_type: 'Heading',
		start: heading_start,
		level: hash_count as 1 | 2 | 3 | 4 | 5 | 6,
	});
	state.stack.push({
		id,
		node_type: 'Heading',
		optimistic: false,
		delimiter: '',
		tag_name: undefined,
		has_children: false,
		start: heading_start,
	});
	state.in_heading = true;
	state.heading_text_parts = [''];
	state.pos = i;
	state.column = i - start;
	state.prev_char = SPACE;
	return 'consumed';
};

/**
 * Try to parse a horizontal rule at column 0.
 * Returns true if consumed, false if needs more input, null if definitely not an HR.
 * When `forced` is true, treats buffer end as EOF (no more input coming).
 */
export const try_hr = (state: MdzStreamParserState, forced = false): TryResult => {
	const start = state.pos;
	let i = start;

	// must have exactly 3 hyphens
	if (i + HR_HYPHEN_COUNT > state.buffer.length) return 'need_more';
	for (let j = 0; j < HR_HYPHEN_COUNT; j++) {
		if (state.buffer.charCodeAt(i + j) !== HYPHEN) return 'not_match';
	}
	i += HR_HYPHEN_COUNT;

	// after hyphens, only spaces allowed before newline/EOF
	while (i < state.buffer.length) {
		const c = state.buffer.charCodeAt(i);
		if (c === NEWLINE) break;
		if (c !== SPACE) return 'not_match';
		i++;
	}

	// if buffer ends without newline/EOF confirmation, need more input (unless forced)
	if (i >= state.buffer.length && !forced) {
		return 'need_more';
	}

	flush_text(state);
	close_paragraph(state);

	const id = alloc_id(state);
	emit(state, {
		type: 'void',
		id,
		node_type: 'Hr',
		start: offset(state, start),
		end: offset(state, i),
	});
	if (forced) {
		state.pos = state.buffer.length;
	} else {
		state.pos = i;
		if (i < state.buffer.length && state.buffer.charCodeAt(i) === NEWLINE) {
			state.pos++; // consume the newline
		}
		// skip additional newlines
		while (state.pos < state.buffer.length && state.buffer.charCodeAt(state.pos) === NEWLINE) {
			state.pos++;
		}
		if (state.pos >= state.buffer.length) {
			state.skip_leading_newlines = true;
		}
	}
	state.column = 0;
	state.prev_char = NEWLINE;
	return 'consumed';
};

/**
 * Try to open a code block at column 0.
 *
 * Opens the codeblock optimistically when possible. When the current paragraph
 * has no prior content, opens immediately on `\`\`\`lang\n` without lookahead,
 * enabling streaming. When the paragraph has content (text before the fence on
 * a prior line), falls back to lookahead via `find_closing_fence` to avoid
 * splitting the paragraph on revert.
 */
export const try_codeblock_open = (state: MdzStreamParserState): TryResult => {
	const start = state.pos;
	let i = start;

	// count backticks
	let backtick_count = 0;
	while (i < state.buffer.length && state.buffer.charCodeAt(i) === BACKTICK) {
		backtick_count++;
		i++;
	}

	if (backtick_count < MIN_CODEBLOCK_BACKTICKS) {
		// if buffer ended mid-backtick-sequence, need more input
		if (i >= state.buffer.length) return 'need_more';
		// definitely not enough backticks
		return 'not_match';
	}

	// find end of opening fence line (need newline)
	const lang_start = i;
	while (i < state.buffer.length) {
		const c = state.buffer.charCodeAt(i);
		if (c === NEWLINE) break;
		if (c === SPACE) break;
		i++;
	}
	const lang = i > lang_start ? state.buffer.slice(lang_start, i) : null;

	// skip trailing spaces on opening fence line
	while (i < state.buffer.length && state.buffer.charCodeAt(i) === SPACE) {
		i++;
	}

	// must find newline
	if (i >= state.buffer.length) return 'need_more';
	if (state.buffer.charCodeAt(i) !== NEWLINE) return 'not_match';
	i++; // consume newline

	// when the current paragraph has content, closing it would split text on
	// revert — fall back to lookahead to avoid that
	if (state.in_paragraph && (state.accumulated_text.length > 0 || state.active_text_id !== null)) {
		const closing_result = find_closing_fence(state, i, backtick_count);
		if (closing_result === 'not_found') return 'need_more';
		if (closing_result === 'invalid') return 'not_match';
	}

	// build delimiter for potential revert (e.g. "```ts\n" or "```\n")
	const delimiter = state.buffer.slice(start, i);

	flush_text(state);
	close_paragraph(state);

	const id = alloc_id(state);
	const cb_start = offset(state, start);
	emit(state, {type: 'open', id, node_type: 'Codeblock', start: cb_start, lang});
	state.codeblock = {id, backtick_count, text_id: null, delimiter, start: cb_start};
	state.pos = i;
	state.column = 0;
	state.prev_char = NEWLINE;
	return 'consumed';
};

/**
 * Scan buffer from `start` for a valid closing fence with `backtick_count` backticks.
 * Used as a fallback when the current paragraph has prior content (to avoid
 * splitting the paragraph on revert). Returns 'found' if a valid closing fence
 * exists, 'not_found' if the buffer ends before we can determine, 'invalid' if
 * we can see the full remaining content and there's no valid closing fence.
 */
export const find_closing_fence = (
	state: MdzStreamParserState,
	start: number,
	backtick_count: number,
): 'found' | 'not_found' | 'invalid' => {
	let i = start;
	const content_start = start;
	let at_col0 = true;

	while (i < state.buffer.length) {
		if (at_col0 && state.buffer.charCodeAt(i) === BACKTICK) {
			// count backticks
			let count = 0;
			const fence_start = i;
			while (i < state.buffer.length && state.buffer.charCodeAt(i) === BACKTICK) {
				count++;
				i++;
			}
			if (count === backtick_count) {
				// skip trailing spaces
				while (i < state.buffer.length && state.buffer.charCodeAt(i) === SPACE) {
					i++;
				}
				// must be followed by newline or EOF
				if (i >= state.buffer.length || state.buffer.charCodeAt(i) === NEWLINE) {
					// check for empty content
					const content = state.buffer.slice(content_start, fence_start);
					const final_content = content.endsWith('\n') ? content.slice(0, -1) : content;
					if (final_content.length === 0) return 'invalid'; // empty codeblock
					return 'found';
				}
			}
			// not a valid fence — continue scanning
			continue;
		}

		if (state.buffer.charCodeAt(i) === NEWLINE) {
			at_col0 = true;
		} else {
			at_col0 = false;
		}
		i++;
	}

	// reached end of buffer without finding closing fence
	return 'not_found';
};

/**
 * Emit codeblock content as `text` (first chunk) or `append_text` (subsequent
 * chunks), updating `cb.text_id` on first emit. `content_start` is the local
 * buffer position where the content slice began — only used to compute the
 * global byte offset for the first `text` opcode.
 */
export const emit_codeblock_text = (
	state: MdzStreamParserState,
	cb: CodeblockState,
	content: string,
	content_start: number,
): void => {
	if (cb.text_id !== null) {
		emit(state, {type: 'append_text', id: cb.text_id, content});
	} else {
		const id = alloc_id(state);
		const text_start = offset(state, content_start);
		emit(state, {
			type: 'text',
			id,
			content,
			text_type: 'Text',
			start: text_start,
			end: text_start + content.length,
		});
		cb.text_id = id;
	}
};

/**
 * Drain the remaining buffer as codeblock content at EOF.
 * No close opcode is emitted here — `close_codeblock_at_eof` (in state.ts)
 * does the revert-and-wrap dance after process completes.
 */
export const process_codeblock_forced = (state: MdzStreamParserState): void => {
	const cb = state.codeblock!;
	const remaining = state.buffer.slice(state.pos);
	if (remaining.length > 0) {
		emit_codeblock_text(state, cb, remaining, state.pos);
	}
	state.pos = state.buffer.length;
};

/**
 * Process bytes while in codeblock mode.
 * Returns true if processing should continue, false if more input needed.
 */
export const process_codeblock = (state: MdzStreamParserState): boolean => {
	const cb = state.codeblock!;
	const start = state.pos;

	while (state.pos < state.buffer.length) {
		// check for closing fence at column 0
		if (state.column === 0) {
			const fence_match = match_codeblock_close(state, cb.backtick_count);
			if (fence_match === -2) {
				// need more input — hold from this position (don't consume potential fence chars)
				break;
			}
			if (fence_match !== -1) {
				// emit content up to the closing fence (excluding trailing newline before fence)
				let content_end = state.pos;
				if (content_end > start && state.buffer.charCodeAt(content_end - 1) === NEWLINE) {
					content_end--;
				}
				const content = state.buffer.slice(start, content_end);
				if (content.length > 0) {
					emit_codeblock_text(state, cb, content, start);
				}

				// empty codeblock: no content was ever emitted → invalid, revert
				if (cb.text_id === null && content.length === 0) {
					return revert_empty_codeblock(state, cb);
				}

				// codeblock end = position of newline after closing fence (exclusive)
				emit(state, {type: 'close', id: cb.id, end: offset(state, fence_match - 1)});
				state.pos = fence_match;
				state.codeblock = null;
				state.column = 0;
				state.prev_char = NEWLINE;
				// skip newlines after codeblock
				while (state.pos < state.buffer.length && state.buffer.charCodeAt(state.pos) === NEWLINE) {
					state.pos++;
				}
				// if buffer ended before absorbing all trailing newlines, continue in next chunk
				if (state.pos >= state.buffer.length) {
					state.skip_leading_newlines = true;
				}
				return true;
			}
		}

		// not a closing fence — advance
		const c = state.buffer.charCodeAt(state.pos);
		if (c === NEWLINE) {
			state.column = 0;
		} else {
			state.column++;
		}
		state.pos++;
	}

	// buffer exhausted or broke for potential fence — emit content so far, hold trailing data.
	// Hold trailing \n (could be before a closing fence in next chunk), and also hold
	// \n + backticks when we broke mid-fence-check (the \n precedes the backticks and
	// would be stripped by fence close, so must not be emitted as content yet).
	let emit_end = state.pos;
	if (emit_end > start && state.buffer.charCodeAt(emit_end - 1) === NEWLINE) {
		emit_end--;
		state.pos = emit_end; // leave \n (+ any held backticks after it) in buffer
	}
	const content = state.buffer.slice(start, emit_end);
	if (content.length > 0) {
		emit_codeblock_text(state, cb, content, start);
	}
	return false; // need more input
};

/**
 * Check if the buffer at current position has a codeblock closing fence.
 * Returns the position after the fence (including trailing newline) on success,
 * `-1` when definitely not a fence, or `-2` when more input is needed to decide.
 */
export const match_codeblock_close = (
	state: MdzStreamParserState,
	backtick_count: number,
): number => {
	let i = state.pos;

	// count backticks
	let count = 0;
	while (i < state.buffer.length && state.buffer.charCodeAt(i) === BACKTICK) {
		count++;
		i++;
	}
	if (count !== backtick_count) {
		// buffer ended mid-backtick-sequence — could still become a fence
		if (i >= state.buffer.length && count < backtick_count) return -2;
		return -1;
	}

	// trailing spaces allowed
	while (i < state.buffer.length && state.buffer.charCodeAt(i) === SPACE) {
		i++;
	}

	// must be followed by newline or EOF
	if (i < state.buffer.length && state.buffer.charCodeAt(i) === NEWLINE) {
		return i + 1;
	}
	if (i >= state.buffer.length) {
		// exact backtick count but buffer ended (could be spaces or newline coming)
		return -2;
	}
	return -1;
};

/**
 * Revert an empty codeblock (closing fence found but no content was emitted).
 * Wraps the opening fence delimiter in a new paragraph and accumulates the
 * closing fence text for normal paragraph processing.
 */
export const revert_empty_codeblock = (
	state: MdzStreamParserState,
	cb: CodeblockState,
): boolean => {
	const wrap_id = alloc_id(state);
	emit(state, {
		type: 'revert',
		id: cb.id,
		replacement_text: cb.delimiter,
		start: cb.start,
		wrap_node_type: 'Paragraph',
		wrap_id,
	});

	// enter paragraph mode with the wrapper
	state.stack.push({
		id: wrap_id,
		node_type: 'Paragraph',
		optimistic: false,
		delimiter: '',
		tag_name: undefined,
		has_children: false,
		start: cb.start,
	});
	state.in_paragraph = true;
	state.active_text_id = null;
	state.codeblock = null;

	// accumulate the closing fence text (backticks + spaces, without trailing newline)
	const fence_start = state.pos;
	let fence_content_end = fence_start;
	while (
		fence_content_end < state.buffer.length &&
		state.buffer.charCodeAt(fence_content_end) === BACKTICK
	) {
		fence_content_end++;
	}
	while (
		fence_content_end < state.buffer.length &&
		state.buffer.charCodeAt(fence_content_end) === SPACE
	) {
		fence_content_end++;
	}
	accumulate_text(
		state,
		state.buffer.slice(fence_start, fence_content_end),
		offset(state, fence_start),
	);

	// position past the closing fence content, leaving any trailing newline for normal processing
	state.pos = fence_content_end;
	state.column = fence_content_end - fence_start;
	state.prev_char =
		fence_content_end > fence_start ? state.buffer.charCodeAt(fence_content_end - 1) : NEWLINE;
	return true;
};
