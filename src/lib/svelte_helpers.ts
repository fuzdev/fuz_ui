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
 * All functions are prefixed with `svelte_` for clarity.
 */

import ts from 'typescript';
import {readFileSync} from 'node:fs';
import {svelte2tsx} from 'svelte2tsx';
import type {DeclarationJson, ComponentPropInfo} from '@fuzdev/fuz_util/source_json.js';

import {tsdoc_parse, tsdoc_apply_to_declaration} from './tsdoc_helpers.js';
import {module_get_component_name} from './module_helpers.js';

/**
 * Analyze a Svelte component from its svelte2tsx transformation.
 */
export const svelte_analyze_component = (
	ts_code: string,
	source_file: ts.SourceFile,
	checker: ts.TypeChecker,
	component_name: string,
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
		const props = svelte_extract_props(virtual_source, checker);
		if (props.length > 0) {
			result.props = props;
		}

		// Extract source line from original file
		const start_pos = source_file.getLineAndCharacterOfPosition(0);
		result.source_line = start_pos.line + 1;
	} catch (error) {
		// If analysis fails, return basic component info
		// eslint-disable-next-line no-console
		console.error(`Error analyzing Svelte component ${component_name}:`, error);
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
		} catch {
			// Fallback to 'any'
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
): void => {
	if (ts.isTypeLiteralNode(type_node)) {
		// Handle direct type literal: { prop1: type1, prop2: type2 }
		for (const member of type_node.members) {
			if (ts.isPropertySignature(member)) {
				const prop_info = svelte_extract_prop_from_member(member, virtual_source, checker);
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
			svelte_extract_props_from_type(type_part, virtual_source, checker, bindable_props, props);
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
): Array<ComponentPropInfo> => {
	const props: Array<ComponentPropInfo> = [];
	const bindable_props = svelte_extract_bindable_props(virtual_source);

	// Look for $$ComponentProps type alias or Props interface
	ts.forEachChild(virtual_source, (node) => {
		// Check for type alias ($$ComponentProps)
		if (ts.isTypeAliasDeclaration(node) && node.name.text === '$$ComponentProps') {
			svelte_extract_props_from_type(node.type, virtual_source, checker, bindable_props, props);
		}
		// Also check for Props interface (fallback/older format)
		else if (ts.isInterfaceDeclaration(node) && node.name.text === 'Props') {
			for (const member of node.members) {
				if (ts.isPropertySignature(member)) {
					const prop_info = svelte_extract_prop_from_member(member, virtual_source, checker);
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
 * Analyze a Svelte component file from disk.
 *
 * This is a high-level function that handles the complete workflow:
 * 1. Read the Svelte source from disk
 * 2. Transform to TypeScript via svelte2tsx
 * 3. Extract component metadata (props, documentation)
 *
 * Suitable for use in documentation generators, build tools, and analysis.
 *
 * @param file_path Absolute path to the .svelte file
 * @param module_path Module path relative to src/lib (e.g., 'Alert.svelte')
 * @param checker TypeScript type checker for type resolution
 * @returns Complete declaration metadata for the component
 */
export const svelte_analyze_file = (
	file_path: string,
	module_path: string,
	checker: ts.TypeChecker,
): DeclarationJson => {
	const svelte_source = readFileSync(file_path, 'utf-8');

	// Check if component uses TypeScript
	const is_ts_file = svelte_source.includes('lang="ts"');

	// Transform Svelte to TS
	const ts_result = svelte2tsx(svelte_source, {
		filename: file_path,
		isTsFile: is_ts_file,
		emitOnTemplateError: true, // Handle malformed templates gracefully
	});

	// Get component name from filename
	const component_name = module_get_component_name(module_path);

	// Create a temporary source file from the original Svelte content for JSDoc extraction
	const temp_source = ts.createSourceFile(file_path, svelte_source, ts.ScriptTarget.Latest, true);

	// Analyze the component using the existing lower-level function
	return svelte_analyze_component(ts_result.code, temp_source, checker, component_name);
};
