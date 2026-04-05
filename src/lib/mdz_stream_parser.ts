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
	H_LOWER,
	PERIOD,
	is_letter,
	is_tag_name_char,
	is_word_char,
	is_valid_path_char,
	trim_trailing_punctuation,
	mdz_is_url,
	mdz_heading_id_from_text,
} from './mdz_helpers.js';

const HTTPS_PREFIX = 'https://';
const HTTP_PREFIX = 'http://';

interface StackEntry {
	id: MdzNodeId;
	node_type: MdzContainerNodeType;
	/** Whether this was opened speculatively (will be reverted if not closed). */
	optimistic: boolean;
	/** The opening delimiter text, used as `replacement_text` on revert. */
	delimiter: string;
	/** Tag name for Element/Component entries, `undefined` for all others. */
	tag_name: string | undefined;
	/** Whether any child content has been emitted inside this container. */
	has_children: boolean;
	/** Global byte offset of the opening delimiter. */
	start: number;
}

interface CodeblockState {
	id: MdzNodeId;
	backtick_count: number;
	text_id: MdzNodeId | null;
	/** The full opening fence line (e.g. "```ts\n"), used as `replacement_text` on revert. */
	delimiter: string;
	/** Global byte offset of the opening fence. */
	start: number;
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
	#accumulated_text_start = 0;
	#codeblock: CodeblockState | null = null;
	/** Global byte offset of the start of `#buffer`. */
	#base_offset = 0;
	/** Whether we're inside a heading (newline ends it). */
	#in_heading = false;
	/** Whether we're inside an optimistic inline Code container. */
	#in_code = false;
	/** Cached flag: whether a Paragraph is open on the stack. */
	#in_paragraph = false;
	/**
	 * Pending auto-link URL/path state for text-first rendering.
	 * When set, URL chars flow as visible text. On terminator, a `wrap` opcode
	 * retroactively wraps the text node in a Link.
	 *
	 * For URLs, `confirmed` starts false during speculative prefix matching
	 * (chars stream as text while we verify `https://` or `http://`).
	 * For paths, `confirmed` starts true (prefix already validated by hold).
	 */
	#pending_url: {
		url_text: string;
		start: number;
		link_type: 'external' | 'internal';
		/** Whether the URL/path prefix has been fully confirmed. */
		confirmed: boolean;
		/** Prefix match tracking — only used when `!confirmed`. */
		viable_https: boolean;
		viable_http: boolean;
	} | null = null;
	/**
	 * Stack of text segments for heading ID computation.
	 * Each open container inside a heading pushes a new segment.
	 * On close: pop and append to parent (children's text is part of heading).
	 * On revert: pop, prepend replacement_text, append to parent
	 * (document order: delimiter text comes before children's text).
	 */
	#heading_text_parts: Array<string> = [];

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
			this.#base_offset += this.#pos;
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
		// finalize pending URL if any (text-first auto-links)
		if (this.#pending_url !== null) {
			this.#flush_text();
			this.#complete_pending_url();
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
							const text_start = this.#offset();
							this.#emit({
								type: 'text',
								id,
								content: remaining,
								text_type: 'Text',
								start: text_start,
								end: text_start + remaining.length,
							});
							this.#codeblock.text_id = id;
						}
					}
					this.#pos = this.#buffer.length;
					return;
				}
				if (!this.#process_codeblock()) return; // need more input
				continue;
			}

			// optimistic inline code mode — raw scanning for close/revert
			if (this.#in_code) {
				this.#process_code_content();
				continue;
			}

			// text-first URL/path scanning mode
			if (this.#pending_url !== null) {
				this.#process_url_content(forced);
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
				this.#accumulate_text('\n', this.#offset());
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
			if (!this.#process_inline(forced)) return; // need more input
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
		const heading_start = this.#offset(start);
		this.#emit({
			type: 'open',
			id,
			node_type: 'Heading',
			start: heading_start,
			level: hash_count as 1 | 2 | 3 | 4 | 5 | 6,
		});
		this.#stack.push({
			id,
			node_type: 'Heading',
			optimistic: false,
			delimiter: '',
			tag_name: undefined,
			has_children: false,
			start: heading_start,
		});
		this.#in_heading = true;
		this.#heading_text_parts = [''];
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
		if (i + HR_HYPHEN_COUNT > this.#buffer.length) return false;
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
		this.#emit({
			type: 'void',
			id,
			node_type: 'Hr',
			start: this.#offset(start),
			end: this.#offset(i),
		});
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
	 * Opens the codeblock optimistically when possible. When the current paragraph
	 * has no prior content, opens immediately on `\`\`\`lang\n` without lookahead,
	 * enabling streaming. When the paragraph has content (text before the fence on
	 * a prior line), falls back to lookahead via `#find_closing_fence` to avoid
	 * splitting the paragraph on revert.
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

		// when the current paragraph has content, closing it would split text on
		// revert — fall back to lookahead to avoid that
		if (
			this.#in_paragraph &&
			(this.#accumulated_text.length > 0 || this.#active_text_id !== null)
		) {
			const closing_result = this.#find_closing_fence(i, backtick_count);
			if (closing_result === 'not_found') return false;
			if (closing_result === 'invalid') return null;
		}

		// build delimiter for potential revert (e.g. "```ts\n" or "```\n")
		const delimiter = this.#buffer.slice(start, i);

		this.#flush_text();
		this.#close_paragraph();

		const id = this.#alloc_id();
		const cb_start = this.#offset(start);
		this.#emit({type: 'open', id, node_type: 'Codeblock', start: cb_start, lang});
		this.#codeblock = {id, backtick_count, text_id: null, delimiter, start: cb_start};
		this.#pos = i;
		this.#column = 0;
		this.#prev_char = NEWLINE;
		return true;
	}

	/**
	 * Scan buffer from `start` for a valid closing fence with `backtick_count` backticks.
	 * Used as a fallback when the current paragraph has prior content (to avoid
	 * splitting the paragraph on revert). Returns 'found' if a valid closing fence
	 * exists, 'not_found' if the buffer ends before we can determine, 'invalid' if
	 * we can see the full remaining content and there's no valid closing fence.
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
							const text_start = this.#offset(start);
							this.#emit({
								type: 'text',
								id,
								content,
								text_type: 'Text',
								start: text_start,
								end: text_start + content.length,
							});
							cb.text_id = id;
						}
					}

					// empty codeblock: no content was ever emitted → invalid, revert
					if (cb.text_id === null && content.length === 0) {
						return this.#revert_empty_codeblock(cb);
					}

					// codeblock end = position of newline after closing fence (exclusive)
					this.#emit({type: 'close', id: cb.id, end: this.#offset(fence_match - 1)});
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
				const text_start = this.#offset(start);
				this.#emit({
					type: 'text',
					id,
					content,
					text_type: 'Text',
					start: text_start,
					end: text_start + content.length,
				});
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
		if (this.#in_heading || this.#in_paragraph) return;
		const id = this.#alloc_id();
		const start = this.#offset();
		this.#emit({type: 'open', id, node_type: 'Paragraph', start});
		this.#stack.push({
			id,
			node_type: 'Paragraph',
			optimistic: false,
			delimiter: '',
			tag_name: undefined,
			has_children: false,
			start,
		});
		this.#in_paragraph = true;
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
					if (entry.node_type === 'Code') this.#in_code = false;
					this.#emit({
						type: 'revert',
						id: entry.id,
						replacement_text: entry.delimiter,
						start: entry.start,
					});
				}
				const entry = this.#stack.pop()!;
				this.#emit({type: 'close', id: entry.id, end: this.#offset()});
				this.#active_text_id = null;
				this.#in_paragraph = false;
				return;
			}
		}
	}

	#close_heading(): void {
		// revert optimistic containers inside the heading (before clearing #in_heading,
		// so revert replacement text is captured in #heading_text_parts)
		this.#revert_all_optimistic();
		// compute heading ID from accumulated text before clearing heading state
		const heading_text = this.#heading_text_parts.join('');
		this.#heading_text_parts = [];
		this.#in_heading = false;
		const heading_id = mdz_heading_id_from_text(heading_text);
		const end = this.#offset();
		// find and close the heading
		for (let i = this.#stack.length - 1; i >= 0; i--) {
			if (this.#stack[i]!.node_type === 'Heading') {
				const entry = this.#stack[i]!;
				this.#stack.splice(i, 1);
				this.#emit({type: 'close', id: entry.id, end, heading_id});
				this.#active_text_id = null;
				return;
			}
		}
	}

	#close_codeblock_at_eof(): void {
		if (!this.#codeblock) return;
		const cb = this.#codeblock;
		// trim trailing newline from codeblock content (mirrors #close_paragraph behavior)
		this.#trim_trailing_newline();
		const wrap_id = this.#alloc_id();
		this.#emit({
			type: 'revert',
			id: cb.id,
			replacement_text: cb.delimiter,
			start: cb.start,
			wrap_node_type: 'Paragraph',
			wrap_id,
		});
		this.#emit({type: 'close', id: wrap_id, end: this.#offset()});
		this.#codeblock = null;
	}

	/**
	 * Revert an empty codeblock (closing fence found but no content was emitted).
	 * Wraps the opening fence delimiter in a new paragraph and accumulates the
	 * closing fence text for normal paragraph processing.
	 */
	#revert_empty_codeblock(cb: CodeblockState): boolean {
		const wrap_id = this.#alloc_id();
		this.#emit({
			type: 'revert',
			id: cb.id,
			replacement_text: cb.delimiter,
			start: cb.start,
			wrap_node_type: 'Paragraph',
			wrap_id,
		});

		// enter paragraph mode with the wrapper
		this.#stack.push({
			id: wrap_id,
			node_type: 'Paragraph',
			optimistic: false,
			delimiter: '',
			tag_name: undefined,
			has_children: false,
			start: cb.start,
		});
		this.#in_paragraph = true;
		this.#active_text_id = null;
		this.#codeblock = null;

		// accumulate the closing fence text (backticks + spaces, without trailing newline)
		const fence_start = this.#pos;
		let fence_content_end = fence_start;
		while (
			fence_content_end < this.#buffer.length &&
			this.#buffer.charCodeAt(fence_content_end) === BACKTICK
		) {
			fence_content_end++;
		}
		while (
			fence_content_end < this.#buffer.length &&
			this.#buffer.charCodeAt(fence_content_end) === SPACE
		) {
			fence_content_end++;
		}
		this.#accumulate_text(
			this.#buffer.slice(fence_start, fence_content_end),
			this.#offset(fence_start),
		);

		// position past the closing fence content, leaving any trailing newline for normal processing
		this.#pos = fence_content_end;
		this.#column = fence_content_end - fence_start;
		this.#prev_char =
			fence_content_end > fence_start ? this.#buffer.charCodeAt(fence_content_end - 1) : NEWLINE;
		return true;
	}

	// -- Inline processing --

	/**
	 * Process one inline element. Returns false if more input is needed.
	 * When `forced` is true (EOF processing), skips opening constructs
	 * (no new bold/italic/code/link/tag opens) but still handles all
	 * closing constructs and auto-links. Never returns false in forced mode.
	 */
	#process_inline(forced = false): boolean {
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
			if (!forced) return this.#try_bold();
		}

		if (char_code === ASTERISK && !forced) {
			// could be start of ** — need next char to decide
			if (this.#pos + 1 >= this.#buffer.length) return false; // hold for next chunk
			// single asterisk is text (next char is not *)
			this.#ensure_paragraph();
			this.#accumulate_text('*', this.#offset());
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
			if (!forced) return this.#try_italic();
		}

		if (char_code === TILDE) {
			const open_idx = this.#find_open('Strikethrough');
			if (open_idx !== -1 && this.#check_close_word_boundary()) {
				return this.#close_single_delimiter(open_idx);
			}
			if (!forced) return this.#try_strikethrough();
		}

		if (char_code === BACKTICK && !forced) {
			return this.#try_code();
		}

		if (char_code === LEFT_BRACKET && !forced) {
			return this.#try_link_open();
		}

		if (char_code === RIGHT_BRACKET && !forced) {
			const link_idx = this.#find_open('Link');
			if (link_idx !== -1) {
				return this.#try_complete_link(link_idx);
			}
			// no open link — treat as text
			this.#ensure_paragraph();
			this.#accumulate_text(']', this.#offset());
			this.#prev_char = RIGHT_BRACKET;
			this.#column++;
			this.#pos++;
			return true;
		}

		if (char_code === LEFT_ANGLE) {
			// closing tags are handled even in forced mode
			if (this.#pos + 1 < this.#buffer.length && this.#buffer.charCodeAt(this.#pos + 1) === SLASH) {
				const result = this.#try_close_tag();
				if (result === true) return true;
				// in forced mode, false (need more input) falls through to text
				if (!forced && result === false) return false;
				// null means not a close tag — fall through
			}
			if (!forced) {
				const tag_result = this.#try_tag_open();
				if (tag_result !== null) return tag_result;
			}
			// not a valid tag — fall through to text
		}

		// auto-detected URLs (text-first speculative prefix matching)
		if (char_code === H_LOWER) {
			if (forced) {
				const result = this.#try_auto_url_forced();
				if (result !== null) return result;
			} else if (this.#prev_char === -1 || !is_word_char(this.#prev_char)) {
				// word boundary — start speculative URL prefix matching
				return this.#start_speculative_url();
			}
		}

		// auto-detected paths
		if (char_code === SLASH) {
			const result = this.#try_auto_path_absolute(forced);
			if (result !== null) return result;
		}
		if (char_code === PERIOD) {
			const result = this.#try_auto_path_relative(forced);
			if (result !== null) return result;
		}

		// plain text
		this.#consume_text_run();
		return true;
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
		const bold_start = this.#offset();
		this.#emit({type: 'open', id, node_type: 'Bold', start: bold_start});
		this.#stack.push({
			id,
			node_type: 'Bold',
			optimistic: true,
			delimiter: '**',
			tag_name: undefined,
			has_children: false,
			start: bold_start,
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
			this.#emit({
				type: 'revert',
				id: entry.id,
				replacement_text: entry.delimiter,
				start: entry.start,
			});
			this.#accumulate_text('**', this.#offset());
		} else {
			this.#emit({type: 'close', id: entry.id, end: this.#offset() + 2});
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
			this.#accumulate_text('_', this.#offset());
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
			this.#accumulate_text('_', this.#offset());
			this.#prev_char = UNDERSCORE;
			this.#column++;
			this.#pos++;
			return true;
		}

		this.#flush_text();
		this.#ensure_paragraph();

		const id = this.#alloc_id();
		const italic_start = this.#offset();
		this.#emit({type: 'open', id, node_type: 'Italic', start: italic_start});
		this.#stack.push({
			id,
			node_type: 'Italic',
			optimistic: true,
			delimiter: '_',
			tag_name: undefined,
			has_children: false,
			start: italic_start,
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
			this.#accumulate_text('~', this.#offset());
			this.#prev_char = TILDE;
			this.#column++;
			this.#pos++;
			return true;
		}

		if (this.#pos + 1 >= this.#buffer.length) return false;

		// check if the first potential closer has a valid word boundary
		if (!this.#first_closer_has_valid_boundary('~')) {
			this.#ensure_paragraph();
			this.#accumulate_text('~', this.#offset());
			this.#prev_char = TILDE;
			this.#column++;
			this.#pos++;
			return true;
		}

		this.#flush_text();
		this.#ensure_paragraph();

		const id = this.#alloc_id();
		const strike_start = this.#offset();
		this.#emit({type: 'open', id, node_type: 'Strikethrough', start: strike_start});
		this.#stack.push({
			id,
			node_type: 'Strikethrough',
			optimistic: true,
			delimiter: '~',
			tag_name: undefined,
			has_children: false,
			start: strike_start,
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
			this.#emit({
				type: 'revert',
				id: entry.id,
				replacement_text: entry.delimiter,
				start: entry.start,
			});
			this.#accumulate_text(entry.delimiter, this.#offset());
		} else {
			this.#emit({type: 'close', id: entry.id, end: this.#offset() + 1});
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
	 *
	 * Uses native `indexOf` instead of a manual char loop for faster scanning.
	 */
	#first_closer_has_valid_boundary(delimiter: string): boolean {
		const search_start = this.#pos + 1;
		const delim_pos = this.#buffer.indexOf(delimiter, search_start);
		if (delim_pos === -1) return true; // no closer — optimistic
		// check for paragraph break before the delimiter
		const para_pos = this.#buffer.indexOf('\n\n', search_start);
		if (para_pos !== -1 && para_pos < delim_pos) return true; // paragraph break first — optimistic
		// check word boundary after the closer
		const after_pos = delim_pos + 1;
		if (after_pos < this.#buffer.length) {
			return !is_word_char(this.#buffer.charCodeAt(after_pos));
		}
		return true; // at end of buffer — optimistic
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
					this.#accumulate_text('``', this.#offset(start));
					this.#pos = i + 1;
					this.#column += 2;
					this.#prev_char = BACKTICK;
					return true;
				}
				this.#flush_text();
				this.#ensure_paragraph();
				const id = this.#alloc_id();
				this.#emit({
					type: 'text',
					id,
					content,
					text_type: 'Code',
					start: this.#offset(start),
					end: this.#offset(i + 1),
				});
				this.#active_text_id = null;
				this.#pos = i + 1;
				this.#column += i + 1 - start;
				this.#prev_char = BACKTICK;
				return true;
			}
			if (c === NEWLINE) {
				// inline code can't span lines — treat opening backtick as text
				this.#ensure_paragraph();
				this.#accumulate_text('`', this.#offset(start));
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
			this.#accumulate_text('`', this.#offset(start));
			this.#pos = start + 1;
			this.#column++;
			this.#prev_char = BACKTICK;
			return true;
		}

		// buffer ended without close or newline.
		// If formatting is on the stack, hold — the formatting delimiter might appear
		// in the next chunk between the backtick and its closer, and going optimistic
		// would make the code span consume the formatting closer as raw text.
		if (this.#has_inline_formatting_on_stack()) {
			return false; // hold for more input
		}

		// no formatting on stack — open Code optimistically.
		// Content streams via text/append_text inside the container.
		// Closes on matching backtick, reverts on newline.
		this.#flush_text();
		this.#ensure_paragraph();
		const id = this.#alloc_id();
		const code_start = this.#offset(start);
		this.#emit({type: 'open', id, node_type: 'Code', start: code_start});
		this.#stack.push({
			id,
			node_type: 'Code',
			optimistic: true,
			delimiter: '`',
			tag_name: undefined,
			has_children: false,
			start: code_start,
		});
		this.#in_code = true;
		this.#active_text_id = null;
		this.#pos = start + 1; // past opening backtick
		this.#column++;
		this.#prev_char = BACKTICK;
		return true;
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

	/**
	 * Check if any inline formatting container (Bold, Italic, Strikethrough, Link)
	 * is on the stack above the current block boundary.
	 * Used to decide whether backtick can go optimistic — when formatting is open,
	 * the code span might cross the formatting boundary, so we hold instead.
	 */
	#has_inline_formatting_on_stack(): boolean {
		for (let s = this.#stack.length - 1; s >= 0; s--) {
			const entry = this.#stack[s]!;
			if (entry.node_type === 'Paragraph' || entry.node_type === 'Heading') return false;
			if (entry.delimiter) return true;
		}
		return false;
	}

	/**
	 * Process content inside an optimistic inline Code container.
	 * Scans raw text (no inline formatting) until closing backtick or newline.
	 * Backtick closes (or reverts if empty). Newline reverts (code can't span lines).
	 */
	#process_code_content(): void {
		const char_code = this.#buffer.charCodeAt(this.#pos);

		if (char_code === BACKTICK) {
			this.#flush_text();
			const entry = this.#stack.pop()!;
			if (!entry.has_children) {
				// empty code `` — revert opener, accumulate closer as text
				this.#emit({type: 'revert', id: entry.id, replacement_text: '`', start: entry.start});
				this.#accumulate_text('`', this.#offset());
			} else {
				this.#emit({type: 'close', id: entry.id, end: this.#offset() + 1});
			}
			this.#in_code = false;
			this.#active_text_id = null;
			this.#pos++;
			this.#column++;
			this.#prev_char = BACKTICK;
			return;
		}

		if (char_code === NEWLINE) {
			// code spans can't cross lines — revert
			this.#flush_text();
			const entry = this.#stack.pop()!;
			this.#emit({type: 'revert', id: entry.id, replacement_text: '`', start: entry.start});
			this.#in_code = false;
			this.#active_text_id = null;
			// don't consume newline — outer loop handles it
			return;
		}

		// scan raw text until backtick or newline (paragraph already ensured at code open)
		const start = this.#pos;
		this.#pos++;
		while (this.#pos < this.#buffer.length) {
			const c = this.#buffer.charCodeAt(this.#pos);
			if (c === BACKTICK || c === NEWLINE) break;
			this.#pos++;
		}
		this.#accumulate_text(this.#buffer.slice(start, this.#pos), this.#offset(start));
		this.#prev_char = this.#buffer.charCodeAt(this.#pos - 1);
		this.#column += this.#pos - start;
	}

	// -- Links --

	#try_link_open(): boolean {
		this.#flush_text();
		this.#ensure_paragraph();

		const id = this.#alloc_id();
		const link_start = this.#offset();
		this.#emit({type: 'open', id, node_type: 'Link', start: link_start});
		this.#stack.push({
			id,
			node_type: 'Link',
			optimistic: true,
			delimiter: '[',
			tag_name: undefined,
			has_children: false,
			start: link_start,
		});
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
			this.#emit({type: 'revert', id: entry.id, replacement_text: '[', start: entry.start});
			this.#active_text_id = null;
			// consume ] as text
			this.#accumulate_text(']', this.#offset(bracket_pos));
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
					this.#emit({type: 'revert', id: entry.id, replacement_text: '[', start: entry.start});
					this.#active_text_id = null;
					this.#accumulate_text(']', this.#offset(bracket_pos));
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
					this.#emit({type: 'revert', id: entry.id, replacement_text: '[', start: entry.start});
					this.#active_text_id = null;
					this.#accumulate_text(']', this.#offset(bracket_pos));
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
				this.#emit({type: 'close', id: entry.id, end: this.#offset(i + 1), reference, link_type});
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
		this.#emit({type: 'revert', id: entry.id, replacement_text: '[', start: entry.start});
		this.#active_text_id = null;
		this.#accumulate_text(']', this.#offset(bracket_pos));
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
			const tag_start = this.#offset(start);
			this.#emit({type: 'open', id, node_type, start: tag_start, name});
			this.#emit({type: 'close', id, end: this.#offset(i + 2)});
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
		const tag_start = this.#offset(start);
		const delimiter = this.#buffer.slice(start, i); // e.g., "<Alert>"
		this.#emit({type: 'open', id, node_type, start: tag_start, name});
		this.#stack.push({
			id,
			node_type,
			optimistic: true,
			delimiter,
			tag_name: name,
			has_children: false,
			start: tag_start,
		});
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
		this.#emit({type: 'close', id: entry.id, end: this.#offset(i)});
		this.#active_text_id = null;
		this.#column += i - this.#pos;
		this.#pos = i;
		this.#prev_char = RIGHT_ANGLE;
		return true;
	}

	// -- Auto URLs (text-first) --

	/**
	 * Forced-mode URL detection: the full prefix must be in the buffer.
	 * Used at EOF when speculative prefix matching isn't needed.
	 */
	#try_auto_url_forced(): boolean | null {
		if (this.#prev_char !== -1 && is_word_char(this.#prev_char)) return null;

		let prefix_len = 0;
		if (this.#buffer.startsWith('https://', this.#pos)) {
			prefix_len = HTTPS_PREFIX_LENGTH;
		} else if (this.#buffer.startsWith('http://', this.#pos)) {
			prefix_len = HTTP_PREFIX_LENGTH;
		}
		if (prefix_len === 0) return null;

		// must have content after protocol
		if (this.#pos + prefix_len >= this.#buffer.length) return null;
		const after = this.#buffer.charCodeAt(this.#pos + prefix_len);
		if (after === SPACE || after === NEWLINE) return null;

		return this.#scan_auto_link_forced('external');
	}

	// -- Auto paths (text-first) --

	#try_auto_path_absolute(forced = false): boolean | null {
		// must be at word boundary (preceded by space/newline/start)
		if (
			this.#prev_char !== -1 &&
			this.#prev_char !== SPACE &&
			this.#prev_char !== NEWLINE &&
			this.#prev_char !== TAB
		) {
			return null; // not at word boundary
		}

		// reject // and /space
		if (this.#pos + 1 >= this.#buffer.length) return forced ? null : false;
		const next = this.#buffer.charCodeAt(this.#pos + 1);
		if (next === SLASH || next === SPACE || next === NEWLINE || next === TAB) {
			return null; // not a valid path start
		}

		if (forced) return this.#scan_auto_link_forced('internal');
		return this.#start_pending_url('internal');
	}

	#try_auto_path_relative(forced = false): boolean | null {
		if (
			this.#prev_char !== -1 &&
			this.#prev_char !== SPACE &&
			this.#prev_char !== NEWLINE &&
			this.#prev_char !== TAB
		) {
			return null; // not at word boundary
		}

		// check for ./ or ../
		const remaining = this.#buffer.length - this.#pos;
		if (remaining < 3) return forced ? null : false; // need more input

		if (
			this.#buffer.charCodeAt(this.#pos + 1) === PERIOD &&
			this.#buffer.charCodeAt(this.#pos + 2) === SLASH
		) {
			// ../
			if (remaining < 4) return forced ? null : false;
			const after = this.#buffer.charCodeAt(this.#pos + 3);
			if (after === SPACE || after === NEWLINE || after === TAB || after === SLASH) {
				return null; // not a valid path
			}
			if (forced) return this.#scan_auto_link_forced('internal');
			return this.#start_pending_url('internal');
		}

		if (this.#buffer.charCodeAt(this.#pos + 1) === SLASH) {
			// ./
			const after = this.#buffer.charCodeAt(this.#pos + 2);
			if (after === SPACE || after === NEWLINE || after === TAB || after === SLASH) {
				return null; // not a valid path
			}
			if (forced) return this.#scan_auto_link_forced('internal');
			return this.#start_pending_url('internal');
		}

		return null; // not ./ or ../
	}

	/**
	 * Start confirmed text-first mode for paths. Prefix already validated by hold.
	 * Flushes prior text, resets active_text_id, sets #pending_url with confirmed=true.
	 */
	#start_pending_url(link_type: 'external' | 'internal'): boolean {
		this.#flush_text();
		this.#ensure_paragraph();
		this.#active_text_id = null;
		this.#pending_url = {
			url_text: '',
			start: this.#offset(),
			link_type,
			confirmed: true,
			viable_https: false,
			viable_http: false,
		};
		// don't advance pos — URL chars start at current position, handled by #process_url_content
		return true;
	}

	/**
	 * Start speculative text-first mode for URL prefixes.
	 * Chars stream as visible text while we verify `https://` or `http://`.
	 * Cancels if prefix doesn't match (text stays as plain text).
	 */
	#start_speculative_url(): boolean {
		this.#flush_text();
		this.#ensure_paragraph();
		this.#active_text_id = null;
		this.#pending_url = {
			url_text: '',
			start: this.#offset(),
			link_type: 'external',
			confirmed: false,
			viable_https: true,
			viable_http: true,
		};
		return true;
	}

	/**
	 * Speculative URL prefix matching. Checks each char against viable prefixes,
	 * streaming as text. Confirms on full match, cancels on mismatch.
	 */
	#process_url_prefix(): void {
		const pu = this.#pending_url!;
		const char_code = this.#buffer.charCodeAt(this.#pos);
		const pos = pu.url_text.length;

		// narrow viable prefixes
		if (
			pu.viable_https &&
			(pos >= HTTPS_PREFIX.length || char_code !== HTTPS_PREFIX.charCodeAt(pos))
		) {
			pu.viable_https = false;
		}
		if (
			pu.viable_http &&
			(pos >= HTTP_PREFIX.length || char_code !== HTTP_PREFIX.charCodeAt(pos))
		) {
			pu.viable_http = false;
		}

		if (!pu.viable_https && !pu.viable_http) {
			// no viable prefix — cancel speculation, don't consume char
			this.#pending_url = null;
			return;
		}

		// char matches — accumulate as text
		this.#accumulate_text(this.#buffer[this.#pos]!, this.#offset());
		pu.url_text += this.#buffer[this.#pos];
		this.#pos++;
		this.#column++;
		this.#prev_char = char_code;

		// check if a prefix is fully confirmed
		if (
			(pu.viable_https && pos + 1 === HTTPS_PREFIX.length) ||
			(pu.viable_http && pos + 1 === HTTP_PREFIX.length)
		) {
			pu.confirmed = true;
		}
	}

	/**
	 * Process URL/path chars in text-first mode. Scans path chars,
	 * accumulates as visible text. Terminates on space/newline/non-path-char
	 * and emits a `wrap` opcode.
	 */
	#process_url_content(forced: boolean): void {
		// speculative prefix matching phase
		if (!this.#pending_url!.confirmed) {
			this.#process_url_prefix();
			return;
		}

		const char_code = this.#buffer.charCodeAt(this.#pos);

		// URL terminator
		if (char_code === SPACE || char_code === NEWLINE || !is_valid_path_char(char_code)) {
			this.#flush_text();
			this.#complete_pending_url();
			// don't consume terminator — outer loop handles it
			return;
		}

		// scan URL chars
		const start = this.#pos;
		this.#pos++;
		while (this.#pos < this.#buffer.length) {
			const c = this.#buffer.charCodeAt(this.#pos);
			if (c === SPACE || c === NEWLINE || !is_valid_path_char(c)) break;
			this.#pos++;
		}
		const text = this.#buffer.slice(start, this.#pos);
		this.#accumulate_text(text, this.#offset(start));
		this.#pending_url!.url_text += text;
		this.#prev_char = this.#buffer.charCodeAt(this.#pos - 1);
		this.#column += this.#pos - start;

		// at EOF in forced mode, finalize the URL
		if (this.#pos >= this.#buffer.length && forced) {
			this.#flush_text();
			this.#complete_pending_url();
		}
	}

	/**
	 * Complete a pending URL: compute reference with trimmed punctuation,
	 * emit a `wrap` opcode to retroactively wrap the text node in a Link.
	 */
	#complete_pending_url(): void {
		const pu = this.#pending_url!;
		this.#pending_url = null;

		const reference = trim_trailing_punctuation(pu.url_text);
		if (reference.length === 0) return; // empty after trimming — text stays as plain text

		// for external URLs, must have content after protocol prefix
		if (pu.link_type === 'external') {
			const is_https = reference.startsWith('https://');
			const min_len = is_https ? HTTPS_PREFIX_LENGTH + 1 : HTTP_PREFIX_LENGTH + 1;
			if (reference.length < min_len) return; // just protocol, no content
		}

		const text_id = this.#active_text_id;
		if (text_id === null) return; // no text node to wrap (shouldn't happen)

		const trim_end = pu.url_text.length - reference.length;
		const wrap_id = this.#alloc_id();
		const url_end = pu.start + reference.length;

		if (trim_end > 0) {
			const trim_id = this.#alloc_id();
			this.#emit({
				type: 'wrap',
				id: wrap_id,
				node_type: 'Link',
				target_id: text_id,
				reference,
				link_type: pu.link_type,
				start: pu.start,
				end: url_end,
				trim_end,
				trim_id,
			});
			this.#active_text_id = trim_id;
		} else {
			this.#emit({
				type: 'wrap',
				id: wrap_id,
				node_type: 'Link',
				target_id: text_id,
				reference,
				link_type: pu.link_type,
				start: pu.start,
				end: url_end,
			});
			this.#active_text_id = null;
		}
	}

	/**
	 * Forced-mode auto-link: scan the full URL/path inline (no streaming needed
	 * at EOF). Used when forced=true — the entire URL must be in the buffer.
	 */
	#scan_auto_link_forced(link_type: 'external' | 'internal'): boolean | null {
		let i = this.#pos;
		while (i < this.#buffer.length) {
			const c = this.#buffer.charCodeAt(i);
			if (c === SPACE || c === NEWLINE || !is_valid_path_char(c)) break;
			i++;
		}

		let reference = this.#buffer.slice(this.#pos, i);
		reference = trim_trailing_punctuation(reference);
		if (reference.length === 0) return null;

		// for external URLs, must have content after protocol prefix
		if (link_type === 'external') {
			const is_https = reference.startsWith('https://');
			const min_len = is_https ? HTTPS_PREFIX_LENGTH + 1 : HTTP_PREFIX_LENGTH + 1;
			if (reference.length < min_len) return null;
		}

		const end_pos = this.#pos + reference.length;
		const link_start = this.#offset();
		const link_end = this.#offset(end_pos);

		this.#flush_text();
		this.#ensure_paragraph();

		const link_id = this.#alloc_id();
		this.#emit({type: 'open', id: link_id, node_type: 'Link', start: link_start});
		const text_id = this.#alloc_id();
		this.#emit({
			type: 'text',
			id: text_id,
			content: reference,
			text_type: 'Text',
			start: link_start,
			end: link_end,
		});
		this.#emit({type: 'close', id: link_id, end: link_end, reference, link_type});

		this.#active_text_id = null;
		this.#column += end_pos - this.#pos;
		this.#prev_char = reference.charCodeAt(reference.length - 1);
		this.#pos = end_pos;
		return true;
	}

	// -- Text consumption --

	/**
	 * Consume a run of plain text characters. Scans ahead to the next
	 * structurally interesting character and accumulates the whole run
	 * as a single slice, avoiding per-character string concatenation
	 * and dispatch overhead.
	 */
	#consume_text_run(): void {
		this.#ensure_paragraph();
		const start = this.#pos;
		this.#pos++;
		while (this.#pos < this.#buffer.length) {
			const c = this.#buffer.charCodeAt(this.#pos);
			if (
				c === BACKTICK ||
				c === ASTERISK ||
				c === UNDERSCORE ||
				c === TILDE ||
				c === LEFT_BRACKET ||
				c === RIGHT_BRACKET ||
				c === LEFT_ANGLE ||
				c === NEWLINE ||
				// URL/path: only break when actually at a URL or path start.
				// Most h/./slash in prose are not URLs/paths — continuing the scan
				// avoids the full dispatch cycle through #process_loop → #process_inline.
				(c === H_LOWER &&
					(this.#buffer.startsWith('https://', this.#pos) ||
						this.#buffer.startsWith('http://', this.#pos))) ||
				((c === SLASH || c === PERIOD) &&
					(this.#buffer.charCodeAt(this.#pos - 1) === SPACE ||
						this.#buffer.charCodeAt(this.#pos - 1) === NEWLINE ||
						this.#buffer.charCodeAt(this.#pos - 1) === TAB))
			) {
				break;
			}
			this.#pos++;
		}
		this.#accumulate_text(this.#buffer.slice(start, this.#pos), this.#offset(start));
		this.#prev_char = this.#buffer.charCodeAt(this.#pos - 1);
		this.#column += this.#pos - start;
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
		// track text content for heading ID computation
		if (this.#in_heading && this.#heading_text_parts.length > 0) {
			if (op.type === 'text' || op.type === 'append_text') {
				this.#heading_text_parts[this.#heading_text_parts.length - 1] += op.content;
			} else if (op.type === 'open') {
				// child container: push a new segment for its text content
				this.#heading_text_parts.push('');
			} else if (op.type === 'close') {
				// normal close: pop child's text and merge into parent
				if (this.#heading_text_parts.length > 1) {
					const child_text = this.#heading_text_parts.pop()!;
					this.#heading_text_parts[this.#heading_text_parts.length - 1] += child_text;
				}
			} else if (op.type === 'revert') {
				// revert: pop child's text, prepend replacement (document order), merge into parent
				if (this.#heading_text_parts.length > 1) {
					const child_text = this.#heading_text_parts.pop()!;
					this.#heading_text_parts[this.#heading_text_parts.length - 1] +=
						(op.replacement_text || '') + child_text;
				}
			}
		}
	}

	#alloc_id(): MdzNodeId {
		return this.#next_id++;
	}

	/** Global byte offset for a local buffer position. */
	#offset(pos: number = this.#pos): number {
		return this.#base_offset + pos;
	}

	/** Accumulate text, tracking the start offset for the first character. */
	#accumulate_text(text: string, start_offset: number): void {
		if (this.#accumulated_text.length === 0) {
			this.#accumulated_text_start = start_offset;
		}
		this.#accumulated_text += text;
	}

	/**
	 * Trim a trailing newline from paragraph content.
	 * Checks unflushed accumulated text first, then the last emitted text opcode.
	 *
	 * IMPORTANT: This mutates already-emitted opcodes in `#opcodes`. Safe because
	 * callers (`#close_paragraph`, `#close_codeblock_at_eof`, `finish`) always run
	 * before the next `take_opcodes()`. If `take_opcodes()` were ever called
	 * mid-`finish()`, consumers could see stale data.
	 * TODO: consider making this mutation-free (e.g. emit a trim opcode instead).
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
					if (op.type === 'text') op.end--;
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
			const start = this.#accumulated_text_start;
			this.#emit({
				type: 'text',
				id,
				content: this.#accumulated_text,
				text_type: 'Text',
				start,
				end: start + this.#accumulated_text.length,
			});
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
			if (entry.node_type === 'Code') this.#in_code = false;
			if (entry.optimistic) {
				this.#emit({
					type: 'revert',
					id: entry.id,
					replacement_text: entry.delimiter,
					start: entry.start,
				});
			} else {
				this.#emit({type: 'close', id: entry.id, end: this.#offset()});
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
			if (top.node_type === 'Code') this.#in_code = false;
			if (top.optimistic) {
				this.#emit({type: 'revert', id: top.id, replacement_text: top.delimiter, start: top.start});
			} else {
				this.#emit({type: 'close', id: top.id, end: this.#offset()});
			}
		}
		this.#active_text_id = null;
	}
}
