/**
 * Converts parsed `MdzNode` arrays to Svelte markup strings.
 *
 * Used by the `svelte_preprocess_mdz` preprocessor to expand static `<Mdz content="...">` usages
 * into pre-rendered Svelte markup at build time. The output for each node type matches what
 * `MdzNodeView.svelte` renders at runtime, so precompiled and runtime rendering are identical.
 *
 * @module
 */

import {UnreachableError} from '@fuzdev/fuz_util/error.js';

import type {MdzNode} from './mdz.js';

/**
 * Result of converting `MdzNode` arrays to Svelte markup.
 */
export interface MdzToSvelteResult {
	/** Generated Svelte markup string. */
	markup: string;

	/** Required imports: `Map<local_name, {path, kind}>`. */
	imports: Map<string, {path: string; kind: 'default' | 'named'}>;

	/** Whether content references unconfigured Component or Element tags. */
	has_unconfigured_tags: boolean;
}

/**
 * Converts an array of `MdzNode` to a Svelte markup string.
 *
 * Each node type produces output matching what `MdzNodeView.svelte` renders at runtime.
 * Collects required imports and flags unconfigured component/element references.
 *
 * @param nodes Parsed mdz nodes to render.
 * @param components Component name to import path mapping (e.g., `{Alert: '$lib/Alert.svelte'}`).
 *   If content references a component not in this map, `has_unconfigured_tags` is set.
 * @param elements Allowed HTML element names (e.g., `new Set(['aside', 'details'])`).
 *   If content references an element not in this set, `has_unconfigured_tags` is set.
 */
export const mdz_to_svelte = (
	nodes: Array<MdzNode>,
	components: Record<string, string>,
	elements: ReadonlySet<string>,
): MdzToSvelteResult => {
	const imports: Map<string, {path: string; kind: 'default' | 'named'}> = new Map();
	let has_unconfigured_tags = false;

	const render_nodes = (children: Array<MdzNode>): string => {
		return children.map((child) => render_node(child)).join('');
	};

	const render_node = (node: MdzNode): string => {
		switch (node.type) {
			case 'Text':
				return escape_svelte_text(node.content);

			case 'Code':
				imports.set('DocsLink', {path: '@fuzdev/fuz_ui/DocsLink.svelte', kind: 'default'});
				return `<DocsLink reference={'${escape_js_string(node.content)}'} />`;

			case 'Codeblock': {
				imports.set('Code', {path: '@fuzdev/fuz_code/Code.svelte', kind: 'default'});
				const lang_attr =
					node.lang === null ? 'lang={null}' : `lang={'${escape_js_string(node.lang)}'}`;
				return `<Code ${lang_attr} content={'${escape_js_string(node.content)}'} />`;
			}

			case 'Bold':
				return `<strong>${render_nodes(node.children)}</strong>`;

			case 'Italic':
				return `<em>${render_nodes(node.children)}</em>`;

			case 'Strikethrough':
				return `<s>${render_nodes(node.children)}</s>`;

			case 'Link': {
				const children_markup = render_nodes(node.children);
				if (node.link_type === 'internal') {
					if (node.reference.startsWith('#') || node.reference.startsWith('?')) {
						return `<a href={'${escape_js_string(node.reference)}'}>${children_markup}</a>`;
					}
					imports.set('resolve', {path: '$app/paths', kind: 'named'});
					return `<a href={resolve('${escape_js_string(node.reference)}')}>${children_markup}</a>`;
				}
				// External link — matches MdzNodeView: target="_blank" rel="noopener"
				return `<a href={'${escape_js_string(node.reference)}'} target="_blank" rel="noopener">${children_markup}</a>`;
			}

			case 'Paragraph':
				return `<p>${render_nodes(node.children)}</p>`;

			case 'Hr':
				return '<hr />';

			case 'Heading':
				return `<h${node.level}>${render_nodes(node.children)}</h${node.level}>`;

			case 'Element': {
				if (!elements.has(node.name)) {
					has_unconfigured_tags = true;
					return '';
				}
				return `<${node.name}>${render_nodes(node.children)}</${node.name}>`;
			}

			case 'Component': {
				const import_path = components[node.name];
				if (!import_path) {
					has_unconfigured_tags = true;
					return '';
				}
				imports.set(node.name, {path: import_path, kind: 'default'});
				return `<${node.name}>${render_nodes(node.children)}</${node.name}>`;
			}

			default:
				throw new UnreachableError(node);
		}
	};

	const markup = render_nodes(nodes);
	return {markup, imports, has_unconfigured_tags};
};

/**
 * Escapes text for safe embedding in Svelte template markup.
 *
 * Uses a single-pass regex replacement to avoid corruption that occurs with sequential
 * `.replace()` calls (where the second replace matches characters introduced by the first).
 *
 * Escapes four characters:
 * - `{` → `{'{'}` and `}` → `{'}'}` — prevents Svelte expression interpretation
 * - `<` → `&lt;` — prevents HTML/Svelte tag interpretation
 * - `&` → `&amp;` — prevents HTML entity interpretation
 *
 * The `&` escaping is necessary because runtime `MdzNodeView.svelte` renders text
 * with `{node.content}` (a Svelte expression), which auto-escapes `&` to `&amp;`.
 * The preprocessor emits raw template text where `&` is NOT auto-escaped, so
 * manual escaping is required to match the runtime behavior.
 */
export const escape_svelte_text = (text: string): string => {
	return text.replace(/[{}<&]/g, (ch) => {
		switch (ch) {
			case '{':
				return "{'{'}";
			case '}':
				return "{'}'}";
			case '<':
				return '&lt;';
			case '&':
				return '&amp;';
			default:
				return ch;
		}
	});
};

/**
 * Escapes a string for use inside a single-quoted JS string literal in Svelte expressions.
 *
 * Used for attribute values like `reference={'escaped_value'}` and
 * `content={'escaped_value'}`. Single quotes are used because the emitted
 * markup may contain double quotes (e.g., in HTML attribute values).
 */
export const escape_js_string = (value: string): string => {
	return value
		.replace(/\\/g, '\\\\') // backslashes first
		.replace(/'/g, "\\'") // single quotes
		.replace(/\n/g, '\\n') // newlines
		.replace(/\r/g, '\\r'); // carriage returns
};
