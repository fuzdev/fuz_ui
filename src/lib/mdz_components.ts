import type {Component} from 'svelte';

import {create_context} from './context_helpers.js';

/**
 * Component registry for custom Svelte components that can be used in mdz content.
 *
 * For example, registering 'Alert' allows using `<Alert>...</Alert>` in mdz content.
 *
 * The Map values are the Svelte component constructors.
 */
export type MdzComponents = Map<string, Component<any, any>>; // TODO support params

/**
 * Element registry for HTML elements that can be used in mdz content.
 *
 * For example, registering 'div' allows using `<div>...</div>` in mdz content.
 *
 * The Map values are boolean placeholders for future configuration options.
 */
export type MdzElements = Map<string, boolean>;

/**
 * Context for providing custom mdz components via a getter function.
 * Set to a getter (e.g., `() => components`) so changes are reflected reactively.
 */
export const mdz_components_context = create_context<() => MdzComponents | undefined>();

/**
 * Context for providing allowed HTML elements via a getter function.
 * Set to a getter (e.g., `() => elements`) so changes are reflected reactively.
 * By default, no HTML elements are allowed.
 */
export const mdz_elements_context = create_context<() => MdzElements | undefined>();

/**
 * Context for providing a base path getter for resolving relative links in mdz content.
 * Set to a getter (e.g., `() => base`) so changes to the base prop are reflected
 * without needing an effect. When the getter returns a path like `'/docs/mdz/'`,
 * relative paths like `./grammar` resolve to `/docs/mdz/grammar` before rendering.
 * When not set, relative paths use raw hrefs (browser resolves them).
 */
export const mdz_base_context = create_context<() => string | undefined>();

interface MdzGetterContext<T> {
	get_maybe(): (() => T | undefined) | undefined;
	set(value: () => T | undefined): unknown;
}

/**
 * Set an mdz context to a getter that prefers the local `value_fn` and falls
 * back to the ancestor's value when `value_fn()` returns `undefined`.
 *
 * Pass `value_fn` as a getter (not a snapshot) so prop changes remain reactive.
 * The ancestor lookup happens once at component init — that's intentional, it
 * captures the surrounding scope's context at mount time.
 */
export const set_mdz_context_with_fallback = <T>(
	context: MdzGetterContext<T>,
	value_fn: () => T | undefined,
): void => {
	const ancestor = context.get_maybe();
	context.set(() => value_fn() ?? ancestor?.());
};
