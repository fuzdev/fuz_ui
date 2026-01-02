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
 * - **False negatives over false positives**: Strict syntax prevents accidentally
 *   interpreting plain text as formatting. When in doubt, treat as plain text.
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
	link_type: 'external' | 'internal'; // external: https/http, internal: /path
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

// Character codes for performance
const BACKTICK = 96; // `
const ASTERISK = 42; // *
const UNDERSCORE = 95; // _
const TILDE = 126; // ~
const NEWLINE = 10; // \n
const HYPHEN = 45; // -
const HASH = 35; // #
const SPACE = 32; // (space)
const TAB = 9; // \t
const LEFT_ANGLE = 60; // <
const RIGHT_ANGLE = 62; // >
const SLASH = 47; // /
const LEFT_BRACKET = 91; // [
const RIGHT_BRACKET = 93; // ]
const LEFT_PAREN = 40; // (
const RIGHT_PAREN = 41; // )
const COLON = 58; // :
const PERIOD = 46; // .
const COMMA = 44; // ,
const SEMICOLON = 59; // ;
const EXCLAMATION = 33; // !
const QUESTION = 63; // ?
// RFC 3986 URI characters
const DOLLAR = 36; // $
const PERCENT = 37; // %
const AMPERSAND = 38; // &
const APOSTROPHE = 39; // '
const PLUS = 43; // +
const EQUALS = 61; // =
const AT = 64; // @
// Character ranges
const A_UPPER = 65; // A
const Z_UPPER = 90; // Z
const A_LOWER = 97; // a
const Z_LOWER = 122; // z
const ZERO = 48; // 0
const NINE = 57; // 9
// mdz specification constants
const HR_HYPHEN_COUNT = 3; // Horizontal rule requires exactly 3 hyphens
const MIN_CODEBLOCK_BACKTICKS = 3; // Code blocks require minimum 3 backticks
const MAX_HEADING_LEVEL = 6; // Headings support levels 1-6
const HTTPS_PREFIX_LENGTH = 8; // Length of "https://"
const HTTP_PREFIX_LENGTH = 7; // Length of "http://"

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
	 */
	parse(): Array<MdzNode> {
		this.#nodes.length = 0;
		const root_nodes: Array<MdzNode> = [];
		const paragraph_children: Array<MdzNode> = [];

		// Check for block element at document start
		const start_block = this.#try_parse_block_element();
		if (start_block) {
			root_nodes.push(start_block);
		}

		while (this.#index < this.#template.length) {
			// Check for paragraph break (double newline)
			if (this.#is_at_paragraph_break()) {
				this.#flush_text();
				// Move flushed nodes to paragraph_children
				if (this.#nodes.length > 0) {
					paragraph_children.push(...this.#nodes);
					this.#nodes.length = 0;
				}
				// Wrap accumulated nodes in paragraph (or add single tag directly)
				if (paragraph_children.length > 0) {
					if (this.#is_single_tag(paragraph_children)) {
						// Single tag (component/element) - add directly without paragraph wrapper (MDX convention)
						const tag = paragraph_children.find(
							(n) => n.type === 'Component' || n.type === 'Element',
						)!;
						root_nodes.push(tag);
					} else {
						// Regular paragraph
						root_nodes.push({
							type: 'Paragraph',
							children: paragraph_children.slice(),
							start: paragraph_children[0]!.start,
							end: paragraph_children[paragraph_children.length - 1]!.end,
						});
					}
					paragraph_children.length = 0;
				}
				// Consume the paragraph break
				this.#eat('\n\n');

				// Check for block element after paragraph break
				const block = this.#try_parse_block_element();
				if (block) {
					root_nodes.push(block);
				}
			} else {
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
		}

		this.#flush_text();
		if (this.#nodes.length > 0) {
			paragraph_children.push(...this.#nodes);
		}

		// Wrap remaining nodes in final paragraph if any (or add single tag directly)
		if (paragraph_children.length > 0) {
			if (this.#is_single_tag(paragraph_children)) {
				// Single tag (component/element) - add directly without paragraph wrapper (MDX convention)
				const tag = paragraph_children.find((n) => n.type === 'Component' || n.type === 'Element')!;
				root_nodes.push(tag);
			} else {
				// Regular paragraph
				root_nodes.push({
					type: 'Paragraph',
					children: paragraph_children,
					start: paragraph_children[0]!.start,
					end: paragraph_children[paragraph_children.length - 1]!.end,
				});
			}
		}

		return root_nodes;
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
		const char_code = this.#current_char();

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
			if (!this.#is_valid_path_char(char_code)) {
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

		// Save parent accumulation state to avoid polluting component children with parent's accumulated text
		const saved_state = this.#save_accumulation_state();

		// Clear accumulation state for parsing component children
		this.#accumulated_text = '';
		this.#nodes.length = 0;

		// Consume <
		if (!this.#match('<')) {
			// Restore parent state before returning
			this.#restore_accumulation_state(saved_state);

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

		// Parse tag name
		const tag_name_start = this.#index;
		let tag_name_end = this.#index;

		// Tag name must start with a letter
		if (this.#index >= this.#template.length) {
			// Just a `<` at EOF - restore parent state
			this.#restore_accumulation_state(saved_state);
			return {
				type: 'Text',
				content: '<',
				start,
				end: this.#index,
			};
		}

		const first_char = this.#template.charCodeAt(this.#index);
		if (!this.#is_letter(first_char)) {
			// Not a valid tag, treat as text - restore parent state
			this.#restore_accumulation_state(saved_state);
			return {
				type: 'Text',
				content: '<',
				start,
				end: start + 1,
			};
		}

		// Collect tag name (letters, numbers, hyphens, underscores)
		while (this.#index < this.#template.length) {
			const char_code = this.#template.charCodeAt(this.#index);
			if (this.#is_tag_name_char(char_code)) {
				this.#index++;
			} else {
				break;
			}
		}

		tag_name_end = this.#index;
		const tag_name = this.#template.slice(tag_name_start, tag_name_end);

		if (tag_name.length === 0) {
			// Empty tag name - restore parent state
			this.#restore_accumulation_state(saved_state);
			return {
				type: 'Text',
				content: '<',
				start,
				end: start + 1,
			};
		}

		// Determine if this is a Component (uppercase) or Element (lowercase)
		const first_char_code = tag_name.charCodeAt(0);
		const is_component = first_char_code >= A_UPPER && first_char_code <= Z_UPPER;
		const node_type: 'Component' | 'Element' = is_component ? 'Component' : 'Element';

		// Skip whitespace after tag name (for future attribute support)
		while (
			this.#index < this.#template.length &&
			this.#template.charCodeAt(this.#index) === SPACE
		) {
			this.#index++;
		}

		// TODO: Parse attributes here

		// Check for self-closing />
		if (
			this.#index + 1 < this.#template.length &&
			this.#template.charCodeAt(this.#index) === SLASH &&
			this.#template.charCodeAt(this.#index + 1) === RIGHT_ANGLE
		) {
			this.#index += 2;

			// Restore parent state before returning
			this.#restore_accumulation_state(saved_state);

			return {
				type: node_type,
				name: tag_name,
				children: [],
				start,
				end: this.#index,
			};
		}

		// Check for closing >
		if (
			this.#index >= this.#template.length ||
			this.#template.charCodeAt(this.#index) !== RIGHT_ANGLE
		) {
			// Unclosed opening tag, treat as text - restore parent state
			this.#restore_accumulation_state(saved_state);

			this.#index = start + 1;
			return {
				type: 'Text',
				content: '<',
				start,
				end: this.#index,
			};
		}

		// Consume >
		this.#index++;

		// Parse children until closing tag
		const closing_tag = `</${tag_name}>`;
		const children: Array<MdzNode> = [];

		while (this.#index < this.#template.length) {
			// Check for closing tag
			if (this.#match(closing_tag)) {
				// Flush any accumulated text from children
				this.#flush_text();
				children.push(...this.#nodes);
				this.#nodes.length = 0;

				this.#index += closing_tag.length;

				// Restore parent state before returning
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

		// Unclosed tag - reached EOF without finding closing tag
		// Treat the opening tag as text - restore parent state
		this.#restore_accumulation_state(saved_state);

		this.#index = start + 1;
		return {
			type: 'Text',
			content: '<',
			start,
			end: this.#index,
		};
	}

	/**
	 * Check if nodes represent a single tag (component or element) with only whitespace text nodes.
	 * Used to determine if paragraph wrapping should be skipped (MDX convention).
	 * Returns true if there's exactly one Component/Element node and all other nodes are whitespace-only Text nodes.
	 */
	#is_single_tag(nodes: Array<MdzNode>): boolean {
		let found_tag = false;

		for (const node of nodes) {
			if (node.type === 'Component' || node.type === 'Element') {
				if (found_tag) return false; // Multiple tags
				found_tag = true;
			} else if (node.type === 'Text') {
				// Allow only whitespace-only text nodes
				if (node.content.trim() !== '') return false;
			} else {
				// Any other node type means not a single tag
				return false;
			}
		}

		return found_tag;
	}

	/**
	 * Try to parse a block element (heading, hr, or codeblock) at current position.
	 * Returns the parsed block node if a match is found, null otherwise.
	 *
	 * Block elements must:
	 * - Start at column 0 (no leading whitespace)
	 * - Be followed by blank line or EOF
	 *
	 * This helper eliminates duplication between document start and post-paragraph-break parsing.
	 */
	#try_parse_block_element(): MdzHeadingNode | MdzHrNode | MdzCodeblockNode | null {
		if (this.#match_heading()) {
			return this.#parse_heading();
		} else if (this.#match_hr()) {
			return this.#parse_hr();
		} else if (this.#match_code_block()) {
			return this.#parse_code_block();
		}
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
	 * Check if character code is a letter (A-Z, a-z).
	 */
	#is_letter(char_code: number): boolean {
		return (
			(char_code >= A_UPPER && char_code <= Z_UPPER) ||
			(char_code >= A_LOWER && char_code <= Z_LOWER)
		);
	}

	/**
	 * Check if character code is valid for tag name (letter, number, hyphen, underscore).
	 */
	#is_tag_name_char(char_code: number): boolean {
		return (
			this.#is_letter(char_code) ||
			(char_code >= ZERO && char_code <= NINE) ||
			char_code === HYPHEN ||
			char_code === UNDERSCORE
		);
	}

	/**
	 * Check if character is part of a word for word boundary detection.
	 * Used to prevent intraword emphasis with `_` and `~` delimiters.
	 *
	 * Formatting delimiters (`*`, `_`, `~`) are NOT word characters - they're transparent.
	 * Only alphanumeric characters (A-Z, a-z, 0-9) are considered word characters.
	 *
	 * This prevents false positives with snake_case identifiers while allowing
	 * adjacent formatting like `**bold**_italic_`.
	 *
	 * @param char_code - Character code to check
	 */
	#is_word_char(char_code: number): boolean {
		// Formatting delimiters are never word chars (transparent for boundary checks)
		if (char_code === ASTERISK || char_code === UNDERSCORE || char_code === TILDE) {
			return false;
		}

		// Alphanumeric characters are word chars for all delimiters
		return (
			(char_code >= A_UPPER && char_code <= Z_UPPER) ||
			(char_code >= A_LOWER && char_code <= Z_LOWER) ||
			(char_code >= ZERO && char_code <= NINE)
		);
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
			if (this.#is_word_char(prev)) {
				return false;
			}
		}

		if (check_after && index < this.#template.length) {
			const next = this.#template.charCodeAt(index);
			// If followed by word char, not at boundary
			if (this.#is_word_char(next)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Check if character code is valid in URI path per RFC 3986.
	 * Validates against the `pchar` production plus path/query/fragment separators.
	 *
	 * Valid characters:
	 * - unreserved: A-Z a-z 0-9 - . _ ~
	 * - sub-delims: ! $ & ' ( ) * + , ; =
	 * - path allowed: : @
	 * - separators: / ? #
	 * - percent-encoding: %
	 */
	#is_valid_path_char(char_code: number): boolean {
		return (
			(char_code >= A_UPPER && char_code <= Z_UPPER) ||
			(char_code >= A_LOWER && char_code <= Z_LOWER) ||
			(char_code >= ZERO && char_code <= NINE) ||
			// unreserved: - . _ ~
			char_code === HYPHEN ||
			char_code === PERIOD ||
			char_code === UNDERSCORE ||
			char_code === TILDE ||
			// sub-delims: ! $ & ' ( ) * + , ; =
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
			// path allowed: : @
			char_code === COLON ||
			char_code === AT ||
			// separators: / ? #
			char_code === SLASH ||
			char_code === QUESTION ||
			char_code === HASH ||
			// percent-encoding: %
			char_code === PERCENT
		);
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
	 * Check if current position is the start of an internal path (starts with /).
	 */
	#is_at_internal_path(): boolean {
		if (this.#template.charCodeAt(this.#index) !== SLASH) {
			return false;
		}
		// Check previous character - must be whitespace or start of string
		// (to avoid matching / within relative paths like ./a/b or ../a/b)
		if (this.#index > 0) {
			const prev_char = this.#template.charCodeAt(this.#index - 1);
			if (prev_char !== SPACE && prev_char !== NEWLINE && prev_char !== TAB) {
				return false;
			}
		}
		// Must have at least one more character after /, and it must NOT be:
		// - another / (to avoid matching // which is used for comments or protocol-relative URLs)
		// - whitespace (a bare / followed by space is not a useful link)
		if (this.#index + 1 >= this.#template.length) {
			return false;
		}
		const next_char = this.#template.charCodeAt(this.#index + 1);
		return next_char !== SLASH && next_char !== SPACE && next_char !== NEWLINE;
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
			const char_code = this.#current_char();
			if (char_code === SPACE || char_code === NEWLINE || !this.#is_valid_path_char(char_code)) {
				break;
			}
			this.#index++;
		}

		let reference = this.#template.slice(start, this.#index);

		// Apply GFM trailing punctuation trimming with balanced parentheses
		reference = this.#trim_trailing_punctuation(reference);

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
	 * Parse auto-detected internal path (starts with /).
	 * Uses RFC 3986 whitelist validation for valid URI characters.
	 */
	#parse_auto_link_internal(): MdzLinkNode {
		const start = this.#index;

		// Collect path characters using RFC 3986 whitelist
		// Stop at whitespace or any character invalid in URIs
		while (this.#index < this.#template.length) {
			const char_code = this.#current_char();
			if (char_code === SPACE || char_code === NEWLINE || !this.#is_valid_path_char(char_code)) {
				break;
			}
			this.#index++;
		}

		let reference = this.#template.slice(start, this.#index);

		// Apply GFM trailing punctuation trimming
		reference = this.#trim_trailing_punctuation(reference);

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
	 * Trim trailing punctuation from URL/path per RFC 3986 and GFM rules.
	 * - Trims simple trailing: .,;:!?]
	 * - Balanced logic for () only (valid in path components)
	 * - Invalid chars like [] {} are already stopped by whitelist, but ] trimmed as fallback
	 *
	 * Optimized to avoid O(n²) string slicing - tracks end index and slices once at the end.
	 */
	#trim_trailing_punctuation(url: string): string {
		let end = url.length;

		// Trim simple trailing punctuation (] as fallback - whitelist should prevent it)
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
		// Count parentheses in the trimmed portion
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

		// Return original string if no trimming, otherwise slice once
		return end === url.length ? url : url.slice(0, end);
	}

	/**
	 * Parse plain text until special character encountered.
	 * Preserves all whitespace (except paragraph breaks handled separately).
	 * Detects and delegates to URL/path parsing when encountered.
	 */
	#parse_text(): MdzTextNode | MdzLinkNode {
		const start = this.#index;

		// Check for URL or internal path at current position
		if (this.#is_at_url()) {
			return this.#parse_auto_link_url();
		}
		if (this.#is_at_internal_path()) {
			return this.#parse_auto_link_internal();
		}

		while (this.#index < this.#template.length) {
			const char_code = this.#current_char();

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

			// Check for URL or internal path mid-text
			if (this.#is_at_url() || this.#is_at_internal_path()) {
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
	 * Get character code at current index, or -1 if at EOF.
	 */
	#current_char(): number {
		return this.#index < this.#template.length ? this.#template.charCodeAt(this.#index) : -1;
	}

	/**
	 * Check if current position is at a paragraph break (double newline).
	 */
	#is_at_paragraph_break(): boolean {
		return (
			this.#current_char() === NEWLINE &&
			this.#index + 1 < this.#template.length &&
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
	 * HR must be exactly `---` at column 0, followed by blank line or EOF.
	 *
	 * Blank line requirement rationale:
	 * Prevents block elements from accidentally consuming following content.
	 * Without this, `---` followed by regular text would create an hr and treat
	 * the next line as a new paragraph, which could be surprising. The blank line
	 * makes block element boundaries explicit and predictable.
	 */
	#match_hr(): boolean {
		let i = this.#index;

		// Must start at column 0 (no leading whitespace)
		if (i < this.#template.length && this.#template.charCodeAt(i) === SPACE) {
			return false;
		}

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
				// Found newline - check if followed by another newline (blank line) or EOF
				const next_i = i + 1;
				if (next_i >= this.#template.length) {
					return true; // hr followed by newline + EOF
				}
				if (this.#template.charCodeAt(next_i) === NEWLINE) {
					return true; // hr followed by blank line
				}
				return false; // hr followed by single newline + content
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
	 * followed by blank line or EOF.
	 *
	 * Blank line requirement rationale:
	 * Ensures headings are visually and semantically separate from following content.
	 * Without this, `# Heading\nText` would be ambiguous - is the text part of the
	 * heading or a new paragraph? The blank line makes document structure explicit.
	 */
	#match_heading(): boolean {
		let i = this.#index;

		// Must start at column 0 (no leading whitespace)
		if (i < this.#template.length && this.#template.charCodeAt(i) === SPACE) {
			return false;
		}

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

		// Must have non-whitespace content after the space (not just whitespace until newline)
		let has_content = false;
		while (i < this.#template.length && this.#template.charCodeAt(i) !== NEWLINE) {
			const char_code = this.#template.charCodeAt(i);
			if (char_code !== SPACE && char_code !== TAB) {
				has_content = true;
			}
			i++;
		}

		if (!has_content) {
			return false; // heading with only whitespace, treat as plain text
		}

		// At this point we're at newline or EOF
		// Check for blank line after (newline + newline) or EOF
		if (i >= this.#template.length) {
			return true; // heading at EOF
		}

		// Must have newline
		if (this.#template.charCodeAt(i) !== NEWLINE) {
			return false;
		}

		const next_i = i + 1;
		if (next_i >= this.#template.length) {
			return true; // heading followed by newline + EOF
		}

		if (this.#template.charCodeAt(next_i) === NEWLINE) {
			return true; // heading followed by blank line
		}

		return false; // heading followed by single newline + content
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

		// Parse inline content until newline
		const content_nodes: Array<MdzNode> = [];

		while (this.#index < this.#template.length) {
			const char_code = this.#template.charCodeAt(this.#index);

			if (char_code === NEWLINE) {
				break;
			}

			const node = this.#parse_node();
			if (node.type === 'Text') {
				// Check if text node includes a newline (since #parse_text doesn't stop at single newlines)
				// If so, trim it and move index back
				const newline_index = node.content.indexOf('\n');
				if (newline_index !== -1) {
					const trimmed_content = node.content.slice(0, newline_index);
					if (trimmed_content) {
						this.#accumulate_text(trimmed_content, node.start);
					}
					this.#index = node.start + newline_index;
					break;
				} else {
					this.#accumulate_text(node.content, node.start);
				}
			} else {
				this.#flush_text();
				content_nodes.push(...this.#nodes);
				this.#nodes.length = 0;
				content_nodes.push(node);
			}
		}

		this.#flush_text();
		content_nodes.push(...this.#nodes);
		this.#nodes.length = 0;

		// Don't consume the newline - let the main parse loop handle it

		return {
			type: 'Heading',
			level: level as 1 | 2 | 3 | 4 | 5 | 6,
			children: content_nodes,
			start,
			end: this.#index,
		};
	}

	/**
	 * Check if current position matches a code block.
	 * Code block must be 3+ backticks at column 0, followed by blank line or EOF.
	 * Empty code blocks (no content) are treated as invalid.
	 *
	 * Blank line requirement rationale:
	 * Separates code blocks from following content to prevent ambiguity.
	 * Codeblocks are distinct semantic units that should be visually isolated.
	 * The blank line makes it explicit where the code block ends and regular
	 * content begins, following the "explicit over implicit" design principle.
	 */
	#match_code_block(): boolean {
		let i = this.#index;

		// Must start at column 0 (no leading whitespace)
		if (i < this.#template.length && this.#template.charCodeAt(i) === SPACE) {
			return false;
		}

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

					// Check if followed by blank line or EOF
					const next_j = j + 1;
					if (next_j >= this.#template.length) {
						return true; // code block followed by newline + EOF
					}
					if (this.#template.charCodeAt(next_j) === NEWLINE) {
						return true; // code block followed by blank line
					}
					return false; // code block followed by single newline + content
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

/**
 * Check if a string is a URL (`https://` or `http://`).
 * Requires at least one valid character after the protocol.
 * Rejects whitespace and characters that can't start a valid hostname.
 */
const URL_PATTERN = /^https?:\/\/[^\s)\]}<>.,:/?#!]/;
export const mdz_is_url = (s: string): boolean => URL_PATTERN.test(s);
