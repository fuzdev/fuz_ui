/**
 * Lexer-based mdz parser — a two-phase alternative to the single-pass parser in `mdz.ts`.
 *
 * Phase 1 (Lexer): Tokenizes input into a flat `MdzToken[]` stream.
 * Phase 2 (Parser): Consumes the token stream to build the `MdzNode[]` AST.
 *
 * Produces identical output to `mdz_parse` for all inputs. Exists as a parallel
 * implementation for comparison — see grimoire lore/mdz/TODO.md.
 *
 * @module
 */

import type {
	MdzNode,
	MdzTextNode,
	MdzCodeNode,
	MdzCodeblockNode,
	MdzBoldNode,
	MdzItalicNode,
	MdzStrikethroughNode,
	MdzLinkNode,
	MdzParagraphNode,
	MdzHrNode,
	MdzHeadingNode,
	MdzElementNode,
	MdzComponentNode,
} from './mdz.js';
import {mdz_is_url} from './mdz.js';
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
	LEFT_PAREN,
	RIGHT_PAREN,
	COLON,
	PERIOD,
	COMMA,
	SEMICOLON,
	EXCLAMATION,
	QUESTION,
	DOLLAR,
	PERCENT,
	AMPERSAND,
	APOSTROPHE,
	PLUS,
	EQUALS,
	AT,
	RIGHT_BRACKET,
	A_UPPER,
	Z_UPPER,
	A_LOWER,
	Z_LOWER,
	ZERO,
	NINE,
	HR_HYPHEN_COUNT,
	MIN_CODEBLOCK_BACKTICKS,
	MAX_HEADING_LEVEL,
	HTTPS_PREFIX_LENGTH,
	HTTP_PREFIX_LENGTH,
} from './mdz_constants.js';

/**
 * Parses text to an array of `MdzNode` using a two-phase lexer+parser approach.
 */
export const mdz_parse_lexer = (text: string): Array<MdzNode> => {
	const tokens = new MdzLexer(text).tokenize();
	return new MdzTokenParser(tokens).parse();
};

// ============================================================================
// Token types (internal)
// ============================================================================

interface MdzTokenBase {
	start: number;
	end: number;
}

type MdzToken =
	| MdzTokenText
	| MdzTokenCode
	| MdzTokenCodeblock
	| MdzTokenBoldOpen
	| MdzTokenBoldClose
	| MdzTokenItalicOpen
	| MdzTokenItalicClose
	| MdzTokenStrikethroughOpen
	| MdzTokenStrikethroughClose
	| MdzTokenLinkTextOpen
	| MdzTokenLinkTextClose
	| MdzTokenLinkRef
	| MdzTokenAutolink
	| MdzTokenHeadingStart
	| MdzTokenHr
	| MdzTokenTagOpen
	| MdzTokenTagSelfClose
	| MdzTokenTagClose
	| MdzTokenHeadingEnd
	| MdzTokenParagraphBreak;

interface MdzTokenText extends MdzTokenBase {
	type: 'text';
	content: string;
}

interface MdzTokenCode extends MdzTokenBase {
	type: 'code';
	content: string;
}

interface MdzTokenCodeblock extends MdzTokenBase {
	type: 'codeblock';
	lang: string | null;
	content: string;
}

interface MdzTokenBoldOpen extends MdzTokenBase {
	type: 'bold_open';
}

interface MdzTokenBoldClose extends MdzTokenBase {
	type: 'bold_close';
}

interface MdzTokenItalicOpen extends MdzTokenBase {
	type: 'italic_open';
}

interface MdzTokenItalicClose extends MdzTokenBase {
	type: 'italic_close';
}

interface MdzTokenStrikethroughOpen extends MdzTokenBase {
	type: 'strikethrough_open';
}

interface MdzTokenStrikethroughClose extends MdzTokenBase {
	type: 'strikethrough_close';
}

interface MdzTokenLinkTextOpen extends MdzTokenBase {
	type: 'link_text_open';
}

interface MdzTokenLinkTextClose extends MdzTokenBase {
	type: 'link_text_close';
}

interface MdzTokenLinkRef extends MdzTokenBase {
	type: 'link_ref';
	reference: string;
	link_type: 'external' | 'internal';
}

interface MdzTokenAutolink extends MdzTokenBase {
	type: 'autolink';
	reference: string;
	link_type: 'external' | 'internal';
}

interface MdzTokenHeadingStart extends MdzTokenBase {
	type: 'heading_start';
	level: 1 | 2 | 3 | 4 | 5 | 6;
}

interface MdzTokenHr extends MdzTokenBase {
	type: 'hr';
}

interface MdzTokenTagOpen extends MdzTokenBase {
	type: 'tag_open';
	name: string;
	is_component: boolean;
}

interface MdzTokenTagSelfClose extends MdzTokenBase {
	type: 'tag_self_close';
	name: string;
	is_component: boolean;
}

interface MdzTokenTagClose extends MdzTokenBase {
	type: 'tag_close';
	name: string;
}

interface MdzTokenHeadingEnd extends MdzTokenBase {
	type: 'heading_end';
}

interface MdzTokenParagraphBreak extends MdzTokenBase {
	type: 'paragraph_break';
}

// ============================================================================
// Lexer
// ============================================================================

class MdzLexer {
	#text: string;
	#index: number = 0;
	#tokens: Array<MdzToken> = [];
	#max_search_index: number = Number.MAX_SAFE_INTEGER;

	constructor(text: string) {
		this.#text = text;
	}

	tokenize(): Array<MdzToken> {
		// Skip leading newlines
		this.#skip_newlines();

		while (this.#index < this.#text.length) {
			// Check for block elements at column 0
			if (this.#is_at_column_0()) {
				if (this.#tokenize_heading()) continue;
				if (this.#tokenize_hr()) continue;
				if (this.#tokenize_codeblock()) continue;
			}

			// Check for paragraph break
			if (this.#is_at_paragraph_break()) {
				const start = this.#index;
				this.#skip_newlines();
				this.#tokens.push({type: 'paragraph_break', start, end: this.#index});
				continue;
			}

			// Inline tokenization
			this.#tokenize_inline();
		}

		return this.#tokens;
	}

	#is_at_column_0(): boolean {
		return this.#index === 0 || this.#text.charCodeAt(this.#index - 1) === NEWLINE;
	}

	#is_at_paragraph_break(): boolean {
		return (
			this.#char_at(this.#index) === NEWLINE &&
			this.#index + 1 < this.#text.length &&
			this.#text.charCodeAt(this.#index + 1) === NEWLINE
		);
	}

	#char_at(i: number): number {
		return i < this.#text.length ? this.#text.charCodeAt(i) : -1;
	}

	#match(str: string, at?: number): boolean {
		return this.#text.startsWith(str, at ?? this.#index);
	}

	#skip_newlines(): void {
		while (this.#index < this.#text.length && this.#text.charCodeAt(this.#index) === NEWLINE) {
			this.#index++;
		}
	}

	// -- Block tokenizers --

	#tokenize_heading(): boolean {
		let i = this.#index;

		// Count hashes (must be 1-6)
		let hash_count = 0;
		while (
			i < this.#text.length &&
			this.#text.charCodeAt(i) === HASH &&
			hash_count <= MAX_HEADING_LEVEL
		) {
			hash_count++;
			i++;
		}

		if (hash_count === 0 || hash_count > MAX_HEADING_LEVEL) return false;

		// Must have space after hashes
		if (i >= this.#text.length || this.#text.charCodeAt(i) !== SPACE) return false;
		i++; // consume the space

		// Must have non-whitespace content after the space
		let has_content = false;
		let line_end = i;
		while (line_end < this.#text.length && this.#text.charCodeAt(line_end) !== NEWLINE) {
			const char_code = this.#text.charCodeAt(line_end);
			if (char_code !== SPACE && char_code !== TAB) {
				has_content = true;
			}
			line_end++;
		}

		if (!has_content) return false;

		const start = this.#index;
		// Advance past "## " (hashes + space)
		this.#index = start + hash_count + 1;

		this.#tokens.push({
			type: 'heading_start',
			level: hash_count as 1 | 2 | 3 | 4 | 5 | 6,
			start,
			end: this.#index, // end of "## " prefix
		});

		// Tokenize inline content until newline or EOF
		// tokenize_text may consume a newline as part of block-element lookahead,
		// so we check emitted text tokens for embedded newlines and trim.
		while (this.#index < this.#text.length) {
			if (this.#text.charCodeAt(this.#index) === NEWLINE) {
				break;
			}

			const token_count_before = this.#tokens.length;
			this.#tokenize_inline();

			// Check if the last emitted token is text containing a newline
			if (this.#tokens.length > token_count_before) {
				const last_token = this.#tokens[this.#tokens.length - 1]!;
				if (last_token.type === 'text') {
					const newline_idx = last_token.content.indexOf('\n');
					if (newline_idx !== -1) {
						const trimmed = last_token.content.slice(0, newline_idx);
						if (trimmed) {
							last_token.content = trimmed;
							last_token.end = last_token.start + trimmed.length;
						} else {
							this.#tokens.pop();
						}
						this.#index = last_token.start + newline_idx;
						break;
					}
				}
			}
		}

		// Emit heading_end marker so the token parser knows where heading content stops
		this.#tokens.push({type: 'heading_end', start: this.#index, end: this.#index});

		// Skip newlines after heading (like original parser's main loop)
		this.#skip_newlines();

		return true;
	}

	#tokenize_hr(): boolean {
		let i = this.#index;

		// Must have exactly three hyphens
		if (
			i + HR_HYPHEN_COUNT > this.#text.length ||
			this.#text.charCodeAt(i) !== HYPHEN ||
			this.#text.charCodeAt(i + 1) !== HYPHEN ||
			this.#text.charCodeAt(i + 2) !== HYPHEN
		) {
			return false;
		}
		i += HR_HYPHEN_COUNT;

		// After the three hyphens, only whitespace and newline (or EOF) allowed
		while (i < this.#text.length) {
			const char_code = this.#text.charCodeAt(i);
			if (char_code === NEWLINE) break;
			if (char_code !== SPACE) return false;
			i++;
		}

		const start = this.#index;
		this.#index = i; // consume up to but not including newline

		this.#tokens.push({type: 'hr', start, end: this.#index});

		// Skip newlines after HR
		this.#skip_newlines();

		return true;
	}

	#tokenize_codeblock(): boolean {
		let i = this.#index;

		// Count backticks
		let backtick_count = 0;
		while (i < this.#text.length && this.#text.charCodeAt(i) === BACKTICK) {
			backtick_count++;
			i++;
		}

		if (backtick_count < MIN_CODEBLOCK_BACKTICKS) return false;

		// Skip optional language hint
		const lang_start = i;
		while (i < this.#text.length) {
			const char_code = this.#text.charCodeAt(i);
			if (char_code === SPACE || char_code === NEWLINE) break;
			i++;
		}
		const lang = i > lang_start ? this.#text.slice(lang_start, i) : null;

		// Skip trailing spaces on opening fence line
		while (i < this.#text.length && this.#text.charCodeAt(i) === SPACE) {
			i++;
		}

		// Must have newline after opening fence
		if (i >= this.#text.length || this.#text.charCodeAt(i) !== NEWLINE) return false;
		i++; // consume the newline

		const content_start = i;

		// Search for closing fence
		const closing_fence = '`'.repeat(backtick_count);
		while (i < this.#text.length) {
			if (this.#text.startsWith(closing_fence, i)) {
				const prev_char = i > 0 ? this.#text.charCodeAt(i - 1) : NEWLINE;
				if (prev_char === NEWLINE || i === 0) {
					const content = this.#text.slice(content_start, i);
					const final_content = content.endsWith('\n') ? content.slice(0, -1) : content;
					if (final_content.length === 0) return false; // Empty code block

					// Verify closing fence line
					let j = i + backtick_count;
					while (j < this.#text.length && this.#text.charCodeAt(j) === SPACE) {
						j++;
					}
					if (j < this.#text.length && this.#text.charCodeAt(j) !== NEWLINE) {
						return false;
					}

					const start = this.#index;
					this.#index = j; // advance past closing fence and trailing spaces

					this.#tokens.push({
						type: 'codeblock',
						lang,
						content: final_content,
						start,
						end: this.#index,
					});

					// Skip newlines after codeblock
					this.#skip_newlines();

					return true;
				}
			}
			i++;
		}

		return false; // No closing fence found
	}

	// -- Inline tokenizers --

	#tokenize_inline(): void {
		const char_code = this.#char_at(this.#index);

		switch (char_code) {
			case BACKTICK:
				this.#tokenize_code();
				return;
			case ASTERISK:
				this.#tokenize_bold();
				return;
			case UNDERSCORE:
				this.#tokenize_single_delimiter('_', 'italic');
				return;
			case TILDE:
				this.#tokenize_single_delimiter('~', 'strikethrough');
				return;
			case LEFT_BRACKET:
				this.#tokenize_markdown_link();
				return;
			case LEFT_ANGLE:
				this.#tokenize_tag();
				return;
			default:
				this.#tokenize_text();
				return;
		}
	}

	#tokenize_code(): void {
		const start = this.#index;
		this.#index++; // consume `

		// Find closing backtick, stop at newline or search boundary
		let content_end = -1;
		const search_limit = Math.min(this.#max_search_index, this.#text.length);
		for (let i = this.#index; i < search_limit; i++) {
			const char_code = this.#text.charCodeAt(i);
			if (char_code === BACKTICK) {
				content_end = i;
				break;
			}
			if (char_code === NEWLINE) break;
		}

		if (content_end === -1) {
			// Unclosed backtick
			this.#emit_text('`', start);
			return;
		}

		const content = this.#text.slice(this.#index, content_end);

		// Empty inline code
		if (content.length === 0) {
			this.#index = content_end + 1;
			this.#emit_text('``', start);
			return;
		}

		this.#index = content_end + 1;
		this.#tokens.push({type: 'code', content, start, end: this.#index});
	}

	#tokenize_bold(): void {
		const start = this.#index;

		// Check for **
		if (!this.#match('**')) {
			// Single asterisk - text
			this.#index++;
			this.#emit_text('*', start);
			return;
		}

		// Find closing ** within current search boundary
		const search_end = Math.min(this.#max_search_index, this.#text.length);
		let close_index = this.#text.indexOf('**', start + 2);
		if (close_index !== -1 && close_index >= search_end) {
			close_index = -1;
		}
		if (close_index === -1) {
			// Unclosed **
			this.#index += 2;
			this.#emit_text('**', start);
			return;
		}

		// Check for paragraph break between open and close
		if (this.#has_paragraph_break_between(start + 2, close_index)) {
			this.#index += 2;
			this.#emit_text('**', start);
			return;
		}

		// Emit bold_open, tokenize children up to close, emit bold_close
		this.#index += 2;
		this.#tokens.push({type: 'bold_open', start, end: this.#index});

		// Set search boundary for nested parsers
		const saved_max = this.#max_search_index;
		this.#max_search_index = close_index;

		// Tokenize children inline content up to close_index
		while (this.#index < close_index) {
			if (this.#is_at_paragraph_break()) break;
			this.#tokenize_inline();
		}

		this.#max_search_index = saved_max;

		if (this.#index === close_index && this.#match('**')) {
			// Check if empty
			const open_token_index = this.#find_last_token_index('bold_open');
			const has_children = open_token_index !== -1 && open_token_index < this.#tokens.length - 1;

			if (!has_children) {
				// Empty bold - convert to text
				this.#tokens.splice(open_token_index, 1);
				this.#index = start;
				this.#index += 4;
				this.#emit_text('****', start);
				return;
			}

			this.#tokens.push({type: 'bold_close', start: close_index, end: close_index + 2});
			this.#index = close_index + 2;
		} else {
			// Didn't reach closing - convert opening to text
			const open_token_index = this.#find_last_token_index('bold_open');
			if (open_token_index !== -1) {
				this.#tokens[open_token_index] = {type: 'text', content: '**', start, end: start + 2};
			}
		}
	}

	#tokenize_single_delimiter(delimiter: '_' | '~', kind: 'italic' | 'strikethrough'): void {
		const start = this.#index;

		// Check opening word boundary
		if (!this.#is_at_word_boundary(this.#index, true, false)) {
			this.#index++;
			this.#emit_text(delimiter, start);
			return;
		}

		// Find closing delimiter within search boundary
		const search_end = Math.min(this.#max_search_index, this.#text.length);
		let close_index = this.#text.indexOf(delimiter, start + 1);
		if (close_index !== -1 && close_index >= search_end) {
			close_index = -1;
		}
		if (close_index === -1) {
			this.#index++;
			this.#emit_text(delimiter, start);
			return;
		}

		// Check closing word boundary
		if (!this.#is_at_word_boundary(close_index + 1, false, true)) {
			this.#index++;
			this.#emit_text(delimiter, start);
			return;
		}

		// Check for paragraph break between
		if (this.#has_paragraph_break_between(start + 1, close_index)) {
			this.#index++;
			this.#emit_text(delimiter, start);
			return;
		}

		// Emit open token
		this.#index++;
		const open_type = kind === 'italic' ? 'italic_open' : 'strikethrough_open';
		const close_type = kind === 'italic' ? 'italic_close' : 'strikethrough_close';
		this.#tokens.push({type: open_type, start, end: this.#index} as MdzToken);

		// Set search boundary for nested parsers
		const saved_max = this.#max_search_index;
		this.#max_search_index = close_index;

		// Tokenize children up to close_index
		while (this.#index < close_index) {
			if (this.#is_at_paragraph_break()) break;
			this.#tokenize_inline();
		}

		this.#max_search_index = saved_max;

		if (this.#index === close_index && this.#match(delimiter)) {
			// Check if empty
			const open_token_index = this.#find_last_token_index(open_type);
			const has_children = open_token_index !== -1 && open_token_index < this.#tokens.length - 1;

			if (!has_children) {
				// Empty - convert to text
				this.#tokens.splice(open_token_index, 1);
				this.#index = start;
				this.#index += 2;
				this.#emit_text(delimiter + delimiter, start);
				return;
			}

			this.#tokens.push({
				type: close_type,
				start: close_index,
				end: close_index + 1,
			} as MdzToken);
			this.#index = close_index + 1;
		} else {
			// Convert opening to text
			const open_token_index = this.#find_last_token_index(open_type);
			if (open_token_index !== -1) {
				this.#tokens[open_token_index] = {
					type: 'text',
					content: delimiter,
					start,
					end: start + 1,
				};
			}
		}
	}

	#tokenize_markdown_link(): void {
		const start = this.#index;

		// Consume [
		if (this.#text.charCodeAt(this.#index) !== LEFT_BRACKET) {
			this.#index++;
			this.#emit_text(this.#text[start]!, start);
			return;
		}
		this.#index++;

		// Emit link_text_open
		this.#tokens.push({type: 'link_text_open', start, end: this.#index});

		// Tokenize children until ]
		const saved_index = this.#index;
		while (this.#index < this.#text.length) {
			if (this.#text.charCodeAt(this.#index) === RIGHT_BRACKET) break;
			if (this.#is_at_paragraph_break()) break;
			// Stop at ] and ) as delimiters
			if (this.#text.charCodeAt(this.#index) === RIGHT_PAREN) break;
			this.#tokenize_inline();
		}

		// Check for ]
		if (this.#index >= this.#text.length || this.#text.charCodeAt(this.#index) !== RIGHT_BRACKET) {
			// Revert - remove link_text_open and all children tokens added
			this.#revert_tokens_from_link_open(start, saved_index);
			return;
		}

		const bracket_close_start = this.#index;
		this.#index++; // consume ]
		this.#tokens.push({
			type: 'link_text_close',
			start: bracket_close_start,
			end: this.#index,
		});

		// Check for (
		if (this.#index >= this.#text.length || this.#text.charCodeAt(this.#index) !== LEFT_PAREN) {
			this.#revert_tokens_from_link_open(start, saved_index);
			return;
		}
		this.#index++; // consume (

		// Find closing )
		const close_paren = this.#text.indexOf(')', this.#index);
		if (close_paren === -1) {
			this.#revert_tokens_from_link_open(start, saved_index);
			return;
		}

		const reference = this.#text.slice(this.#index, close_paren);

		// Validate reference
		if (!reference.trim()) {
			this.#revert_tokens_from_link_open(start, saved_index);
			return;
		}

		// Validate all characters
		for (let i = 0; i < reference.length; i++) {
			const char_code = reference.charCodeAt(i);
			if (!this.#is_valid_path_char(char_code)) {
				this.#revert_tokens_from_link_open(start, saved_index);
				return;
			}
		}

		this.#index = close_paren + 1;

		const link_type = mdz_is_url(reference) ? 'external' : 'internal';

		this.#tokens.push({
			type: 'link_ref',
			reference,
			link_type,
			start: bracket_close_start + 1, // after ]
			end: this.#index,
		});
	}

	#revert_tokens_from_link_open(start: number, saved_index: number): void {
		// Find and remove link_text_open and all tokens after it
		let open_idx = -1;
		for (let i = this.#tokens.length - 1; i >= 0; i--) {
			if (this.#tokens[i]!.type === 'link_text_open' && this.#tokens[i]!.start === start) {
				open_idx = i;
				break;
			}
		}
		if (open_idx !== -1) {
			this.#tokens.splice(open_idx);
		}
		this.#index = start + 1;
		this.#emit_text('[', start);
	}

	#tokenize_tag(): void {
		const start = this.#index;
		this.#index++; // consume <

		// Tag name must start with a letter
		if (this.#index >= this.#text.length || !this.#is_letter(this.#char_at(this.#index))) {
			this.#emit_text('<', start);
			return;
		}

		// Collect tag name
		const tag_name_start = this.#index;
		while (this.#index < this.#text.length && this.#is_tag_name_char(this.#char_at(this.#index))) {
			this.#index++;
		}
		const tag_name = this.#text.slice(tag_name_start, this.#index);

		if (tag_name.length === 0) {
			this.#emit_text('<', start);
			return;
		}

		const first_char_code = tag_name.charCodeAt(0);
		const is_component = first_char_code >= A_UPPER && first_char_code <= Z_UPPER;

		// Skip whitespace
		while (this.#index < this.#text.length && this.#text.charCodeAt(this.#index) === SPACE) {
			this.#index++;
		}

		// Check for self-closing />
		if (
			this.#index + 1 < this.#text.length &&
			this.#text.charCodeAt(this.#index) === SLASH &&
			this.#text.charCodeAt(this.#index + 1) === RIGHT_ANGLE
		) {
			this.#index += 2;
			this.#tokens.push({
				type: 'tag_self_close',
				name: tag_name,
				is_component,
				start,
				end: this.#index,
			});
			return;
		}

		// Check for >
		if (this.#index >= this.#text.length || this.#text.charCodeAt(this.#index) !== RIGHT_ANGLE) {
			this.#index = start + 1;
			this.#emit_text('<', start);
			return;
		}
		this.#index++; // consume >

		// Check for closing tag existence before committing
		const closing_tag = `</${tag_name}>`;
		const closing_tag_pos = this.#text.indexOf(closing_tag, this.#index);
		if (closing_tag_pos === -1) {
			// No closing tag - revert
			this.#index = start + 1;
			this.#emit_text('<', start);
			return;
		}

		// Emit tag_open
		this.#tokens.push({type: 'tag_open', name: tag_name, is_component, start, end: this.#index});

		// Tokenize children until closing tag
		while (this.#index < this.#text.length) {
			if (this.#match(closing_tag)) {
				const close_start = this.#index;
				this.#index += closing_tag.length;
				this.#tokens.push({
					type: 'tag_close',
					name: tag_name,
					start: close_start,
					end: this.#index,
				});
				return;
			}
			this.#tokenize_inline();
		}

		// Shouldn't reach here since we verified closing tag exists
		// But if we do, the tag_open token stays and parser will handle it
	}

	#tokenize_text(): void {
		const start = this.#index;

		// Check for URL or internal path at current position
		if (this.#is_at_url()) {
			this.#tokenize_auto_link_url();
			return;
		}
		if (this.#is_at_internal_path()) {
			this.#tokenize_auto_link_internal();
			return;
		}

		while (this.#index < this.#text.length) {
			const char_code = this.#char_at(this.#index);

			// Stop at special characters
			if (
				char_code === BACKTICK ||
				char_code === ASTERISK ||
				char_code === UNDERSCORE ||
				char_code === TILDE ||
				char_code === LEFT_BRACKET ||
				char_code === RIGHT_BRACKET ||
				char_code === RIGHT_PAREN ||
				char_code === LEFT_ANGLE
			) {
				break;
			}

			// Check for paragraph break
			if (this.#is_at_paragraph_break()) break;

			// When next line could start a block element, consume the newline and stop
			if (char_code === NEWLINE) {
				const next_i = this.#index + 1;
				if (next_i < this.#text.length) {
					const next_char = this.#text.charCodeAt(next_i);
					if (next_char === HASH || next_char === HYPHEN || next_char === BACKTICK) {
						this.#index++; // consume the newline
						break;
					}
				}
			}

			// Check for URL or internal path mid-text
			if (this.#is_at_url() || this.#is_at_internal_path()) break;

			this.#index++;
		}

		// Ensure we always consume at least one character
		if (this.#index === start && this.#index < this.#text.length) {
			this.#index++;
		}

		const content = this.#text.slice(start, this.#index);
		this.#emit_text(content, start);
	}

	// -- Auto-link tokenizers --

	#tokenize_auto_link_url(): void {
		const start = this.#index;

		// Consume protocol
		if (this.#match('https://')) {
			this.#index += HTTPS_PREFIX_LENGTH;
		} else if (this.#match('http://')) {
			this.#index += HTTP_PREFIX_LENGTH;
		}

		// Collect URL characters
		while (this.#index < this.#text.length) {
			const char_code = this.#char_at(this.#index);
			if (char_code === SPACE || char_code === NEWLINE || !this.#is_valid_path_char(char_code)) {
				break;
			}
			this.#index++;
		}

		let reference = this.#text.slice(start, this.#index);
		reference = this.#trim_trailing_punctuation(reference);
		this.#index = start + reference.length;

		this.#tokens.push({
			type: 'autolink',
			reference,
			link_type: 'external',
			start,
			end: this.#index,
		});
	}

	#tokenize_auto_link_internal(): void {
		const start = this.#index;

		// Collect path characters
		while (this.#index < this.#text.length) {
			const char_code = this.#char_at(this.#index);
			if (char_code === SPACE || char_code === NEWLINE || !this.#is_valid_path_char(char_code)) {
				break;
			}
			this.#index++;
		}

		let reference = this.#text.slice(start, this.#index);
		reference = this.#trim_trailing_punctuation(reference);
		this.#index = start + reference.length;

		this.#tokens.push({
			type: 'autolink',
			reference,
			link_type: 'internal',
			start,
			end: this.#index,
		});
	}

	// -- Helper methods --

	#emit_text(content: string, start: number): void {
		this.#tokens.push({type: 'text', content, start, end: start + content.length});
	}

	#find_last_token_index(type: string): number {
		for (let i = this.#tokens.length - 1; i >= 0; i--) {
			if (this.#tokens[i]!.type === type) return i;
		}
		return -1;
	}

	#has_paragraph_break_between(from: number, to: number): boolean {
		for (let i = from; i < to - 1; i++) {
			if (this.#text.charCodeAt(i) === NEWLINE && this.#text.charCodeAt(i + 1) === NEWLINE) {
				return true;
			}
		}
		return false;
	}

	#is_at_url(): boolean {
		if (this.#match('https://')) {
			if (this.#index + HTTPS_PREFIX_LENGTH >= this.#text.length) return false;
			const next_char = this.#text.charCodeAt(this.#index + HTTPS_PREFIX_LENGTH);
			return next_char !== SPACE && next_char !== NEWLINE;
		}
		if (this.#match('http://')) {
			if (this.#index + HTTP_PREFIX_LENGTH >= this.#text.length) return false;
			const next_char = this.#text.charCodeAt(this.#index + HTTP_PREFIX_LENGTH);
			return next_char !== SPACE && next_char !== NEWLINE;
		}
		return false;
	}

	#is_at_internal_path(): boolean {
		if (this.#text.charCodeAt(this.#index) !== SLASH) return false;
		if (this.#index > 0) {
			const prev_char = this.#text.charCodeAt(this.#index - 1);
			if (prev_char !== SPACE && prev_char !== NEWLINE && prev_char !== TAB) return false;
		}
		if (this.#index + 1 >= this.#text.length) return false;
		const next_char = this.#text.charCodeAt(this.#index + 1);
		return next_char !== SLASH && next_char !== SPACE && next_char !== NEWLINE;
	}

	#is_word_char(char_code: number): boolean {
		if (char_code === ASTERISK || char_code === UNDERSCORE || char_code === TILDE) return false;
		return (
			(char_code >= A_UPPER && char_code <= Z_UPPER) ||
			(char_code >= A_LOWER && char_code <= Z_LOWER) ||
			(char_code >= ZERO && char_code <= NINE)
		);
	}

	#is_at_word_boundary(index: number, check_before: boolean, check_after: boolean): boolean {
		if (check_before && index > 0) {
			const prev = this.#text.charCodeAt(index - 1);
			if (this.#is_word_char(prev)) return false;
		}
		if (check_after && index < this.#text.length) {
			const next = this.#text.charCodeAt(index);
			if (this.#is_word_char(next)) return false;
		}
		return true;
	}

	#is_letter(char_code: number): boolean {
		return (
			(char_code >= A_UPPER && char_code <= Z_UPPER) ||
			(char_code >= A_LOWER && char_code <= Z_LOWER)
		);
	}

	#is_tag_name_char(char_code: number): boolean {
		return (
			this.#is_letter(char_code) ||
			(char_code >= ZERO && char_code <= NINE) ||
			char_code === HYPHEN ||
			char_code === UNDERSCORE
		);
	}

	#is_valid_path_char(char_code: number): boolean {
		return (
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
			char_code === PERCENT
		);
	}

	#trim_trailing_punctuation(url: string): string {
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

		let open_count = 0;
		let close_count = 0;
		for (let i = 0; i < end; i++) {
			const char = url.charCodeAt(i);
			if (char === LEFT_PAREN) open_count++;
			if (char === RIGHT_PAREN) close_count++;
		}

		while (end > 0 && close_count > open_count) {
			const last_char = url.charCodeAt(end - 1);
			if (last_char === RIGHT_PAREN) {
				end--;
				close_count--;
			} else {
				break;
			}
		}

		return end === url.length ? url : url.slice(0, end);
	}
}

// ============================================================================
// Token Parser
// ============================================================================

class MdzTokenParser {
	#tokens: Array<MdzToken>;
	#index: number = 0;

	constructor(tokens: Array<MdzToken>) {
		this.#tokens = tokens;
	}

	parse(): Array<MdzNode> {
		const root_nodes: Array<MdzNode> = [];
		const paragraph_children: Array<MdzNode> = [];

		while (this.#index < this.#tokens.length) {
			const token = this.#tokens[this.#index]!;

			// Block-level tokens
			if (token.type === 'heading_start') {
				const flushed = this.#flush_paragraph(paragraph_children, true);
				if (flushed) root_nodes.push(flushed);
				root_nodes.push(this.#parse_heading());
				continue;
			}

			if (token.type === 'hr') {
				const flushed = this.#flush_paragraph(paragraph_children, true);
				if (flushed) root_nodes.push(flushed);
				root_nodes.push({type: 'Hr', start: token.start, end: token.end});
				this.#index++;
				continue;
			}

			if (token.type === 'codeblock') {
				const flushed = this.#flush_paragraph(paragraph_children, true);
				if (flushed) root_nodes.push(flushed);
				root_nodes.push({
					type: 'Codeblock',
					lang: token.lang,
					content: token.content,
					start: token.start,
					end: token.end,
				});
				this.#index++;
				continue;
			}

			if (token.type === 'paragraph_break') {
				const flushed = this.#flush_paragraph(paragraph_children, true);
				if (flushed) root_nodes.push(flushed);
				this.#index++;
				continue;
			}

			// Inline tokens → paragraph children
			const node = this.#parse_inline();
			if (node) paragraph_children.push(node);
		}

		// Flush remaining content
		const final_paragraph = this.#flush_paragraph(paragraph_children, true);
		if (final_paragraph) root_nodes.push(final_paragraph);

		return root_nodes;
	}

	#parse_heading(): MdzHeadingNode {
		const token = this.#tokens[this.#index]! as MdzTokenHeadingStart;
		const start = token.start;
		const level = token.level;
		this.#index++;

		const children: Array<MdzNode> = [];

		// Collect inline nodes until heading_end marker
		while (this.#index < this.#tokens.length) {
			const t = this.#tokens[this.#index]!;
			if (t.type === 'heading_end') {
				this.#index++; // consume the marker
				break;
			}
			const node = this.#parse_inline();
			if (node) children.push(node);
		}

		const end = children.length > 0 ? children[children.length - 1]!.end : start + level + 1;

		return {type: 'Heading', level, children, start, end};
	}

	#parse_inline(): MdzNode | null {
		if (this.#index >= this.#tokens.length) return null;

		const token = this.#tokens[this.#index]!;

		switch (token.type) {
			case 'text':
				this.#index++;
				return {type: 'Text', content: token.content, start: token.start, end: token.end};

			case 'code':
				this.#index++;
				return {type: 'Code', content: token.content, start: token.start, end: token.end};

			case 'bold_open':
				return this.#parse_bold();

			case 'italic_open':
				return this.#parse_italic();

			case 'strikethrough_open':
				return this.#parse_strikethrough();

			case 'link_text_open':
				return this.#parse_link();

			case 'autolink':
				return this.#parse_autolink();

			case 'tag_open':
				return this.#parse_tag_node();

			case 'tag_self_close':
				return this.#parse_self_close_tag();

			// Orphaned close tokens - treat as text
			case 'bold_close':
				this.#index++;
				return {type: 'Text', content: '**', start: token.start, end: token.end};

			case 'italic_close':
				this.#index++;
				return {type: 'Text', content: '_', start: token.start, end: token.end};

			case 'strikethrough_close':
				this.#index++;
				return {type: 'Text', content: '~', start: token.start, end: token.end};

			case 'link_text_close':
				this.#index++;
				return {type: 'Text', content: ']', start: token.start, end: token.end};

			case 'link_ref':
				this.#index++;
				return {
					type: 'Text',
					content: `(${token.reference})`,
					start: token.start,
					end: token.end,
				};

			case 'tag_close':
				this.#index++;
				return {
					type: 'Text',
					content: `</${token.name}>`,
					start: token.start,
					end: token.end,
				};

			default:
				this.#index++;
				return null;
		}
	}

	#parse_bold(): MdzBoldNode | MdzTextNode {
		const token = this.#tokens[this.#index]! as MdzTokenBoldOpen;
		const start = token.start;
		this.#index++;

		const children: Array<MdzNode> = [];

		while (this.#index < this.#tokens.length) {
			const t = this.#tokens[this.#index]!;
			if (t.type === 'bold_close') {
				this.#index++;
				return {type: 'Bold', children, start, end: t.end};
			}
			if (
				t.type === 'paragraph_break' ||
				t.type === 'heading_start' ||
				t.type === 'hr' ||
				t.type === 'codeblock'
			) {
				break;
			}
			const node = this.#parse_inline();
			if (node) children.push(node);
		}

		// Unclosed - treat as text
		return {type: 'Text', content: '**', start, end: start + 2};
	}

	#parse_italic(): MdzItalicNode | MdzTextNode {
		const token = this.#tokens[this.#index]! as MdzTokenItalicOpen;
		const start = token.start;
		this.#index++;

		const children: Array<MdzNode> = [];

		while (this.#index < this.#tokens.length) {
			const t = this.#tokens[this.#index]!;
			if (t.type === 'italic_close') {
				this.#index++;
				return {type: 'Italic', children, start, end: t.end};
			}
			if (
				t.type === 'paragraph_break' ||
				t.type === 'heading_start' ||
				t.type === 'hr' ||
				t.type === 'codeblock'
			) {
				break;
			}
			const node = this.#parse_inline();
			if (node) children.push(node);
		}

		return {type: 'Text', content: '_', start, end: start + 1};
	}

	#parse_strikethrough(): MdzStrikethroughNode | MdzTextNode {
		const token = this.#tokens[this.#index]! as MdzTokenStrikethroughOpen;
		const start = token.start;
		this.#index++;

		const children: Array<MdzNode> = [];

		while (this.#index < this.#tokens.length) {
			const t = this.#tokens[this.#index]!;
			if (t.type === 'strikethrough_close') {
				this.#index++;
				return {type: 'Strikethrough', children, start, end: t.end};
			}
			if (
				t.type === 'paragraph_break' ||
				t.type === 'heading_start' ||
				t.type === 'hr' ||
				t.type === 'codeblock'
			) {
				break;
			}
			const node = this.#parse_inline();
			if (node) children.push(node);
		}

		return {type: 'Text', content: '~', start, end: start + 1};
	}

	#parse_link(): MdzLinkNode | MdzTextNode {
		const open_token = this.#tokens[this.#index]! as MdzTokenLinkTextOpen;
		const start = open_token.start;
		this.#index++;

		const children: Array<MdzNode> = [];

		while (this.#index < this.#tokens.length) {
			const t = this.#tokens[this.#index]!;
			if (t.type === 'link_text_close') {
				this.#index++;

				// Expect link_ref next
				if (this.#index < this.#tokens.length && this.#tokens[this.#index]!.type === 'link_ref') {
					const ref_token = this.#tokens[this.#index]! as MdzTokenLinkRef;
					this.#index++;
					return {
						type: 'Link',
						reference: ref_token.reference,
						children,
						link_type: ref_token.link_type,
						start,
						end: ref_token.end,
					};
				}

				// No link_ref - treat as text
				return {type: 'Text', content: '[', start, end: start + 1};
			}
			if (
				t.type === 'paragraph_break' ||
				t.type === 'heading_start' ||
				t.type === 'hr' ||
				t.type === 'codeblock'
			) {
				break;
			}
			const node = this.#parse_inline();
			if (node) children.push(node);
		}

		return {type: 'Text', content: '[', start, end: start + 1};
	}

	#parse_autolink(): MdzLinkNode {
		const token = this.#tokens[this.#index]! as MdzTokenAutolink;
		this.#index++;
		return {
			type: 'Link',
			reference: token.reference,
			children: [{type: 'Text', content: token.reference, start: token.start, end: token.end}],
			link_type: token.link_type,
			start: token.start,
			end: token.end,
		};
	}

	#parse_tag_node(): MdzElementNode | MdzComponentNode | MdzTextNode {
		const open_token = this.#tokens[this.#index]! as MdzTokenTagOpen;
		const start = open_token.start;
		const tag_name = open_token.name;
		const node_type: 'Component' | 'Element' = open_token.is_component ? 'Component' : 'Element';
		this.#index++;

		const children: Array<MdzNode> = [];

		while (this.#index < this.#tokens.length) {
			const t = this.#tokens[this.#index]!;
			if (t.type === 'tag_close' && (t as MdzTokenTagClose).name === tag_name) {
				this.#index++;
				return {type: node_type, name: tag_name, children, start, end: t.end};
			}
			const node = this.#parse_inline();
			if (node) children.push(node);
		}

		// Unclosed tag
		return {type: 'Text', content: '<', start, end: start + 1};
	}

	#parse_self_close_tag(): MdzElementNode | MdzComponentNode {
		const token = this.#tokens[this.#index]! as MdzTokenTagSelfClose;
		const node_type: 'Component' | 'Element' = token.is_component ? 'Component' : 'Element';
		this.#index++;
		return {type: node_type, name: token.name, children: [], start: token.start, end: token.end};
	}

	// -- Paragraph flushing --

	#flush_paragraph(paragraph_children: Array<MdzNode>, trim_trailing = false): MdzNode | null {
		if (paragraph_children.length === 0) return null;

		if (trim_trailing) {
			// Trim trailing newlines from last text node
			const last = paragraph_children[paragraph_children.length - 1]!;
			if (last.type === 'Text') {
				const trimmed = last.content.replace(/\n+$/, '');
				if (trimmed) {
					last.content = trimmed;
					last.end = last.start + trimmed.length;
				} else {
					paragraph_children.pop();
				}
			}

			// Skip whitespace-only paragraphs
			const has_content = paragraph_children.some(
				(n) => n.type !== 'Text' || n.content.trim().length > 0,
			);
			if (!has_content) {
				paragraph_children.length = 0;
				return null;
			}
		}

		// Single tag extraction (MDX convention)
		const single_tag = this.#extract_single_tag(paragraph_children);
		if (single_tag) {
			paragraph_children.length = 0;
			return single_tag;
		}

		// Merge adjacent text nodes
		const merged = this.#merge_adjacent_text(paragraph_children.slice());
		paragraph_children.length = 0;

		if (merged.length === 0) return null;

		return {
			type: 'Paragraph',
			children: merged,
			start: merged[0]!.start,
			end: merged[merged.length - 1]!.end,
		};
	}

	#extract_single_tag(nodes: Array<MdzNode>): MdzComponentNode | MdzElementNode | null {
		let tag: MdzComponentNode | MdzElementNode | null = null;

		for (const node of nodes) {
			if (node.type === 'Component' || node.type === 'Element') {
				if (tag) return null;
				tag = node;
			} else if (node.type === 'Text') {
				if (node.content.trim() !== '') return null;
			} else {
				return null;
			}
		}

		return tag;
	}

	#merge_adjacent_text(nodes: Array<MdzNode>): Array<MdzNode> {
		if (nodes.length <= 1) return nodes;

		const merged: Array<MdzNode> = [];
		let pending_text: MdzTextNode | null = null;

		for (const node of nodes) {
			if (node.type === 'Text') {
				if (pending_text) {
					pending_text = {
						type: 'Text',
						content: pending_text.content + node.content,
						start: pending_text.start,
						end: node.end,
					};
				} else {
					pending_text = {...node} as MdzTextNode;
				}
			} else {
				if (pending_text) {
					merged.push(pending_text);
					pending_text = null;
				}
				merged.push(node);
			}
		}

		if (pending_text) merged.push(pending_text);

		return merged;
	}
}
