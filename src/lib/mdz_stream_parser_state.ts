/**
 * Streaming parser state and low-level operations.
 *
 * Free functions take a `MdzStreamParserState` first parameter so handlers can
 * live in separate sibling modules — JS private (`#`) fields can't cross
 * module boundaries.
 *
 * @module
 */

import type {MdzContainerNodeType, MdzNodeId, MdzOpcode} from './mdz_opcodes.js';
import {NEWLINE, mdz_heading_id_from_text} from './mdz_helpers.js';

/**
 * Tri-state result for `try_*` parser handlers.
 * - `'consumed'`: input matched and the parser advanced
 * - `'need_more'`: input is potentially valid but more bytes are required to decide
 * - `'not_match'`: input definitely doesn't match — caller falls through to the next handler
 */
export type TryResult = 'consumed' | 'need_more' | 'not_match';

export interface StackEntry {
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
	/**
	 * Whether any non-whitespace text or non-text child has been emitted
	 * inside this container. Only tracked for `Paragraph` entries to detect
	 * whitespace-only paragraphs that should be dropped at close.
	 */
	has_non_whitespace_content: boolean;
	/** Global byte offset of the opening delimiter. */
	start: number;
}

export interface CodeblockState {
	id: MdzNodeId;
	backtick_count: number;
	text_id: MdzNodeId | null;
	/** The full opening fence line (e.g. "```ts\n"), used as `replacement_text` on revert. */
	delimiter: string;
	/** Global byte offset of the opening fence. */
	start: number;
}

/**
 * Pending auto-link URL/path state for text-first rendering.
 * When set, URL chars flow as visible text. On terminator, a `wrap` opcode
 * retroactively wraps the text node in a Link.
 *
 * For URLs, `confirmed` starts false during speculative prefix matching
 * (chars stream as text while we verify `https://` or `http://`).
 * For paths, `confirmed` starts true (prefix already validated by hold).
 */
export interface PendingUrl {
	url_text: string;
	start: number;
	link_type: 'external' | 'internal';
	/** Whether the URL/path prefix has been fully confirmed. */
	confirmed: boolean;
	/** Prefix match tracking — only used when `!confirmed`. */
	viable_https: boolean;
	viable_http: boolean;
}

/**
 * Mutable state for the streaming parser. One instance per `MdzStreamParser`.
 * Handlers in sibling modules take this as their first parameter — the streaming
 * parser uses free functions, not class methods, so state crosses module
 * boundaries.
 */
export interface MdzStreamParserState {
	buffer: string;
	pos: number;
	opcodes: Array<MdzOpcode>;
	next_id: MdzNodeId;
	stack: Array<StackEntry>;
	column: number;
	prev_char: number;
	active_text_id: MdzNodeId | null;
	accumulated_text: string;
	accumulated_text_start: number;
	codeblock: CodeblockState | null;
	/** Global byte offset of the start of `buffer`. */
	base_offset: number;
	/** Whether we're inside a heading (newline ends it). */
	in_heading: boolean;
	/** Whether we're inside an optimistic inline Code container. */
	in_code: boolean;
	/** Cached flag: whether a Paragraph is open on the stack. */
	in_paragraph: boolean;
	pending_url: PendingUrl | null;
	/**
	 * Stack of text segments for heading ID computation.
	 * Each open container inside a heading pushes a new segment.
	 * On close: pop and append to parent (children's text is part of heading).
	 * On revert: pop, prepend replacement_text, append to parent
	 * (document order: delimiter text comes before children's text).
	 */
	heading_text_parts: Array<string>;
	/**
	 * When true, skip leading newlines at the start of the next processing pass.
	 * Set after block element closes (codeblock, heading, HR) when trailing
	 * newlines couldn't be absorbed within the same buffer — needed for
	 * char-by-char streaming where post-block newlines arrive in later chunks.
	 */
	skip_leading_newlines: boolean;
	/**
	 * Stack index of the innermost open `Paragraph`, or `-1` when none.
	 * Lets `mark_paragraph_non_whitespace` skip the stack walk that runs on
	 * every non-whitespace emit. Updated only on Paragraph push/pop (block
	 * boundaries — only one of `Paragraph`/`Heading` can be on the stack
	 * at a time, so the cache is stable across inline pushes/pops).
	 */
	paragraph_stack_idx: number;
	/**
	 * Id of the most-recent `text`/`append_text` emission, used by
	 * `trim_trailing_newline` to target the right opcode after `take_opcodes()`
	 * has drained the queue. `null` after a structural emit (open/close/revert)
	 * sealed the prior text run.
	 */
	last_text_id: MdzNodeId | null;
	/** Whether the most recent text emission's content ended in `'\n'`. */
	last_text_ended_with_newline: boolean;
	/**
	 * Whether the most recent text emission was a `text` opcode (not
	 * `append_text`) with content exactly `'\n'` — trimming the trailing \n
	 * would leave the text node empty, so `active_text_id` must be cleared
	 * to keep subsequent content from merging into a deleted node.
	 */
	last_text_was_singleton_newline: boolean;
}

export const create_state = (): MdzStreamParserState => ({
	buffer: '',
	pos: 0,
	opcodes: [],
	next_id: 0,
	stack: [],
	column: 0,
	prev_char: -1,
	active_text_id: null,
	accumulated_text: '',
	accumulated_text_start: 0,
	codeblock: null,
	base_offset: 0,
	in_heading: false,
	in_code: false,
	in_paragraph: false,
	pending_url: null,
	heading_text_parts: [],
	// matches mdz_parse: leading newlines before any block are skipped, not
	// preserved as paragraph content
	skip_leading_newlines: true,
	paragraph_stack_idx: -1,
	last_text_id: null,
	last_text_ended_with_newline: false,
	last_text_was_singleton_newline: false,
});

export const alloc_id = (state: MdzStreamParserState): MdzNodeId => state.next_id++;

/**
 * Whether `text` contains any non-whitespace character. Hot path — called from
 * `emit` on every text emission. Char-loop checking common whitespace (space,
 * tab, newline, carriage return, form feed, vertical tab) avoids the regex
 * allocation that `/\S/.test()` incurs per call.
 *
 * Deliberately ASCII-only. `/\S/` and `String.prototype.trim()` (which
 * `mdz_parse` uses to detect whitespace-only paragraphs) recognize Unicode
 * whitespace too (U+00A0 NBSP, U+2028/U+2029, U+3000, etc.). A paragraph
 * containing only Unicode whitespace would be kept by the streaming parser
 * but dropped by `mdz_parse` — no fixture currently hits this.
 */
const has_non_whitespace = (text: string): boolean => {
	for (let i = 0; i < text.length; i++) {
		const c = text.charCodeAt(i);
		// 0x09=tab, 0x0a=LF, 0x0b=VT, 0x0c=FF, 0x0d=CR, 0x20=space
		if (c !== 0x20 && (c < 0x09 || c > 0x0d)) return true;
	}
	return false;
};

/**
 * Push a new container frame onto the stack. Fills the boilerplate fields
 * (`has_children`, `has_non_whitespace_content`) so call sites only spell out
 * what varies per container type. Keeping the object literal in one place
 * also gives V8 a single monomorphic creation site for `StackEntry`.
 */
export const push_stack_entry = (
	state: MdzStreamParserState,
	id: MdzNodeId,
	node_type: MdzContainerNodeType,
	start: number,
	optimistic: boolean = false,
	delimiter: string = '',
	tag_name?: string,
): void => {
	state.stack.push({
		id,
		node_type,
		optimistic,
		delimiter,
		tag_name,
		has_children: false,
		has_non_whitespace_content: false,
		start,
	});
	if (node_type === 'Paragraph') {
		state.paragraph_stack_idx = state.stack.length - 1;
	}
};

/**
 * Mark the innermost open `Paragraph` as having non-whitespace content,
 * via the `paragraph_stack_idx` cache (O(1) instead of an O(stack) walk).
 *
 * No-op when no Paragraph is open — that includes the Heading case, since
 * block boundaries are mutually exclusive (a Heading on stack means
 * `paragraph_stack_idx === -1`).
 */
const mark_paragraph_non_whitespace = (state: MdzStreamParserState): void => {
	if (state.paragraph_stack_idx === -1) return;
	state.stack[state.paragraph_stack_idx]!.has_non_whitespace_content = true;
};

/** Global byte offset for a local buffer position. */
export const offset = (state: MdzStreamParserState, pos: number = state.pos): number =>
	state.base_offset + pos;

export const emit = (state: MdzStreamParserState, op: MdzOpcode): void => {
	state.opcodes.push(op);
	// mark the innermost container as having children
	if (op.type === 'text' || op.type === 'append_text' || op.type === 'void') {
		const top = state.stack[state.stack.length - 1];
		if (top) {
			top.has_children = true;
			// propagate non-whitespace marker to the nearest Paragraph so
			// whitespace-only paragraphs can be discarded at close
			if (op.type === 'void' || has_non_whitespace(op.content)) {
				mark_paragraph_non_whitespace(state);
			}
		}
	} else if (op.type === 'open') {
		// opening a child container counts as content for the parent
		const parent = state.stack[state.stack.length - 1];
		if (parent) {
			parent.has_children = true;
			mark_paragraph_non_whitespace(state);
		}
	} else if (op.type === 'wrap') {
		// retroactive Link wrap of a text node — the resulting Link is non-whitespace
		mark_paragraph_non_whitespace(state);
	}
	// track the most recent text run so `trim_trailing_newline` can target it
	// after `take_opcodes()` has drained the queue
	if (op.type === 'text') {
		state.last_text_id = op.id;
		state.last_text_ended_with_newline = op.content.endsWith('\n');
		state.last_text_was_singleton_newline = op.content === '\n';
	} else if (op.type === 'append_text') {
		state.last_text_id = op.id;
		state.last_text_ended_with_newline = op.content.endsWith('\n');
		// append_text builds on a prior text node; the underlying node can't be
		// singleton even if this appended chunk is just '\n'
		state.last_text_was_singleton_newline = false;
	} else if (op.type === 'open' || op.type === 'close' || op.type === 'revert') {
		// structural opcode seals the prior text run
		state.last_text_id = null;
		state.last_text_ended_with_newline = false;
		state.last_text_was_singleton_newline = false;
	}
	// track text content for heading ID computation
	if (state.in_heading && state.heading_text_parts.length > 0) {
		if (op.type === 'text' || op.type === 'append_text') {
			state.heading_text_parts[state.heading_text_parts.length - 1] += op.content;
		} else if (op.type === 'open') {
			// child container: push a new segment for its text content
			state.heading_text_parts.push('');
		} else if (op.type === 'close') {
			// normal close: pop child's text and merge into parent
			if (state.heading_text_parts.length > 1) {
				const child_text = state.heading_text_parts.pop()!;
				state.heading_text_parts[state.heading_text_parts.length - 1] += child_text;
			}
		} else if (op.type === 'revert') {
			// revert: pop child's text, prepend replacement (document order), merge into parent
			if (state.heading_text_parts.length > 1) {
				const child_text = state.heading_text_parts.pop()!;
				state.heading_text_parts[state.heading_text_parts.length - 1] +=
					(op.replacement_text || '') + child_text;
			}
		}
	}
};

/** Accumulate text, tracking the start offset for the first character. */
export const accumulate_text = (
	state: MdzStreamParserState,
	text: string,
	start_offset: number,
): void => {
	if (state.accumulated_text.length === 0) {
		state.accumulated_text_start = start_offset;
	}
	state.accumulated_text += text;
};

/**
 * Flush accumulated text as a text or append_text opcode.
 */
export const flush_text = (state: MdzStreamParserState): void => {
	if (state.accumulated_text.length === 0) return;
	if (state.active_text_id !== null) {
		emit(state, {
			type: 'append_text',
			id: state.active_text_id,
			content: state.accumulated_text,
		});
	} else {
		ensure_paragraph(state);
		const id = alloc_id(state);
		const start = state.accumulated_text_start;
		emit(state, {
			type: 'text',
			id,
			content: state.accumulated_text,
			text_type: 'Text',
			start,
			end: start + state.accumulated_text.length,
		});
		state.active_text_id = id;
	}
	state.accumulated_text = '';
};

export const ensure_paragraph = (state: MdzStreamParserState): void => {
	if (state.in_heading || state.in_paragraph) return;
	const id = alloc_id(state);
	const start = offset(state);
	emit(state, {type: 'open', id, node_type: 'Paragraph', start});
	push_stack_entry(state, id, 'Paragraph', start);
	state.in_paragraph = true;
};

/**
 * Find the innermost open container of a given type.
 * Returns stack index, or -1 if not found.
 * Does not cross block boundaries (Paragraph, Heading).
 */
export const find_open = (state: MdzStreamParserState, type: MdzContainerNodeType): number => {
	for (let i = state.stack.length - 1; i >= 0; i--) {
		const entry = state.stack[i]!;
		if (entry.node_type === type) return i;
		// don't cross block boundaries
		if (entry.node_type === 'Paragraph' || entry.node_type === 'Heading') return -1;
	}
	return -1;
};

/**
 * Revert all stack entries above the given index.
 */
export const revert_above = (state: MdzStreamParserState, target_idx: number): void => {
	while (state.stack.length - 1 > target_idx) {
		const entry = state.stack.pop()!;
		if (entry.node_type === 'Code') state.in_code = false;
		if (entry.optimistic) {
			emit(state, {
				type: 'revert',
				id: entry.id,
				replacement_text: entry.delimiter,
				start: entry.start,
			});
		} else {
			emit(state, {type: 'close', id: entry.id, end: offset(state)});
		}
	}
	state.active_text_id = null;
};

/**
 * Revert all optimistic inline containers in the current block context.
 */
export const revert_all_optimistic = (state: MdzStreamParserState): void => {
	while (state.stack.length > 0) {
		const top = state.stack[state.stack.length - 1]!;
		if (top.node_type === 'Paragraph' || top.node_type === 'Heading') break;
		state.stack.pop();
		if (top.node_type === 'Code') state.in_code = false;
		if (top.optimistic) {
			emit(state, {
				type: 'revert',
				id: top.id,
				replacement_text: top.delimiter,
				start: top.start,
			});
		} else {
			emit(state, {type: 'close', id: top.id, end: offset(state)});
		}
	}
	state.active_text_id = null;
};

/**
 * Trim a trailing newline from paragraph content.
 * Checks unflushed accumulated text first; otherwise emits a `trim_text`
 * opcode targeting the most recent text/append_text via the tracking fields
 * on `state` (which survive `take_opcodes()` drains). The opcode stream
 * stays append-only — no retroactive opcode mutation.
 */
export const trim_trailing_newline = (state: MdzStreamParserState): void => {
	if (state.accumulated_text.endsWith('\n')) {
		state.accumulated_text = state.accumulated_text.slice(0, -1);
		return;
	}
	if (state.last_text_id === null || !state.last_text_ended_with_newline) return;
	// emit trim opcode; consumer adjusts content and removes empty nodes
	emit(state, {type: 'trim_text', id: state.last_text_id, count: 1});
	// if this trim empties a singleton text node, clear active_text_id so
	// subsequent content doesn't merge into a deleted node via append_text
	if (state.last_text_was_singleton_newline) {
		state.active_text_id = null;
	}
	// after trim, the prior text no longer ends in \n — guard against re-trim
	state.last_text_ended_with_newline = false;
	state.last_text_was_singleton_newline = false;
};

export const close_paragraph = (state: MdzStreamParserState): void => {
	// find and close the paragraph on the stack
	for (let i = state.stack.length - 1; i >= 0; i--) {
		if (state.stack[i]!.node_type === 'Paragraph') {
			// trim trailing newline from paragraph content
			trim_trailing_newline(state);
			// revert everything above the paragraph
			while (state.stack.length - 1 > i) {
				const entry = state.stack.pop()!;
				if (entry.node_type === 'Code') state.in_code = false;
				emit(state, {
					type: 'revert',
					id: entry.id,
					replacement_text: entry.delimiter,
					start: entry.start,
				});
			}
			const entry = state.stack.pop()!;
			// drop whitespace-only paragraphs to match `mdz_parse`'s output;
			// consumers (`mdz_opcodes_to_nodes`, `MdzStreamState`) honor `discard`
			// by removing the node and its descendants from the tree
			const discard = !entry.has_non_whitespace_content;
			emit(
				state,
				discard
					? {type: 'close', id: entry.id, end: offset(state), discard: true}
					: {type: 'close', id: entry.id, end: offset(state)},
			);
			state.active_text_id = null;
			state.in_paragraph = false;
			state.paragraph_stack_idx = -1;
			return;
		}
	}
};

export const close_heading = (state: MdzStreamParserState): void => {
	// revert optimistic containers inside the heading (before clearing in_heading,
	// so revert replacement text is captured in heading_text_parts)
	revert_all_optimistic(state);
	// compute heading ID from accumulated text before clearing heading state
	const heading_text = state.heading_text_parts.join('');
	state.heading_text_parts = [];
	state.in_heading = false;
	const heading_id = mdz_heading_id_from_text(heading_text);
	const end = offset(state);
	// find and close the heading
	for (let i = state.stack.length - 1; i >= 0; i--) {
		if (state.stack[i]!.node_type === 'Heading') {
			const entry = state.stack[i]!;
			state.stack.splice(i, 1);
			emit(state, {type: 'close', id: entry.id, end, heading_id});
			state.active_text_id = null;
			return;
		}
	}
};

/**
 * Close an unclosed codeblock at EOF by reverting it to a paragraph wrapper.
 *
 * Unlike `revert_empty_codeblock` (which pushes the wrapper onto the stack
 * because parsing continues), this is terminal — called only from `finish()`
 * after no further emits happen — so it skips the `push_stack_entry` /
 * `in_paragraph` / `paragraph_stack_idx` bookkeeping. The wrapper exists only
 * in the opcode stream; the parser state's stack stays untouched.
 */
export const close_codeblock_at_eof = (state: MdzStreamParserState): void => {
	if (!state.codeblock) return;
	const cb = state.codeblock;
	// trim trailing newline from codeblock content (mirrors close_paragraph behavior)
	trim_trailing_newline(state);
	const wrap_id = alloc_id(state);
	emit(state, {
		type: 'revert',
		id: cb.id,
		replacement_text: cb.delimiter,
		start: cb.start,
		wrap_node_type: 'Paragraph',
		wrap_id,
	});
	emit(state, {type: 'close', id: wrap_id, end: offset(state)});
	state.codeblock = null;
};

export const handle_paragraph_break = (state: MdzStreamParserState): void => {
	flush_text(state);
	// revert all unclosed optimistic inline containers
	revert_all_optimistic(state);
	close_paragraph(state);
	// skip all consecutive newlines
	while (state.pos < state.buffer.length && state.buffer.charCodeAt(state.pos) === NEWLINE) {
		state.pos++;
	}
	// if we ran out of buffer while skipping, carry the absorb across chunks —
	// otherwise a `\n\n\n\n` split mid-run would leak a leading `\n` into the
	// next paragraph's text. Mirrors the heading-newline absorb in `process_inline`.
	if (state.pos >= state.buffer.length) {
		state.skip_leading_newlines = true;
	}
	state.column = 0;
	state.prev_char = NEWLINE;
};
