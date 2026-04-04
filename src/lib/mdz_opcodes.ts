/**
 * Opcode types for the mdz streaming parser.
 *
 * Opcodes are serializable rendering instructions emitted by `MdzStreamParser`.
 * They tell a renderer what to do next — open a container, append text, close it,
 * or revert an optimistic assumption. Target-agnostic: works for HTML, Svelte, PDF, etc.
 *
 * The parser makes optimistic assumptions about ambiguous syntax (e.g., `**` is probably bold)
 * and emits `revert` opcodes to correct when wrong. This enables true streaming rendering
 * without ever re-parsing.
 *
 * @module
 */

/**
 * Unique monotonic identifier for each node created by the parser.
 * IDs are never reused within a parser instance.
 */
export type MdzNodeId = number;

/** Node types that can be opened as containers. */
export type MdzContainerNodeType =
	| 'Paragraph'
	| 'Bold'
	| 'Italic'
	| 'Strikethrough'
	| 'Link'
	| 'Heading'
	| 'Element'
	| 'Component'
	| 'Codeblock';

/** Node types for self-contained leaf elements. */
export type MdzVoidNodeType = 'Hr';

/** Discriminant for leaf text nodes. */
export type MdzTextNodeType = 'Text' | 'Code';

/**
 * Open a container node. The renderer starts a new element/wrapper.
 * Children are subsequent opcodes until the matching `close`.
 */
export interface MdzOpcodeOpen {
	type: 'open';
	id: MdzNodeId;
	node_type: MdzContainerNodeType;
	/** Byte offset in the full input where the opening delimiter begins. */
	start: number;
	/** Heading level (1-6). Present when `node_type` is `'Heading'`. */
	level?: 1 | 2 | 3 | 4 | 5 | 6;
	/** Tag name. Present when `node_type` is `'Element'` or `'Component'`. */
	name?: string;
	/** Language hint. Present when `node_type` is `'Codeblock'`. */
	lang?: string | null;
}

/**
 * Close a previously opened container node.
 * Carries deferred metadata that wasn't known at open time.
 */
export interface MdzOpcodeClose {
	type: 'close';
	id: MdzNodeId;
	/** Byte offset in the full input immediately after the closing delimiter. */
	end: number;
	/** Link URL/path, resolved when `](url)` completes. */
	reference?: string;
	/** Link type, resolved alongside `reference`. */
	link_type?: 'external' | 'internal';
	/** Heading slug, computed from full heading content. */
	heading_id?: string;
}

/**
 * Create a leaf text or code node.
 * The parent is implicit — the innermost open container on the renderer's stack.
 */
export interface MdzOpcodeText {
	type: 'text';
	id: MdzNodeId;
	content: string;
	text_type: MdzTextNodeType;
	/** Byte offset where this node begins (for Code, the opening backtick). */
	start: number;
	/** Byte offset immediately after this node ends (for Code, after the closing backtick). */
	end: number;
}

/**
 * Append content to an existing text node.
 * Streaming optimization — avoids creating a new node per chunk
 * during plain text runs.
 */
export interface MdzOpcodeAppendText {
	type: 'append_text';
	id: MdzNodeId;
	content: string;
}

/**
 * Create a self-contained leaf node (e.g., horizontal rule).
 * Inserted as a child of the innermost open container, or at root level.
 */
export interface MdzOpcodeVoid {
	type: 'void';
	id: MdzNodeId;
	node_type: MdzVoidNodeType;
	/** Byte offset in the full input where this element begins. */
	start: number;
	/** Byte offset immediately after this element ends. */
	end: number;
}

/**
 * Undo an optimistic open. Removes the container wrapper,
 * inserts `replacement_text` as literal text at the container's position,
 * and re-parents the container's children to the grandparent.
 *
 * When `wrap_node_type` and `wrap_id` are set, the replacement text and
 * re-parented children are wrapped in a new container of the given type
 * instead of being placed directly at the grandparent level. The wrapper
 * is pushed onto the consumer's stack (open for future content). This is
 * used for block-level reverts (e.g., codeblock → paragraph) where the
 * grandparent is root and content needs a container.
 */
export interface MdzOpcodeRevert {
	type: 'revert';
	id: MdzNodeId;
	/** The delimiter text to emit as literal content (e.g., `"**"`, `"["`, `"<Tag>"`). */
	replacement_text: string;
	/** Byte offset of the original opening delimiter in the full input. */
	start: number;
	/** Wrap replacement text and re-parented children in a new container of this type. */
	wrap_node_type?: MdzContainerNodeType;
	/** ID for the wrapper node. Required when `wrap_node_type` is set. */
	wrap_id?: MdzNodeId;
}

/** Discriminated union of all mdz opcodes. */
export type MdzOpcode =
	| MdzOpcodeOpen
	| MdzOpcodeClose
	| MdzOpcodeText
	| MdzOpcodeAppendText
	| MdzOpcodeVoid
	| MdzOpcodeRevert;
