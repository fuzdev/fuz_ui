/**
 * Pure helpers behind `DeclarationDetail`: the token streams its signature
 * lines render, which parameters earn a row of their own, and the fragments
 * that address a declaration's fields.
 *
 * A signature is composed from the structured fields (`parameters`,
 * `returnType`, `genericParams`) instead of the flat `typeSignature`, so each
 * type in it renders through `TypeLink` and links on its own.
 *
 * @module
 */

import type {
	ComponentPropJsonInput,
	DeclarationModifier,
	GenericParamJsonInput,
	MemberJsonInput,
	ParameterJsonInput,
	TypeJson
} from 'svelte-docinfo/types.js';

/**
 * One piece of a rendered signature line. Spacing lives in the token text, so
 * a renderer emits the tokens adjacent with nothing between them.
 *
 * - `keyword` - a TypeScript keyword around the name (`readonly `, `new `, ` extends `)
 * - `name` - the name the line declares, rendered as its heading
 * - `text` - punctuation and parameter names
 * - `type` - a type, with its structured tree when the analysis emitted one
 * - `value` - a default's source text
 */
export type SignatureToken =
	| { kind: 'keyword'; text: string }
	| { kind: 'name'; text: string }
	| { kind: 'text'; text: string }
	| { kind: 'type'; type: string; type_info?: TypeJson }
	| { kind: 'value'; text: string };

/**
 * The callable fields a signature is composed from, shared by function
 * declarations, function members, and overloads.
 */
export interface SignatureCallable {
	/** The checker's flat rendering, the fallback where composing would lose something. */
	typeSignature?: string;
	genericParams?: Array<GenericParamJsonInput>;
	parameters?: Array<ParameterJsonInput>;
	returnType?: string;
	returnTypeInfo?: TypeJson;
}

/**
 * Modifiers that are TypeScript keywords in front of a member, in the order
 * TypeScript writes them. The rest (`getter`, `setter`) describe the member
 * without being its syntax, and render as chips.
 */
const SIGNATURE_KEYWORD_MODIFIERS: ReadonlyArray<DeclarationModifier> = [
	'public',
	'protected',
	'static',
	'abstract',
	'readonly'
];

/** The name TypeScript gives a destructured parameter, which has none of its own. */
const DESTRUCTURED_PARAMETER_MATCHER = /^__\d+$/;

/**
 * What a flat signature can show that the structured fields can't: a type
 * predicate or assertion return (`returnType` is the checker's `boolean` or
 * `void`), a `this` parameter (absent from `parameters`), and a `const` type
 * parameter (absent from `genericParams`).
 */
const SIGNATURE_FLAT_ONLY_MATCHERS: ReadonlyArray<RegExp> = [
	/\): (?:asserts [\w$]+(?: is .+)?|[\w$]+ is .+)$/,
	/^(?:<.*>)?\(this: /,
	/^<(?:const |.*?, const )/
];

/**
 * Whether composing a signature from the structured fields keeps everything
 * its flat `typeSignature` shows. It doesn't for a destructured parameter
 * (structured as `__0`, with the binding pattern only in the flat text), a
 * type predicate or assertion return, a `this` parameter, or a `const` type
 * parameter; those keep the flat signature. A callable with no flat signature
 * to fall back on is composed regardless.
 */
export const signature_is_composable = (callable: SignatureCallable): boolean => {
	const { typeSignature } = callable;
	if (!typeSignature) return true;
	if (callable.parameters?.some((param) => DESTRUCTURED_PARAMETER_MATCHER.test(param.name))) {
		return false;
	}
	return !SIGNATURE_FLAT_ONLY_MATCHERS.some((matcher) => matcher.test(typeSignature));
};

/** Sentinel member names svelte-docinfo gives unnamed call and construct signatures. */
const MEMBER_NAME_CALL = '(call)';
const MEMBER_NAME_CONSTRUCT = '(construct)';

const push_text = (tokens: Array<SignatureToken>, text: string): void => {
	const last = tokens[tokens.length - 1];
	if (last?.kind === 'text') {
		last.text += text;
	} else {
		tokens.push({ kind: 'text', text });
	}
};

const push_type = (tokens: Array<SignatureToken>, type: string, type_info?: TypeJson): void => {
	tokens.push(type_info ? { kind: 'type', type, type_info } : { kind: 'type', type });
};

const push_default = (tokens: Array<SignatureToken>, default_value: string | undefined): void => {
	if (default_value === undefined) return;
	push_text(tokens, ' = ');
	tokens.push({ kind: 'value', text: default_value });
};

const push_generics = (
	tokens: Array<SignatureToken>,
	generic_params: Array<GenericParamJsonInput> | undefined
): void => {
	if (!generic_params?.length) return;
	push_text(tokens, '<');
	for (let i = 0; i < generic_params.length; i++) {
		const generic = generic_params[i]!;
		push_text(tokens, i > 0 ? ', ' + generic.name : generic.name);
		if (generic.constraint) {
			tokens.push({ kind: 'keyword', text: ' extends ' });
			push_type(tokens, generic.constraint);
		}
		if (generic.defaultType) {
			push_text(tokens, ' = ');
			push_type(tokens, generic.defaultType);
		}
	}
	push_text(tokens, '>');
};

// defaults stay out of a composed parameter list: a parameter with one gets a
// row of its own, which shows it
const push_parameters = (
	tokens: Array<SignatureToken>,
	parameters: Array<ParameterJsonInput> | undefined
): void => {
	push_text(tokens, '(');
	if (parameters) {
		for (let i = 0; i < parameters.length; i++) {
			const param = parameters[i]!;
			push_text(
				tokens,
				(i > 0 ? ', ' : '') +
					(param.rest ? '...' : '') +
					param.name +
					(param.optional ? '?: ' : ': ')
			);
			push_type(tokens, param.type, param.typeInfo);
		}
	}
	push_text(tokens, ')');
};

const push_callable = (tokens: Array<SignatureToken>, callable: SignatureCallable): void => {
	push_generics(tokens, callable.genericParams);
	push_parameters(tokens, callable.parameters);
	if (callable.returnType) {
		push_text(tokens, ': ');
		push_type(tokens, callable.returnType, callable.returnTypeInfo);
	}
};

/**
 * Composes `name<T>(a: A, b?: B): R` for a function declaration or one of its
 * overloads. A callable with no `returnType` (a snippet) ends at the
 * parameter list.
 *
 * Composes unconditionally: callers check `signature_is_composable` first and
 * keep the flat signature where it says more.
 */
export const to_function_signature_tokens = (
	name: string,
	callable: SignatureCallable
): Array<SignatureToken> => {
	const tokens: Array<SignatureToken> = [{ kind: 'name', text: name }];
	push_callable(tokens, callable);
	return tokens;
};

/**
 * Composes `name?: Type = default` for a parameter's own row, or
 * `...name: Type` for a rest parameter.
 */
export const to_parameter_signature_tokens = (param: ParameterJsonInput): Array<SignatureToken> => {
	const tokens: Array<SignatureToken> = [];
	if (param.rest) push_text(tokens, '...');
	tokens.push({ kind: 'name', text: param.name });
	push_text(tokens, param.optional ? '?: ' : ': ');
	push_type(tokens, param.type, param.typeInfo);
	push_default(tokens, param.defaultValue);
	return tokens;
};

/**
 * Composes `name?: Type = default` for a component prop.
 */
export const to_prop_signature_tokens = (prop: ComponentPropJsonInput): Array<SignatureToken> => {
	const tokens: Array<SignatureToken> = [{ kind: 'name', text: prop.name }];
	push_text(tokens, prop.optional ? '?: ' : ': ');
	push_type(tokens, prop.type, prop.typeInfo);
	push_default(tokens, prop.defaultValue);
	return tokens;
};

export interface MemberSignatureOptions {
	/**
	 * Leaves a variable member's type off, for enum values, whose type is
	 * only the enum's name joined to their own.
	 */
	omit_type?: boolean;
}

/**
 * Composes a member's line after the way TypeScript declares it:
 * `readonly name?: Type = default` for a property, `name<T>(a: A): R` for a
 * method, `constructor(a: A)` for a class constructor, and the bare
 * `(a: A): R` or `new (a: A): R` for an unnamed call or construct signature.
 * The line follows the data, not the source text: svelte-docinfo emits a
 * function-typed property as a method, so `now: () => number` reads
 * `now(): number`, and a quoted name prints without its quotes.
 *
 * The name is followed by the flat `typeSignature` instead where composing
 * would lose something: a callable whose extraction failed (`partial`), one
 * `signature_is_composable` rejects, and a construct signature (which
 * carries no structured return type).
 */
export const to_member_signature_tokens = (
	member: MemberJsonInput,
	options?: MemberSignatureOptions
): Array<SignatureToken> => {
	const tokens: Array<SignatureToken> = [];
	const { modifiers } = member;
	if (modifiers?.length) {
		for (const keyword of SIGNATURE_KEYWORD_MODIFIERS) {
			if (modifiers.includes(keyword)) {
				tokens.push({ kind: 'keyword', text: keyword + ' ' });
			}
		}
	}
	const flat = member.kind !== 'variable' && (member.partial || !signature_is_composable(member));
	if (member.kind === 'constructor') {
		if (member.name === MEMBER_NAME_CONSTRUCT) {
			tokens.push({ kind: 'keyword', text: member.typeSignature ? 'new ' : 'new' });
			if (member.typeSignature) push_type(tokens, member.typeSignature);
		} else {
			tokens.push({ kind: 'name', text: member.name });
			if (!flat) {
				push_parameters(tokens, member.parameters);
			} else if (member.typeSignature) {
				push_type(tokens, member.typeSignature);
			}
		}
		return tokens;
	}
	if (member.name !== MEMBER_NAME_CALL) {
		tokens.push({ kind: 'name', text: member.name });
		if (member.optional) push_text(tokens, '?');
	}
	if (member.kind === 'function') {
		if (!flat) {
			push_callable(tokens, member);
		} else if (member.typeSignature) {
			push_type(tokens, member.typeSignature);
		}
	} else if (member.typeSignature && !options?.omit_type) {
		push_text(tokens, ': ');
		push_type(tokens, member.typeSignature, member.typeInfo);
	}
	push_default(tokens, member.defaultValue);
	return tokens;
};

/**
 * The modifiers that render as chips beside a member's line, the ones that
 * aren't keywords in it.
 */
export const to_member_chip_modifiers = (member: MemberJsonInput): Array<string> =>
	member.modifiers?.filter((modifier) => !SIGNATURE_KEYWORD_MODIFIERS.includes(modifier)) ?? [];

/**
 * Whether a parameter says more than a composed signature already shows: a
 * description, a default, or documented properties. One that doesn't gets no
 * row of its own.
 */
export const parameter_has_detail = (param: ParameterJsonInput): boolean =>
	!!param.description ||
	param.defaultValue !== undefined ||
	(!!param.propertyDescriptions && Object.keys(param.propertyDescriptions).length > 0);

// no whitespace (invalid in an id), no `.` (the path separator), and no
// brackets or parens (index signatures, computed names, the sentinels)
const FRAGMENT_PART_MATCHER = /^[^\s.()[\]]+$/;

/**
 * Builds the URL fragment addressing a field of a declaration:
 * `SidebarState.toggle` for a member, prop, or parameter, and
 * `SidebarState.constructor.options` for a parameter of a member.
 *
 * @param declaration_name - the declaration the field belongs to
 * @param path - the field's name, preceded by its owning member's when nested
 * @returns `undefined` for a name that isn't a plain key: one with whitespace
 * (an index signature's `[key: string]`), a `.` (the separator, so the
 * fragment stays unambiguous), or brackets or parens (a computed name, the
 * `(call)` and `(construct)` sentinels)
 */
export const to_declaration_field_fragment = (
	declaration_name: string,
	...path: Array<string>
): string | undefined =>
	path.length > 0 && path.every((part) => FRAGMENT_PART_MATCHER.test(part))
		? declaration_name + '.' + path.join('.')
		: undefined;
