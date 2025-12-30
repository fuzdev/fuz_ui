/**
 * Svelte component analysis helpers.
 *
 * Extracts metadata from Svelte components using svelte2tsx transformations:
 *
 * - Component props with types and JSDoc
 * - Component-level documentation
 * - Type information
 *
 * Workflow: Transform Svelte to TypeScript via svelte2tsx, parse the transformed
 * TypeScript with the TS Compiler API, extract component-level JSDoc from original source.
 *
 * Requires svelte2tsx 0.7.x (Svelte 5 compatible). The transformed output format
 * is version-specific - other versions may produce different AST structures.
 * Version constraint is enforced via peerDependencies in package.json.
 *
 * All functions are prefixed with `svelte_` for clarity.
 */

import ts from 'typescript';
import {svelte2tsx} from 'svelte2tsx';
import {TraceMap, originalPositionFor} from '@jridgewell/trace-mapping';
import type {DeclarationJson, ComponentPropInfo, ModuleJson} from '@fuzdev/fuz_util/source_json.js';

import {tsdoc_parse, tsdoc_apply_to_declaration} from './tsdoc_helpers.js';
import {ts_extract_module_comment} from './ts_helpers.js';
import {
	type SourceFileInfo,
	type ModuleSourceOptions,
	module_get_component_name,
	module_extract_dependencies,
} from './module_helpers.js';
import type {AnalysisContext} from './analysis_context.js';

/** Result of analyzing a Svelte file. */
export interface SvelteFileAnalysis {
	/** The component declaration metadata. */
	declaration: DeclarationJson;
	/** Module-level documentation comment, if present. */
	module_comment?: string;
}

/**
 * Analyze a Svelte component from its svelte2tsx transformation.
 */
export const svelte_analyze_component = (
	ts_code: string,
	source_file: ts.SourceFile,
	checker: ts.TypeChecker,
	component_name: string,
	file_path: string,
	source_map: TraceMap | null,
	ctx: AnalysisContext,
): DeclarationJson => {
	const result: DeclarationJson = {
		name: component_name,
		kind: 'component',
	};

	try {
		// Create a virtual source file from the svelte2tsx output
		// svelte2tsx generates plain TypeScript (not TSX/JSX)
		const virtual_source = ts.createSourceFile(
			source_file.fileName + '.ts',
			ts_code,
			ts.ScriptTarget.Latest,
			true,
			ts.ScriptKind.TS,
		);

		// Extract component-level TSDoc from svelte2tsx transformed output
		const component_tsdoc = svelte_extract_component_tsdoc(virtual_source);
		tsdoc_apply_to_declaration(result, component_tsdoc);

		// Extract props from svelte2tsx transformed output
		const props = svelte_extract_props(
			virtual_source,
			checker,
			component_name,
			file_path,
			source_map,
			ctx,
		);
		if (props.length > 0) {
			result.props = props;
		}

		// Extract source line from original file
		const start_pos = source_file.getLineAndCharacterOfPosition(0);
		result.source_line = start_pos.line + 1;
	} catch (error) {
		throw new Error(`Failed to analyze Svelte component ${component_name}`, {cause: error});
	}

	return result;
};

/**
 * Extract component-level TSDoc comment from svelte2tsx transformed output.
 *
 * svelte2tsx places component-level JSDoc inside the $$render() function,
 * attached to a variable statement (usually before the props destructuring).
 * This function searches the AST recursively to find it.
 */
const svelte_extract_component_tsdoc = (
	source_file: ts.SourceFile,
): ReturnType<typeof tsdoc_parse> => {
	let found_tsdoc: ReturnType<typeof tsdoc_parse> = undefined;

	// Recursively search for component-level JSDoc
	function visit(node: ts.Node) {
		if (found_tsdoc) return; // Already found, stop searching

		// Skip PropertySignature nodes - those are prop-level JSDoc, not component-level
		if (ts.isPropertySignature(node)) {
			return; // Don't recurse into property signatures
		}

		// Check for JSDoc on VariableStatement or VariableDeclaration
		// Component-level JSDoc is attached to these node types
		if (ts.isVariableStatement(node) || ts.isVariableDeclaration(node)) {
			const tsdoc = tsdoc_parse(node, source_file);
			if (tsdoc) {
				found_tsdoc = tsdoc;
				return;
			}
		}

		// Continue searching child nodes
		ts.forEachChild(node, visit);
	}

	visit(source_file);
	return found_tsdoc;
};

/**
 * Helper to extract prop info from a property signature member.
 */
const svelte_extract_prop_from_member = (
	member: ts.PropertySignature,
	source_file: ts.SourceFile,
	checker: ts.TypeChecker,
	component_name: string,
	file_path: string,
	source_map: TraceMap | null,
	ctx: AnalysisContext,
): ComponentPropInfo | undefined => {
	if (!ts.isIdentifier(member.name)) return undefined;

	const prop_name = member.name.text;
	const optional = !!member.questionToken;

	// Get type string
	let type_string = 'any';
	if (member.type) {
		type_string = member.type.getText(source_file);
	} else {
		// Try to get type from type checker
		try {
			const prop_type = checker.getTypeAtLocation(member);
			type_string = checker.typeToString(prop_type);
		} catch (err) {
			// Fallback to 'any' but report diagnostic with mapped position
			const {line, character} = source_file.getLineAndCharacterOfPosition(member.getStart());

			// Map virtual position back to original .svelte file if source map available
			let final_line: number | null = line + 1;
			let final_column: number | null = character + 1;
			if (source_map) {
				const original = originalPositionFor(source_map, {line: line + 1, column: character});
				// When line is found, column is guaranteed to be present (same mapping entry)
				if (original.line !== null) {
					final_line = original.line;
					final_column = original.column + 1;
				}
			}

			ctx.add({
				kind: 'svelte_prop_failed',
				file: file_path,
				line: final_line,
				column: final_column,
				message: `Failed to resolve type for prop "${prop_name}" in ${component_name}, falling back to 'any': ${err instanceof Error ? err.message : String(err)}`,
				severity: 'warning',
				component_name,
				prop_name,
			});
		}
	}

	// Extract TSDoc description
	let description: string | undefined;
	const tsdoc = tsdoc_parse(member, source_file);
	if (tsdoc) {
		description = tsdoc.text;
	}

	// Extract default value (if available in TSDoc or initializer)
	let default_value: string | undefined;
	const default_match = description?.match(/@default\s+(.+)/);
	if (default_match) {
		default_value = default_match[1]!.trim();
	}

	return {
		name: prop_name,
		type: type_string,
		...(optional && {optional}),
		description,
		default_value,
	};
};

/**
 * Extract bindable prop names from svelte2tsx transformed output.
 *
 * svelte2tsx marks bindable props with `__sveltets_$$bindings('prop1', 'prop2', ...)`.
 * This function extracts those prop names.
 */
const svelte_extract_bindable_props = (virtual_source: ts.SourceFile): Set<string> => {
	const bindable_props: Set<string> = new Set();

	// Search for __sveltets_$$bindings call
	function visit(node: ts.Node) {
		if (ts.isCallExpression(node)) {
			const expr = node.expression;
			if (ts.isIdentifier(expr) && expr.text === '__sveltets_$$bindings') {
				// Extract string literal arguments
				for (const arg of node.arguments) {
					if (ts.isStringLiteral(arg)) {
						bindable_props.add(arg.text);
					}
				}
			}
		}
		ts.forEachChild(node, visit);
	}

	visit(virtual_source);
	return bindable_props;
};

/**
 * Extract props from a type node (handles type literals and intersection types).
 *
 * @mutates props - adds extracted prop info to the array
 */
const svelte_extract_props_from_type = (
	type_node: ts.TypeNode,
	virtual_source: ts.SourceFile,
	checker: ts.TypeChecker,
	bindable_props: Set<string>,
	props: Array<ComponentPropInfo>,
	component_name: string,
	file_path: string,
	source_map: TraceMap | null,
	ctx: AnalysisContext,
): void => {
	if (ts.isTypeLiteralNode(type_node)) {
		// Handle direct type literal: { prop1: type1, prop2: type2 }
		for (const member of type_node.members) {
			if (ts.isPropertySignature(member)) {
				const prop_info = svelte_extract_prop_from_member(
					member,
					virtual_source,
					checker,
					component_name,
					file_path,
					source_map,
					ctx,
				);
				if (prop_info) {
					// Mark as bindable if found in bindings
					if (bindable_props.has(prop_info.name)) {
						prop_info.bindable = true;
					}
					props.push(prop_info);
				}
			}
		}
	} else if (ts.isIntersectionTypeNode(type_node)) {
		// Handle intersection type: TypeA & TypeB & { prop: type }
		for (const type_part of type_node.types) {
			svelte_extract_props_from_type(
				type_part,
				virtual_source,
				checker,
				bindable_props,
				props,
				component_name,
				file_path,
				source_map,
				ctx,
			);
		}
	}
	// Skip other type references like SvelteHTMLElements['details'] since we can't easily resolve them
};

/**
 * Extract props from svelte2tsx transformed output.
 *
 * svelte2tsx generates a `$$ComponentProps` type alias containing the component props.
 * This function extracts prop metadata from that type.
 */
const svelte_extract_props = (
	virtual_source: ts.SourceFile,
	checker: ts.TypeChecker,
	component_name: string,
	file_path: string,
	source_map: TraceMap | null,
	ctx: AnalysisContext,
): Array<ComponentPropInfo> => {
	const props: Array<ComponentPropInfo> = [];
	const bindable_props = svelte_extract_bindable_props(virtual_source);

	// Look for $$ComponentProps type alias or Props interface
	ts.forEachChild(virtual_source, (node) => {
		// Check for type alias ($$ComponentProps)
		if (ts.isTypeAliasDeclaration(node) && node.name.text === '$$ComponentProps') {
			svelte_extract_props_from_type(
				node.type,
				virtual_source,
				checker,
				bindable_props,
				props,
				component_name,
				file_path,
				source_map,
				ctx,
			);
		}
		// Also check for Props interface (fallback/older format)
		else if (ts.isInterfaceDeclaration(node) && node.name.text === 'Props') {
			for (const member of node.members) {
				if (ts.isPropertySignature(member)) {
					const prop_info = svelte_extract_prop_from_member(
						member,
						virtual_source,
						checker,
						component_name,
						file_path,
						source_map,
						ctx,
					);
					if (prop_info) {
						// Mark as bindable if found in bindings
						if (bindable_props.has(prop_info.name)) {
							prop_info.bindable = true;
						}
						props.push(prop_info);
					}
				}
			}
		}
	});

	return props;
};

/**
 * Extract the content of the main `<script>` tag from Svelte source.
 *
 * Matches `<script>` or `<script lang="ts">` but not `<script module>`.
 * Returns undefined if no matching script tag is found.
 */
export const svelte_extract_script_content = (svelte_source: string): string | undefined => {
	// Match <script> or <script lang="ts"> but not <script module>
	// Captures the content between opening and closing tags
	const script_regex = /<script(?:\s+lang=["']ts["'])?(?:\s*)>([^]*?)<\/script>/i;
	const match = script_regex.exec(svelte_source);
	return match?.[1];
};

/**
 * Extract module-level comment from Svelte script content.
 *
 * Uses the same blank-line heuristic as TypeScript module comments:
 * a JSDoc comment (`/** ... *\/`) followed by a blank line is considered
 * a module-level comment rather than a declaration comment.
 *
 * @param script_content The content of the `<script>` tag
 * @returns The cleaned module comment text, or undefined if none found
 */
export const svelte_extract_module_comment = (script_content: string): string | undefined => {
	// Parse the script content as TypeScript and reuse the shared extraction logic
	const source_file = ts.createSourceFile(
		'script.ts',
		script_content,
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TS,
	);
	return ts_extract_module_comment(source_file);
};

/**
 * Analyze a Svelte component file.
 *
 * This is a high-level function that handles the complete workflow:
 * 1. Transform Svelte source to TypeScript via svelte2tsx
 * 2. Extract component metadata (props, documentation)
 * 3. Extract module-level documentation
 *
 * Suitable for use in documentation generators, build tools, and analysis.
 *
 * @param source_file Source file info with path and content
 * @param module_path Module path relative to source root (e.g., 'Alert.svelte')
 * @param checker TypeScript type checker for type resolution
 * @param ctx Analysis context for collecting diagnostics
 * @returns Component declaration and optional module-level comment
 */
export const svelte_analyze_file = (
	source_file: SourceFileInfo,
	module_path: string,
	checker: ts.TypeChecker,
	ctx: AnalysisContext,
): SvelteFileAnalysis => {
	const svelte_source = source_file.content;

	// Check if component uses TypeScript
	const is_ts_file = svelte_source.includes('lang="ts"');

	// Transform Svelte to TS
	const ts_result = svelte2tsx(svelte_source, {
		filename: source_file.id,
		isTsFile: is_ts_file,
		emitOnTemplateError: true, // Handle malformed templates gracefully
	});

	// Create source map for position mapping back to original .svelte file
	let source_map: TraceMap | null = null;
	try {
		// svelte2tsx returns a magic-string SourceMap which is compatible with TraceMap
		// Cast to unknown first since the types don't perfectly align but are compatible
		source_map = new TraceMap(
			ts_result.map as unknown as ConstructorParameters<typeof TraceMap>[0],
		);
	} catch {
		// If source map parsing fails, diagnostics will use virtual file positions
	}

	// Get component name from filename
	const component_name = module_get_component_name(module_path);

	// Create a temporary source file from the original Svelte content for JSDoc extraction
	const temp_source = ts.createSourceFile(
		source_file.id,
		svelte_source,
		ts.ScriptTarget.Latest,
		true,
	);

	// Analyze the component using the existing lower-level function
	const declaration = svelte_analyze_component(
		ts_result.code,
		temp_source,
		checker,
		component_name,
		module_path,
		source_map,
		ctx,
	);

	// Extract module-level comment from the script content
	const script_content = svelte_extract_script_content(svelte_source);
	const module_comment = script_content ? svelte_extract_module_comment(script_content) : undefined;

	return {declaration, module_comment};
};

/**
 * Analyze a Svelte component file and extract module metadata.
 *
 * Wraps `svelte_analyze_file` and adds dependency information
 * from the source file info if available.
 *
 * This is a high-level function suitable for building documentation or library metadata.
 * For lower-level analysis, use `svelte_analyze_file` directly.
 *
 * @param source_file The source file info (from Gro filer, file system, or other source)
 * @param module_path The module path (relative to source root)
 * @param checker TypeScript type checker
 * @param options Module source options for path extraction (use `MODULE_SOURCE_DEFAULTS` for standard layouts)
 * @param ctx Analysis context for collecting diagnostics
 * @returns Module metadata for inclusion in source_json
 */
export const svelte_analyze_module = (
	source_file: SourceFileInfo,
	module_path: string,
	checker: ts.TypeChecker,
	options: ModuleSourceOptions,
	ctx: AnalysisContext,
): ModuleJson => {
	// Use the existing helper for core analysis
	const {declaration, module_comment} = svelte_analyze_file(source_file, module_path, checker, ctx);

	// Extract dependencies and dependents if provided
	const {dependencies, dependents} = module_extract_dependencies(source_file, options);

	return {
		path: module_path,
		declarations: [declaration],
		module_comment,
		dependencies: dependencies.length > 0 ? dependencies : undefined,
		dependents: dependents.length > 0 ? dependents : undefined,
	};
};
