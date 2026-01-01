/**
 * TSDoc/JSDoc parsing helpers using the TypeScript Compiler API.
 *
 * Provides `tsdoc_parse()` for extracting JSDoc/TSDoc from TypeScript nodes.
 * Primarily designed for build-time code generation but can be used at runtime.
 *
 * ## Design
 *
 * Pure extraction approach: extracts documentation as-is with minimal transformation,
 * preserving source intent. Works around TypeScript Compiler API quirks where needed.
 *
 * Supports both regular TypeScript and Svelte components (via svelte2tsx output).
 *
 * ## Tag support
 *
 * Supports a subset of standard TSDoc tags:
 * `@param`, `@returns`, `@throws`, `@example`, `@deprecated`, `@see`, `@since`, `@nodocs`.
 *
 * The `@nodocs` tag excludes exports from documentation and flat namespace validation.
 * The declaration is still exported and usable, just not documented.
 *
 * Also supports `@mutates` (non-standard) for documenting mutations to parameters or external state.
 * Use format: `@mutates paramName - description of mutation`.
 *
 * Only `@returns` is supported (not `@return`).
 *
 * The `@see` tag supports multiple formats: plain URLs (`https://...`), `{@link}` syntax, and module names.
 * Relative/absolute path support in `@see` is TBD.
 *
 * ## Behavioral notes
 *
 * Due to TS Compiler API limitations:
 * - Preserves dash separator in `@param` descriptions: `@param x desc` → `"- desc"`
 * - `@throws` tags have `{Type}` stripped by TS API; fallback regex extracts first word as error type
 * - TS API strips URL protocols from `@see` tag text; we use `getText()` to preserve original format including `{@link}` syntax
 *
 * All functions are prefixed with `tsdoc_` for clarity.
 *
 * @module
 */

import ts from 'typescript';
import type {DeclarationJson} from '@fuzdev/fuz_util/source_json.js';

/**
 * Parsed JSDoc/TSDoc comment with structured metadata.
 */
export interface TsdocParsedComment {
	/** Comment text (excluding comment markers) */
	text: string;
	/** Parameter descriptions mapped by parameter name */
	params: Map<string, string>;
	/** Return value description from `@returns` */
	returns?: string;
	/** Thrown errors from `@throws` */
	throws?: Array<{type?: string; description: string}>;
	/** Code examples from `@example` */
	examples?: Array<string>;
	/** Deprecation message from `@deprecated` */
	deprecated_message?: string;
	/** Related references from `@see` */
	see_also?: Array<string>;
	/** Version information from `@since` */
	since?: string;
	/** Mutation documentation from `@mutates` (non-standard) */
	mutates?: Array<string>;
	/** Whether to exclude from documentation. From `@nodocs` tag. */
	nodocs?: boolean;
}

/**
 * Parse JSDoc comment from a TypeScript node.
 *
 * Extracts and parses all JSDoc tags including:
 *
 * - `@param` - parameter descriptions
 * - `@returns` - return value description
 * - `@throws` - error documentation
 * - `@example` - code examples
 * - `@deprecated` - deprecation warnings
 * - `@see` - related references
 * - `@since` - version information
 * - `@mutates` - mutation documentation (non-standard)
 *
 * @param node The TypeScript node to extract JSDoc from
 * @param source_file Source file (used for extracting full` @see` tag text)
 */
export const tsdoc_parse = (
	node: ts.Node,
	source_file: ts.SourceFile,
): TsdocParsedComment | undefined => {
	const tsdoc_comments = ts.getJSDocCommentsAndTags(node);
	if (tsdoc_comments.length === 0) return undefined;

	let full_text = '';
	const params: Map<string, string> = new Map();
	let returns: string | undefined;
	const throws: Array<{type?: string; description: string}> = [];
	const examples: Array<string> = [];
	let deprecated_message: string | undefined;
	const see_also: Array<string> = [];
	let since: string | undefined;
	const mutates: Array<string> = [];
	let nodocs = false;

	// Extract main comment text
	for (const comment of tsdoc_comments) {
		if (ts.isJSDoc(comment) && comment.comment) {
			const text =
				typeof comment.comment === 'string'
					? comment.comment
					: comment.comment.map((c) => c.text).join('');
			full_text += text + '\n';
		}
	}

	// Extract tags
	const tags = ts.getJSDocTags(node);
	for (const tag of tags) {
		const tag_text =
			typeof tag.comment === 'string' ? tag.comment : tag.comment?.map((c) => c.text).join('');
		const tag_name = tag.tagName.text;

		if (tag_name === 'param' && ts.isJSDocParameterTag(tag)) {
			// Extract parameter name and description
			const param_name = ts.isIdentifier(tag.name) ? tag.name.text : tag.name.getText();
			if (param_name && tag_text) {
				params.set(param_name, tag_text.trim());
			}
		} else if (tag_name === 'returns' && tag_text) {
			returns = tag_text.trim();
		} else if (tag_name === 'throws' && tag_text) {
			// Try to extract error type and description
			const match = /^\{?(\w+)\}?\s+(.+)/.exec(tag_text);
			if (match) {
				throws.push({type: match[1], description: match[2]!.trim()});
			} else {
				throws.push({description: tag_text.trim()});
			}
		} else if (tag_name === 'example' && tag_text) {
			examples.push(tag_text.trim());
		} else if (tag_name === 'deprecated' && tag_text) {
			deprecated_message = tag_text.trim();
		} else if (tag_name === 'see') {
			// The TS API strips 'https' from URLs in @see tags, so get full text from source
			const full_tag_text = tag.getText(source_file);
			// Extract content after @see, handling JSDoc formatting artifacts
			const see_content = full_tag_text
				.replace(/^@see\s+/, '') // remove @see prefix
				.replace(/\n\s*\*\s*/g, ' ') // remove JSDoc line continuations
				.replace(/\s*\*\s*$/, '') // remove trailing asterisk artifacts
				.trim();

			if (see_content) {
				see_also.push(see_content);
			}
		} else if (tag_name === 'since' && tag_text) {
			since = tag_text.trim();
		} else if (tag_name === 'mutates' && tag_text) {
			mutates.push(tag_text.trim());
		} else if (tag_name === 'nodocs') {
			nodocs = true;
		}
	}

	full_text = full_text.trim();

	return {
		text: full_text,
		params,
		returns,
		...(throws.length && {throws}),
		...(examples.length && {examples}),
		deprecated_message,
		...(see_also.length && {see_also}),
		since,
		...(mutates.length && {mutates}),
		...(nodocs && {nodocs}),
	};
};

/**
 * Apply parsed TSDoc metadata to a declaration.
 *
 * Consolidates the common pattern of assigning TSDoc fields to declarations,
 * with conditional assignment for array fields (only if non-empty).
 *
 * @param declaration declaration object to update
 * @param tsdoc parsed TSDoc comment (if available)
 * @mutates declaration - adds doc_comment, deprecated_message, examples, see_also, throws, since fields
 */
export const tsdoc_apply_to_declaration = (
	declaration: DeclarationJson,
	tsdoc: TsdocParsedComment | undefined,
): void => {
	if (!tsdoc) return;

	declaration.doc_comment = tsdoc.text;
	declaration.deprecated_message = tsdoc.deprecated_message;

	// Only assign arrays if they have content
	if (tsdoc.examples?.length) {
		declaration.examples = tsdoc.examples;
	}
	if (tsdoc.see_also?.length) {
		declaration.see_also = tsdoc.see_also;
	}
	if (tsdoc.throws?.length) {
		declaration.throws = tsdoc.throws;
	}
	if (tsdoc.since) {
		declaration.since = tsdoc.since;
	}
};

/**
 * Clean raw JSDoc comment text by removing comment markers and leading asterisks.
 *
 * Transforms `/** ... *\/` style comments into clean text.
 *
 * @param comment_text The raw comment text including `/**` and `*\/` markers
 * @returns Cleaned comment text, or undefined if empty after cleaning
 */
export const tsdoc_clean_comment = (comment_text: string): string | undefined => {
	const text = comment_text
		.replace(/^\/\*\*/, '')
		.replace(/\*\/$/, '')
		.split('\n')
		.map((line) => line.replace(/^\s*\*\s?/, ''))
		.join('\n')
		.trim();

	return text || undefined;
};
