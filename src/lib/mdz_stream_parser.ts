/**
 * Streaming opcode parser for mdz.
 *
 * Fed chunks of text (e.g., from LLM output), emits opcodes as rendering
 * instructions. Makes optimistic assumptions about ambiguous syntax and
 * emits `revert` opcodes to correct when wrong. Never re-parses.
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

import type {MdzNodeId, MdzOpcode, MdzContainerNodeType} from './mdz_opcodes.js';
import {
	BACKTICK,
	ASTERISK,
	UNDERSCORE,
	TILDE,
	NEWLINE,
	HYPHEN,
	HASH,
	SPACE,
	TAB,
	LEFT_ANGLE,
	RIGHT_ANGLE,
	SLASH,
	LEFT_BRACKET,
	RIGHT_BRACKET,
	LEFT_PAREN,
	RIGHT_PAREN,
	A_UPPER,
	Z_UPPER,
	HR_HYPHEN_COUNT,
	MIN_CODEBLOCK_BACKTICKS,
	MAX_HEADING_LEVEL,
	HTTPS_PREFIX_LENGTH,
	HTTP_PREFIX_LENGTH,
	PERIOD,
	is_letter,
	is_tag_name_char,
	is_word_char,
	is_valid_path_char,
	trim_trailing_punctuation,
	mdz_is_url,
} from './mdz_helpers.js';

interface StackEntry {
	id: MdzNodeId;
	node_type: MdzContainerNodeType;
	/** Whether this was opened speculatively (will be reverted if not closed). */
	optimistic: boolean;
	/** The opening delimiter text, used as `replacement_text` on revert. */
	delimiter: string;
	/** Tag name for Element/Component entries. */
	tag_name?: string;
	/** Whether any child content has been emitted inside this container. */
	has_children?: boolean;
}

interface CodeblockState {
	id: MdzNodeId;
	backtick_count: number;
	text_id: MdzNodeId | null;
}

/**
 * Streaming opcode parser for mdz content.
 * Feed chunks via `feed()`, retrieve opcodes via `take_opcodes()`, call `finish()` at end.
 */
export class MdzStreamParser {
	#buffer = '';
	#pos = 0;
	#opcodes: Array<MdzOpcode> = [];
	#next_id: MdzNodeId = 0;
	#stack: Array<StackEntry> = [];
	#column = 0;
	#prev_char = -1;
	#active_text_id: MdzNodeId | null = null;
	#accumulated_text = '';
	#codeblock: CodeblockState | null = null;
	/** Whether we're inside a heading (newline ends it). */
	#in_heading = false;

	/**
	 * Feed a chunk of text to the parser.
	 * Opcodes are accumulated and retrieved via `take_opcodes()`.
	 */
	feed(chunk: string): void {
		this.#buffer += chunk;
		this.#process();
		// flush any accumulated text so the renderer shows it immediately
		this.#flush_text();
		// drain processed bytes from the buffer
		if (this.#pos > 0) {
			this.#buffer = this.#buffer.slice(this.#pos);
			this.#pos = 0;
		}
	}

	/**
	 * Signal end of input. Resolves all pending state:
	 * closes open blocks, reverts unclosed optimistic opens.
	 *
	 * Trailing newline trimming uses three cooperating mechanisms:
	 * 1. `#trim_trailing_newline()` in `#close_paragraph()` — trims from the last
	 *    emitted text/append_text opcode (handles mid-stream paragraph breaks)
	 * 2. Pre-flush trim below — trims unflushed `#accumulated_text` before it becomes
	 *    an opcode (handles trailing `\n` from `#process_remaining()`)
	 * 3. The pre-flush trim runs before `#revert_all_optimistic()`, so the `\n` is
	 *    removed before reverts are emitted. `#trim_trailing_newline()` in
	 *    `#close_paragraph()` handles any remaining cases after reverts.
	 */
	finish(): void {
		// process any remaining buffer
		if (this.#buffer.length > 0) {
			this.#process_remaining();
		}
		// pre-flush trim: remove trailing \n from accumulated text before it's emitted
		if (this.#accumulated_text.endsWith('\n')) {
			this.#accumulated_text = this.#accumulated_text.slice(0, -1);
		}
		this.#flush_text();
		// revert any unclosed optimistic inline containers
		this.#revert_all_optimistic();
		// close heading if open
		if (this.#in_heading) {
			this.#close_heading();
		}
		// close paragraph if open
		this.#close_paragraph();
		// close codeblock if open (unclosed at EOF)
		if (this.#codeblock) {
			this.#close_codeblock_at_eof();
		}
	}

	/**
	 * Drain and return all accumulated opcodes.
	 */
	take_opcodes(): Array<MdzOpcode> {
		const ops = this.#opcodes;
		this.#opcodes = [];
		return ops;
	}

	// -- Processing loop --

	#process(): void {
		this.#process_loop(false);
	}

	/**
	 * Force-process remaining buffer bytes at finish() time.
	 * Treats ambiguous trailing bytes as concrete content.
	 */
	#process_remaining(): void {
		this.#process_loop(true);
	}

	/**
	 * Core processing loop. When `forced` is false (normal streaming), returns
	 * when more input is needed. When `forced` is true (EOF), treats buffer end
	 * as content end and never waits for more input.
	 */
	#process_loop(forced: boolean): void {
		while (this.#pos < this.#buffer.length) {
			// codeblock mode
			if (this.#codeblock) {
				if (forced) {
					// codeblock at EOF: remaining content is codeblock text
					const remaining = this.#buffer.slice(this.#pos);
					if (remaining.length > 0) {
						if (this.#codeblock.text_id !== null) {
							this.#emit({
								type: 'append_text',
								id: this.#codeblock.text_id,
								content: remaining,
							});
						} else {
							const id = this.#alloc_id();
							this.#emit({type: 'text', id, content: remaining, text_type: 'Text'});
							this.#codeblock.text_id = id;
						}
					}
					this.#pos = this.#buffer.length;
					return;
				}
				if (!this.#process_codeblock()) return; // need more input
				continue;
			}

			const char_code = this.#buffer.charCodeAt(this.#pos);

			// newline handling
			if (char_code === NEWLINE) {
				if (this.#in_heading) {
					// newline ends heading
					this.#flush_text();
					this.#close_heading();
					this.#pos++;
					// absorb consecutive newlines after heading
					while (
						this.#pos < this.#buffer.length &&
						this.#buffer.charCodeAt(this.#pos) === NEWLINE
					) {
						this.#pos++;
					}
					this.#column = 0;
					this.#prev_char = NEWLINE;
					continue;
				}
				// hold trailing \n when streaming (could be start of \n\n)
				if (!forced && this.#pos + 1 >= this.#buffer.length) return;
				// check for paragraph break (\n\n)
				if (
					this.#pos + 1 < this.#buffer.length &&
					this.#buffer.charCodeAt(this.#pos + 1) === NEWLINE
				) {
					this.#handle_paragraph_break();
					continue;
				}
				// single newline: accumulate as text
				this.#accumulated_text += '\n';
				this.#pos++;
				this.#column = 0;
				this.#prev_char = NEWLINE;
				continue;
			}

			// block elements at column 0
			if (this.#column === 0 && !this.#in_heading) {
				if (char_code === HASH) {
					const r = this.#try_heading();
					if (r === true) continue;
					if (!forced && r === false) return; // need more input
				} else if (char_code === HYPHEN) {
					const r = this.#try_hr(forced);
					if (r === true) continue;
					if (!forced && r === false) return; // need more input
				} else if (char_code === BACKTICK) {
					const r = this.#try_codeblock_open();
					if (r === true) continue;
					if (!forced && r === false) return; // need more input
				}
			}

			// inline processing
			if (forced) {
				this.#process_inline_forced();
			} else {
				if (!this.#process_inline()) return; // need more input
			}
		}
	}

	// -- Block element handlers --

	/**
	 * Try to parse a heading at column 0.
	 * Returns true if consumed, false if needs more input, null if definitely not a heading.
	 */
	#try_heading(): boolean | null {
		const start = this.#pos;
		let i = start;

		// count hashes
		let hash_count = 0;
		while (
			i < this.#buffer.length &&
			this.#buffer.charCodeAt(i) === HASH &&
			hash_count <= MAX_HEADING_LEVEL
		) {
			hash_count++;
			i++;
		}

		if (hash_count === 0 || hash_count > MAX_HEADING_LEVEL) return null;

		// need at least one more char to check for space
		if (i >= this.#buffer.length) return false; // need more input

		// must have space after hashes
		if (this.#buffer.charCodeAt(i) !== SPACE) return null;
		i++; // consume space

		// must have at least one non-whitespace char (but we might not have it yet)
		// for streaming, we'll open the heading optimistically when we see `# `
		// if the content turns out empty, that's an edge case we can handle on close

		// close any open paragraph first
		this.#flush_text();
		this.#close_paragraph();

		const id = this.#alloc_id();
		this.#emit({
			type: 'open',
			id,
			node_type: 'Heading',
			level: hash_count as 1 | 2 | 3 | 4 | 5 | 6,
		});
		this.#stack.push({id, node_type: 'Heading', optimistic: false, delimiter: ''});
		this.#in_heading = true;
		this.#pos = i;
		this.#column = i - start;
		this.#prev_char = SPACE;
		return true;
	}

	/**
	 * Try to parse a horizontal rule at column 0.
	 * Returns true if consumed, false if needs more input, null if definitely not an HR.
	 * When `forced` is true, treats buffer end as EOF (no more input coming).
	 */
	#try_hr(forced = false): boolean | null {
		const start = this.#pos;
		let i = start;

		// must have exactly 3 hyphens
		if (i + HR_HYPHEN_COUNT > this.#buffer.length) return forced ? false : false;
		for (let j = 0; j < HR_HYPHEN_COUNT; j++) {
			if (this.#buffer.charCodeAt(i + j) !== HYPHEN) return forced ? false : null;
		}
		i += HR_HYPHEN_COUNT;

		// after hyphens, only spaces allowed before newline/EOF
		while (i < this.#buffer.length) {
			const c = this.#buffer.charCodeAt(i);
			if (c === NEWLINE) break;
			if (c !== SPACE) return forced ? false : null;
			i++;
		}

		// if buffer ends without newline/EOF confirmation, need more input (unless forced)
		if (i >= this.#buffer.length && !forced) {
			return false;
		}

		this.#flush_text();
		this.#close_paragraph();

		const id = this.#alloc_id();
		this.#emit({type: 'void', id, node_type: 'Hr'});
		if (forced) {
			this.#pos = this.#buffer.length;
		} else {
			this.#pos = i;
			if (i < this.#buffer.length && this.#buffer.charCodeAt(i) === NEWLINE) {
				this.#pos++; // consume the newline
			}
			// skip additional newlines
			while (this.#pos < this.#buffer.length && this.#buffer.charCodeAt(this.#pos) === NEWLINE) {
				this.#pos++;
			}
		}
		this.#column = 0;
		this.#prev_char = NEWLINE;
		return true;
	}

	/**
	 * Try to open a code block at column 0.
	 * Returns true if consumed, false if needs more input, null if definitely not a codeblock.
	 *
	 * **Streaming limitation**: This method scans the entire buffer for a closing fence
	 * before opening the codeblock (to reject empty codeblocks and invalid fences).
	 * Codeblock content is NOT streamed until the closing fence is buffered.
	 * For LLM output with large codeblocks, this means the parser holds all content
	 * until the full block arrives. A future optimization could open optimistically
	 * and revert if the closing fence is missing, matching the inline formatting strategy.
	 */
	#try_codeblock_open(): boolean | null {
		const start = this.#pos;
		let i = start;

		// count backticks
		let backtick_count = 0;
		while (i < this.#buffer.length && this.#buffer.charCodeAt(i) === BACKTICK) {
			backtick_count++;
			i++;
		}

		if (backtick_count < MIN_CODEBLOCK_BACKTICKS) {
			// if buffer ended mid-backtick-sequence, need more input
			if (i >= this.#buffer.length) return false;
			// definitely not enough backticks
			return null;
		}

		// find end of opening fence line (need newline)
		const lang_start = i;
		while (i < this.#buffer.length) {
			const c = this.#buffer.charCodeAt(i);
			if (c === NEWLINE) break;
			if (c === SPACE) break;
			i++;
		}
		const lang = i > lang_start ? this.#buffer.slice(lang_start, i) : null;

		// skip trailing spaces on opening fence line
		while (i < this.#buffer.length && this.#buffer.charCodeAt(i) === SPACE) {
			i++;
		}

		// must find newline
		if (i >= this.#buffer.length) return false; // need more input
		if (this.#buffer.charCodeAt(i) !== NEWLINE) return null;
		i++; // consume newline

		// look ahead for a valid closing fence in the buffer
		const closing_result = this.#find_closing_fence(i, backtick_count);
		if (closing_result === 'not_found') return false; // need more input (fence may come later)
		if (closing_result === 'invalid') return null; // no valid closing fence exists — not a codeblock

		this.#flush_text();
		this.#close_paragraph();

		const id = this.#alloc_id();
		this.#emit({type: 'open', id, node_type: 'Codeblock', lang});
		this.#codeblock = {id, backtick_count, text_id: null};
		this.#pos = i;
		this.#column = 0;
		this.#prev_char = NEWLINE;
		return true;
	}

	/**
	 * Scan buffer from `start` for a valid closing fence with `backtick_count` backticks.
	 * Returns 'found' if a valid closing fence exists, 'not_found' if buffer ends
	 * before we can determine (might come in next chunk), 'invalid' if we can see
	 * the full remaining content and there's no valid closing fence.
	 */
	#find_closing_fence(start: number, backtick_count: number): 'found' | 'not_found' | 'invalid' {
		let i = start;
		const content_start = start;
		let at_col0 = true;

		while (i < this.#buffer.length) {
			if (at_col0 && this.#buffer.charCodeAt(i) === BACKTICK) {
				// count backticks
				let count = 0;
				const fence_start = i;
				while (i < this.#buffer.length && this.#buffer.charCodeAt(i) === BACKTICK) {
					count++;
					i++;
				}
				if (count === backtick_count) {
					// skip trailing spaces
					while (i < this.#buffer.length && this.#buffer.charCodeAt(i) === SPACE) {
						i++;
					}
					// must be followed by newline or EOF
					if (i >= this.#buffer.length || this.#buffer.charCodeAt(i) === NEWLINE) {
						// check for empty content
						const content = this.#buffer.slice(content_start, fence_start);
						const final_content = content.endsWith('\n') ? content.slice(0, -1) : content;
						if (final_content.length === 0) return 'invalid'; // empty codeblock
						return 'found';
					}
				}
				// not a valid fence — continue scanning
				continue;
			}

			if (this.#buffer.charCodeAt(i) === NEWLINE) {
				at_col0 = true;
			} else {
				at_col0 = false;
			}
			i++;
		}

		// reached end of buffer without finding closing fence
		return 'not_found';
	}

	/**
	 * Process bytes while in codeblock mode.
	 * Returns true if processing should continue, false if more input needed.
	 */
	#process_codeblock(): boolean {
		const cb = this.#codeblock!;
		const start = this.#pos;

		while (this.#pos < this.#buffer.length) {
			// check for closing fence at column 0
			if (this.#column === 0) {
				const fence_match = this.#match_codeblock_close(cb.backtick_count);
				if (fence_match !== -1) {
					// emit content up to the closing fence (excluding trailing newline before fence)
					let content_end = this.#pos;
					if (content_end > start && this.#buffer.charCodeAt(content_end - 1) === NEWLINE) {
						content_end--;
					}
					const content = this.#buffer.slice(start, content_end);
					if (content.length > 0) {
						if (cb.text_id !== null) {
							this.#emit({type: 'append_text', id: cb.text_id, content});
						} else {
							const id = this.#alloc_id();
							this.#emit({type: 'text', id, content, text_type: 'Text'});
							cb.text_id = id;
						}
					}
					this.#emit({type: 'close', id: cb.id});
					this.#pos = fence_match;
					this.#codeblock = null;
					this.#column = 0;
					this.#prev_char = NEWLINE;
					// skip newlines after codeblock
					while (
						this.#pos < this.#buffer.length &&
						this.#buffer.charCodeAt(this.#pos) === NEWLINE
					) {
						this.#pos++;
					}
					return true;
				}
			}

			// not a closing fence — advance
			const c = this.#buffer.charCodeAt(this.#pos);
			if (c === NEWLINE) {
				this.#column = 0;
			} else {
				this.#column++;
			}
			this.#pos++;
		}

		// buffer exhausted — emit content so far, hold trailing \n for potential fence
		let emit_end = this.#pos;
		// hold trailing newline (could be before a closing fence in next chunk)
		if (emit_end > start && this.#buffer.charCodeAt(emit_end - 1) === NEWLINE) {
			emit_end--;
			this.#pos = emit_end; // leave \n in buffer
		}
		const content = this.#buffer.slice(start, emit_end);
		if (content.length > 0) {
			if (cb.text_id !== null) {
				this.#emit({type: 'append_text', id: cb.text_id, content});
			} else {
				const id = this.#alloc_id();
				this.#emit({type: 'text', id, content, text_type: 'Text'});
				cb.text_id = id;
			}
		}
		return false; // need more input
	}

	/**
	 * Check if the buffer at current position has a codeblock closing fence.
	 * Returns the position after the fence (including trailing newline), or -1.
	 */
	#match_codeblock_close(backtick_count: number): number {
		let i = this.#pos;

		// count backticks
		let count = 0;
		while (i < this.#buffer.length && this.#buffer.charCodeAt(i) === BACKTICK) {
			count++;
			i++;
		}
		if (count !== backtick_count) return -1;

		// trailing spaces allowed
		while (i < this.#buffer.length && this.#buffer.charCodeAt(i) === SPACE) {
			i++;
		}

		// must be followed by newline or EOF
		if (i < this.#buffer.length && this.#buffer.charCodeAt(i) === NEWLINE) {
			return i + 1;
		}
		if (i >= this.#buffer.length) {
			// could be EOF or more input coming — for streaming, treat as needing more input
			// unless buffer has the exact fence. We'll rely on finish() to handle EOF.
			return -1;
		}
		return -1;
	}

	#handle_paragraph_break(): void {
		this.#flush_text();
		// revert all unclosed optimistic inline containers
		this.#revert_all_optimistic();
		this.#close_paragraph();
		// skip all consecutive newlines
		while (this.#pos < this.#buffer.length && this.#buffer.charCodeAt(this.#pos) === NEWLINE) {
			this.#pos++;
		}
		this.#column = 0;
		this.#prev_char = NEWLINE;
	}

	// -- Paragraph management --

	#ensure_paragraph(): void {
		if (this.#in_heading) return; // don't open paragraph inside heading
		// check if we already have a paragraph or heading as the outermost block
		for (const entry of this.#stack) {
			if (entry.node_type === 'Paragraph') return; // already inside a paragraph
		}
		const id = this.#alloc_id();
		this.#emit({type: 'open', id, node_type: 'Paragraph'});
		this.#stack.push({id, node_type: 'Paragraph', optimistic: false, delimiter: ''});
	}

	#close_paragraph(): void {
		// find and close the paragraph on the stack
		for (let i = this.#stack.length - 1; i >= 0; i--) {
			if (this.#stack[i]!.node_type === 'Paragraph') {
				// trim trailing newline from paragraph content
				this.#trim_trailing_newline();
				// revert everything above the paragraph
				while (this.#stack.length - 1 > i) {
					const entry = this.#stack.pop()!;
					this.#emit({type: 'revert', id: entry.id, replacement_text: entry.delimiter});
				}
				const entry = this.#stack.pop()!;
				this.#emit({type: 'close', id: entry.id});
				this.#active_text_id = null;
				return;
			}
		}
	}

	#close_heading(): void {
		this.#in_heading = false;
		// revert optimistic containers inside the heading
		this.#revert_all_optimistic();
		// find and close the heading
		for (let i = this.#stack.length - 1; i >= 0; i--) {
			if (this.#stack[i]!.node_type === 'Heading') {
				const entry = this.#stack[i]!;
				// collect text content for heading ID
				// TODO: compute heading_id from emitted text opcodes
				this.#stack.splice(i, 1);
				this.#emit({type: 'close', id: entry.id});
				this.#active_text_id = null;
				return;
			}
		}
	}

	#close_codeblock_at_eof(): void {
		if (!this.#codeblock) return;
		this.#emit({type: 'close', id: this.#codeblock.id});
		this.#codeblock = null;
	}

	// -- Inline processing --

	/**
	 * Process one inline element. Returns false if more input is needed.
	 */
	#process_inline(): boolean {
		const char_code = this.#buffer.charCodeAt(this.#pos);

		// check for closing delimiters first (if matching open exists)
		if (
			char_code === ASTERISK &&
			this.#pos + 1 < this.#buffer.length &&
			this.#buffer.charCodeAt(this.#pos + 1) === ASTERISK
		) {
			if (this.#find_open('Bold') !== -1) {
				return this.#close_bold();
			}
			return this.#try_bold();
		}

		if (char_code === ASTERISK) {
			// could be start of ** — need next char to decide
			if (this.#pos + 1 >= this.#buffer.length) return false; // hold for next chunk
			// single asterisk is text (next char is not *)
			this.#ensure_paragraph();
			this.#accumulated_text += '*';
			this.#prev_char = ASTERISK;
			this.#column++;
			this.#pos++;
			return true;
		}

		if (char_code === UNDERSCORE) {
			const open_idx = this.#find_open('Italic');
			if (open_idx !== -1 && this.#check_close_word_boundary()) {
				return this.#close_single_delimiter(open_idx);
			}
			return this.#try_italic();
		}

		if (char_code === TILDE) {
			const open_idx = this.#find_open('Strikethrough');
			if (open_idx !== -1 && this.#check_close_word_boundary()) {
				return this.#close_single_delimiter(open_idx);
			}
			return this.#try_strikethrough();
		}

		if (char_code === BACKTICK) {
			return this.#try_code();
		}

		if (char_code === LEFT_BRACKET) {
			return this.#try_link_open();
		}

		if (char_code === RIGHT_BRACKET) {
			const link_idx = this.#find_open('Link');
			if (link_idx !== -1) {
				return this.#try_complete_link(link_idx);
			}
			// no open link — treat as text
			this.#ensure_paragraph();
			this.#accumulated_text += ']';
			this.#prev_char = RIGHT_BRACKET;
			this.#column++;
			this.#pos++;
			return true;
		}

		if (char_code === LEFT_ANGLE) {
			// check for closing tag first
			if (this.#pos + 1 < this.#buffer.length && this.#buffer.charCodeAt(this.#pos + 1) === SLASH) {
				const result = this.#try_close_tag();
				if (result !== null) return result;
			}
			const tag_result = this.#try_tag_open();
			if (tag_result !== null) return tag_result;
			// not a valid tag — fall through to text
		}

		// auto-detected URLs
		if (char_code === 104 /* h */) {
			const result = this.#try_auto_url();
			if (result !== null) return result;
		}

		// auto-detected paths
		if (char_code === SLASH) {
			const result = this.#try_auto_path_absolute();
			if (result !== null) return result;
		}
		if (char_code === PERIOD) {
			const result = this.#try_auto_path_relative();
			if (result !== null) return result;
		}

		// plain text
		this.#consume_text_char();
		return true;
	}

	/**
	 * Like process_inline but doesn't return false (forced processing at EOF).
	 */
	#process_inline_forced(): void {
		const char_code = this.#buffer.charCodeAt(this.#pos);

		// try closing delimiters
		if (
			char_code === ASTERISK &&
			this.#pos + 1 < this.#buffer.length &&
			this.#buffer.charCodeAt(this.#pos + 1) === ASTERISK
		) {
			if (this.#find_open('Bold') !== -1) {
				this.#close_bold();
				return;
			}
		}
		if (char_code === UNDERSCORE) {
			const open_idx = this.#find_open('Italic');
			if (open_idx !== -1 && this.#check_close_word_boundary()) {
				this.#close_single_delimiter(open_idx);
				return;
			}
		}
		if (char_code === TILDE) {
			const open_idx = this.#find_open('Strikethrough');
			if (open_idx !== -1 && this.#check_close_word_boundary()) {
				this.#close_single_delimiter(open_idx);
				return;
			}
		}

		// auto-detected URLs (force mode — treat buffer end as URL end)
		if (char_code === 104 /* h */) {
			const result = this.#try_auto_url(true);
			if (result) return;
		}

		// auto-detected paths (force mode)
		if (char_code === SLASH) {
			const result = this.#try_auto_path_absolute(true);
			if (result) return;
		}
		if (char_code === PERIOD) {
			const result = this.#try_auto_path_relative(true);
			if (result) return;
		}

		// everything else: consume as text
		this.#consume_text_char();
	}

	// -- Bold --

	#try_bold(): boolean {
		// we know we're at ** and there's no open Bold
		if (this.#pos + 1 >= this.#buffer.length) return false; // need more input

		// need at least one char after ** to avoid empty bold
		if (this.#pos + 2 >= this.#buffer.length) return false;

		this.#flush_text();
		this.#ensure_paragraph();

		const id = this.#alloc_id();
		this.#emit({type: 'open', id, node_type: 'Bold'});
		this.#stack.push({
			id,
			node_type: 'Bold',
			optimistic: true,
			delimiter: '**',
		});
		this.#active_text_id = null;
		this.#pos += 2;
		this.#column += 2;
		this.#prev_char = ASTERISK;
		return true;
	}

	#close_bold(): boolean {
		const idx = this.#find_open('Bold');
		if (idx === -1) return true;
		this.#flush_text();
		// revert anything between the bold and the top of the stack
		this.#revert_above(idx);
		const entry = this.#stack.pop()!;
		// check for empty container — revert to literal text instead of closing
		if (!entry.has_children) {
			this.#emit({type: 'revert', id: entry.id, replacement_text: entry.delimiter});
			this.#accumulated_text += '**';
		} else {
			this.#emit({type: 'close', id: entry.id});
		}
		this.#active_text_id = null;
		this.#pos += 2;
		this.#column += 2;
		this.#prev_char = ASTERISK;
		return true;
	}

	// -- Italic --

	#try_italic(): boolean {
		// check opening word boundary
		if (this.#prev_char !== -1 && is_word_char(this.#prev_char)) {
			// not at word boundary — emit as text
			this.#ensure_paragraph();
			this.#accumulated_text += '_';
			this.#prev_char = UNDERSCORE;
			this.#column++;
			this.#pos++;
			return true;
		}

		// need at least one char after _
		if (this.#pos + 1 >= this.#buffer.length) return false;

		// check if the first potential closer has a valid word boundary
		// (matches existing parser's greedy first-match strategy)
		if (!this.#first_closer_has_valid_boundary('_')) {
			this.#ensure_paragraph();
			this.#accumulated_text += '_';
			this.#prev_char = UNDERSCORE;
			this.#column++;
			this.#pos++;
			return true;
		}

		this.#flush_text();
		this.#ensure_paragraph();

		const id = this.#alloc_id();
		this.#emit({type: 'open', id, node_type: 'Italic'});
		this.#stack.push({
			id,
			node_type: 'Italic',
			optimistic: true,
			delimiter: '_',
		});
		this.#active_text_id = null;
		this.#pos++;
		this.#column++;
		this.#prev_char = UNDERSCORE;
		return true;
	}

	// -- Strikethrough --

	#try_strikethrough(): boolean {
		// check opening word boundary
		if (this.#prev_char !== -1 && is_word_char(this.#prev_char)) {
			this.#ensure_paragraph();
			this.#accumulated_text += '~';
			this.#prev_char = TILDE;
			this.#column++;
			this.#pos++;
			return true;
		}

		if (this.#pos + 1 >= this.#buffer.length) return false;

		// check if the first potential closer has a valid word boundary
		if (!this.#first_closer_has_valid_boundary('~')) {
			this.#ensure_paragraph();
			this.#accumulated_text += '~';
			this.#prev_char = TILDE;
			this.#column++;
			this.#pos++;
			return true;
		}

		this.#flush_text();
		this.#ensure_paragraph();

		const id = this.#alloc_id();
		this.#emit({type: 'open', id, node_type: 'Strikethrough'});
		this.#stack.push({
			id,
			node_type: 'Strikethrough',
			optimistic: true,
			delimiter: '~',
		});
		this.#active_text_id = null;
		this.#pos++;
		this.#column++;
		this.#prev_char = TILDE;
		return true;
	}

	// -- Single delimiter close (italic/strikethrough) --

	#check_close_word_boundary(): boolean {
		const next_pos = this.#pos + 1;
		if (next_pos < this.#buffer.length) {
			return !is_word_char(this.#buffer.charCodeAt(next_pos));
		}
		// at end of buffer — we'll treat as boundary for now (finish() handles unclosed)
		return true;
	}

	#close_single_delimiter(stack_idx: number): boolean {
		this.#flush_text();
		this.#revert_above(stack_idx);
		const entry = this.#stack.pop()!;
		// check for empty container — revert to literal text instead of closing
		if (!entry.has_children) {
			this.#emit({type: 'revert', id: entry.id, replacement_text: entry.delimiter});
			this.#accumulated_text += entry.delimiter;
		} else {
			this.#emit({type: 'close', id: entry.id});
		}
		this.#active_text_id = null;
		this.#pos++;
		this.#column++;
		this.#prev_char = this.#buffer.charCodeAt(this.#pos - 1);
		return true;
	}

	/**
	 * Check if the first potential closing delimiter in the buffer has a valid word boundary.
	 * Used to match the existing parser's greedy first-match strategy:
	 * if the first closer fails, the whole formatting attempt is rejected.
	 * Returns true if the first closer is valid, or if no closer is found in the buffer
	 * (optimistic — it might come in a later chunk).
	 */
	#first_closer_has_valid_boundary(delimiter: string): boolean {
		const char_code = delimiter.charCodeAt(0);
		let i = this.#pos + 1; // past the opening delimiter
		while (i < this.#buffer.length) {
			const c = this.#buffer.charCodeAt(i);
			if (
				c === NEWLINE &&
				i + 1 < this.#buffer.length &&
				this.#buffer.charCodeAt(i + 1) === NEWLINE
			) {
				break; // paragraph break — stop searching
			}
			if (c === char_code) {
				// found a potential closer — check word boundary after it
				const after_pos = i + 1;
				if (after_pos < this.#buffer.length) {
					return !is_word_char(this.#buffer.charCodeAt(after_pos));
				}
				// at end of buffer — can't determine, be optimistic
				return true;
			}
			i++;
		}
		// no closer found in buffer — be optimistic (might come in a later chunk)
		return true;
	}

	// -- Inline code --

	#try_code(): boolean {
		const start = this.#pos;
		let i = start + 1; // past opening backtick

		// compute search boundary: don't scan past open formatting delimiters
		const search_limit = this.#code_search_limit(start + 1);

		// scan for closing backtick (must be before newline and search boundary)
		while (i < this.#buffer.length && i < search_limit) {
			const c = this.#buffer.charCodeAt(i);
			if (c === BACKTICK) {
				// found close
				const content = this.#buffer.slice(start + 1, i);
				if (content.length === 0) {
					// empty code — treat as text
					this.#ensure_paragraph();
					this.#accumulated_text += '``';
					this.#pos = i + 1;
					this.#column += 2;
					this.#prev_char = BACKTICK;
					return true;
				}
				this.#flush_text();
				this.#ensure_paragraph();
				const id = this.#alloc_id();
				this.#emit({type: 'text', id, content, text_type: 'Code'});
				this.#active_text_id = null;
				this.#pos = i + 1;
				this.#column += i + 1 - start;
				this.#prev_char = BACKTICK;
				return true;
			}
			if (c === NEWLINE) {
				// inline code can't span lines — treat opening backtick as text
				this.#ensure_paragraph();
				this.#accumulated_text += '`';
				this.#pos = start + 1;
				this.#column++;
				this.#prev_char = BACKTICK;
				return true;
			}
			i++;
		}

		// hit search limit (open formatting delimiter boundary) — treat backtick as text
		if (i < this.#buffer.length && i >= search_limit) {
			this.#ensure_paragraph();
			this.#accumulated_text += '`';
			this.#pos = start + 1;
			this.#column++;
			this.#prev_char = BACKTICK;
			return true;
		}

		// buffer ended without close or newline — need more input
		return false;
	}

	/**
	 * Compute search limit for inline code scanning.
	 * Finds the closest closing delimiter for any open formatting on the stack.
	 * This prevents backtick scanning from crossing bold/italic/etc boundaries.
	 */
	#code_search_limit(from: number): number {
		let limit = this.#buffer.length;
		for (let s = this.#stack.length - 1; s >= 0; s--) {
			const entry = this.#stack[s]!;
			if (entry.node_type === 'Paragraph' || entry.node_type === 'Heading') break;
			// find the closing delimiter in the buffer
			const delimiter = entry.delimiter;
			if (!delimiter) continue;
			const idx = this.#buffer.indexOf(delimiter, from);
			if (idx !== -1 && idx < limit) {
				limit = idx;
			}
		}
		return limit;
	}

	// -- Links --

	#try_link_open(): boolean {
		this.#flush_text();
		this.#ensure_paragraph();

		const id = this.#alloc_id();
		this.#emit({type: 'open', id, node_type: 'Link'});
		this.#stack.push({id, node_type: 'Link', optimistic: true, delimiter: '['});
		this.#active_text_id = null;
		this.#pos++;
		this.#column++;
		this.#prev_char = LEFT_BRACKET;
		return true;
	}

	/**
	 * Try to complete a link after seeing `]`.
	 * Returns false if more input is needed (leaves pos at `]`).
	 */
	#try_complete_link(link_stack_idx: number): boolean {
		const bracket_pos = this.#pos;

		// need at least one char after ]
		if (bracket_pos + 1 >= this.#buffer.length) return false;

		const after_bracket = this.#buffer.charCodeAt(bracket_pos + 1);
		if (after_bracket !== LEFT_PAREN) {
			// not a link — revert
			this.#flush_text();
			this.#revert_above(link_stack_idx);
			const entry = this.#stack.pop()!;
			this.#emit({type: 'revert', id: entry.id, replacement_text: '['});
			this.#active_text_id = null;
			// consume ] as text
			this.#accumulated_text += ']';
			this.#pos = bracket_pos + 1;
			this.#column++;
			this.#prev_char = RIGHT_BRACKET;
			return true;
		}

		// found ]( — scan for )
		let i = bracket_pos + 2; // past ](
		while (i < this.#buffer.length) {
			const c = this.#buffer.charCodeAt(i);
			if (c === RIGHT_PAREN) {
				const reference = this.#buffer.slice(bracket_pos + 2, i);
				// validate reference
				if (!reference.trim()) {
					// empty reference — revert
					this.#flush_text();
					this.#revert_above(link_stack_idx);
					const entry = this.#stack.pop()!;
					this.#emit({type: 'revert', id: entry.id, replacement_text: '['});
					this.#active_text_id = null;
					this.#accumulated_text += ']';
					this.#pos = bracket_pos + 1;
					this.#column++;
					this.#prev_char = RIGHT_BRACKET;
					return true;
				}
				// validate characters
				let valid = true;
				for (let j = 0; j < reference.length; j++) {
					if (!is_valid_path_char(reference.charCodeAt(j))) {
						valid = false;
						break;
					}
				}
				if (!valid) {
					this.#flush_text();
					this.#revert_above(link_stack_idx);
					const entry = this.#stack.pop()!;
					this.#emit({type: 'revert', id: entry.id, replacement_text: '['});
					this.#active_text_id = null;
					this.#accumulated_text += ']';
					this.#pos = bracket_pos + 1;
					this.#column++;
					this.#prev_char = RIGHT_BRACKET;
					return true;
				}

				// success — close the link with reference
				this.#flush_text();
				this.#revert_above(link_stack_idx);
				const entry = this.#stack.pop()!;
				const link_type = mdz_is_url(reference) ? 'external' : 'internal';
				this.#emit({type: 'close', id: entry.id, reference, link_type});
				this.#active_text_id = null;
				this.#pos = i + 1;
				this.#column += i + 1 - bracket_pos;
				this.#prev_char = RIGHT_PAREN;
				return true;
			}
			if (c === NEWLINE || c === SPACE) {
				// invalid character in URL (simplified check)
				break;
			}
			i++;
		}

		// didn't find ) — need more input or invalid
		if (i >= this.#buffer.length) return false; // need more input

		// found invalid char before ) — revert
		this.#flush_text();
		this.#revert_above(link_stack_idx);
		const entry = this.#stack.pop()!;
		this.#emit({type: 'revert', id: entry.id, replacement_text: '['});
		this.#active_text_id = null;
		this.#accumulated_text += ']';
		this.#pos = bracket_pos + 1;
		this.#column++;
		this.#prev_char = RIGHT_BRACKET;
		return true;
	}

	// -- Tags --

	#try_tag_open(): boolean | null {
		const start = this.#pos;
		let i = start + 1; // past <

		// tag name must start with letter
		if (i >= this.#buffer.length) return null; // treat as text via fallthrough
		if (!is_letter(this.#buffer.charCodeAt(i))) {
			return null; // not a tag
		}

		// collect tag name
		const name_start = i;
		while (i < this.#buffer.length && is_tag_name_char(this.#buffer.charCodeAt(i))) {
			i++;
		}
		if (i >= this.#buffer.length) return false; // need more input

		const name = this.#buffer.slice(name_start, i);

		// skip whitespace
		while (i < this.#buffer.length && this.#buffer.charCodeAt(i) === SPACE) {
			i++;
		}
		if (i >= this.#buffer.length) return false;

		// check for self-closing />
		if (
			this.#buffer.charCodeAt(i) === SLASH &&
			i + 1 < this.#buffer.length &&
			this.#buffer.charCodeAt(i + 1) === RIGHT_ANGLE
		) {
			const first_char = name.charCodeAt(0);
			const is_component = first_char >= A_UPPER && first_char <= Z_UPPER;
			const node_type: MdzContainerNodeType = is_component ? 'Component' : 'Element';

			this.#flush_text();
			this.#ensure_paragraph();
			const id = this.#alloc_id();
			this.#emit({type: 'open', id, node_type, name});
			this.#emit({type: 'close', id});
			this.#active_text_id = null;
			this.#pos = i + 2;
			this.#column += i + 2 - start;
			this.#prev_char = RIGHT_ANGLE;
			return true;
		}

		// check for >
		if (this.#buffer.charCodeAt(i) !== RIGHT_ANGLE) {
			return null; // not a valid tag
		}
		i++; // past >

		const first_char = name.charCodeAt(0);
		const is_component = first_char >= A_UPPER && first_char <= Z_UPPER;
		const node_type: MdzContainerNodeType = is_component ? 'Component' : 'Element';

		this.#flush_text();
		this.#ensure_paragraph();
		const id = this.#alloc_id();
		const delimiter = this.#buffer.slice(start, i); // e.g., "<Alert>"
		this.#emit({type: 'open', id, node_type, name});
		this.#stack.push({id, node_type, optimistic: true, delimiter, tag_name: name});
		this.#active_text_id = null;
		this.#pos = i;
		this.#column += i - start;
		this.#prev_char = RIGHT_ANGLE;
		return true;
	}

	/**
	 * Try to close a tag. Returns null if not a close tag, false if needs more input, true if consumed.
	 */
	#try_close_tag(): boolean | null {
		// we're at </
		let i = this.#pos + 2; // past </

		if (i >= this.#buffer.length) return false;

		// collect tag name
		const name_start = i;
		while (i < this.#buffer.length && is_tag_name_char(this.#buffer.charCodeAt(i))) {
			i++;
		}
		if (i >= this.#buffer.length) return false; // need more input
		if (this.#buffer.charCodeAt(i) !== RIGHT_ANGLE) return null; // not a valid close tag

		const name = this.#buffer.slice(name_start, i);
		i++; // past >

		// find matching open tag on stack
		let found_idx = -1;
		for (let j = this.#stack.length - 1; j >= 0; j--) {
			const entry = this.#stack[j]!;
			if (
				(entry.node_type === 'Element' || entry.node_type === 'Component') &&
				entry.tag_name === name
			) {
				found_idx = j;
				break;
			}
			if (entry.node_type === 'Paragraph' || entry.node_type === 'Heading') break;
		}

		if (found_idx === -1) return null; // no matching open tag

		this.#flush_text();
		this.#revert_above(found_idx);
		const entry = this.#stack.pop()!;
		this.#emit({type: 'close', id: entry.id});
		this.#active_text_id = null;
		this.#column += i - this.#pos;
		this.#pos = i;
		this.#prev_char = RIGHT_ANGLE;
		return true;
	}

	// -- Auto URLs --

	#try_auto_url(forced = false): boolean | null {
		let prefix_len = 0;
		if (this.#buffer.startsWith('https://', this.#pos)) {
			prefix_len = HTTPS_PREFIX_LENGTH;
		} else if (this.#buffer.startsWith('http://', this.#pos)) {
			prefix_len = HTTP_PREFIX_LENGTH;
		}
		if (prefix_len === 0) return forced ? false : null;

		// must have content after protocol
		if (this.#pos + prefix_len >= this.#buffer.length) return false;
		const after = this.#buffer.charCodeAt(this.#pos + prefix_len);
		if (after === SPACE || after === NEWLINE) return forced ? false : null;

		// collect URL characters
		let i = this.#pos + prefix_len;
		while (i < this.#buffer.length) {
			const c = this.#buffer.charCodeAt(i);
			if (c === SPACE || c === NEWLINE || !is_valid_path_char(c)) break;
			i++;
		}

		// if buffer ended mid-URL, need more input (unless forced)
		if (i >= this.#buffer.length && !forced) return false;

		let reference = this.#buffer.slice(this.#pos, i);
		reference = trim_trailing_punctuation(reference);
		if (forced && reference.length <= prefix_len) return false;

		return this.#emit_auto_link(reference, 'external');
	}

	// -- Auto paths --

	#try_auto_path_absolute(forced = false): boolean | null {
		// must be at word boundary (preceded by space/newline/start)
		if (
			this.#prev_char !== -1 &&
			this.#prev_char !== SPACE &&
			this.#prev_char !== NEWLINE &&
			this.#prev_char !== TAB
		) {
			return forced ? false : null;
		}

		// reject // and /space
		if (this.#pos + 1 >= this.#buffer.length) return false;
		const next = this.#buffer.charCodeAt(this.#pos + 1);
		if (next === SLASH || next === SPACE || next === NEWLINE || next === TAB) {
			return forced ? false : null;
		}

		return this.#consume_auto_path('internal', forced);
	}

	#try_auto_path_relative(forced = false): boolean | null {
		if (
			this.#prev_char !== -1 &&
			this.#prev_char !== SPACE &&
			this.#prev_char !== NEWLINE &&
			this.#prev_char !== TAB
		) {
			return forced ? false : null;
		}

		// check for ./ or ../
		const remaining = this.#buffer.length - this.#pos;
		if (remaining < 3) return false; // need more input

		if (
			this.#buffer.charCodeAt(this.#pos + 1) === PERIOD &&
			this.#buffer.charCodeAt(this.#pos + 2) === SLASH
		) {
			// ../
			if (remaining < 4) return false;
			const after = this.#buffer.charCodeAt(this.#pos + 3);
			if (after === SPACE || after === NEWLINE || after === TAB || after === SLASH) {
				return forced ? false : null;
			}
			return this.#consume_auto_path('internal', forced);
		}

		if (this.#buffer.charCodeAt(this.#pos + 1) === SLASH) {
			// ./
			const after = this.#buffer.charCodeAt(this.#pos + 2);
			if (after === SPACE || after === NEWLINE || after === TAB || after === SLASH) {
				return forced ? false : null;
			}
			return this.#consume_auto_path('internal', forced);
		}

		return forced ? false : null;
	}

	#consume_auto_path(link_type: 'external' | 'internal', forced = false): boolean | null {
		let i = this.#pos;
		while (i < this.#buffer.length) {
			const c = this.#buffer.charCodeAt(i);
			if (c === SPACE || c === NEWLINE || !is_valid_path_char(c)) break;
			i++;
		}

		// if buffer ended mid-path, need more input (unless forced)
		if (i >= this.#buffer.length && !forced) return false;

		let reference = this.#buffer.slice(this.#pos, i);
		reference = trim_trailing_punctuation(reference);
		if (forced && reference.length === 0) return false;

		return this.#emit_auto_link(reference, link_type);
	}

	#emit_auto_link(reference: string, link_type: 'external' | 'internal'): boolean {
		const end_pos = this.#pos + reference.length;

		this.#flush_text();
		this.#ensure_paragraph();

		const link_id = this.#alloc_id();
		this.#emit({type: 'open', id: link_id, node_type: 'Link'});
		const text_id = this.#alloc_id();
		this.#emit({type: 'text', id: text_id, content: reference, text_type: 'Text'});
		this.#emit({type: 'close', id: link_id, reference, link_type});

		this.#active_text_id = null;
		this.#column += end_pos - this.#pos;
		this.#prev_char = reference.charCodeAt(reference.length - 1);
		this.#pos = end_pos;
		return true;
	}

	// -- Text consumption --

	#consume_text_char(): void {
		this.#ensure_paragraph();
		const c = this.#buffer[this.#pos]!;
		this.#accumulated_text += c;
		this.#prev_char = c.charCodeAt(0);
		if (this.#prev_char === NEWLINE) {
			this.#column = 0;
		} else {
			this.#column++;
		}
		this.#pos++;
	}

	// -- Helpers --

	#emit(op: MdzOpcode): void {
		this.#opcodes.push(op);
		// mark the innermost container as having children
		if (op.type === 'text' || op.type === 'append_text' || op.type === 'void') {
			const top = this.#stack[this.#stack.length - 1];
			if (top) top.has_children = true;
		} else if (op.type === 'open') {
			// opening a child container counts as content for the parent
			const parent = this.#stack[this.#stack.length - 1];
			if (parent) parent.has_children = true;
		}
	}

	#alloc_id(): MdzNodeId {
		return this.#next_id++;
	}

	/**
	 * Trim a trailing newline from paragraph content.
	 * Checks unflushed accumulated text first, then the last emitted text opcode.
	 */
	#trim_trailing_newline(): void {
		if (this.#accumulated_text.endsWith('\n')) {
			this.#accumulated_text = this.#accumulated_text.slice(0, -1);
			return;
		}
		// check the last emitted opcode (already flushed)
		for (let i = this.#opcodes.length - 1; i >= 0; i--) {
			const op = this.#opcodes[i]!;
			if (op.type === 'text' || op.type === 'append_text') {
				if (op.content.endsWith('\n')) {
					op.content = op.content.slice(0, -1);
					if (op.content.length === 0) {
						this.#opcodes.splice(i, 1);
						// if we removed a text node, clear active_text_id
						if (op.type === 'text') this.#active_text_id = null;
					}
				}
				return;
			}
			// stop at structural opcodes
			if (op.type === 'open' || op.type === 'close' || op.type === 'revert') return;
		}
	}

	/**
	 * Flush accumulated text as a text or append_text opcode.
	 */
	#flush_text(): void {
		if (this.#accumulated_text.length === 0) return;
		if (this.#active_text_id !== null) {
			this.#emit({type: 'append_text', id: this.#active_text_id, content: this.#accumulated_text});
		} else {
			this.#ensure_paragraph();
			const id = this.#alloc_id();
			this.#emit({type: 'text', id, content: this.#accumulated_text, text_type: 'Text'});
			this.#active_text_id = id;
		}
		this.#accumulated_text = '';
	}

	/**
	 * Find the innermost open container of a given type.
	 * Returns stack index, or -1 if not found.
	 * Does not cross block boundaries (Paragraph, Heading).
	 */
	#find_open(type: MdzContainerNodeType): number {
		for (let i = this.#stack.length - 1; i >= 0; i--) {
			const entry = this.#stack[i]!;
			if (entry.node_type === type) return i;
			// don't cross block boundaries
			if (entry.node_type === 'Paragraph' || entry.node_type === 'Heading') return -1;
		}
		return -1;
	}

	/**
	 * Revert all stack entries above the given index.
	 */
	#revert_above(target_idx: number): void {
		while (this.#stack.length - 1 > target_idx) {
			const entry = this.#stack.pop()!;
			if (entry.optimistic) {
				this.#emit({type: 'revert', id: entry.id, replacement_text: entry.delimiter});
			} else {
				this.#emit({type: 'close', id: entry.id});
			}
		}
		this.#active_text_id = null;
	}

	/**
	 * Revert all optimistic inline containers in the current block context.
	 */
	#revert_all_optimistic(): void {
		while (this.#stack.length > 0) {
			const top = this.#stack[this.#stack.length - 1]!;
			if (top.node_type === 'Paragraph' || top.node_type === 'Heading') break;
			this.#stack.pop();
			if (top.optimistic) {
				this.#emit({type: 'revert', id: top.id, replacement_text: top.delimiter});
			} else {
				this.#emit({type: 'close', id: top.id});
			}
		}
		this.#active_text_id = null;
	}
}
