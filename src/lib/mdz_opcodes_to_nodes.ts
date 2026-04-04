/**
 * Converts a stream of mdz opcodes to the `MdzNode[]` tree representation.
 *
 * Stack-based replay: `open` pushes a frame, `close` pops and builds the node,
 * `text`/`void` create leaf nodes, `append_text` extends the last text node,
 * `revert` undoes an optimistic open and re-parents children.
 *
 * The output is identical to `mdz_parse()` from `mdz.ts`, enabling
 * validation of the streaming parser against the existing fixture suite.
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
	MdzParagraphNode,
	MdzHeadingNode,
	MdzHrNode,
	MdzCodeblockNode,
	MdzElementNode,
	MdzComponentNode,
	MdzCodeNode,
} from './mdz.js';
import type {MdzOpcode, MdzNodeId} from './mdz_opcodes.js';
import {extract_single_tag, mdz_heading_id} from './mdz_helpers.js';

interface StackFrame {
	id: MdzNodeId;
	node_type: string;
	children: Array<MdzNode>;
	// metadata from open opcode
	level?: number;
	name?: string;
	lang?: string | null;
	// metadata from close opcode (deferred)
	reference?: string;
	link_type?: 'external' | 'internal';
	heading_id?: string;
}

/**
 * Convert an array of mdz opcodes to the `MdzNode[]` tree.
 * Produces output identical to `mdz_parse()`.
 */
export const mdz_opcodes_to_nodes = (opcodes: Array<MdzOpcode>): Array<MdzNode> => {
	const root: Array<MdzNode> = [];
	const stack: Array<StackFrame> = [];
	// index node IDs to their text content (for append_text)
	const text_nodes: Array<MdzTextNode | MdzCodeNode | undefined> = [];

	const target = (): Array<MdzNode> => {
		return stack.length > 0 ? stack[stack.length - 1]!.children : root;
	};

	for (const op of opcodes) {
		switch (op.type) {
			case 'open': {
				stack.push({
					id: op.id,
					node_type: op.node_type,
					children: [],
					level: op.level,
					name: op.name,
					lang: op.lang,
				});
				break;
			}

			case 'close': {
				const frame = stack.pop();
				if (!frame) break;

				// apply deferred metadata
				if (op.reference !== undefined) frame.reference = op.reference;
				if (op.link_type !== undefined) frame.link_type = op.link_type;
				if (op.heading_id !== undefined) frame.heading_id = op.heading_id;

				const node = build_node(frame);
				if (node) target().push(node);
				break;
			}

			case 'text': {
				const node: MdzTextNode | MdzCodeNode =
					op.text_type === 'Code'
						? ({type: 'Code', content: op.content, start: 0, end: 0} as MdzCodeNode)
						: ({type: 'Text', content: op.content, start: 0, end: 0} as MdzTextNode);
				text_nodes[op.id] = node;
				target().push(node);
				break;
			}

			case 'append_text': {
				const existing = text_nodes[op.id];
				if (existing) {
					existing.content += op.content;
				}
				break;
			}

			case 'void': {
				target().push({type: 'Hr', start: 0, end: 0} as MdzHrNode);
				break;
			}

			case 'revert': {
				// find and remove the reverted node's frame from the stack
				let reverted_frame: StackFrame | null = null;
				for (let i = stack.length - 1; i >= 0; i--) {
					if (stack[i]!.id === op.id) {
						reverted_frame = stack.splice(i, 1)[0]!;
						break;
					}
				}

				if (reverted_frame) {
					const dest = target();
					// insert replacement text
					if (op.replacement_text) {
						dest.push({
							type: 'Text',
							content: op.replacement_text,
							start: 0,
							end: 0,
						} as MdzTextNode);
					}
					// re-parent children
					for (const child of reverted_frame.children) {
						dest.push(child);
					}
				}
				break;
			}
		}
	}

	return root;
};

/**
 * Build an `MdzNode` from a completed stack frame.
 */
const build_node = (frame: StackFrame): MdzNode | null => {
	switch (frame.node_type) {
		case 'Paragraph': {
			const children = merge_adjacent_text(frame.children);
			if (children.length === 0) return null;

			// extract single tag (MDX convention)
			const single_tag = extract_single_tag(children);
			if (single_tag) return single_tag;

			return {
				type: 'Paragraph',
				children,
				start: children[0]!.start,
				end: children[children.length - 1]!.end,
			} as MdzParagraphNode;
		}

		case 'Heading': {
			const children = merge_adjacent_text(frame.children);
			const id = frame.heading_id ?? mdz_heading_id(children);
			return {
				type: 'Heading',
				level: frame.level ?? 1,
				id,
				children,
				start: 0,
				end: 0,
			} as MdzHeadingNode;
		}

		case 'Bold':
			return {
				type: 'Bold',
				children: merge_adjacent_text(frame.children),
				start: 0,
				end: 0,
			} as MdzBoldNode;

		case 'Italic':
			return {
				type: 'Italic',
				children: merge_adjacent_text(frame.children),
				start: 0,
				end: 0,
			} as MdzItalicNode;

		case 'Strikethrough':
			return {
				type: 'Strikethrough',
				children: merge_adjacent_text(frame.children),
				start: 0,
				end: 0,
			} as MdzStrikethroughNode;

		case 'Link':
			return {
				type: 'Link',
				reference: frame.reference ?? '',
				children: merge_adjacent_text(frame.children),
				link_type: frame.link_type ?? 'internal',
				start: 0,
				end: 0,
			} as MdzLinkNode;

		case 'Codeblock':
			// code block content is in children as text
			// eslint-disable-next-line no-case-declarations
			const content = frame.children
				.filter((c): c is MdzTextNode => c.type === 'Text')
				.map((c) => c.content)
				.join('');
			return {
				type: 'Codeblock',
				lang: frame.lang ?? null,
				content,
				start: 0,
				end: 0,
			} as MdzCodeblockNode;

		case 'Element':
			return {
				type: 'Element',
				name: frame.name ?? '',
				children: merge_adjacent_text(frame.children),
				start: 0,
				end: 0,
			} as MdzElementNode;

		case 'Component':
			return {
				type: 'Component',
				name: frame.name ?? '',
				children: merge_adjacent_text(frame.children),
				start: 0,
				end: 0,
			} as MdzComponentNode;

		default:
			return null;
	}
};

/**
 * Merge adjacent Text nodes into single nodes.
 * Fast path: returns the original array when no adjacent text pairs exist.
 */
const merge_adjacent_text = (nodes: Array<MdzNode>): Array<MdzNode> => {
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
	let pending: MdzTextNode | null = null;

	for (const node of nodes) {
		if (node.type === 'Text') {
			if (pending) {
				pending = {
					type: 'Text',
					content: pending.content + node.content,
					start: pending.start,
					end: node.end,
				};
			} else {
				pending = {...node};
			}
		} else {
			if (pending) {
				merged.push(pending);
				pending = null;
			}
			merged.push(node);
		}
	}

	if (pending) merged.push(pending);

	return merged;
};
