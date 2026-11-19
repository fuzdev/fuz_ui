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
	OverloadJsonInput,
	ParameterJsonInput,
	TypeJson
} from 'svelte-docinfo/types.js';

import { dedent_continuation_lines } from './helpers.ts';

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
 * declarations, function members, constructors, and overloads: the
 * parameters, the return type or its predicate (`x is A`), the generics,
 * and a declared `this` parameter.
 */
export type SignatureCallable = Partial<
	Pick<
		OverloadJsonInput,
		| 'typeSignature'
		| 'genericParams'
		| 'parameters'
		| 'returnType'
		| 'returnTypeInfo'
		| 'returnPredicate'
		| 'thisType'
		| 'thisTypeInfo'
	>
>;

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

// a default that spans lines can't sit in a signature line; `to_default_block`
// hands it to the renderer as a block instead
const push_default = (tokens: Array<SignatureToken>, default_value: string | undefined): void => {
	if (default_value === undefined || default_value.includes('\n')) return;
	push_text(tokens, ' = ');
	tokens.push({ kind: 'value', text: default_value });
};

/**
 * A default that spans lines, dedented for a block of its own beneath the
 * signature, which carries only single-line defaults.
 *
 * @returns `undefined` for an absent or single-line default
 */
export const to_default_block = (default_value: string | undefined): string | undefined =>
	default_value?.includes('\n') ? dedent_continuation_lines(default_value) : undefined;

const IDENTIFIER_MATCHER = /^[\p{ID_Start}_$][\p{ID_Continue}$]*$/u;

/**
 * A member's or prop's name as TypeScript writes it as a key: quoted unless
 * it's an identifier, a number, or a bracketed form (an index signature, a
 * computed name). The source's own quote style isn't in the data, so single
 * quotes.
 */
const to_key_text = (name: string): string =>
	IDENTIFIER_MATCHER.test(name) || /^\d+$/.test(name) || name.startsWith('[')
		? name
		: `'${name.replace(/[\\']/g, '\\$&')}'`;

const push_generics = (
	tokens: Array<SignatureToken>,
	generic_params: Array<GenericParamJsonInput> | undefined
): void => {
	if (!generic_params?.length) return;
	push_text(tokens, '<');
	for (let i = 0; i < generic_params.length; i++) {
		const generic = generic_params[i]!;
		if (i > 0) push_text(tokens, ', ');
		if (generic.modifiers?.length) {
			tokens.push({ kind: 'keyword', text: generic.modifiers.join(' ') + ' ' });
		}
		push_text(tokens, generic.name);
		if (generic.constraint) {
			tokens.push({ kind: 'keyword', text: ' extends ' });
			push_type(tokens, generic.constraint, generic.constraintInfo);
		}
		if (generic.defaultType) {
			push_text(tokens, ' = ');
			push_type(tokens, generic.defaultType, generic.defaultTypeInfo);
		}
	}
	push_text(tokens, '>');
};

// defaults stay out of a composed parameter list: a parameter with one gets a
// row of its own, which shows it. A declared `this` parameter leads the list,
// as TypeScript writes it, and a destructured parameter shows its pattern
const push_parameters = (tokens: Array<SignatureToken>, callable: SignatureCallable): void => {
	const { parameters } = callable;
	push_text(tokens, '(');
	if (callable.thisType !== undefined) {
		push_text(tokens, 'this: ');
		push_type(tokens, callable.thisType, callable.thisTypeInfo);
	}
	if (parameters) {
		for (let i = 0; i < parameters.length; i++) {
			const param = parameters[i]!;
			push_text(
				tokens,
				(i > 0 || callable.thisType !== undefined ? ', ' : '') +
					(param.rest ? '...' : '') +
					(param.pattern ?? param.name) +
					(param.optional ? '?: ' : ': ')
			);
			push_type(tokens, param.type, param.typeInfo);
		}
	}
	push_text(tokens, ')');
};

// the return clause after its `: ` or ` => `: a type predicate or assertion
// where the signature declares one, else the return type
const push_return = (tokens: Array<SignatureToken>, callable: SignatureCallable): void => {
	const predicate = callable.returnPredicate;
	if (!predicate) {
		if (callable.returnType) push_type(tokens, callable.returnType, callable.returnTypeInfo);
		return;
	}
	if (predicate.asserts) tokens.push({ kind: 'keyword', text: 'asserts ' });
	push_text(tokens, predicate.parameterName);
	if (predicate.type !== undefined) {
		tokens.push({ kind: 'keyword', text: ' is ' });
		push_type(tokens, predicate.type, predicate.typeInfo);
	}
};

const push_callable = (tokens: Array<SignatureToken>, callable: SignatureCallable): void => {
	push_generics(tokens, callable.genericParams);
	push_parameters(tokens, callable);
	if (callable.returnType || callable.returnPredicate) {
		push_text(tokens, ': ');
		push_return(tokens, callable);
	}
};

// a function type, `<T>(a: A) => R`, for a callback prop and a function-typed property
const push_function_type = (tokens: Array<SignatureToken>, callable: SignatureCallable): void => {
	push_generics(tokens, callable.genericParams);
	push_parameters(tokens, callable);
	push_text(tokens, ' => ');
	push_return(tokens, callable);
};

/**
 * Composes `name<T>(a: A, b?: B): R` for a function declaration, a method, or
 * one of their overloads. A callable with no `returnType` (a snippet, a
 * constructor) ends at the parameter list. The unnamed-signature sentinels
 * render as TypeScript writes them: `(call)` as the bare `(a: A): R`,
 * `(construct)` as `new (a: A): R`.
 *
 * @param name - the declaration's or member's name
 */
export const to_function_signature_tokens = (
	name: string,
	callable: SignatureCallable
): Array<SignatureToken> => {
	const tokens: Array<SignatureToken> = [];
	if (name === MEMBER_NAME_CONSTRUCT) {
		tokens.push({ kind: 'keyword', text: 'new ' });
	} else if (name !== MEMBER_NAME_CALL) {
		tokens.push({ kind: 'name', text: name });
	}
	push_callable(tokens, callable);
	return tokens;
};

/**
 * Whether a member is a class constructor, whose signatures render without
 * the instance-type return svelte-docinfo gives them, as TypeScript writes
 * them; an interface's `(construct)` signature keeps its return.
 */
export const member_is_class_constructor = (member: MemberJsonInput): boolean =>
	member.kind === 'constructor' && member.name !== MEMBER_NAME_CONSTRUCT;

/**
 * Composes `name?: Type = default` for a parameter's own row, or
 * `...name: Type` for a rest parameter. A destructured parameter is named by
 * its pattern.
 */
export const to_parameter_signature_tokens = (param: ParameterJsonInput): Array<SignatureToken> => {
	const tokens: Array<SignatureToken> = [];
	if (param.rest) push_text(tokens, '...');
	tokens.push({ kind: 'name', text: param.pattern ?? param.name });
	push_text(tokens, param.optional ? '?: ' : ': ');
	push_type(tokens, param.type, param.typeInfo);
	push_default(tokens, param.defaultValue);
	return tokens;
};

/**
 * Whether a type is a bare function type, `(…) => R`, and not a function type
 * inside a union or intersection (`((a: A) => R) | null`), a generic one, or
 * no function at all.
 */
const is_bare_function_type = (type: string): boolean => {
	if (type[0] !== '(') return false;
	let depth = 0;
	for (let i = 0; i < type.length; i++) {
		const char = type[i];
		if (char === '(') {
			depth++;
		} else if (char === ')' && --depth === 0) {
			return type.startsWith(' => ', i + 1);
		}
	}
	return false;
};

/**
 * Whether a callback prop's type composes from its `parameters` and
 * `returnType` without losing anything: its flat type is a bare function
 * type. Any other type a callback prop has (a union with a function type, a
 * generic function type, a named function type) stays as written.
 * Composed, each parameter's type links and keeps the alias names the flat
 * string expands.
 */
export const prop_is_composable = (prop: ComponentPropJsonInput): boolean =>
	prop.returnType !== undefined && is_bare_function_type(prop.type);

/**
 * Composes `name?: Type = default` for a component prop, with a callback
 * prop's type composed as `(a: A) => R` where `prop_is_composable` allows.
 */
export const to_prop_signature_tokens = (prop: ComponentPropJsonInput): Array<SignatureToken> => {
	const tokens: Array<SignatureToken> = [{ kind: 'name', text: to_key_text(prop.name) }];
	push_text(tokens, prop.optional ? '?: ' : ': ');
	if (prop_is_composable(prop)) {
		push_function_type(tokens, prop);
	} else {
		push_type(tokens, prop.type, prop.typeInfo);
	}
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
 * A function-typed property reads `now: () => number` where the data marks it
 * (`property`) and has one signature; unmarked, or with overloads, which
 * the method form lists one by one, it reads `now(): number`. A name that needs quotes gets single ones,
 * whatever the source wrote.
 *
 * The name is followed by the flat `typeSignature` instead where composing
 * would lose something: a callable whose extraction failed (`partial`), and
 * a construct signature (which carries no structured return type).
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
	const flat = member.kind !== 'variable' && !!member.partial;
	if (member.kind === 'constructor') {
		if (member.name === MEMBER_NAME_CONSTRUCT) {
			tokens.push({ kind: 'keyword', text: member.typeSignature ? 'new ' : 'new' });
			if (member.typeSignature) push_type(tokens, member.typeSignature);
		} else {
			tokens.push({ kind: 'name', text: member.name });
			if (!flat) {
				push_parameters(tokens, member);
			} else if (member.typeSignature) {
				push_type(tokens, member.typeSignature);
			}
		}
		return tokens;
	}
	if (member.name !== MEMBER_NAME_CALL) {
		tokens.push({ kind: 'name', text: to_key_text(member.name) });
		if (member.optional) push_text(tokens, '?');
	}
	if (member.kind === 'function') {
		if (!flat && member.property && member.name !== MEMBER_NAME_CALL && !member.overloads?.length) {
			push_text(tokens, ': ');
			push_function_type(tokens, member);
		} else if (!flat) {
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
