/**
 * Reactive state for the mdz streaming renderer.
 *
 * Maintains a reactive tree of `MdzStreamNode` objects that Svelte 5 can
 * efficiently update. Opcodes from `MdzStreamParser` are applied via
 * `apply()` or `apply_batch()`, mutating the tree in place.
 *
 * @module
 */

import {DEV} from 'esm-env';

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
				if (DEV && this.#nodes.has(opcode.id)) {
					throw new Error(
						`MdzStreamState: duplicate open for id ${opcode.id} (node_type '${opcode.node_type}')`,
					);
				}
				const node = new MdzStreamNode(opcode.id, opcode.node_type);
				if (opcode.level !== undefined) node.level = opcode.level;
				if (opcode.name !== undefined) node.name = opcode.name;
				if (opcode.lang !== undefined) node.lang = opcode.lang;
				this.#nodes.set(opcode.id, node);

				const parent_id = this.#stack.length > 0 ? this.#stack[this.#stack.length - 1]! : null;
				this.#parents.set(opcode.id, parent_id);

				if (parent_id !== null) {
					const parent = this.#nodes.get(parent_id);
					if (DEV && !parent) {
						throw new Error(
							`MdzStreamState: parent id ${parent_id} on stack but missing from nodes`,
						);
					}
					if (parent) parent.children.push(node);
				} else {
					this.root.push(node);
				}

				this.#stack.push(opcode.id);
				break;
			}

			case 'close': {
				if (DEV) {
					if (!this.#nodes.has(opcode.id)) {
						throw new Error(`MdzStreamState: close for unknown id ${opcode.id}`);
					}
					if (!this.#stack.includes(opcode.id)) {
						throw new Error(`MdzStreamState: close for id ${opcode.id} which is not on the stack`);
					}
				}
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
				// cleanup: closed nodes have no further opcode interactions.
				// children are retained in the render tree via children arrays.
				this.#cleanup_node(opcode.id);
				break;
			}

			case 'text': {
				if (DEV && this.#nodes.has(opcode.id)) {
					throw new Error(
						`MdzStreamState: duplicate text for id ${opcode.id} (text_type '${opcode.text_type}')`,
					);
				}
				const node = new MdzStreamNode(opcode.id, opcode.text_type);
				node.content = opcode.content;
				node.text_type = opcode.text_type;
				this.#nodes.set(opcode.id, node);

				const parent_id = this.#stack.length > 0 ? this.#stack[this.#stack.length - 1]! : null;
				this.#parents.set(opcode.id, parent_id);

				if (parent_id !== null) {
					const parent = this.#nodes.get(parent_id);
					if (DEV && !parent) {
						throw new Error(
							`MdzStreamState: parent id ${parent_id} on stack but missing from nodes`,
						);
					}
					if (parent) parent.children.push(node);
				} else {
					this.root.push(node);
				}
				break;
			}

			case 'append_text': {
				if (DEV && !this.#nodes.has(opcode.id)) {
					throw new Error(`MdzStreamState: append_text for unknown id ${opcode.id}`);
				}
				const node = this.#nodes.get(opcode.id);
				if (node) {
					node.content += opcode.content;
				}
				break;
			}

			case 'void': {
				if (DEV && this.#nodes.has(opcode.id)) {
					throw new Error(
						`MdzStreamState: duplicate void for id ${opcode.id} (node_type '${opcode.node_type}')`,
					);
				}
				const node = new MdzStreamNode(opcode.id, opcode.node_type);
				this.#nodes.set(opcode.id, node);

				const parent_id = this.#stack.length > 0 ? this.#stack[this.#stack.length - 1]! : null;
				this.#parents.set(opcode.id, parent_id);

				if (parent_id !== null) {
					const parent = this.#nodes.get(parent_id);
					if (DEV && !parent) {
						throw new Error(
							`MdzStreamState: parent id ${parent_id} on stack but missing from nodes`,
						);
					}
					if (parent) parent.children.push(node);
				} else {
					this.root.push(node);
				}
				break;
			}

			case 'revert': {
				if (DEV) {
					if (!this.#nodes.has(opcode.id)) {
						throw new Error(`MdzStreamState: revert for unknown id ${opcode.id}`);
					}
					if (!this.#stack.includes(opcode.id)) {
						throw new Error(`MdzStreamState: revert for id ${opcode.id} which is not on the stack`);
					}
				}
				const node = this.#nodes.get(opcode.id);
				if (!node) break;

				const parent_id = this.#parents.get(opcode.id);
				const parent_children =
					parent_id !== null && parent_id !== undefined
						? this.#nodes.get(parent_id)?.children
						: this.root;

				if (!parent_children) {
					if (DEV) {
						throw new Error(
							`MdzStreamState: revert for id ${opcode.id} but parent has no children array`,
						);
					}
					break;
				}

				// find the node in parent's children
				let node_idx = -1;
				for (let i = 0; i < parent_children.length; i++) {
					if (parent_children[i]!.id === opcode.id) {
						node_idx = i;
						break;
					}
				}
				if (node_idx === -1) {
					if (DEV) {
						throw new Error(
							`MdzStreamState: revert for id ${opcode.id} but node not found in parent's children`,
						);
					}
					break;
				}

				// collect replacement content: literal delimiter text + re-parented children
				const replacement_nodes: Array<MdzStreamNode> = [];
				if (opcode.replacement_text) {
					const text_node = new MdzStreamNode(opcode.id, 'Text');
					text_node.content = opcode.replacement_text;
					text_node.text_type = 'Text';
					replacement_nodes.push(text_node);
				}
				for (const child of node.children) {
					replacement_nodes.push(child);
				}

				if (opcode.wrap_node_type != null && opcode.wrap_id != null) {
					if (DEV && this.#nodes.has(opcode.wrap_id)) {
						throw new Error(
							`MdzStreamState: revert wrap_id ${opcode.wrap_id} already exists in nodes`,
						);
					}
					// block-level revert: wrap content in a new container and push onto stack
					const wrapper = new MdzStreamNode(opcode.wrap_id, opcode.wrap_node_type);
					for (const rn of replacement_nodes) {
						wrapper.children.push(rn);
					}
					for (const child of node.children) {
						this.#parents.set(child.id, opcode.wrap_id);
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

	/** Remove a node and its descendants from the lookup maps. */
	#cleanup_node(id: MdzNodeId): void {
		const node = this.#nodes.get(id);
		if (node) {
			for (const child of node.children) {
				this.#cleanup_node(child.id);
			}
		}
		this.#nodes.delete(id);
		this.#parents.delete(id);
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
