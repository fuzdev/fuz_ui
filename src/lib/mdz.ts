/**
 * mdz - minimal markdown dialect for Fuz documentation.
 *
 * Parses an enhanced markdown dialect with:
 * - inline formatting: `code`, **bold**, _italic_, ~strikethrough~
 * - auto-detected links: external URLs (`https://...`) and internal paths (`/path`)
 * - markdown links: `[text](url)` with custom display text
 * - inline code in backticks (creates `Code` nodes; auto-linking to identifiers/modules
 *   is handled by the rendering layer via `MdzNodeView.svelte`)
 * - paragraph breaks (double newline)
 * - block elements: headings, horizontal rules, code blocks
 * - HTML elements and Svelte components (opt-in via context)
 *
 * Key constraint: preserves ALL whitespace exactly as authored,
 * and is rendered with white-space pre or pre-wrap.
 *
 * ## Design philosophy
 *
 * - **False negatives over false positives**: When in doubt, treat as plain text.
 *   Block elements can interrupt paragraphs without blank lines; inline formatting is strict.
 * - **One way to do things**: Single unambiguous syntax per feature. No alternatives.
 * - **Explicit over implicit**: Clear delimiters and column-0 requirements avoid ambiguity.
 * - **Simple over complete**: Prefer simple parsing rules over complex edge case handling.
 *
 * ## Status
 *
 * This is an early proof of concept with missing features and edge cases.
 *
 * @module
 */

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
	is_letter,
	is_tag_name_char,
	is_word_char,
	PERIOD,
	is_valid_path_char,
	trim_trailing_punctuation,
	is_at_absolute_path,
	is_at_relative_path,
	extract_single_tag,
	mdz_heading_id,
	mdz_is_url,
} from './mdz_helpers.js';

// TODO design incremental parsing or some system that preserves Svelte components across re-renders when possible

/**
 * Parses text to an array of `MdzNode`.
 */
export const mdz_parse = (text: string): Array<MdzNode> => new MdzParser(text).parse();

export type MdzNode =
	| MdzTextNode
	| MdzCodeNode
	| MdzCodeblockNode
	| MdzBoldNode
	| MdzItalicNode
	| MdzStrikethroughNode
	| MdzLinkNode
	| MdzParagraphNode
	| MdzHrNode
	| MdzHeadingNode
	| MdzElementNode
	| MdzComponentNode;

export interface MdzBaseNode {
	type: string;
	start: number;
	end: number;
}

export interface MdzTextNode extends MdzBaseNode {
	type: 'Text';
	content: string;
}

export interface MdzCodeNode extends MdzBaseNode {
	type: 'Code';
	content: string; // The code content (identifier/module name)
}

export interface MdzCodeblockNode extends MdzBaseNode {
	type: 'Codeblock';
	lang: string | null; // language hint, if provided
	content: string; // raw code content
}

export interface MdzBoldNode extends MdzBaseNode {
	type: 'Bold';
	children: Array<MdzNode>;
}

export interface MdzItalicNode extends MdzBaseNode {
	type: 'Italic';
	children: Array<MdzNode>;
}

export interface MdzStrikethroughNode extends MdzBaseNode {
	type: 'Strikethrough';
	children: Array<MdzNode>;
}

export interface MdzLinkNode extends MdzBaseNode {
	type: 'Link';
	reference: string; // URL or path
	children: Array<MdzNode>; // Display content (can include inline formatting)
	link_type: 'external' | 'internal'; // external: https/http, internal: /path, ./path, ../path
}

export interface MdzParagraphNode extends MdzBaseNode {
	type: 'Paragraph';
	children: Array<MdzNode>;
}

export interface MdzHrNode extends MdzBaseNode {
	type: 'Hr';
}

export interface MdzHeadingNode extends MdzBaseNode {
	type: 'Heading';
	level: 1 | 2 | 3 | 4 | 5 | 6;
	id: string; // slugified heading text for fragment links
	children: Array<MdzNode>; // inline formatting allowed
}

export interface MdzElementNode extends MdzBaseNode {
	type: 'Element';
	name: string; // HTML element name (e.g., 'div', 'span', 'code')
	children: Array<MdzNode>;
}

export interface MdzComponentNode extends MdzBaseNode {
	type: 'Component';
	name: string; // Svelte component name (e.g., 'Alert', 'Card')
	children: Array<MdzNode>;
}

/**
 * Parser for mdz format.
 * Single-pass lexer/parser with text accumulation for efficiency.
 * Used by `mdz_parse`, which should be preferred for simple usage.
 */
export class MdzParser {
	#index: number = 0;
	#template: string;
	#accumulated_text: string = '';
	#accumulated_start: number = 0;
	#nodes: Array<MdzNode> = [];
	#max_search_index: number = Number.MAX_SAFE_INTEGER; // Boundary for delimiter searches

	constructor(template: string) {
		this.#template = template;
	}

	/**
	 * Main parse method. Returns flat array of nodes,
	 * with paragraph nodes wrapping content between double newlines.
	 *
	 * Block elements (headings, HR, codeblocks) are detected at every column-0
	 * position — they can interrupt paragraphs without requiring blank lines.
	 */
	parse(): Array<MdzNode> {
		this.#nodes.length = 0;
		const root_nodes: Array<MdzNode> = [];
		const paragraph_children: Array<MdzNode> = [];

		// Skip leading newlines
		this.#skip_newlines();

		while (this.#index < this.#template.length) {
			// Block elements only start at column 0 — skip peek for mid-line characters
			const block_type =
				(this.#index === 0 || this.#template.charCodeAt(this.#index - 1) === NEWLINE) &&
				this.#peek_block_element();
			if (block_type) {
				const flushed = this.#flush_paragraph(paragraph_children, true);
				if (flushed) root_nodes.push(flushed);
				if (block_type === 'heading') root_nodes.push(this.#parse_heading());
				else if (block_type === 'hr') root_nodes.push(this.#parse_hr());
				else root_nodes.push(this.#parse_code_block());
				this.#skip_newlines();
				continue;
			}

			// Check for paragraph break (double newline)
			if (this.#is_at_paragraph_break()) {
				const flushed = this.#flush_paragraph(paragraph_children, true);
				if (flushed) root_nodes.push(flushed);
				this.#skip_newlines();
				continue;
			}

			// Parse inline content
			const node = this.#parse_node();
			if (node.type === 'Text') {
				this.#accumulate_text(node.content, node.start);
			} else {
				this.#flush_text();
				this.#nodes.push(node);
			}
			if (this.#nodes.length > 0) {
				paragraph_children.push(...this.#nodes);
				this.#nodes.length = 0;
			}
		}

		// Flush remaining content as final paragraph
		const final_paragraph = this.#flush_paragraph(paragraph_children, true);
		if (final_paragraph) root_nodes.push(final_paragraph);

		return root_nodes;
	}

	/**
	 * Flush accumulated inline content as a paragraph node (or single tag).
	 * When `trim_trailing` is true, trims trailing newlines from the last text node
	 * (the line break before a block element or paragraph break).
	 *
	 * @mutates paragraph_children - trims last text node, removes whitespace-only nodes, clears array
	 */
	#flush_paragraph(paragraph_children: Array<MdzNode>, trim_trailing = false): MdzNode | null {
		this.#flush_text();
		if (this.#nodes.length > 0) {
			paragraph_children.push(...this.#nodes);
			this.#nodes.length = 0;
		}

		if (paragraph_children.length === 0) {
			return null;
		}

		if (trim_trailing) {
			// Trim trailing newlines from the last text node (line break before block element)
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

			// Skip whitespace-only paragraphs (e.g. newlines between consecutive blocks)
			const has_content = paragraph_children.some(
				(n) => n.type !== 'Text' || n.content.trim().length > 0,
			);
			if (!has_content) {
				paragraph_children.length = 0;
				return null;
			}
		}

		// Single tag (component/element) - add directly without paragraph wrapper (MDX convention)
		const single_tag = extract_single_tag(paragraph_children);
		if (single_tag) {
			paragraph_children.length = 0;
			return single_tag;
		}

		// Regular paragraph
		const result: MdzParagraphNode = {
			type: 'Paragraph',
			children: paragraph_children.slice(),
			start: paragraph_children[0]!.start,
			end: paragraph_children[paragraph_children.length - 1]!.end,
		};
		paragraph_children.length = 0;
		return result;
	}

	/**
	 * Consume consecutive newline characters.
	 */
	#skip_newlines(): void {
		while (
			this.#index < this.#template.length &&
			this.#template.charCodeAt(this.#index) === NEWLINE
		) {
			this.#index++;
		}
	}

	/**
	 * Accumulate text for later flushing (performance optimization).
	 */
	#accumulate_text(text: string, start: number): void {
		if (this.#accumulated_text === '') {
			this.#accumulated_start = start;
		}
		this.#accumulated_text += text;
	}

	#flush_text(): void {
		if (this.#accumulated_text !== '') {
			this.#nodes.push({
				type: 'Text',
				content: this.#accumulated_text,
				start: this.#accumulated_start,
				end: this.#accumulated_start + this.#accumulated_text.length,
			});
			this.#accumulated_text = '';
		}
	}

	/**
	 * Create a text node and advance index past the content.
	 * Used when formatting delimiters fail to match and need to be treated as literal text.
	 */
	#make_text_node(content: string, start: number): MdzTextNode {
		this.#index = start + content.length;
		return {
			type: 'Text',
			content,
			start,
			end: this.#index,
		};
	}

	/**
	 * Parse next node based on current character.
	 * Uses switch for performance (avoids regex in hot loop).
	 */
	#parse_node(): MdzNode {
		const char_code = this.#template.charCodeAt(this.#index);

		// Use character codes for performance in hot path
		switch (char_code) {
			case BACKTICK:
				return this.#parse_code();
			case ASTERISK:
				return this.#parse_bold();
			case UNDERSCORE:
				return this.#parse_italic();
			case TILDE:
				return this.#parse_strikethrough();
			case LEFT_BRACKET:
				return this.#parse_markdown_link();
			case LEFT_ANGLE:
				return this.#parse_tag();
			default:
				return this.#parse_text();
		}
	}

	/**
	 * Parse backtick code: `code`
	 * Auto-links to identifiers/modules if match found.
	 * Falls back to text if unclosed, empty, or if newline encountered before closing backtick.
	 */
	#parse_code(): MdzCodeNode | MdzTextNode {
		const start = this.#index;
		this.#eat('`');
		const content_start = this.#index;

		// Find closing backtick, but stop at newline (respect boundary for greedy matching)
		let content_end = -1;
		const search_limit = Math.min(this.#max_search_index, this.#template.length);
		for (let i = this.#index; i < search_limit; i++) {
			const char_code = this.#template.charCodeAt(i);
			if (char_code === BACKTICK) {
				content_end = i;
				break;
			}
			if (char_code === NEWLINE) {
				// Newline before closing backtick - treat as unclosed
				break;
			}
		}

		if (content_end === -1) {
			// Unclosed backtick or newline encountered, treat as text
			return this.#make_text_node('`', start);
		}

		const content = this.#template.slice(content_start, content_end);

		// Empty inline code has no semantic meaning, treat as literal text
		if (content.length === 0) {
			return this.#make_text_node('``', start);
		}

		this.#index = content_end + 1;

		return {
			type: 'Code',
			content,
			start,
			end: this.#index,
		};
	}

	/**
	 * Parse bold starting with double asterisk.
	 *
	 * - **bold** = Bold node
	 *
	 * Falls back to text if unclosed or single asterisk.
	 *
	 * Bold has no word boundary restrictions and works everywhere including intraword.
	 * Examples:
	 * - `foo**bar**baz` → foo<strong>bar</strong>baz (creates bold)
	 * - `word **bold** word` → word <strong>bold</strong> word (also works)
	 */
	#parse_bold(): MdzBoldNode | MdzTextNode {
		const start = this.#index;

		// Check for ** (bold)
		if (this.#match('**')) {
			// Bold (**) has no word boundary restrictions - works everywhere including intraword
			this.#eat('**');

			// Find closing ** (greedy matching - first occurrence within boundary)
			const search_end = Math.min(this.#max_search_index, this.#template.length);
			let close_index = this.#template.indexOf('**', this.#index);
			// Check if close_index exceeds search boundary
			if (close_index !== -1 && close_index >= search_end) {
				close_index = -1;
			}
			if (close_index === -1) {
				// Unclosed, treat as text
				return this.#make_text_node('**', start);
			}

			// No word boundary check for closing ** - works everywhere
			// Parse children up to closing delimiter (bounded parsing)
			const children = this.#parse_nodes_until('**', close_index);

			// Verify we're at the closing delimiter (could have stopped early due to paragraph break)
			if (!this.#match('**')) {
				// Interrupted before closing - treat as unclosed
				return this.#make_text_node('**', start);
			}

			// Empty bold has no semantic meaning, treat as literal text
			if (children.length === 0) {
				this.#index = start;
				return this.#make_text_node('****', start);
			}

			// Consume closing **
			this.#eat('**');
			return {
				type: 'Bold',
				children,
				start,
				end: this.#index,
			};
		}

		// Single asterisk - treat as text
		const content = this.#template[this.#index]!;
		return this.#make_text_node(content, start);
	}

	/**
	 * Common parser for single-delimiter formatting (italic and strikethrough).
	 * Both formats use identical parsing logic with different delimiters and node types.
	 *
	 * Word boundary requirements:
	 * - Opening delimiter must be at word boundary (not preceded by alphanumeric)
	 * - Closing delimiter must be at word boundary (not followed by alphanumeric)
	 * - This prevents false positives with `snake_case` and `foo~bar~baz` text
	 *
	 * Falls back to literal text if:
	 * - Delimiter not at word boundary
	 * - Unclosed (no matching closing delimiter found)
	 * - Empty content (e.g., `__` or `~~`)
	 * - Paragraph break interrupts before closing delimiter
	 *
	 * @param delimiter - The delimiter character (`_` for italic, `~` for strikethrough)
	 * @param node_type - The node type to create ('Italic' or 'Strikethrough')
	 * @returns Formatted node or text node if validation fails
	 */
	#parse_single_delimiter_formatting(
		delimiter: '_',
		node_type: 'Italic',
	): MdzItalicNode | MdzTextNode;
	#parse_single_delimiter_formatting(
		delimiter: '~',
		node_type: 'Strikethrough',
	): MdzStrikethroughNode | MdzTextNode;
	#parse_single_delimiter_formatting(
		delimiter: '_' | '~',
		node_type: 'Italic' | 'Strikethrough',
	): MdzItalicNode | MdzStrikethroughNode | MdzTextNode {
		const start = this.#index;

		// Check if opening delimiter is at word boundary
		if (!this.#is_at_word_boundary(this.#index, true, false)) {
			// Intraword delimiter - treat as literal text
			const content = this.#template[this.#index]!;
			return this.#make_text_node(content, start);
		}

		this.#eat(delimiter);

		// Find closing delimiter (greedy matching - first occurrence within boundary)
		const search_end = Math.min(this.#max_search_index, this.#template.length);
		let close_index = this.#template.indexOf(delimiter, this.#index);
		// Check if close_index exceeds search boundary
		if (close_index !== -1 && close_index >= search_end) {
			close_index = -1;
		}
		if (close_index === -1) {
			// Unclosed, treat as text
			return this.#make_text_node(delimiter, start);
		}

		// Check if closing delimiter is at word boundary
		if (!this.#is_at_word_boundary(close_index + 1, false, true)) {
			// Closing delimiter not at boundary - treat whole thing as text
			return this.#make_text_node(delimiter, start);
		}

		// Parse children up to closing delimiter (bounded parsing)
		const children = this.#parse_nodes_until(delimiter, close_index);

		// Verify we're at the closing delimiter (could have stopped early due to paragraph break)
		if (!this.#match(delimiter)) {
			// Interrupted before closing - treat as unclosed
			return this.#make_text_node(delimiter, start);
		}

		// Empty formatting has no semantic meaning, treat as literal text
		if (children.length === 0) {
			this.#index = start;
			return this.#make_text_node(delimiter + delimiter, start);
		}

		// Consume closing delimiter
		this.#eat(delimiter);
		return {
			type: node_type,
			children,
			start,
			end: this.#index,
		};
	}

	/**
	 * Parse italic starting with underscore.
	 * _italic_ = Italic node
	 * Falls back to text if unclosed or not at word boundary.
	 *
	 * Following GFM spec: underscores cannot create emphasis in middle of words.
	 * Examples:
	 * - `foo_bar_baz` → literal text (intraword)
	 * - `word _emphasis_ word` → emphasis (at word boundaries)
	 */
	#parse_italic(): MdzItalicNode | MdzTextNode {
		return this.#parse_single_delimiter_formatting('_', 'Italic');
	}

	/**
	 * Parse strikethrough starting with tilde.
	 * ~strikethrough~ = Strikethrough node
	 * Falls back to text if unclosed or not at word boundary.
	 *
	 * Following mdz philosophy (false negatives over false positives):
	 * Strikethrough requires word boundaries to prevent intraword formatting.
	 * Examples:
	 * - `foo~bar~baz` → literal text (intraword)
	 * - `word ~strike~ word` → strikethrough (at word boundaries)
	 */
	#parse_strikethrough(): MdzStrikethroughNode | MdzTextNode {
		return this.#parse_single_delimiter_formatting('~', 'Strikethrough');
	}

	/**
	 * Parse markdown link: `[text](url)`.
	 * Falls back to text if malformed.
	 */
	#parse_markdown_link(): MdzLinkNode | MdzTextNode {
		const start = this.#index;

		// Consume opening [
		if (!this.#match('[')) {
			const content = this.#template[this.#index]!;
			this.#index++;
			return {
				type: 'Text',
				content,
				start,
				end: this.#index,
			};
		}
		this.#index++;

		// Parse children nodes until closing ]
		const children = this.#parse_nodes_until(']');

		// Check if we found the closing ]
		if (!this.#match(']')) {
			// No closing ], treat as text
			this.#index = start + 1;
			return {
				type: 'Text',
				content: '[',
				start,
				end: this.#index,
			};
		}
		this.#index++; // consume ]

		// Check for opening (
		if (
			this.#index >= this.#template.length ||
			this.#template.charCodeAt(this.#index) !== LEFT_PAREN
		) {
			// No opening (, treat as text
			this.#index = start + 1;
			return {
				type: 'Text',
				content: '[',
				start,
				end: this.#index,
			};
		}
		this.#index++;

		// Find closing )
		const close_paren = this.#template.indexOf(')', this.#index);
		if (close_paren === -1) {
			// No closing ), treat as text
			this.#index = start + 1;
			return {
				type: 'Text',
				content: '[',
				start,
				end: this.#index,
			};
		}

		// Extract URL/path
		const reference = this.#template.slice(this.#index, close_paren);

		// Validate reference is not empty or whitespace-only
		if (!reference.trim()) {
			// Empty reference, treat as text
			this.#index = start + 1;
			return {
				type: 'Text',
				content: '[',
				start,
				end: this.#index,
			};
		}

		// Validate all characters in reference are valid URI characters per RFC 3986
		// This prevents spaces and other invalid characters from being in markdown link URLs
		// Follows GFM behavior: invalid chars cause fallback to text, then auto-detection
		for (let i = 0; i < reference.length; i++) {
			const char_code = reference.charCodeAt(i);
			if (!is_valid_path_char(char_code)) {
				// Invalid character in URL, treat as text and let auto-detection handle it
				this.#index = start + 1;
				return {
					type: 'Text',
					content: '[',
					start,
					end: this.#index,
				};
			}
		}

		this.#index = close_paren + 1;

		// Determine link type (external vs internal)
		const link_type = mdz_is_url(reference) ? 'external' : 'internal';

		return {
			type: 'Link',
			reference,
			children,
			link_type,
			start,
			end: this.#index,
		};
	}

	/**
	 * Parse component/element tag: `<TagName>content</TagName>` or `<TagName />`
	 *
	 * Formats:
	 * - `<Alert>content</Alert>` - Svelte component with children (uppercase first letter)
	 * - `<div>content</div>` - HTML element with children (lowercase first letter)
	 * - `<Alert />` - self-closing component/element
	 *
	 * Tag names must start with a letter and can contain letters, numbers, hyphens, underscores.
	 *
	 * Falls back to text if malformed or unclosed.
	 *
	 * TODO: Add attribute support like `<Alert status="error">` or `<div class="container">`
	 */
	#parse_tag(): MdzElementNode | MdzComponentNode | MdzTextNode {
		const start = this.#index;

		// Phase 1: Validate tag structure using a local scan index.
		// Avoids save/restore of accumulation state on the fast path
		// (most `<` characters are not valid tags).
		let i = start + 1; // skip <

		// Tag name must start with a letter
		if (i >= this.#template.length || !is_letter(this.#template.charCodeAt(i))) {
			this.#index = start + 1;
			return this.#make_text_node('<', start);
		}

		// Collect tag name (letters, numbers, hyphens, underscores)
		while (i < this.#template.length && is_tag_name_char(this.#template.charCodeAt(i))) {
			i++;
		}

		const tag_name = this.#template.slice(start + 1, i);
		const first_char_code = tag_name.charCodeAt(0);
		const node_type: 'Component' | 'Element' =
			first_char_code >= A_UPPER && first_char_code <= Z_UPPER ? 'Component' : 'Element';

		// Skip whitespace after tag name (for future attribute support)
		while (i < this.#template.length && this.#template.charCodeAt(i) === SPACE) {
			i++;
		}

		// TODO: Parse attributes here

		// Check for self-closing />
		if (
			i + 1 < this.#template.length &&
			this.#template.charCodeAt(i) === SLASH &&
			this.#template.charCodeAt(i + 1) === RIGHT_ANGLE
		) {
			this.#index = i + 2;
			return {
				type: node_type,
				name: tag_name,
				children: [],
				start,
				end: this.#index,
			};
		}

		// Must have closing >
		if (i >= this.#template.length || this.#template.charCodeAt(i) !== RIGHT_ANGLE) {
			this.#index = start + 1;
			return this.#make_text_node('<', start);
		}

		const content_start = i + 1; // past >

		// Bail early if closing tag is missing, past a paragraph break,
		// or past the search boundary (e.g. heading line end)
		const closing_tag = `</${tag_name}>`;
		const search_limit = Math.min(this.#max_search_index, this.#template.length);
		const close_tag_index = this.#template.indexOf(closing_tag, content_start);
		if (close_tag_index === -1 || close_tag_index >= search_limit) {
			this.#index = start + 1;
			return this.#make_text_node('<', start);
		}
		const para_break = this.#template.indexOf('\n\n', content_start);
		if (para_break !== -1 && para_break < close_tag_index) {
			this.#index = start + 1;
			return this.#make_text_node('<', start);
		}

		// Phase 2: Tag validated — save accumulation state and parse children.
		const saved_state = this.#save_accumulation_state();
		this.#accumulated_text = '';
		this.#nodes.length = 0;
		this.#index = content_start;

		const children: Array<MdzNode> = [];

		while (this.#index < this.#template.length) {
			if (this.#match(closing_tag)) {
				this.#flush_text();
				children.push(...this.#nodes);
				this.#nodes.length = 0;

				this.#index += closing_tag.length;
				this.#restore_accumulation_state(saved_state);

				return {
					type: node_type,
					name: tag_name,
					children,
					start,
					end: this.#index,
				};
			}

			const node = this.#parse_node();
			if (node.type === 'Text') {
				this.#accumulate_text(node.content, node.start);
			} else {
				this.#flush_text();
				children.push(...this.#nodes);
				this.#nodes.length = 0;
				children.push(node);
			}
		}

		// Defensive: pre-check guarantees closing tag exists, but handle EOF gracefully
		this.#restore_accumulation_state(saved_state);
		this.#index = start + 1;
		return this.#make_text_node('<', start);
	}

	/**
	 * Read-only check if current position matches a block element.
	 * Does not modify parser state — used to peek before flushing paragraph.
	 * Caller must verify column-0 position before calling.
	 */
	#peek_block_element(): 'heading' | 'hr' | 'codeblock' | null {
		if (this.#match_heading()) return 'heading';
		if (this.#match_hr()) return 'hr';
		if (this.#match_code_block()) return 'codeblock';
		return null;
	}

	/**
	 * Save current text accumulation state.
	 * Used when parsing nested structures (like components/elements) that need isolated accumulation.
	 * Returns state object that can be passed to `#restore_accumulation_state()`.
	 */
	#save_accumulation_state(): {
		accumulated_text: string;
		accumulated_start: number;
		nodes: Array<MdzNode>;
	} {
		return {
			accumulated_text: this.#accumulated_text,
			accumulated_start: this.#accumulated_start,
			nodes: this.#nodes.slice(),
		};
	}

	/**
	 * Restore previously saved text accumulation state.
	 * Used to restore parent state when exiting nested structure parsing.
	 * @param state - State object returned from `#save_accumulation_state()`
	 */
	#restore_accumulation_state(state: {
		accumulated_text: string;
		accumulated_start: number;
		nodes: Array<MdzNode>;
	}): void {
		this.#accumulated_text = state.accumulated_text;
		this.#accumulated_start = state.accumulated_start;
		this.#nodes.length = 0;
		this.#nodes.push(...state.nodes);
	}

	/**
	 * Check if position is at a word boundary.
	 * Word boundary = not surrounded by word characters (A-Z, a-z, 0-9).
	 * Used to prevent intraword emphasis for underscores and tildes.
	 *
	 * @param index - Position to check
	 * @param check_before - Whether to check the character before this position
	 * @param check_after - Whether to check the character after this position
	 */
	#is_at_word_boundary(index: number, check_before: boolean, check_after: boolean): boolean {
		if (check_before && index > 0) {
			const prev = this.#template.charCodeAt(index - 1);
			// If preceded by word char, not at boundary
			if (is_word_char(prev)) {
				return false;
			}
		}

		if (check_after && index < this.#template.length) {
			const next = this.#template.charCodeAt(index);
			// If followed by word char, not at boundary
			if (is_word_char(next)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Check if current position is the start of an external URL (`https://` or `http://`).
	 */
	#is_at_url(): boolean {
		if (this.#match('https://')) {
			// Check for protocol-only (e.g., just "https://")
			// Must have at least one non-whitespace character after protocol
			if (this.#index + HTTPS_PREFIX_LENGTH >= this.#template.length) {
				return false;
			}
			const next_char = this.#template.charCodeAt(this.#index + HTTPS_PREFIX_LENGTH);
			return next_char !== SPACE && next_char !== NEWLINE;
		}
		if (this.#match('http://')) {
			// Check for protocol-only (e.g., just "http://")
			// Must have at least one non-whitespace character after protocol
			if (this.#index + HTTP_PREFIX_LENGTH >= this.#template.length) {
				return false;
			}
			const next_char = this.#template.charCodeAt(this.#index + HTTP_PREFIX_LENGTH);
			return next_char !== SPACE && next_char !== NEWLINE;
		}
		return false;
	}

	/**
	 * Parse auto-detected external URL (`https://` or `http://`).
	 * Uses RFC 3986 whitelist validation for valid URI characters.
	 */
	#parse_auto_link_url(): MdzLinkNode {
		const start = this.#index;

		// Consume protocol
		if (this.#match('https://')) {
			this.#index += HTTPS_PREFIX_LENGTH;
		} else if (this.#match('http://')) {
			this.#index += HTTP_PREFIX_LENGTH;
		}

		// Collect URL characters using RFC 3986 whitelist
		// Stop at whitespace or any character invalid in URIs
		while (this.#index < this.#template.length) {
			const char_code = this.#template.charCodeAt(this.#index);
			if (char_code === SPACE || char_code === NEWLINE || !is_valid_path_char(char_code)) {
				break;
			}
			this.#index++;
		}

		let reference = this.#template.slice(start, this.#index);

		// Apply GFM trailing punctuation trimming with balanced parentheses
		reference = trim_trailing_punctuation(reference);

		// Update index after trimming
		this.#index = start + reference.length;

		return {
			type: 'Link',
			reference,
			children: [{type: 'Text', content: reference, start, end: this.#index}],
			link_type: 'external',
			start,
			end: this.#index,
		};
	}

	/**
	 * Parse auto-detected path (absolute `/`, relative `./` or `../`).
	 * Uses RFC 3986 whitelist validation for valid URI characters.
	 */
	#parse_auto_link_path(): MdzLinkNode {
		const start = this.#index;

		// Collect path characters using RFC 3986 whitelist
		// Stop at whitespace or any character invalid in URIs
		while (this.#index < this.#template.length) {
			const char_code = this.#template.charCodeAt(this.#index);
			if (char_code === SPACE || char_code === NEWLINE || !is_valid_path_char(char_code)) {
				break;
			}
			this.#index++;
		}

		let reference = this.#template.slice(start, this.#index);

		// Apply GFM trailing punctuation trimming
		reference = trim_trailing_punctuation(reference);

		// Update index after trimming
		this.#index = start + reference.length;

		return {
			type: 'Link',
			reference,
			children: [{type: 'Text', content: reference, start, end: this.#index}],
			link_type: 'internal',
			start,
			end: this.#index,
		};
	}

	/**
	 * Parse plain text until special character encountered.
	 * Preserves all whitespace (except paragraph breaks handled separately).
	 * Detects and delegates to URL/path parsing when encountered.
	 */
	#parse_text(): MdzTextNode | MdzLinkNode {
		const start = this.#index;

		// Check for URL or internal absolute/relative path at current position
		if (this.#is_at_url()) {
			return this.#parse_auto_link_url();
		}
		if (
			is_at_absolute_path(this.#template, this.#index) ||
			is_at_relative_path(this.#template, this.#index)
		) {
			return this.#parse_auto_link_path();
		}

		while (this.#index < this.#template.length) {
			const char_code = this.#template.charCodeAt(this.#index);

			// Stop at special characters (but preserve single newlines)
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

			// Check for paragraph break (double newline)
			if (this.#is_at_paragraph_break()) {
				break;
			}

			// When next line could start a block element, consume the newline and stop.
			// The main loop will try block detection at the next character.
			// Consuming the newline here avoids a 3-iteration detour (break before \n,
			// fail peek at \n, safety-increment, then succeed peek at block char).
			if (char_code === NEWLINE) {
				const next_i = this.#index + 1;
				if (next_i < this.#template.length) {
					const next_char = this.#template.charCodeAt(next_i);
					if (next_char === HASH || next_char === HYPHEN || next_char === BACKTICK) {
						this.#index++; // consume the newline
						break;
					}
				}
			}

			// Check for URL or internal absolute/relative path mid-text (char code guard avoids startsWith on every char)
			if (
				(char_code === 104 /* h */ && this.#is_at_url()) ||
				(char_code === SLASH && is_at_absolute_path(this.#template, this.#index)) ||
				(char_code === PERIOD && is_at_relative_path(this.#template, this.#index))
			) {
				break;
			}

			this.#index++;
		}

		// Ensure we always consume at least one character to prevent infinite loops
		if (this.#index === start && this.#index < this.#template.length) {
			this.#index++;
		}

		// Use slice instead of concatenation for performance
		const content = this.#template.slice(start, this.#index);

		return {
			type: 'Text',
			content,
			start,
			end: this.#index,
		};
	}

	/**
	 * Parse nodes until delimiter string is found.
	 * Used for parsing children of inline formatting (bold, italic, strikethrough) and markdown links.
	 *
	 * Implements greedy/bounded parsing to prevent nested formatters from consuming parent delimiters:
	 * - When parsing `**bold with _italic_**`, the outer `**` parser finds its closing delimiter at position Y
	 * - Sets `#max_search_index = Y` to create a boundary
	 * - Parses children only within range, preventing `_italic_` from finding delimiters beyond Y
	 * - This ensures proper nesting without backtracking
	 *
	 * Stops parsing when:
	 * - Delimiter string is found
	 * - Paragraph break (double newline) is encountered (allows block elements to interrupt inline formatting)
	 * - `end_index` boundary is reached
	 *
	 * @param delimiter - The delimiter string to stop at (e.g., '**', '_', ']')
	 * @param end_index - Optional maximum index to parse up to (for greedy/bounded parsing)
	 * @returns Array of parsed nodes (may be empty if delimiter found immediately)
	 */
	#parse_nodes_until(delimiter: string, end_index?: number): Array<MdzNode> {
		const nodes: Array<MdzNode> = [];
		const max_index = end_index ?? this.#template.length;

		// Save and set max search boundary for nested parsers
		const saved_max_search_index = this.#max_search_index;
		this.#max_search_index = max_index;

		while (this.#index < max_index) {
			if (this.#match(delimiter)) {
				break;
			}

			// Check for paragraph break (block element interruption)
			if (this.#is_at_paragraph_break()) {
				// Paragraph break interrupts inline formatting
				break;
			}

			const node = this.#parse_node();
			nodes.push(node);
		}

		// Restore previous boundary
		this.#max_search_index = saved_max_search_index;

		return nodes;
	}

	/**
	 * Check if current position is at a paragraph break (double newline).
	 */
	#is_at_paragraph_break(): boolean {
		return (
			this.#index + 1 < this.#template.length &&
			this.#template.charCodeAt(this.#index) === NEWLINE &&
			this.#template.charCodeAt(this.#index + 1) === NEWLINE
		);
	}

	#match(str: string): boolean {
		return this.#template.startsWith(str, this.#index);
	}

	/**
	 * Consume string at current index, or throw error.
	 */
	#eat(str: string): void {
		if (this.#match(str)) {
			this.#index += str.length;
		} else {
			throw Error(`Expected "${str}" at index ${this.#index}`);
		}
	}

	/**
	 * Check if current position matches a horizontal rule.
	 * HR must be exactly `---` at column 0, followed by newline or EOF.
	 *
	 * mdz has no setext headings, so `---` after a paragraph is unambiguous
	 * (always an HR, unlike CommonMark where it becomes a setext heading).
	 */
	#match_hr(): boolean {
		let i = this.#index;

		// Must have exactly three hyphens
		if (
			i + HR_HYPHEN_COUNT > this.#template.length ||
			this.#template.charCodeAt(i) !== HYPHEN ||
			this.#template.charCodeAt(i + 1) !== HYPHEN ||
			this.#template.charCodeAt(i + 2) !== HYPHEN
		) {
			return false;
		}
		i += HR_HYPHEN_COUNT;

		// After the three hyphens, only whitespace and newline (or EOF) allowed
		while (i < this.#template.length) {
			const char_code = this.#template.charCodeAt(i);
			if (char_code === NEWLINE) {
				return true;
			}
			if (char_code !== SPACE) {
				return false; // Non-whitespace after ---, not an hr
			}
			i++;
		}

		// Reached EOF after ---, valid hr
		return true;
	}

	/**
	 * Parse horizontal rule: `---`
	 * Assumes #match_hr() already verified this is an hr.
	 */
	#parse_hr(): MdzHrNode {
		const start = this.#index;

		// Consume the three hyphens (no leading whitespace - already verified)
		this.#index += HR_HYPHEN_COUNT;

		// Skip trailing whitespace
		while (
			this.#index < this.#template.length &&
			this.#template.charCodeAt(this.#index) === SPACE
		) {
			this.#index++;
		}

		// Don't consume the newline - let the main parse loop handle it

		return {
			type: 'Hr',
			start,
			end: this.#index,
		};
	}

	/**
	 * Check if current position matches a heading.
	 * Heading must be 1-6 hashes at column 0, followed by space and content,
	 * followed by newline or EOF.
	 */
	#match_heading(): boolean {
		let i = this.#index;

		// Count hashes (must be 1-6)
		let hash_count = 0;
		while (
			i < this.#template.length &&
			this.#template.charCodeAt(i) === HASH &&
			hash_count <= MAX_HEADING_LEVEL
		) {
			hash_count++;
			i++;
		}

		if (hash_count === 0 || hash_count > MAX_HEADING_LEVEL) {
			return false;
		}

		// Must have space after hashes
		if (i >= this.#template.length || this.#template.charCodeAt(i) !== SPACE) {
			return false;
		}
		i++; // consume the space

		// Must have at least one non-whitespace character after the space
		while (i < this.#template.length) {
			const char_code = this.#template.charCodeAt(i);
			if (char_code === NEWLINE) return false; // reached end of line with only whitespace
			if (char_code !== SPACE && char_code !== TAB) return true;
			i++;
		}

		// Reached EOF with only whitespace after hashes
		return false;
	}

	/**
	 * Parse heading: `# Heading text`
	 * Assumes #match_heading() already verified this is a heading.
	 */
	#parse_heading(): MdzHeadingNode {
		const start = this.#index;

		// Count and consume hashes
		let level = 0;
		while (this.#index < this.#template.length && this.#template.charCodeAt(this.#index) === HASH) {
			level++;
			this.#index++;
		}

		// Consume the space after hashes (already verified to exist)
		this.#index++;

		// Find end-of-line to bound nested parsers (prevents tag scanner from scanning past heading)
		let eol = this.#template.indexOf('\n', this.#index);
		if (eol === -1) eol = this.#template.length;

		const saved_max_search_index = this.#max_search_index;
		this.#max_search_index = eol;

		// Parse inline content until end of line
		const content_nodes: Array<MdzNode> = [];

		while (this.#index < eol) {
			const node = this.#parse_node();
			if (node.type === 'Text') {
				// Trim if #parse_text overshot past the newline
				if (node.end > eol) {
					const trimmed_content = node.content.slice(0, eol - node.start);
					if (trimmed_content) {
						this.#accumulate_text(trimmed_content, node.start);
					}
					this.#index = eol;
					break;
				}
				this.#accumulate_text(node.content, node.start);
			} else {
				this.#flush_text();
				content_nodes.push(...this.#nodes);
				this.#nodes.length = 0;
				content_nodes.push(node);
			}
		}

		this.#max_search_index = saved_max_search_index;

		this.#flush_text();
		content_nodes.push(...this.#nodes);
		this.#nodes.length = 0;

		// Don't consume the newline - let the main parse loop handle it

		return {
			type: 'Heading',
			level: level as 1 | 2 | 3 | 4 | 5 | 6,
			id: mdz_heading_id(content_nodes),
			children: content_nodes,
			start,
			end: this.#index,
		};
	}

	/**
	 * Check if current position matches a code block.
	 * Code block must be 3+ backticks at column 0, closing fence followed by newline or EOF.
	 * Empty code blocks (no content) are treated as invalid.
	 */
	#match_code_block(): boolean {
		let i = this.#index;

		// Must have at least three backticks
		let backtick_count = 0;
		while (i < this.#template.length && this.#template.charCodeAt(i) === BACKTICK) {
			backtick_count++;
			i++;
		}

		if (backtick_count < MIN_CODEBLOCK_BACKTICKS) {
			return false;
		}

		// Skip optional language hint (consume until space or newline)
		while (i < this.#template.length) {
			const char_code = this.#template.charCodeAt(i);
			if (char_code === SPACE || char_code === NEWLINE) {
				break;
			}
			i++;
		}

		// Skip any trailing spaces on opening fence line
		while (i < this.#template.length && this.#template.charCodeAt(i) === SPACE) {
			i++;
		}

		// Must have newline after opening fence (or be at EOF)
		if (i >= this.#template.length) {
			return false; // No newline, can't be a valid code block
		}

		if (this.#template.charCodeAt(i) !== NEWLINE) {
			return false;
		}
		i++; // consume the newline

		// Mark content start position (after opening fence newline)
		const content_start = i;

		// Now search for closing fence
		const closing_fence = '`'.repeat(backtick_count);
		while (i < this.#template.length) {
			// Check if we're at a potential closing fence (must be at start of line)
			if (this.#template.startsWith(closing_fence, i)) {
				// Verify it's at column 0 by checking previous character
				const prev_char = i > 0 ? this.#template.charCodeAt(i - 1) : NEWLINE;
				if (prev_char === NEWLINE || i === 0) {
					// Found closing fence - check for empty content first
					const content = this.#template.slice(content_start, i);
					const final_content = content.endsWith('\n') ? content.slice(0, -1) : content;
					if (final_content.length === 0) {
						return false; // Empty code block has no semantic meaning
					}

					// Now verify what comes after closing fence
					let j = i + backtick_count;

					// Skip trailing whitespace on closing fence line
					while (j < this.#template.length && this.#template.charCodeAt(j) === SPACE) {
						j++;
					}

					// Must have newline after closing fence (or be at EOF)
					if (j >= this.#template.length) {
						return true;
					}

					if (this.#template.charCodeAt(j) !== NEWLINE) {
						// closing fence has non-whitespace after it on same line - not a code block
						return false;
					}

					return true; // code block followed by newline or EOF
				}
			}
			i++;
		}

		// No closing fence found - not a valid code block
		return false;
	}

	/**
	 * Parse code block: ```lang\ncode\n```
	 * Assumes #match_code_block() already verified this is a code block.
	 */
	#parse_code_block(): MdzCodeblockNode {
		const start = this.#index;

		// Count and consume opening backticks
		let backtick_count = 0;
		while (
			this.#index < this.#template.length &&
			this.#template.charCodeAt(this.#index) === BACKTICK
		) {
			backtick_count++;
			this.#index++;
		}

		// Parse optional language hint (consume until space or newline)
		let lang: string | null = null;
		const lang_start = this.#index;
		while (this.#index < this.#template.length) {
			const char_code = this.#template.charCodeAt(this.#index);
			if (char_code === SPACE || char_code === NEWLINE) {
				break;
			}
			this.#index++;
		}
		if (this.#index > lang_start) {
			lang = this.#template.slice(lang_start, this.#index);
		}

		// Skip any trailing spaces on opening fence line
		while (
			this.#index < this.#template.length &&
			this.#template.charCodeAt(this.#index) === SPACE
		) {
			this.#index++;
		}

		// Consume the newline after opening fence (first newline is consumed per spec)
		if (this.#index < this.#template.length && this.#template.charCodeAt(this.#index) === NEWLINE) {
			this.#index++;
		}

		// Collect content until closing fence
		const content_start = this.#index;
		const closing_fence = '`'.repeat(backtick_count);

		while (this.#index < this.#template.length) {
			// Check if we're at the closing fence (must be at start of line)
			if (this.#template.startsWith(closing_fence, this.#index)) {
				// Verify it's at column 0 by checking previous character
				const prev_char = this.#index > 0 ? this.#template.charCodeAt(this.#index - 1) : NEWLINE;
				if (prev_char === NEWLINE || this.#index === 0) {
					// Check if it's exactly the right number of backticks at line start
					let j = this.#index + backtick_count;
					// After closing fence, only whitespace and newline allowed
					while (j < this.#template.length && this.#template.charCodeAt(j) === SPACE) {
						j++;
					}
					if (j >= this.#template.length || this.#template.charCodeAt(j) === NEWLINE) {
						// Valid closing fence
						const content = this.#template.slice(content_start, this.#index);
						// Remove trailing newline if present (closing fence comes after a newline)
						const final_content = content.endsWith('\n') ? content.slice(0, -1) : content;

						// Consume closing fence
						this.#index += backtick_count;

						// Skip trailing whitespace on closing fence line
						while (
							this.#index < this.#template.length &&
							this.#template.charCodeAt(this.#index) === SPACE
						) {
							this.#index++;
						}

						// Don't consume the newline - let the main parse loop handle it

						return {
							type: 'Codeblock',
							lang,
							content: final_content,
							start,
							end: this.#index,
						};
					}
				}
			}
			this.#index++;
		}

		// Should not reach here if #match_code_block() validated correctly
		throw Error('Code block not properly closed');
	}
}
