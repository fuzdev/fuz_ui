/**
 * mdz token parser — consumes a `MdzToken[]` stream to build the `MdzNode[]` AST.
 *
 * Phase 2 of the two-phase lexer+parser alternative to the single-pass parser
 * in `mdz.ts`. Phase 1 (lexer) is in `mdz_lexer.ts`.
 *
 * @module
 */

import type {
	MdzNode,
	MdzTextNode,
	MdzBoldNode,
	MdzItalicNode,
	MdzStrikethroughNode,
	MdzLinkNode,
	MdzHeadingNode,
	MdzElementNode,
	MdzComponentNode,
} from './mdz.js';
import {extract_single_tag, mdz_heading_id} from './mdz_helpers.js';
import {
	MdzLexer,
	type MdzToken,
	type MdzTokenHeadingStart,
	type MdzTokenBoldOpen,
	type MdzTokenItalicOpen,
	type MdzTokenStrikethroughOpen,
	type MdzTokenLinkTextOpen,
	type MdzTokenLinkRef,
	type MdzTokenAutolink,
	type MdzTokenTagOpen,
	type MdzTokenTagSelfClose,
} from './mdz_lexer.js';

/**
 * Parses text to an array of `MdzNode` using a two-phase lexer+parser approach.
 */
export const mdz_parse_lexer = (text: string): Array<MdzNode> => {
	const tokens = new MdzLexer(text).tokenize();
	return new MdzTokenParser(tokens).parse();
};

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

		const merged = this.#merge_adjacent_text(children);
		const end = merged.length > 0 ? merged[merged.length - 1]!.end : start + level + 1;

		return {type: 'Heading', level, id: mdz_heading_id(merged), children: merged, start, end};
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
			if (node) this.#push_merging_text(children, node);
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
			if (node) this.#push_merging_text(children, node);
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
			if (node) this.#push_merging_text(children, node);
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
			if (node) this.#push_merging_text(children, node);
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
			if (t.type === 'tag_close' && t.name === tag_name) {
				this.#index++;
				return {type: node_type, name: tag_name, children, start, end: t.end};
			}
			const node = this.#parse_inline();
			if (node) this.#push_merging_text(children, node);
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
		const single_tag = extract_single_tag(paragraph_children);
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

	/**
	 * Push a node to a children array, merging adjacent Text nodes.
	 */
	#push_merging_text(children: Array<MdzNode>, node: MdzNode): void {
		const prev = children[children.length - 1];
		if (prev?.type === 'Text' && node.type === 'Text') {
			prev.content += node.content;
			prev.end = node.end;
		} else {
			children.push(node);
		}
	}

	#merge_adjacent_text(nodes: Array<MdzNode>): Array<MdzNode> {
		if (nodes.length <= 1) return nodes;

		// fast path: check if any merging is actually needed
		let needs_merge = false;
		for (let i = 1; i < nodes.length; i++) {
			if (nodes[i - 1]!.type === 'Text' && nodes[i]!.type === 'Text') {
				needs_merge = true;
				break;
			}
		}
		if (!needs_merge) return nodes;

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
