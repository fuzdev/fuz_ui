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

// TODO the `Signature*` types in this module spell out fields svelte-docinfo
// emits after 0.18.1, so the module typechecks against the release that
// lacks them; delete them for svelte-docinfo's own types once a release with
// the fields is the floor

/**
 * A signature's type predicate or assertion (`x is A`, `asserts x is A`,
 * `asserts x`), which `returnType` (the checker's `boolean` or `void`) can't show.
 */
export interface SignatureReturnPredicate {
	/** The narrowed parameter's name, or `this`. */
	parameterName: string;
	asserts?: boolean;
	/** Absent for a bare `asserts x`. */
	type?: string;
	typeInfo?: TypeJson;
}

/** A generic parameter with its modifiers and the trees beside its source-text types. */
export type SignatureGenericParam = GenericParamJsonInput & {
	/** `const`, `in`, and `out`, as written. */
	modifiers?: Array<string>;
	constraintInfo?: TypeJson;
	defaultTypeInfo?: TypeJson;
};

/** A parameter with the binding pattern a destructured one is written as. */
export type SignatureParameter = ParameterJsonInput & {
	/** A destructured parameter's pattern (`{ a, b = 1 }`), beside its positional `name`. */
	pattern?: string;
};

/** What a signature declares beyond its parameters and return type. */
export interface SignatureFacts {
	returnPredicate?: SignatureReturnPredicate;
	/** The type of a declared `this` parameter, which `parameters` leaves out. */
	thisType?: string;
	thisTypeInfo?: TypeJson;
}

/**
 * The callable fields a signature is composed from, shared by function
 * declarations, function members, and overloads.
 */
export interface SignatureCallable extends SignatureFacts {
	/** The checker's flat rendering, the fallback where composing would lose something. */
	typeSignature?: string;
	genericParams?: Array<SignatureGenericParam>;
	parameters?: Array<SignatureParameter>;
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

// What a flat signature shows that svelte-docinfo's structured fields lacked
// through 0.18.1: a type predicate or assertion return, a `this` parameter,
// and a `const` type parameter. Each is consulted only where the field that
// now carries the fact is absent.
// TODO delete with `signature_is_composable` once every supported
// svelte-docinfo emits `returnPredicate`, `thisType`, `pattern`, and
// generic `modifiers`
const FLAT_PREDICATE_RETURN_MATCHER = /^(?:asserts |[\w$]+ is )/;
const FLAT_SIGNATURE_PREDICATE_MATCHER = /\): (?:asserts [\w$]+(?: is .+)?|[\w$]+ is .+)$/;
const FLAT_SIGNATURE_THIS_MATCHER = /^(?:<.*>)?\(this: /;
const FLAT_SIGNATURE_CONST_MATCHER = /^<(?:const |.*?, const )/;

const has_unnamed_destructured_parameter = (
	parameters: Array<SignatureParameter> | undefined
): boolean =>
	!!parameters?.some(
		(param) => param.pattern === undefined && DESTRUCTURED_PARAMETER_MATCHER.test(param.name)
	);

/**
 * Whether composing a signature from the structured fields keeps everything
 * its flat `typeSignature` shows. Four things need a field of their own: a
 * destructured parameter (`pattern`; its `name` is only `__0`), a type
 * predicate or assertion return (`returnPredicate`), a `this` parameter
 * (`thisType`), and a `const` type parameter (a generic's `modifiers`). Where
 * the flat text shows one and the data lacks its field, the flat signature
 * stays. A callable with no flat signature to fall back on is
 * composed regardless.
 */
export const signature_is_composable = (callable: SignatureCallable): boolean => {
	const { typeSignature } = callable;
	if (!typeSignature) return true;
	if (has_unnamed_destructured_parameter(callable.parameters)) return false;
	if (!callable.returnPredicate && FLAT_SIGNATURE_PREDICATE_MATCHER.test(typeSignature)) {
		return false;
	}
	if (callable.thisType === undefined && FLAT_SIGNATURE_THIS_MATCHER.test(typeSignature)) {
		return false;
	}
	return !(
		FLAT_SIGNATURE_CONST_MATCHER.test(typeSignature) &&
		!callable.genericParams?.some((generic) => generic.modifiers?.includes('const'))
	);
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
	generic_params: Array<SignatureGenericParam> | undefined
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
 * Composes unconditionally: callers check `signature_is_composable` first and
 * keep the flat signature where it says more.
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
 * Composes `name?: Type = default` for a parameter's own row, or
 * `...name: Type` for a rest parameter. A destructured parameter is named by
 * its pattern where the data carries one.
 */
export const to_parameter_signature_tokens = (param: SignatureParameter): Array<SignatureToken> => {
	const tokens: Array<SignatureToken> = [];
	if (param.rest) push_text(tokens, '...');
	tokens.push({ kind: 'name', text: param.pattern ?? param.name });
	push_text(tokens, param.optional ? '?: ' : ': ');
	push_type(tokens, param.type, param.typeInfo);
	push_default(tokens, param.defaultValue);
	return tokens;
};

/**
 * The return clause of a bare function type, `(…) => R` — `undefined` for
 * anything else: a function type inside a union or intersection
 * (`((a: A) => R) | null`), a generic one, or no function at all.
 */
const to_function_type_return = (type: string): string | undefined => {
	if (type[0] !== '(') return undefined;
	let depth = 0;
	for (let i = 0; i < type.length; i++) {
		const char = type[i];
		if (char === '(') {
			depth++;
		} else if (char === ')' && --depth === 0) {
			return type.startsWith(' => ', i + 1) ? type.slice(i + 5) : undefined;
		}
	}
	return undefined;
};

/** A component prop with the signature fields a callback prop can carry. */
export type SignatureProp = ComponentPropJsonInput &
	SignatureFacts & { parameters?: Array<SignatureParameter> };

/**
 * Whether a callback prop's type composes from its `parameters` and
 * `returnType` without losing anything: its flat type is a bare function
 * type, and what it shows beyond parameters and a return type (a destructured
 * parameter, a type predicate return, a `this` parameter) the prop carries as
 * a field.
 * Composed, each parameter's type links and keeps the alias names the flat
 * string expands.
 */
export const prop_is_composable = (prop: SignatureProp): boolean => {
	if (prop.returnType === undefined) return false;
	const flat_return = to_function_type_return(prop.type);
	return (
		flat_return !== undefined &&
		(!!prop.returnPredicate || !FLAT_PREDICATE_RETURN_MATCHER.test(flat_return)) &&
		(prop.thisType !== undefined || !prop.type.startsWith('(this: ')) &&
		!has_unnamed_destructured_parameter(prop.parameters)
	);
};

/**
 * Composes `name?: Type = default` for a component prop, with a callback
 * prop's type composed as `(a: A) => R` where `prop_is_composable` allows.
 */
export const to_prop_signature_tokens = (prop: SignatureProp): Array<SignatureToken> => {
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
 * A member with the signature facts and `property`, set on a function member written as a function-typed
 * property (`now: () => number`) and not as a method.
 */
export type SignatureMember = MemberJsonInput &
	SignatureFacts & { property?: boolean; parameters?: Array<SignatureParameter> };

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
 * would lose something: a callable whose extraction failed (`partial`), one
 * `signature_is_composable` rejects, and a construct signature (which
 * carries no structured return type).
 */
export const to_member_signature_tokens = (
	member: SignatureMember,
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
