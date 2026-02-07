/**
 * Svelte preprocessor that compiles static `<Mdz>` content to Svelte markup at build time.
 *
 * Detects `<Mdz>` components with static string `content` props, parses the mdz content,
 * renders each `MdzNode` to equivalent Svelte markup via `mdz_to_svelte`, and replaces
 * the `<Mdz>` with `<MdzPrecompiled>` containing pre-rendered children.
 * Dynamic `content` props are left untouched.
 *
 * @module
 */

import {parse, type PreprocessorGroup, type AST} from 'svelte/compiler';
import MagicString from 'magic-string';
import {walk} from 'zimmerframe';
import {should_exclude_path} from '@fuzdev/fuz_util/path.js';
import {
	find_attribute,
	extract_static_string,
	build_static_bindings,
	resolve_component_names,
	has_identifier_in_tree,
	find_import_insert_position,
	generate_import_lines,
	type PreprocessImportInfo,
	type ResolvedComponentImport,
} from '@fuzdev/fuz_util/svelte_preprocess_helpers.js';

import {mdz_parse} from './mdz.js';
import {mdz_to_svelte} from './mdz_to_svelte.js';

/**
 * Options for `svelte_preprocess_mdz`.
 */
export interface SveltePreprocessMdzOptions {
	/** File patterns to exclude. */
	exclude?: Array<string | RegExp>;

	/**
	 * Component import mapping for mdz content.
	 * Key: component name as used in mdz (e.g., 'Alert').
	 * Value: import path (e.g., '$lib/Alert.svelte').
	 *
	 * If mdz content references a component not in this map,
	 * that Mdz usage is skipped (left as runtime).
	 */
	components?: Record<string, string>;

	/**
	 * Allowed HTML elements in mdz content.
	 * If mdz content references an element not in this list,
	 * that Mdz usage is skipped (left as runtime).
	 */
	elements?: Array<string>;

	/**
	 * Import sources that resolve to the Mdz component.
	 * Used to verify that `<Mdz>` in templates refers to fuz_ui's Mdz.svelte.
	 *
	 * @default ['@fuzdev/fuz_ui/Mdz.svelte']
	 */
	component_imports?: Array<string>;

	/**
	 * Import path for the precompiled wrapper component.
	 *
	 * @default '@fuzdev/fuz_ui/MdzPrecompiled.svelte'
	 */
	compiled_component_import?: string;

	/**
	 * How to handle errors during mdz parsing or rendering.
	 *
	 * @default 'throw' in CI, 'log' otherwise
	 */
	on_error?: 'log' | 'throw';
}

const PRECOMPILED_NAME = 'MdzPrecompiled';

/**
 * Creates a Svelte preprocessor that compiles static `<Mdz>` content at build time.
 *
 * @param options Configuration for component/element resolution and file filtering.
 * @returns A Svelte `PreprocessorGroup` for use in `svelte.config.js`.
 */
export const svelte_preprocess_mdz = (
	options: SveltePreprocessMdzOptions = {},
): PreprocessorGroup => {
	const {
		exclude = [],
		components = {},
		elements: elements_array = [],
		component_imports = ['@fuzdev/fuz_ui/Mdz.svelte'],
		compiled_component_import = '@fuzdev/fuz_ui/MdzPrecompiled.svelte',
		on_error = process.env.CI === 'true' ? 'throw' : 'log',
	} = options;
	const elements = new Set(elements_array);

	return {
		name: 'fuz-mdz',

		markup: ({content, filename}) => {
			if (should_exclude_path(filename, exclude)) {
				return {code: content};
			}

			// Quick bail: does file mention any known Mdz import source?
			if (!component_imports.some((source) => content.includes(source))) {
				return {code: content};
			}

			const ast = parse(content, {filename, modern: true});

			// Resolve which local names map to the Mdz component
			const mdz_names = resolve_component_names(ast, component_imports);
			if (mdz_names.size === 0) {
				return {code: content};
			}

			// Check for MdzPrecompiled name collision
			if (has_name_collision(ast, compiled_component_import)) {
				return {code: content};
			}

			const s = new MagicString(content);
			const bindings = build_static_bindings(ast);

			// Find and transform Mdz usages with static content
			const {transformations, total_usages, transformed_usages} = find_mdz_usages(ast, mdz_names, {
				components,
				elements,
				filename,
				source: content,
				bindings,
				on_error,
			});

			if (transformations.length === 0) {
				return {code: content};
			}

			// Apply transformations
			for (const t of transformations) {
				s.overwrite(t.start, t.end, t.replacement);
			}

			// Determine which Mdz imports can be removed
			const removable_imports = find_removable_mdz_imports(
				ast,
				mdz_names,
				total_usages,
				transformed_usages,
			);

			// Add required imports and remove unused Mdz imports
			manage_imports(
				s,
				ast,
				transformations,
				removable_imports,
				compiled_component_import,
				content,
			);

			return {
				code: s.toString(),
				map: s.generateMap({hires: true}),
			};
		},
	};
};

interface MdzTransformation {
	start: number;
	end: number;
	replacement: string;
	required_imports: Map<string, PreprocessImportInfo>;
}

interface FindMdzUsagesResult {
	transformations: Array<MdzTransformation>;
	/** Total template usages per Mdz local name. */
	total_usages: Map<string, number>;
	/** Successfully transformed usages per Mdz local name. */
	transformed_usages: Map<string, number>;
}

interface FindMdzUsagesContext {
	components: Record<string, string>;
	elements: ReadonlySet<string>;
	filename: string | undefined;
	source: string;
	bindings: ReadonlyMap<string, string>;
	on_error: 'log' | 'throw';
}

/**
 * Checks if `MdzPrecompiled` is already imported from a different source.
 * If so, the preprocessor bails to avoid name collisions.
 */
const has_name_collision = (ast: AST.Root, compiled_component_import: string): boolean => {
	for (const script of [ast.instance, ast.module]) {
		if (!script) continue;
		for (const node of script.content.body) {
			if (node.type !== 'ImportDeclaration') continue;
			const source_path = node.source.value as string;
			for (const spec of node.specifiers) {
				if (spec.local.name === PRECOMPILED_NAME && source_path !== compiled_component_import) {
					return true;
				}
			}
		}
	}
	return false;
};

/**
 * Walks the AST to find `<Mdz>` component usages with static `content` props
 * and generates transformations to replace them with `<MdzPrecompiled>` children.
 */
const find_mdz_usages = (
	ast: AST.Root,
	mdz_names: Map<string, ResolvedComponentImport>,
	context: FindMdzUsagesContext,
): FindMdzUsagesResult => {
	const transformations: Array<MdzTransformation> = [];
	const total_usages: Map<string, number> = new Map();
	const transformed_usages: Map<string, number> = new Map();

	walk(ast.fragment as any, null, {
		// TODO: use proper Svelte AST type for fragment
		Component(node: AST.Component, ctx: {next: () => void}) {
			// Always recurse into children so nested Mdz components are found
			ctx.next();

			if (!mdz_names.has(node.name)) return;

			// Track total usages per name
			total_usages.set(node.name, (total_usages.get(node.name) ?? 0) + 1);

			// Skip if spread attributes present — can't determine content statically
			if (node.attributes.some((attr: any) => attr.type === 'SpreadAttribute')) return; // TODO: use proper Svelte attribute union type

			const content_attr = find_attribute(node, 'content');
			if (!content_attr) return;

			// Extract static string value
			const content_value = extract_static_string(content_attr.value, context.bindings);
			if (content_value === null) return;

			// Parse mdz content and render to Svelte markup
			let result;
			try {
				const nodes = mdz_parse(content_value);
				result = mdz_to_svelte(nodes, context.components, context.elements);
			} catch (error) {
				const message = `[fuz-mdz] Preprocessing failed${context.filename ? ` in ${context.filename}` : ''}: ${error instanceof Error ? error.message : String(error)}`;
				if (context.on_error === 'throw') {
					throw new Error(message);
				}
				// eslint-disable-next-line no-console
				console.error(message);
				return;
			}

			// If content has unconfigured tags, skip this usage (fall back to runtime)
			if (result.has_unconfigured_tags) return;

			// Build replacement: <MdzPrecompiled ...props except content...>children</MdzPrecompiled>
			const replacement = build_replacement(node, content_attr, result.markup, context.source);

			transformed_usages.set(node.name, (transformed_usages.get(node.name) ?? 0) + 1);

			transformations.push({
				start: (node as any).start, // TODO: use proper Svelte AST type with position data
				end: (node as any).end, // TODO: use proper Svelte AST type with position data
				replacement,
				required_imports: result.imports,
			});
		},
	});

	return {transformations, total_usages, transformed_usages};
};

/**
 * Builds the replacement string for a transformed Mdz component.
 *
 * Reconstructs the opening tag as `<MdzPrecompiled` with all attributes except `content`,
 * using source text slicing to preserve exact formatting and dynamic expressions.
 */
const build_replacement = (
	node: AST.Component,
	content_attr: AST.Attribute,
	children_markup: string,
	source: string,
): string => {
	// Collect source ranges of all attributes EXCEPT content
	const other_attr_ranges: Array<{start: number; end: number}> = [];
	for (const attr of node.attributes) {
		if (attr === content_attr) continue;
		other_attr_ranges.push({start: (attr as any).start, end: (attr as any).end}); // TODO: use proper Svelte AST type with position data
	}

	// Build opening tag with MdzPrecompiled name
	let opening = `<${PRECOMPILED_NAME}`;
	for (const range of other_attr_ranges) {
		opening += ' ' + source.slice(range.start, range.end);
	}
	opening += '>';

	return `${opening}${children_markup}</${PRECOMPILED_NAME}>`;
};

/**
 * Determines which Mdz import declarations can be safely removed.
 *
 * An import is removable when:
 * 1. All template usages of that name were successfully transformed.
 * 2. The import has a single specifier (no partial removal of multi-specifier imports).
 * 3. The identifier is not referenced elsewhere in script or template expressions.
 */
const find_removable_mdz_imports = (
	ast: AST.Root,
	mdz_names: Map<string, ResolvedComponentImport>,
	total_usages: Map<string, number>,
	transformed_usages: Map<string, number>,
): Set<any> => {
	// TODO: use proper ESTree ImportDeclaration type
	const removable: Set<any> = new Set(); // TODO: use proper ESTree ImportDeclaration type

	for (const [name, {import_node}] of mdz_names) {
		const total = total_usages.get(name) ?? 0;
		const transformed = transformed_usages.get(name) ?? 0;

		// Only remove if ALL template usages were transformed
		if (total === 0 || transformed < total) continue;

		// Only remove single-specifier imports (don't try partial removal)
		if (import_node.specifiers.length !== 1) continue;

		// Check if identifier is referenced elsewhere in the AST
		const skip: Set<unknown> = new Set([import_node]);

		// Check instance script body (excluding the import itself)
		if (ast.instance?.content && has_identifier_in_tree(ast.instance.content, name, skip)) {
			continue;
		}

		// Check module script body (excluding the import itself)
		if (ast.module?.content && has_identifier_in_tree(ast.module.content, name, skip)) {
			continue;
		}

		// Check template for expression references (Component.name is a string, not Identifier)
		if (has_identifier_in_tree(ast.fragment, name)) {
			continue;
		}

		removable.add(import_node);
	}

	return removable;
};

/**
 * Manages import additions and removals.
 *
 * Adds the `MdzPrecompiled` import and other required imports (DocsLink, Code, resolve).
 * Removes Mdz import declarations that are no longer referenced.
 *
 * To avoid MagicString boundary conflicts when the insertion position falls inside
 * a removal range, one removable Mdz import is overwritten with the MdzPrecompiled
 * import line instead of using separate remove + appendLeft.
 */
const manage_imports = (
	s: MagicString,
	ast: AST.Root,
	transformations: Array<MdzTransformation>,
	removable_imports: Set<any>, // TODO: use proper ESTree ImportDeclaration type
	compiled_component_import: string,
	source: string,
): void => {
	// Collect all required imports across transformations
	const required: Map<string, PreprocessImportInfo> = new Map();
	for (const t of transformations) {
		for (const [name, info] of t.required_imports) {
			required.set(name, info);
		}
	}

	// Always need MdzPrecompiled when transformations occur
	required.set(PRECOMPILED_NAME, {path: compiled_component_import, kind: 'default'});

	const script = ast.instance;

	if (!script) {
		// No instance script — removable_imports won't apply (imports are in module script if any)
		// Just add all required imports
		const lines = generate_import_lines(required);
		if (ast.module) {
			const module_end = (ast.module as unknown as AST.BaseNode).end;
			s.appendLeft(module_end, `\n\n<script lang="ts">\n${lines}\n</script>`);
		} else {
			s.prepend(`<script lang="ts">\n${lines}\n</script>\n\n`);
		}
		// Remove Mdz imports from module script if removable
		for (const node of removable_imports) {
			remove_import_declaration(s, node, source);
		}
		return;
	}

	// Check existing imports to avoid duplicates — tracks both name AND source path
	const existing: Map<string, string> = new Map();
	for (const node of script.content.body) {
		if (node.type === 'ImportDeclaration') {
			const source_path = node.source.value as string;
			for (const spec of node.specifiers) {
				existing.set(spec.local.name, source_path);
			}
		}
	}

	const to_add: Map<string, PreprocessImportInfo> = new Map();
	for (const [name, info] of required) {
		const existing_path = existing.get(name);
		if (existing_path === undefined) {
			to_add.set(name, info);
		}
	}

	// Strategy: if we're both adding MdzPrecompiled and removing an Mdz import,
	// overwrite one removable import with the MdzPrecompiled line to avoid
	// MagicString boundary conflicts. Other imports use normal appendLeft.
	let overwrite_target: any = null; // TODO: use proper ESTree ImportDeclaration type
	if (to_add.has(PRECOMPILED_NAME) && removable_imports.size > 0) {
		// Pick the first removable import to overwrite
		overwrite_target = removable_imports.values().next().value;
	}

	// Generate the MdzPrecompiled import line separately if using overwrite
	if (overwrite_target) {
		const node_start = overwrite_target.start;
		const node_end = overwrite_target.end;

		// Find the start of the line (consume leading whitespace)
		let line_start = node_start;
		while (line_start > 0 && (source[line_start - 1] === '\t' || source[line_start - 1] === ' ')) {
			line_start--;
		}

		// Extract indentation from the original import line rather than hardcoding a tab.
		// The import node's start is after any leading whitespace, so the indentation is
		// the characters between the line start and the node start.
		const original_indent = source.slice(line_start, node_start);
		const precompiled_line = `${original_indent}import ${PRECOMPILED_NAME} from '${compiled_component_import}';`;

		s.overwrite(line_start, node_end, precompiled_line);
		to_add.delete(PRECOMPILED_NAME);
	}

	// Add remaining imports normally
	if (to_add.size > 0) {
		const insert_pos = find_import_insert_position(script);
		const lines = generate_import_lines(to_add);
		s.appendLeft(insert_pos, '\n' + lines);
	}

	// Remove remaining Mdz imports (skip the overwrite target)
	for (const node of removable_imports) {
		if (node === overwrite_target) continue;
		remove_import_declaration(s, node, source);
	}
};

/**
 * Removes an import declaration from the source using MagicString.
 * Consumes surrounding whitespace to avoid leaving blank lines.
 *
 * The leading whitespace check only looks for tabs and spaces, not `\r`.
 * This is correct for both Unix (`\n`) and Windows (`\r\n`) line endings:
 * in `\r\n`, the `\r` belongs to the previous line's terminator, not to
 * this line's leading whitespace.
 */
// TODO: use proper ESTree ImportDeclaration type instead of `any`
const remove_import_declaration = (s: MagicString, import_node: any, source: string): void => {
	let start: number = import_node.start;
	let end: number = import_node.end;

	// Consume trailing newline
	if (source[end] === '\n') {
		end++;
	} else if (source[end] === '\r' && source[end + 1] === '\n') {
		end += 2;
	}

	// Consume leading whitespace on the same line
	while (start > 0 && (source[start - 1] === '\t' || source[start - 1] === ' ')) {
		start--;
	}

	s.remove(start, end);
};
