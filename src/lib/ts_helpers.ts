/**
 * TypeScript compiler API helpers for extracting metadata from source code.
 *
 * All functions are prefixed with `ts_` for clarity.
 */

import ts from 'typescript';
import type {
	DeclarationJson,
	GenericParamInfo,
	DeclarationKind,
} from '@fuzdev/fuz_util/source_json.js';

import {tsdoc_parse, tsdoc_apply_to_declaration, tsdoc_clean_comment} from './tsdoc_helpers.js';
import {
	type ModuleSourceOptions,
	module_extract_path,
	module_matches_source,
} from './module_helpers.js';

const ts_parse_generic_param = (param: ts.TypeParameterDeclaration): GenericParamInfo => {
	const result: GenericParamInfo = {
		name: param.name.text,
	};

	if (param.constraint) {
		result.constraint = param.constraint.getText();
	}

	if (param.default) {
		result.default_type = param.default.getText();
	}

	return result;
};

/**
 * Extract modifier keywords from a node's modifiers.
 *
 * Returns an array of modifier strings like ['public', 'readonly', 'static']
 */
const ts_extract_modifiers = (
	modifiers: ReadonlyArray<ts.ModifierLike> | undefined,
): Array<string> => {
	const modifier_flags: Array<string> = [];
	if (!modifiers) return modifier_flags;

	for (const mod of modifiers) {
		if (mod.kind === ts.SyntaxKind.PublicKeyword) modifier_flags.push('public');
		else if (mod.kind === ts.SyntaxKind.PrivateKeyword) modifier_flags.push('private');
		else if (mod.kind === ts.SyntaxKind.ProtectedKeyword) modifier_flags.push('protected');
		else if (mod.kind === ts.SyntaxKind.ReadonlyKeyword) modifier_flags.push('readonly');
		else if (mod.kind === ts.SyntaxKind.StaticKeyword) modifier_flags.push('static');
		else if (mod.kind === ts.SyntaxKind.AbstractKeyword) modifier_flags.push('abstract');
	}

	return modifier_flags;
};

/**
 * Infer declaration kind from symbol and node.
 */
export const ts_infer_declaration_kind = (symbol: ts.Symbol, node: ts.Node): DeclarationKind => {
	// Check symbol flags
	if (symbol.flags & ts.SymbolFlags.Class) return 'class';
	if (symbol.flags & ts.SymbolFlags.Function) return 'function';
	if (symbol.flags & ts.SymbolFlags.Interface) return 'type';
	if (symbol.flags & ts.SymbolFlags.TypeAlias) return 'type';

	// Check node kind
	if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node) || ts.isFunctionExpression(node))
		return 'function';
	if (ts.isClassDeclaration(node)) return 'class';
	if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) return 'type';
	if (ts.isVariableDeclaration(node)) {
		// Check if it's a function-valued variable
		const init = node.initializer;
		if (init && (ts.isArrowFunction(init) || ts.isFunctionExpression(init))) {
			return 'function';
		}
		return 'variable';
	}

	return 'variable';
};

/**
 * Extract function/method information including parameters
 * with descriptions and default values.
 *
 * @internal Use `ts_analyze_declaration` for high-level analysis.
 * @mutates declaration - adds type_signature, return_type, return_description, throws, since, parameters, generic_params
 */
export const ts_extract_function_info = (
	node: ts.Node,
	symbol: ts.Symbol,
	checker: ts.TypeChecker,
	declaration: DeclarationJson,
	tsdoc: ReturnType<typeof tsdoc_parse>,
): void => {
	try {
		const type = checker.getTypeOfSymbolAtLocation(symbol, node);
		const signatures = type.getCallSignatures();

		if (signatures.length > 0) {
			const sig = signatures[0]!;
			declaration.type_signature = checker.signatureToString(sig);

			const return_type = checker.getReturnTypeOfSignature(sig);
			declaration.return_type = checker.typeToString(return_type);

			// Extract return description from TSDoc
			if (tsdoc?.returns) {
				declaration.return_description = tsdoc.returns;
			}

			// Extract throws and since from TSDoc
			if (tsdoc?.throws?.length) {
				declaration.throws = tsdoc.throws;
			}
			if (tsdoc?.since) {
				declaration.since = tsdoc.since;
			}

			// Extract parameters with descriptions and default values
			declaration.parameters = sig.parameters.map((param) => {
				const param_decl = param.valueDeclaration;

				// Get type - use declaration location if available, otherwise get declared type
				let type_string = 'unknown';
				if (param_decl) {
					const param_type = checker.getTypeOfSymbolAtLocation(param, param_decl);
					type_string = checker.typeToString(param_type);
				} else {
					const param_type = checker.getDeclaredTypeOfSymbol(param);
					type_string = checker.typeToString(param_type);
				}

				// Get TSDoc description for this parameter
				const description = tsdoc?.params.get(param.name);

				// Extract default value from AST
				let default_value: string | undefined;
				if (param_decl && ts.isParameter(param_decl) && param_decl.initializer) {
					default_value = param_decl.initializer.getText();
				}

				const optional = !!(param_decl && ts.isParameter(param_decl) && param_decl.questionToken);

				return {
					name: param.name,
					type: type_string,
					...(optional && {optional}),
					description,
					default_value,
				};
			});
		}
	} catch (_err) {
		// Ignore: Type checker errors are expected when analyzing incomplete or complex signatures
	}

	// Extract generic type parameters
	if (ts.isFunctionDeclaration(node) || ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
		if (node.typeParameters?.length) {
			declaration.generic_params = node.typeParameters.map(ts_parse_generic_param);
		}
	}
};

/**
 * Extract type/interface information with rich property metadata.
 *
 * @internal Use `ts_analyze_declaration` for high-level analysis.
 * @mutates declaration - adds type_signature, generic_params, extends, properties
 */
export const ts_extract_type_info = (
	node: ts.Node,
	_symbol: ts.Symbol,
	checker: ts.TypeChecker,
	declaration: DeclarationJson,
): void => {
	try {
		const type = checker.getTypeAtLocation(node);
		declaration.type_signature = checker.typeToString(type);
	} catch (_err) {
		// Ignore: Type checker may fail on complex or recursive types
	}

	if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
		if (node.typeParameters?.length) {
			declaration.generic_params = node.typeParameters.map(ts_parse_generic_param);
		}
	}

	if (ts.isInterfaceDeclaration(node)) {
		if (node.heritageClauses) {
			declaration.extends = node.heritageClauses
				.filter((hc) => hc.token === ts.SyntaxKind.ExtendsKeyword)
				.flatMap((hc) => hc.types.map((t) => t.getText()));
		}

		// Extract properties with full metadata
		declaration.properties = [];
		for (const member of node.members) {
			if (ts.isPropertySignature(member) && ts.isIdentifier(member.name)) {
				const prop_name = member.name.text;
				const prop_declaration: DeclarationJson = {
					name: prop_name,
					kind: 'variable',
				};

				// Extract modifiers
				const modifier_flags = ts_extract_modifiers(ts.getModifiers(member));
				if (modifier_flags.length > 0) {
					prop_declaration.modifiers = modifier_flags;
				}

				// Extract type
				if (member.type) {
					prop_declaration.type_signature = member.type.getText();
				}

				// Extract TSDoc
				const prop_tsdoc = tsdoc_parse(member, node.getSourceFile());
				if (prop_tsdoc) {
					prop_declaration.doc_comment = prop_tsdoc.text;
				}

				declaration.properties.push(prop_declaration);
			}
		}
	}
};

/**
 * Extract class information with rich member metadata.
 *
 * @internal Use `ts_analyze_declaration` for high-level analysis.
 * @mutates declaration - adds extends, implements, generic_params, members
 */
export const ts_extract_class_info = (
	node: ts.Node,
	_symbol: ts.Symbol,
	checker: ts.TypeChecker,
	declaration: DeclarationJson,
): void => {
	if (!ts.isClassDeclaration(node)) return;

	if (node.heritageClauses) {
		declaration.extends = node.heritageClauses
			.filter((hc) => hc.token === ts.SyntaxKind.ExtendsKeyword)
			.flatMap((hc) => hc.types.map((t) => t.getText()));

		declaration.implements = node.heritageClauses
			.filter((hc) => hc.token === ts.SyntaxKind.ImplementsKeyword)
			.flatMap((hc) => hc.types.map((t) => t.getText()));
	}

	if (node.typeParameters?.length) {
		declaration.generic_params = node.typeParameters.map(ts_parse_generic_param);
	}

	// Extract members with full metadata
	declaration.members = [];
	for (const member of node.members) {
		if (
			ts.isPropertyDeclaration(member) ||
			ts.isMethodDeclaration(member) ||
			ts.isConstructorDeclaration(member)
		) {
			const is_constructor = ts.isConstructorDeclaration(member);
			const member_name = is_constructor
				? 'constructor'
				: ts.isIdentifier(member.name)
					? member.name.text
					: member.name.getText();
			if (!member_name) continue;

			// Skip private fields (those starting with #)
			if (member_name.startsWith('#')) continue;

			const member_declaration: DeclarationJson = {
				name: member_name,
				kind: is_constructor
					? 'constructor'
					: ts.isMethodDeclaration(member)
						? 'function'
						: 'variable',
			};

			// Extract visibility and modifiers
			const modifier_flags = ts_extract_modifiers(ts.getModifiers(member));
			if (modifier_flags.length > 0) {
				member_declaration.modifiers = modifier_flags;
			}

			// Extract TSDoc
			const member_tsdoc = tsdoc_parse(member, node.getSourceFile());
			if (member_tsdoc) {
				member_declaration.doc_comment = member_tsdoc.text;
			}

			// Extract type information and parameters for methods and constructors
			try {
				if (ts.isPropertyDeclaration(member) && member.type) {
					member_declaration.type_signature = member.type.getText();
				} else if (ts.isMethodDeclaration(member) || ts.isConstructorDeclaration(member)) {
					let signatures: ReadonlyArray<ts.Signature> = [];

					if (is_constructor) {
						// For constructors, get construct signatures from the class symbol
						// Skip anonymous classes (no name)
						if (node.name) {
							const class_symbol = checker.getSymbolAtLocation(node.name);
							if (class_symbol) {
								const class_type = checker.getTypeOfSymbolAtLocation(class_symbol, node);
								signatures = class_type.getConstructSignatures();
							}
						}
					} else {
						// For methods, get call signatures from the method symbol
						const member_symbol = checker.getSymbolAtLocation(member.name);
						if (member_symbol) {
							const member_type = checker.getTypeOfSymbolAtLocation(member_symbol, member);
							signatures = member_type.getCallSignatures();
						}
					}

					if (signatures.length > 0) {
						const sig = signatures[0]!;

						// Extract type signature for both constructors and methods
						member_declaration.type_signature = checker.signatureToString(sig);

						// For methods (but not constructors), also extract return info separately
						if (!is_constructor) {
							// Extract return type for methods
							const return_type = checker.getReturnTypeOfSignature(sig);
							member_declaration.return_type = checker.typeToString(return_type);

							// Extract return description from TSDoc
							if (member_tsdoc?.returns) {
								member_declaration.return_description = member_tsdoc.returns;
							}
						}

						// Extract parameters with descriptions and default values
						member_declaration.parameters = sig.parameters.map((param) => {
							const param_decl = param.valueDeclaration;

							// Get type - use declaration location if available, otherwise get declared type
							let type_string = 'unknown';
							if (param_decl) {
								const param_type = checker.getTypeOfSymbolAtLocation(param, param_decl);
								type_string = checker.typeToString(param_type);
							} else {
								const param_type = checker.getDeclaredTypeOfSymbol(param);
								type_string = checker.typeToString(param_type);
							}

							// Get TSDoc description for this parameter
							const description = member_tsdoc?.params.get(param.name);

							// Extract default value from AST
							let default_value: string | undefined;
							if (param_decl && ts.isParameter(param_decl) && param_decl.initializer) {
								default_value = param_decl.initializer.getText();
							}

							const optional = !!(
								param_decl &&
								ts.isParameter(param_decl) &&
								param_decl.questionToken
							);

							return {
								name: param.name,
								type: type_string,
								...(optional && {optional}),
								description,
								default_value,
							};
						});

						// Extract throws and since from TSDoc (for both methods and constructors)
						if (member_tsdoc?.throws?.length) {
							member_declaration.throws = member_tsdoc.throws;
						}
						if (member_tsdoc?.since) {
							member_declaration.since = member_tsdoc.since;
						}
					}
				}
			} catch (_err) {
				// Ignore: Type checker may fail on complex member signatures
			}

			declaration.members.push(member_declaration);
		}
	}
};

/**
 * Extract variable information.
 *
 * @internal Use `ts_analyze_declaration` for high-level analysis.
 * @mutates declaration - adds type_signature
 */
export const ts_extract_variable_info = (
	node: ts.Node,
	symbol: ts.Symbol,
	checker: ts.TypeChecker,
	declaration: DeclarationJson,
): void => {
	try {
		const type = checker.getTypeOfSymbolAtLocation(symbol, node);
		declaration.type_signature = checker.typeToString(type);
	} catch (_err) {
		// Ignore: Type checker may fail on complex variable types
	}
};

/**
 * Result of analyzing a single declaration.
 */
export interface TsDeclarationAnalysis {
	/** The analyzed declaration metadata. */
	declaration: DeclarationJson;
	/** Whether the declaration is marked @nodocs (should be excluded from documentation). */
	nodocs: boolean;
}

/**
 * Analyze a TypeScript symbol and extract rich metadata.
 *
 * This is a high-level function that combines TSDoc parsing with TypeScript
 * type analysis to produce complete declaration metadata. Suitable for use
 * in documentation generators, IDE integrations, and other tooling.
 *
 * @param symbol The TypeScript symbol to analyze
 * @param source_file The source file containing the symbol
 * @param checker The TypeScript type checker
 * @returns Complete declaration metadata including docs, types, and parameters, plus nodocs flag
 */
export const ts_analyze_declaration = (
	symbol: ts.Symbol,
	source_file: ts.SourceFile,
	checker: ts.TypeChecker,
): TsDeclarationAnalysis => {
	const name = symbol.name;
	const decl_node = symbol.valueDeclaration || symbol.declarations?.[0];

	// Determine kind (fallback to 'variable' if no declaration node)
	const kind = decl_node ? ts_infer_declaration_kind(symbol, decl_node) : 'variable';

	const result: DeclarationJson = {
		name,
		kind,
	};

	if (!decl_node) {
		return {declaration: result, nodocs: false};
	}

	// Extract TSDoc
	const tsdoc = tsdoc_parse(decl_node, source_file);
	const nodocs = tsdoc?.nodocs ?? false;
	tsdoc_apply_to_declaration(result, tsdoc);

	// Extract source line
	const start = decl_node.getStart(source_file);
	const start_pos = source_file.getLineAndCharacterOfPosition(start);
	result.source_line = start_pos.line + 1;

	// Extract type-specific info
	if (result.kind === 'function') {
		ts_extract_function_info(decl_node, symbol, checker, result, tsdoc);
	} else if (result.kind === 'type') {
		ts_extract_type_info(decl_node, symbol, checker, result);
	} else if (result.kind === 'class') {
		ts_extract_class_info(decl_node, symbol, checker, result);
	} else if (result.kind === 'variable') {
		ts_extract_variable_info(decl_node, symbol, checker, result);
	}

	return {declaration: result, nodocs};
};

/**
 * Information about a same-name re-export.
 * Used for post-processing to build `also_exported_from` arrays.
 */
export interface ReExportInfo {
	/** Name of the re-exported declaration. */
	name: string;
	/** Module path (relative to src/lib) where the declaration is originally declared. */
	original_module: string;
}

/**
 * Result of analyzing a module's exports.
 */
export interface ModuleExportsAnalysis {
	/** Module-level documentation comment. */
	module_comment?: string;
	/** All exported declarations with their metadata (excludes same-name re-exports). */
	declarations: Array<DeclarationJson>;
	/** Same-name re-exports (for building also_exported_from in post-processing). */
	re_exports: Array<ReExportInfo>;
}

/**
 * Analyze all exports from a TypeScript source file.
 *
 * Extracts the module-level comment and all exported declarations with
 * complete metadata. Handles re-exports by:
 * - Same-name re-exports: tracked in `re_exports` for `also_exported_from` building
 * - Renamed re-exports: included as new declarations with `alias_of` metadata
 *
 * This is a high-level function suitable for building documentation, API explorers, or analysis tools.
 *
 * @param source_file The TypeScript source file to analyze
 * @param checker The TypeScript type checker
 * @param options Module source options for path extraction in re-exports
 * @returns Module comment, array of analyzed declarations, and re-export information
 */
export const ts_analyze_module_exports = (
	source_file: ts.SourceFile,
	checker: ts.TypeChecker,
	options: ModuleSourceOptions,
): ModuleExportsAnalysis => {
	const declarations: Array<DeclarationJson> = [];
	const re_exports: Array<ReExportInfo> = [];

	// Extract module-level comment
	const module_comment = ts_extract_module_comment(source_file);

	// Get all exported symbols
	const symbol = checker.getSymbolAtLocation(source_file);
	if (symbol) {
		const exports = checker.getExportsOfModule(symbol);
		for (const export_symbol of exports) {
			// Check if this is an alias (potential re-export) using the Alias flag
			const is_alias = (export_symbol.flags & ts.SymbolFlags.Alias) !== 0;

			if (is_alias) {
				// This might be a re-export - use getAliasedSymbol to find the original
				const aliased_symbol = checker.getAliasedSymbol(export_symbol);
				const aliased_decl = aliased_symbol.valueDeclaration || aliased_symbol.declarations?.[0];

				if (aliased_decl) {
					const original_source = aliased_decl.getSourceFile();

					// Check if this is a CROSS-FILE re-export (original in different file)
					if (original_source.fileName !== source_file.fileName) {
						// Only track if the original is from a source module (not node_modules)
						if (module_matches_source(original_source.fileName, options)) {
							const original_module = module_extract_path(original_source.fileName, options);
							const original_name = aliased_symbol.name;
							const is_renamed = export_symbol.name !== original_name;

							if (is_renamed) {
								// Renamed re-export (export {foo as bar}) - create new declaration with alias_of
								const kind = ts_infer_declaration_kind(aliased_symbol, aliased_decl);
								const decl: DeclarationJson = {
									name: export_symbol.name,
									kind,
									alias_of: {module: original_module, name: original_name},
								};
								declarations.push(decl);
							} else {
								// Same-name re-export - track for also_exported_from, skip from declarations
								re_exports.push({
									name: export_symbol.name,
									original_module,
								});
							}
							continue;
						}
						// Re-export from external module (node_modules) - skip entirely
						continue;
					}
					// Within-file alias (export { x as y }) - fall through to normal analysis
				}
			}

			// Normal export or within-file alias - declared in this file
			const {declaration, nodocs} = ts_analyze_declaration(export_symbol, source_file, checker);
			// Skip @nodocs declarations - they're excluded from documentation
			if (nodocs) continue;
			declarations.push(declaration);
		}
	}

	return {
		module_comment,
		declarations,
		re_exports,
	};
};

/**
 * Extract module-level comment.
 *
 * Only accepts JSDoc/TSDoc comments (`/** ... *\/`) followed by a blank line to distinguish
 * them from identifier-level comments. This prevents accidentally treating function/class
 * comments as module comments. Module comments can appear after imports.
 */
export const ts_extract_module_comment = (source_file: ts.SourceFile): string | undefined => {
	const full_text = source_file.getFullText();

	// Check for comments at the start of the file (before any statements)
	const leading_comments = ts.getLeadingCommentRanges(full_text, 0);
	if (leading_comments?.length) {
		for (const comment of leading_comments) {
			const comment_text = full_text.substring(comment.pos, comment.end);
			if (!comment_text.trimStart().startsWith('/**')) continue;

			// Check if there's a blank line after this comment
			const first_statement = source_file.statements[0];
			if (first_statement) {
				const between = full_text.substring(comment.end, first_statement.getStart());
				if (between.includes('\n\n')) {
					return tsdoc_clean_comment(comment_text);
				}
			} else {
				// No statements, just return the comment
				return tsdoc_clean_comment(comment_text);
			}
		}
	}

	// Check for comments before each statement (e.g., after imports)
	for (const statement of source_file.statements) {
		const statement_start = statement.getFullStart();
		const statement_pos = statement.getStart();

		// Get comments in the trivia before this statement
		const comments = ts.getLeadingCommentRanges(full_text, statement_start);
		if (!comments?.length) continue;

		for (const comment of comments) {
			const comment_text = full_text.substring(comment.pos, comment.end);
			if (!comment_text.trimStart().startsWith('/**')) continue;

			// Check if there's a blank line between comment and statement
			const between = full_text.substring(comment.end, statement_pos);
			if (between.includes('\n\n')) {
				return tsdoc_clean_comment(comment_text);
			}
		}
	}

	return undefined;
};

/**
 * Options for creating a TypeScript program.
 */
export interface TsProgramOptions {
	/** Project root directory. @default './' */
	root?: string;
	/** Path to tsconfig.json (relative to root). @default 'tsconfig.json' */
	tsconfig?: string;
	/** Override compiler options. */
	compiler_options?: ts.CompilerOptions;
}

/**
 * Create TypeScript program for analysis.
 *
 * @param log Logger for info messages
 * @param options Configuration options for program creation
 * @throws Error if tsconfig.json is not found
 */
export const ts_create_program = (
	log: {info: (message: string) => void},
	options?: TsProgramOptions,
): ts.Program => {
	const root = options?.root ?? './';
	const tsconfig_name = options?.tsconfig ?? 'tsconfig.json';

	const config_path = ts.findConfigFile(root, ts.sys.fileExists, tsconfig_name);
	if (!config_path) {
		throw new Error(`No ${tsconfig_name} found in ${root}`);
	}

	log.info(`using ${config_path}`);

	const config_file = ts.readConfigFile(config_path, ts.sys.readFile);
	const parsed_config = ts.parseJsonConfigFileContent(config_file.config, ts.sys, root);

	// Merge compiler options if provided
	const compiler_options = options?.compiler_options
		? {...parsed_config.options, ...options.compiler_options}
		: parsed_config.options;

	return ts.createProgram(parsed_config.fileNames, compiler_options);
};
