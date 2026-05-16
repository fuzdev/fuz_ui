/**
 * Streaming opcode parser for mdz.
 *
 * Fed chunks of text (e.g., from LLM output), emits opcodes as rendering
 * instructions. Makes optimistic assumptions about ambiguous syntax and
 * emits `revert` opcodes to correct when wrong. Never re-parses.
 *
 * The design was independently arrived at but shares goals with
 * {@link https://bsky.app/profile/pngwn.at/post/3mi527zntb22n @pngwn.at}'s
 * Penguin-Flavoured Markdown (PFM): restrict the syntax so streaming is tractable,
 * render optimistically and correct when wrong, emit serializable opcodes
 * to avoid re-parsing, and keep the opcodes target-agnostic so any renderer
 * can consume them. mdz diverges in one respect: the Svelte consumer
 * (`MdzStreamState`) does build a reactive tree from opcodes — the platform
 * dictates this — but mutations are fine-grained via `$state`, not diffed.
 *
 * The parser is split across sibling modules: this file holds the public
 * `MdzStreamParser` class and the `process_loop` / `process_inline`
 * orchestrators. Per-category handlers (block / inline / link / url / text)
 * live in `mdz_stream_parser_*.ts` as free functions taking the shared
 * `MdzStreamParserState` as first argument.
 *
 * Usage:
 * ```ts
 * const parser = new MdzStreamParser();
 * parser.feed('hello **bold');
 * const ops1 = parser.take_opcodes(); // open Paragraph, text "hello ", open Bold, text "bold"
 * parser.feed('** world');
 * const ops2 = parser.take_opcodes(); // close Bold, text " world"
 * parser.finish();
 * const ops3 = parser.take_opcodes(); // close Paragraph
 * ```
 *
 * @module
 */

import type {MdzOpcode} from './mdz_opcodes.js';
import {
	BACKTICK,
	ASTERISK,
	UNDERSCORE,
	TILDE,
	NEWLINE,
	HYPHEN,
	HASH,
	LEFT_ANGLE,
	SLASH,
	LEFT_BRACKET,
	RIGHT_BRACKET,
	H_LOWER,
	PERIOD,
	is_word_char,
} from './mdz_helpers.js';
import {
	type MdzStreamParserState,
	accumulate_text,
	close_codeblock_at_eof,
	close_heading,
	close_paragraph,
	create_state,
	ensure_paragraph,
	find_open,
	flush_text,
	handle_paragraph_break,
	offset,
	revert_all_optimistic,
} from './mdz_stream_parser_state.js';
import {
	process_codeblock,
	process_codeblock_forced,
	try_codeblock_open,
	try_heading,
	try_hr,
} from './mdz_stream_parser_block.js';
import {
	check_close_word_boundary,
	close_bold,
	close_single_delimiter,
	process_code_content,
	try_bold,
	try_code,
	try_italic,
	try_strikethrough,
} from './mdz_stream_parser_inline.js';
import {
	try_close_tag,
	try_complete_link,
	try_link_open,
	try_tag_open,
} from './mdz_stream_parser_link.js';
import {
	complete_pending_url,
	process_url_content,
	start_speculative_url,
	try_auto_path_absolute,
	try_auto_path_relative,
	try_auto_url_forced,
} from './mdz_stream_parser_url.js';
import {consume_text_run} from './mdz_stream_parser_text.js';

/**
 * Streaming opcode parser for mdz content.
 * Feed chunks via `feed()`, retrieve opcodes via `take_opcodes()`, call `finish()` at end.
 *
 * The opcode sequence is not deterministic across chunk boundaries — the same input
 * fed in different chunk sizes may produce different `text`/`append_text` splits and
 * different optimistic/revert sequences. The final tree (via `mdz_opcodes_to_nodes`)
 * is always identical regardless of chunking.
 */
export class MdzStreamParser {
	#state: MdzStreamParserState = create_state();

	/**
	 * Feed a chunk of text to the parser.
	 * Opcodes are accumulated and retrieved via `take_opcodes()`.
	 */
	feed(chunk: string): void {
		const state = this.#state;
		state.buffer += chunk;
		process_loop(state, false);
		// flush any accumulated text so the renderer shows it immediately
		flush_text(state);
		// drain processed bytes from the buffer
		if (state.pos > 0) {
			state.base_offset += state.pos;
			state.buffer = state.buffer.slice(state.pos);
			state.pos = 0;
		}
	}

	/**
	 * Signal end of input. Resolves all pending state:
	 * closes open blocks, reverts unclosed optimistic opens.
	 *
	 * Trailing newline trimming uses three cooperating mechanisms:
	 * 1. `trim_trailing_newline()` in `close_paragraph()` — trims from the last
	 *    emitted text/append_text opcode (handles mid-stream paragraph breaks)
	 * 2. Pre-flush trim below — trims unflushed `accumulated_text` before it becomes
	 *    an opcode (handles trailing `\n` from `#process_remaining()`)
	 * 3. The pre-flush trim runs before `revert_all_optimistic()`, so the `\n` is
	 *    removed before reverts are emitted. `trim_trailing_newline()` in
	 *    `close_paragraph()` handles any remaining cases after reverts.
	 */
	finish(): void {
		const state = this.#state;
		// process any remaining buffer — `forced=true` treats ambiguous trailing
		// bytes as concrete content rather than waiting for more input
		if (state.buffer.length > 0) {
			process_loop(state, true);
		}
		// finalize pending URL if any (text-first auto-links)
		if (state.pending_url !== null) {
			flush_text(state);
			complete_pending_url(state);
		}
		// pre-flush trim: remove trailing \n from accumulated text before it's emitted
		if (state.accumulated_text.endsWith('\n')) {
			state.accumulated_text = state.accumulated_text.slice(0, -1);
		}
		flush_text(state);
		// revert any unclosed optimistic inline containers
		revert_all_optimistic(state);
		// close heading if open
		if (state.in_heading) {
			close_heading(state);
		}
		// close paragraph if open
		close_paragraph(state);
		// close codeblock if open (unclosed at EOF)
		if (state.codeblock) {
			close_codeblock_at_eof(state);
		}
	}

	/**
	 * Drain and return all accumulated opcodes.
	 * Destructive — empties the internal queue. The returned array is owned by the caller.
	 */
	take_opcodes(): Array<MdzOpcode> {
		const ops = this.#state.opcodes;
		this.#state.opcodes = [];
		return ops;
	}
}

// -- Processing loop --

/**
 * Core processing loop. When `forced` is false (normal streaming), returns
 * when more input is needed. When `forced` is true (EOF), treats buffer end
 * as content end and never waits for more input.
 */
const process_loop = (state: MdzStreamParserState, forced: boolean): void => {
	// absorb leading newlines left over from a block element close in a prior chunk
	if (state.skip_leading_newlines) {
		while (state.pos < state.buffer.length && state.buffer.charCodeAt(state.pos) === NEWLINE) {
			state.pos++;
		}
		state.skip_leading_newlines = false;
	}
	while (state.pos < state.buffer.length) {
		// codeblock mode
		if (state.codeblock) {
			if (forced) {
				process_codeblock_forced(state);
				return;
			}
			if (!process_codeblock(state)) return; // need more input
			continue;
		}

		// optimistic inline code mode — raw scanning for close/revert
		if (state.in_code) {
			process_code_content(state);
			continue;
		}

		// text-first URL/path scanning mode
		if (state.pending_url !== null) {
			process_url_content(state, forced);
			continue;
		}

		const char_code = state.buffer.charCodeAt(state.pos);

		// newline handling
		if (char_code === NEWLINE) {
			if (state.in_heading) {
				// newline ends heading
				flush_text(state);
				close_heading(state);
				state.pos++;
				// absorb consecutive newlines after heading
				while (state.pos < state.buffer.length && state.buffer.charCodeAt(state.pos) === NEWLINE) {
					state.pos++;
				}
				if (state.pos >= state.buffer.length) {
					state.skip_leading_newlines = true;
				}
				state.column = 0;
				state.prev_char = NEWLINE;
				continue;
			}
			// hold trailing \n when streaming (could be start of \n\n)
			if (!forced && state.pos + 1 >= state.buffer.length) return;
			// check for paragraph break (\n\n)
			if (
				state.pos + 1 < state.buffer.length &&
				state.buffer.charCodeAt(state.pos + 1) === NEWLINE
			) {
				handle_paragraph_break(state);
				continue;
			}
			// single newline: accumulate as text
			accumulate_text(state, '\n', offset(state));
			state.pos++;
			state.column = 0;
			state.prev_char = NEWLINE;
			continue;
		}

		// block elements at column 0
		if (state.column === 0 && !state.in_heading) {
			if (char_code === HASH) {
				const r = try_heading(state);
				if (r === 'consumed') continue;
				if (!forced && r === 'need_more') return;
			} else if (char_code === HYPHEN) {
				const r = try_hr(state, forced);
				if (r === 'consumed') continue;
				if (!forced && r === 'need_more') return;
			} else if (char_code === BACKTICK) {
				const r = try_codeblock_open(state);
				if (r === 'consumed') continue;
				if (!forced && r === 'need_more') return;
			}
		}

		// inline processing
		if (!process_inline(state, forced)) return; // need more input
	}
};

// -- Inline processing --

/**
 * Process one inline element. Returns false if more input is needed.
 * When `forced` is true (EOF processing), skips optimistic opening constructs
 * (no new bold/code/link/tag opens) but still handles italic (non-optimistic,
 * safe to try), all closing constructs, and auto-links.
 * Never returns false in forced mode.
 */
const process_inline = (state: MdzStreamParserState, forced: boolean): boolean => {
	const char_code = state.buffer.charCodeAt(state.pos);

	// check for closing delimiters first (if matching open exists)
	if (
		char_code === ASTERISK &&
		state.pos + 1 < state.buffer.length &&
		state.buffer.charCodeAt(state.pos + 1) === ASTERISK
	) {
		const bold_idx = find_open(state, 'Bold');
		if (bold_idx !== -1) {
			return close_bold(state, bold_idx);
		}
		if (!forced) return try_bold(state);
	}

	if (char_code === ASTERISK && !forced) {
		// could be start of ** — need next char to decide
		if (state.pos + 1 >= state.buffer.length) return false; // hold for next chunk
		// single asterisk is text (next char is not *)
		ensure_paragraph(state);
		accumulate_text(state, '*', offset(state));
		state.prev_char = ASTERISK;
		state.column++;
		state.pos++;
		return true;
	}

	if (char_code === UNDERSCORE) {
		const open_idx = find_open(state, 'Italic');
		if (open_idx !== -1 && check_close_word_boundary(state)) {
			return close_single_delimiter(state, open_idx);
		}
		// Italic is non-optimistic — only opens when closer is confirmed in
		// the buffer, so it's safe (and necessary) to try in forced mode too.
		return try_italic(state, forced);
	}

	if (char_code === TILDE) {
		const open_idx = find_open(state, 'Strikethrough');
		if (open_idx !== -1 && check_close_word_boundary(state)) {
			return close_single_delimiter(state, open_idx);
		}
		if (!forced) return try_strikethrough(state);
	}

	if (char_code === BACKTICK && !forced) {
		return try_code(state);
	}

	if (char_code === LEFT_BRACKET && !forced) {
		return try_link_open(state);
	}

	if (char_code === RIGHT_BRACKET && !forced) {
		const link_idx = find_open(state, 'Link');
		if (link_idx !== -1) {
			return try_complete_link(state, link_idx);
		}
		// no open link — treat as text
		ensure_paragraph(state);
		accumulate_text(state, ']', offset(state));
		state.prev_char = RIGHT_BRACKET;
		state.column++;
		state.pos++;
		return true;
	}

	if (char_code === LEFT_ANGLE) {
		// closing tags are handled even in forced mode
		if (state.pos + 1 < state.buffer.length && state.buffer.charCodeAt(state.pos + 1) === SLASH) {
			const result = try_close_tag(state);
			if (result === 'consumed') return true;
			// in forced mode, need_more falls through to text
			if (!forced && result === 'need_more') return false;
			// not_match — fall through
		}
		if (!forced) {
			const tag_result = try_tag_open(state);
			if (tag_result === 'consumed') return true;
			if (tag_result === 'need_more') return false;
			// not_match — fall through
		}
		// not a valid tag — fall through to text
	}

	// auto-detected URLs (text-first speculative prefix matching)
	if (char_code === H_LOWER) {
		if (forced) {
			const result = try_auto_url_forced(state);
			if (result === 'consumed') return true;
			if (result === 'need_more') return false;
		} else if (state.prev_char === -1 || !is_word_char(state.prev_char)) {
			// word boundary — start speculative URL prefix matching
			start_speculative_url(state);
			return true;
		}
	}

	// auto-detected paths
	if (char_code === SLASH) {
		const result = try_auto_path_absolute(state, forced);
		if (result === 'consumed') return true;
		if (result === 'need_more') return false;
	}
	if (char_code === PERIOD) {
		const result = try_auto_path_relative(state, forced);
		if (result === 'consumed') return true;
		if (result === 'need_more') return false;
	}

	// plain text
	consume_text_run(state);
	return true;
};
