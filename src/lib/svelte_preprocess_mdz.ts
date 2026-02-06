/**
 * Svelte preprocessor that compiles static `<Mdz>` content to Svelte markup at build time.
 *
 * Detects `<Mdz>` components with static string `content` props, parses the mdz content,
 * renders each `MdzNode` to equivalent Svelte markup via `mdz_to_svelte`, and replaces
 * the `content` prop with pre-rendered children. Dynamic `content` props are left untouched.
 *
 * @module
 */

import {parse, type PreprocessorGroup, type AST} from 'svelte/compiler';
import MagicString from 'magic-string';
import {walk} from 'zimmerframe';

import {mdz_parse} from './mdz.js';
import {mdz_to_svelte} from './mdz_to_svelte.js';
import {
	should_exclude,
	find_attribute,
	extract_static_string,
	resolve_component_names,
	find_import_insert_position,
	generate_import_lines,
	type PreprocessImportInfo,
} from './svelte_preprocess_helpers.js';

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
}

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
		elements = [],
		component_imports = ['@fuzdev/fuz_ui/Mdz.svelte'],
	} = options;

	return {
		name: 'fuz-mdz',

		markup: ({content, filename}) => {
			if (should_exclude(filename, exclude)) {
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

			const s = new MagicString(content);

			// Find and transform Mdz usages with static content
			const transformations = find_mdz_usages(ast, mdz_names, {
				components,
				elements,
				filename,
				source: content,
			});

			if (transformations.length === 0) {
				return {code: content};
			}

			// Apply transformations
			for (const t of transformations) {
				s.overwrite(t.start, t.end, t.replacement);
			}

			// Add required imports
			add_imports(s, ast, transformations);

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

interface FindMdzUsagesContext {
	components: Record<string, string>;
	elements: Array<string>;
	filename: string | undefined;
	source: string;
}

/**
 * Walks the AST to find `<Mdz>` component usages with static `content` props
 * and generates transformations to replace them with pre-rendered children.
 */
const find_mdz_usages = (
	ast: AST.Root,
	mdz_names: Set<string>,
	context: FindMdzUsagesContext,
): Array<MdzTransformation> => {
	const transformations: Array<MdzTransformation> = [];

	walk(ast.fragment as any, null, {
		Component(node: AST.Component, ctx: {next: () => void}) {
			// Always recurse into children so nested Mdz components are found
			ctx.next();

			if (!mdz_names.has(node.name)) return;

			// Skip if spread attributes present — can't determine content statically
			if (node.attributes.some((attr: any) => attr.type === 'SpreadAttribute')) return;

			const content_attr = find_attribute(node, 'content');
			if (!content_attr) return;

			// Extract static string value
			const content_value = extract_static_string(content_attr.value);
			if (content_value === null) return;

			// Parse mdz content
			const nodes = mdz_parse(content_value);

			// Render to Svelte markup
			const result = mdz_to_svelte(nodes, {
				components: context.components,
				elements: context.elements,
			});

			// If content has unconfigured tags, skip this usage (fall back to runtime)
			if (result.has_unconfigured_tags) return;

			// Build replacement: reconstruct <Mdz ...props except content...>children</Mdz>
			const replacement = build_replacement(node, content_attr, result.markup, context.source);

			transformations.push({
				start: (node as any).start,
				end: (node as any).end,
				replacement,
				required_imports: result.imports,
			});
		},
	});

	return transformations;
};

/**
 * Builds the replacement string for a transformed Mdz component.
 *
 * Reconstructs the opening `<Mdz` tag with all attributes except `content`,
 * using source text slicing to preserve exact formatting and dynamic expressions.
 * Appends the rendered children and closes with `</Mdz>`.
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
		other_attr_ranges.push({start: (attr as any).start, end: (attr as any).end});
	}

	// Build opening tag
	let opening = `<${node.name}`;
	for (const range of other_attr_ranges) {
		opening += ' ' + source.slice(range.start, range.end);
	}
	opening += '>';

	return `${opening}${children_markup}</${node.name}>`;
};

/**
 * Adds required imports to the script block.
 *
 * Collects all required imports across transformations, deduplicates by name and path,
 * and inserts them into the instance script. Creates a script tag if none exists.
 */
const add_imports = (
	s: MagicString,
	ast: AST.Root,
	transformations: Array<MdzTransformation>,
): void => {
	// Collect all required imports across transformations
	const required: Map<string, PreprocessImportInfo> = new Map();
	for (const t of transformations) {
		for (const [name, info] of t.required_imports) {
			required.set(name, info);
		}
	}

	if (required.size === 0) return;

	const script = ast.instance;

	if (!script) {
		// No instance script — check for module script to insert after, or prepend
		const lines = generate_import_lines(required);
		if (ast.module) {
			// Insert instance script after module script
			const module_end = (ast.module as unknown as AST.BaseNode).end;
			s.appendLeft(module_end, `\n\n<script lang="ts">\n${lines}\n</script>`);
		} else {
			s.prepend(`<script lang="ts">\n${lines}\n</script>\n\n`);
		}
		return;
	}

	// Check existing imports to avoid duplicates — tracks both name AND source path
	const existing: Map<string, string> = new Map(); // local name -> source path
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
			// Name not yet imported — add it
			to_add.set(name, info);
		}
		// If existing_path === info.path: already imported from same source, skip
		// If existing_path !== info.path: name collision from different source, skip
		// (fall back to runtime for safety — aliased imports not yet supported)
	}

	if (to_add.size > 0) {
		const insert_pos = find_import_insert_position(script);
		const lines = generate_import_lines(to_add);
		s.appendLeft(insert_pos, '\n' + lines);
	}
};
