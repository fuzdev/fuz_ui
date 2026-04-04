/**
 * Reactive state for the mdz streaming renderer.
 *
 * Maintains a reactive tree of `MdzStreamNode` objects that Svelte 5 can
 * efficiently update. Opcodes from `MdzStreamParser` are applied via
 * `apply()` or `apply_batch()`, mutating the tree in place.
 *
 * @module
 */

import type {MdzNodeId, MdzOpcode} from './mdz_opcodes.js';

/**
 * A reactive node in the stream renderer tree.
 * Fields are `$state` so Svelte re-renders only what changes.
 */
export class MdzStreamNode {
	id: MdzNodeId;
	type: string;
	content: string = $state('');
	children: Array<MdzStreamNode> = $state([]);
	// metadata
	level?: number;
	reference?: string = $state();
	link_type?: string = $state();
	name?: string;
	lang?: string | null;
	heading_id?: string = $state();
	text_type?: string; // 'Text' | 'Code'

	constructor(id: MdzNodeId, type: string) {
		this.id = id;
		this.type = type;
	}
}

/**
 * Reactive state manager for streaming mdz content.
 * Apply opcodes to incrementally build and update the render tree.
 */
export class MdzStreamState {
	root: Array<MdzStreamNode> = $state([]);

	/** Node lookup by ID. */
	#nodes = new Map<MdzNodeId, MdzStreamNode>();

	/** Parent tracking for re-parenting during revert. */
	#parents = new Map<MdzNodeId, MdzNodeId | null>();

	/** Stack of open container IDs (for knowing current parent). */
	#stack: Array<MdzNodeId> = [];

	/**
	 * Apply a single opcode.
	 */
	apply(opcode: MdzOpcode): void {
		switch (opcode.type) {
			case 'open': {
				const node = new MdzStreamNode(opcode.id, opcode.node_type);
				if (opcode.level !== undefined) node.level = opcode.level;
				if (opcode.name !== undefined) node.name = opcode.name;
				if (opcode.lang !== undefined) node.lang = opcode.lang;
				this.#nodes.set(opcode.id, node);

				const parent_id = this.#stack.length > 0 ? this.#stack[this.#stack.length - 1]! : null;
				this.#parents.set(opcode.id, parent_id);

				if (parent_id !== null) {
					const parent = this.#nodes.get(parent_id);
					if (parent) parent.children.push(node);
				} else {
					this.root.push(node);
				}

				this.#stack.push(opcode.id);
				break;
			}

			case 'close': {
				const node = this.#nodes.get(opcode.id);
				if (node) {
					// apply deferred metadata
					if (opcode.reference !== undefined) node.reference = opcode.reference;
					if (opcode.link_type !== undefined) node.link_type = opcode.link_type;
					if (opcode.heading_id !== undefined) node.heading_id = opcode.heading_id;
				}
				// pop from stack
				const idx = this.#stack.lastIndexOf(opcode.id);
				if (idx !== -1) this.#stack.splice(idx, 1);
				break;
			}

			case 'text': {
				const node = new MdzStreamNode(opcode.id, opcode.text_type);
				node.content = opcode.content;
				node.text_type = opcode.text_type;
				this.#nodes.set(opcode.id, node);

				const parent_id = this.#stack.length > 0 ? this.#stack[this.#stack.length - 1]! : null;
				this.#parents.set(opcode.id, parent_id);

				if (parent_id !== null) {
					const parent = this.#nodes.get(parent_id);
					if (parent) parent.children.push(node);
				} else {
					this.root.push(node);
				}
				break;
			}

			case 'append_text': {
				const node = this.#nodes.get(opcode.id);
				if (node) {
					node.content += opcode.content;
				}
				break;
			}

			case 'void': {
				const node = new MdzStreamNode(opcode.id, opcode.node_type);
				this.#nodes.set(opcode.id, node);

				const parent_id = this.#stack.length > 0 ? this.#stack[this.#stack.length - 1]! : null;
				this.#parents.set(opcode.id, parent_id);

				if (parent_id !== null) {
					const parent = this.#nodes.get(parent_id);
					if (parent) parent.children.push(node);
				} else {
					this.root.push(node);
				}
				break;
			}

			case 'revert': {
				const node = this.#nodes.get(opcode.id);
				if (!node) break;

				const parent_id = this.#parents.get(opcode.id);
				const parent_children =
					parent_id !== null && parent_id !== undefined
						? this.#nodes.get(parent_id)?.children
						: this.root;

				if (!parent_children) break;

				// find the node in parent's children
				let node_idx = -1;
				for (let i = 0; i < parent_children.length; i++) {
					if (parent_children[i]!.id === opcode.id) {
						node_idx = i;
						break;
					}
				}
				if (node_idx === -1) break;

				// collect replacement text + re-parented children
				const replacement_nodes: Array<MdzStreamNode> = [];
				if (opcode.replacement_text) {
					const text_node = new MdzStreamNode(-1, 'Text');
					text_node.content = opcode.replacement_text;
					text_node.text_type = 'Text';
					replacement_nodes.push(text_node);
				}
				for (const child of node.children) {
					replacement_nodes.push(child);
				}

				if (opcode.wrap_node_type != null && opcode.wrap_id != null) {
					// block-level revert: wrap content in a new container and push onto stack
					const wrapper = new MdzStreamNode(opcode.wrap_id, opcode.wrap_node_type);
					for (const rn of replacement_nodes) {
						wrapper.children.push(rn);
						this.#parents.set(rn.id, opcode.wrap_id);
					}
					this.#nodes.set(opcode.wrap_id, wrapper);
					this.#parents.set(opcode.wrap_id, parent_id ?? null);
					parent_children.splice(node_idx, 1, wrapper);
					this.#stack.push(opcode.wrap_id);
				} else {
					// inline revert: re-parent directly to grandparent
					for (const child of node.children) {
						this.#parents.set(child.id, parent_id ?? null);
					}
					parent_children.splice(node_idx, 1, ...replacement_nodes);
				}

				// remove reverted node from stack
				const stack_idx = this.#stack.lastIndexOf(opcode.id);
				if (stack_idx !== -1) this.#stack.splice(stack_idx, 1);

				// cleanup
				this.#nodes.delete(opcode.id);
				this.#parents.delete(opcode.id);
				break;
			}
		}
	}

	/**
	 * Apply a batch of opcodes.
	 */
	apply_batch(opcodes: Array<MdzOpcode>): void {
		for (const op of opcodes) {
			this.apply(op);
		}
	}

	/**
	 * Reset the state (clear all nodes).
	 */
	reset(): void {
		this.root = [];
		this.#nodes.clear();
		this.#parents.clear();
		this.#stack = [];
	}
}
