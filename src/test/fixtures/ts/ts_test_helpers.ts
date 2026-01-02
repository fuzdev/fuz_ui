import ts from 'typescript';
import type {DeclarationJson} from '@fuzdev/fuz_util/source_json.js';

import {load_fixtures_generic} from '../../test_helpers.js';
import {
	ts_infer_declaration_kind,
	ts_extract_function_info,
	ts_extract_type_info,
	ts_extract_class_info,
	ts_extract_variable_info,
	ts_extract_module_comment,
} from '$lib/ts_helpers.js';
import {tsdoc_parse} from '$lib/tsdoc_helpers.js';
import {AnalysisContext} from '$lib/analysis_context.js';

export type TsFixtureCategory =
	| 'function'
	| 'class'
	| 'type'
	| 'variable'
	| 'module_comment'
	| 'infer_kind';

export interface TsFixture {
	name: string;
	category: TsFixtureCategory;
	input: string;
	/** string for module_comment category, null for no_comment case, otherwise DeclarationJson */
	expected: DeclarationJson | string | null;
}

/**
 * Create a TypeScript program and type checker for a given source file.
 * Used by both test files and update tasks to ensure consistent behavior.
 *
 * @param source_file - The TypeScript source file to analyze
 * @param file_path - The path identifier for the file
 * @returns An object with the program and type checker
 */
export const create_test_program = (
	source_file: ts.SourceFile,
	file_path: string,
): {program: ts.Program; checker: ts.TypeChecker} => {
	const program = ts.createProgram(
		[file_path],
		{
			target: ts.ScriptTarget.Latest,
			module: ts.ModuleKind.ESNext,
			noResolve: true,
		},
		{
			getSourceFile: (fileName) => {
				if (fileName === file_path) return source_file;
				return undefined;
			},
			writeFile: () => undefined,
			getCurrentDirectory: () => '',
			getDirectories: () => [],
			fileExists: () => true,
			readFile: () => '',
			getCanonicalFileName: (fileName) => fileName,
			useCaseSensitiveFileNames: () => true,
			getNewLine: () => '\n',
			getDefaultLibFileName: () => 'lib.d.ts',
		},
	);
	const checker = program.getTypeChecker();
	return {program, checker};
};

/**
 * A source file entry for multi-file test programs.
 */
export interface TestSourceFile {
	path: string;
	content: string;
}

/**
 * Create a TypeScript program with multiple source files.
 * Used for testing re-export scenarios where declarations are in different files.
 *
 * Note: The re-export detection in ts_helpers.ts uses `checker.getAliasedSymbol()` to
 * properly resolve aliases to their original declarations, which works correctly with
 * this test infrastructure.
 *
 * @param files - Array of source files with their paths and content
 * @returns Object with program, checker, and a map of source files by path
 */
export const create_multi_file_program = (
	files: Array<TestSourceFile>,
): {program: ts.Program; checker: ts.TypeChecker; source_files: Map<string, ts.SourceFile>} => {
	// Create source files
	const source_files = new Map<string, ts.SourceFile>();
	for (const file of files) {
		const source_file = ts.createSourceFile(file.path, file.content, ts.ScriptTarget.Latest, true);
		source_files.set(file.path, source_file);
	}

	const file_paths = files.map((f) => f.path);

	const program = ts.createProgram(
		file_paths,
		{
			target: ts.ScriptTarget.Latest,
			module: ts.ModuleKind.ESNext,
			moduleResolution: ts.ModuleResolutionKind.NodeNext,
		},
		{
			getSourceFile: (fileName) => source_files.get(fileName),
			writeFile: () => undefined,
			getCurrentDirectory: () => '/src/lib',
			getDirectories: () => [],
			fileExists: (fileName) => source_files.has(fileName),
			readFile: (fileName) => {
				const sf = source_files.get(fileName);
				return sf?.text ?? '';
			},
			getCanonicalFileName: (fileName) => fileName,
			useCaseSensitiveFileNames: () => true,
			getNewLine: () => '\n',
			getDefaultLibFileName: () => 'lib.d.ts',
			resolveModuleNames: (moduleNames, _containingFile) => {
				return moduleNames.map((name) => {
					// Handle relative imports like './foo.js' or './foo.ts'
					if (name.startsWith('./')) {
						const resolved = name.replace(/^\.\//, '/src/lib/').replace(/\.js$/, '.ts');
						if (source_files.has(resolved)) {
							return {resolvedFileName: resolved, isExternalLibraryImport: false};
						}
					}
					return undefined;
				});
			},
		},
	);

	const checker = program.getTypeChecker();
	return {program, checker, source_files};
};

/**
 * Extract a declaration from a TypeScript source file based on the fixture category.
 * Used by both test files and update tasks to ensure consistent behavior.
 *
 * @param source_file - The TypeScript source file to analyze
 * @param checker - The TypeScript type checker
 * @param category - The fixture category (function, class, type, etc.)
 * @returns The extracted declaration, or null if not found
 */
export const extract_declaration_from_source = (
	source_file: ts.SourceFile,
	checker: ts.TypeChecker,
	category: TsFixtureCategory,
): DeclarationJson | string | null => {
	// Handle module_comment category differently (returns string, not IdentifierJson)
	if (category === 'module_comment') {
		return ts_extract_module_comment(source_file) ?? null;
	}

	// Find the exported declaration
	for (const statement of source_file.statements) {
		// Check if this statement type can have modifiers
		if (
			!ts.isFunctionDeclaration(statement) &&
			!ts.isClassDeclaration(statement) &&
			!ts.isInterfaceDeclaration(statement) &&
			!ts.isTypeAliasDeclaration(statement) &&
			!ts.isVariableStatement(statement)
		) {
			continue;
		}

		const modifiers = ts.getModifiers(statement);
		const is_exported = modifiers?.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword);

		if (!is_exported) continue;

		// Get symbol and node
		let symbol: ts.Symbol | undefined;
		let node: ts.Node | undefined;

		if (ts.isFunctionDeclaration(statement) && statement.name) {
			node = statement;
			symbol = checker.getSymbolAtLocation(statement.name);
		} else if (ts.isClassDeclaration(statement) && statement.name) {
			node = statement;
			symbol = checker.getSymbolAtLocation(statement.name);
		} else if (ts.isInterfaceDeclaration(statement)) {
			node = statement;
			symbol = checker.getSymbolAtLocation(statement.name);
		} else if (ts.isTypeAliasDeclaration(statement)) {
			node = statement;
			symbol = checker.getSymbolAtLocation(statement.name);
		} else if (ts.isVariableStatement(statement)) {
			// Get the first declaration
			const decl = statement.declarationList.declarations[0];
			if (decl && ts.isIdentifier(decl.name)) {
				node = decl;
				symbol = checker.getSymbolAtLocation(decl.name);
			}
		}

		if (!symbol || !node) continue;

		const name = symbol.name;

		// For infer_kind category, just test kind inference
		if (category === 'infer_kind') {
			const kind = ts_infer_declaration_kind(symbol, node);
			return {name, kind};
		}

		// Create base declaration
		const declaration: DeclarationJson = {
			name,
			kind: ts_infer_declaration_kind(symbol, node),
		};

		// Extract TSDoc
		const tsdoc = tsdoc_parse(node, source_file);

		// Apply appropriate extraction based on category
		const ctx = new AnalysisContext();
		switch (category) {
			case 'function':
				ts_extract_function_info(node, symbol, checker, declaration, tsdoc, ctx);
				break;
			case 'class':
				ts_extract_class_info(node, symbol, checker, declaration, ctx);
				break;
			case 'type':
				ts_extract_type_info(node, symbol, checker, declaration, ctx);
				break;
			case 'variable':
				ts_extract_variable_info(node, symbol, checker, declaration, ctx);
				break;
		}

		return declaration;
	}

	return null;
};

/**
 * Infer the fixture category from its name based on naming conventions.
 */
export const infer_category_from_name = (name: string): TsFixtureCategory => {
	if (name.startsWith('class_') || name === 'fields_private' || name === 'members_public') {
		return 'class';
	}
	if (name.startsWith('function_') || name.startsWith('params_')) {
		return 'function';
	}
	if (name.startsWith('interface_') || name.startsWith('type_')) {
		return 'type';
	}
	if (name.startsWith('variable_')) {
		return 'variable';
	}
	if (name.startsWith('infer_kind_') || name.endsWith('_declaration')) {
		return 'infer_kind';
	}
	if (name.startsWith('module_comment_') || name === 'multi_line' || name === 'no_comment') {
		return 'module_comment';
	}
	throw new Error(`Cannot infer category from fixture name: ${name}`);
};

/**
 * Load all fixtures from the ts fixtures directory (flat structure).
 */
export const load_fixtures = async (): Promise<Array<TsFixture>> => {
	const generic_fixtures = await load_fixtures_generic<DeclarationJson | string | null>({
		fixtures_dir: import.meta.dirname,
		input_extension: '.ts',
	});

	// Add category inference
	return generic_fixtures.map((f) => ({
		...f,
		category: infer_category_from_name(f.name),
	}));
};

/**
 * Validate that a DeclarationJson has the expected structure.
 */
export const validate_declaration_structure = (declaration: DeclarationJson): void => {
	if (!declaration) {
		throw new Error('Expected declaration to be defined');
	}

	// Must have name and kind
	if (typeof declaration.name !== 'string') {
		throw new Error('Expected declaration.name to be a string');
	}

	if (typeof declaration.kind !== 'string') {
		throw new Error('Expected declaration.kind to be a string');
	}

	// Validate kind is one of the allowed values
	const valid_kinds = ['function', 'class', 'type', 'variable', 'component'];
	if (!valid_kinds.includes(declaration.kind)) {
		throw new Error(`Expected declaration.kind to be one of ${valid_kinds.join(', ')}`);
	}

	// Validate optional fields based on kind
	if (declaration.kind === 'function') {
		if (declaration.parameters !== undefined && !Array.isArray(declaration.parameters)) {
			throw new Error('Expected parameters to be an array');
		}
		if (declaration.return_type !== undefined && typeof declaration.return_type !== 'string') {
			throw new Error('Expected return_type to be a string');
		}
	}

	if (declaration.kind === 'class') {
		if (declaration.members !== undefined && !Array.isArray(declaration.members)) {
			throw new Error('Expected members to be an array');
		}
	}

	if (declaration.kind === 'type') {
		if (declaration.properties !== undefined && !Array.isArray(declaration.properties)) {
			throw new Error('Expected properties to be an array');
		}
	}

	// Validate generic_params if present
	if (declaration.generic_params !== undefined) {
		if (!Array.isArray(declaration.generic_params)) {
			throw new Error('Expected generic_params to be an array');
		}
		for (const param of declaration.generic_params) {
			if (typeof param.name !== 'string') {
				throw new Error('Expected generic param name to be a string');
			}
		}
	}
};
