<script lang="ts">
	import type {Snippet} from 'svelte';
	import {is_editable, swallow} from '@fuzdev/fuz_util/dom.js';
	import {wait} from '@fuzdev/fuz_util/async.js';

	import Teleport from './Teleport.svelte';
	import type {DialogLayout} from './dialog.js';

	// TODO use `<dialog>` here instead of `Teleport`
	// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog

	/*

	This component is a singleton that mounts to a #dialog container element added to the body,
	using a `Teleport` component to avoid ancestor-caused style issues like overflow and z-index.
	It adds `.dialog` to the body when mounted to fix scrolling behavior,
	and adds padding to the body to adjust for any scrollbars.
	It uses a CSS custom property for this to avoid the high complexity of trying to
	correctly revert any preexisting values for overflow and padding on the body.
	We don't want to add restrictions to what users can do to the body on their own!

	*/

	const {
		container,
		layout = 'centered',
		index = 0,
		active = true,
		content_selector = '.pane',
		onclose,
		children,
	}: {
		// TODO maybe change this API away from an element to a selector? or remove the API completely?
		container?: HTMLElement;
		/**
		 * @default 'centered'
		 */
		layout?: DialogLayout;
		/**
		 * index 0 is under 1 is under 2 etc -- the topmost dialog is the last in the array
		 * @default 0
		 */
		index?: number;
		/**
		 * @default true
		 */
		active?: boolean;
		/**
		 * If provided, prevents clicks that would close the dialog
		 * from bubbling past any elements matching this selector.
		 * @default '.pane'
		 */
		content_selector?: string | null;
		onclose?: () => void;
		children: Snippet<[close: (e?: Event) => void]>;
	} = $props();

	const ROOT_SELECTOR = 'body'; // TODO make configurable
	const CONTAINER_ID = 'fuz_dialog';

	let container_el: HTMLElement | undefined = $state();
	$effect(() => {
		update_container_el(container);
	});

	const update_container_el = (container: HTMLElement | undefined): void => {
		if (container) {
			container_el = container;
		} else {
			const found = document.getElementById(CONTAINER_ID);
			if (found) {
				container_el = found;
			} else {
				const root_el = document.querySelector(ROOT_SELECTOR);
				if (!root_el) {
					throw Error(`Cannot find dialog root element with selector '${ROOT_SELECTOR}'`);
				}
				container_el = document.createElement('div');
				container_el.id = CONTAINER_ID;
				container_el.style.display = 'contents';
				root_el.appendChild(container_el);
			}
		}
	};

	let dialog_el: HTMLElement | undefined = $state();
	let content_el: HTMLElement | undefined = $state();

	const close = (e?: Event) => {
		if (e) swallow(e);
		onclose?.();
	};

	// TODO hook into a ui input system
	const on_window_keydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape' && !is_editable(e.target)) {
			// apply hotkey only for the top-most dialog
			const parent_el = dialog_el?.parentElement;
			const parents = parent_el?.parentElement?.children;
			const index = Array.prototype.indexOf.call(parents, parent_el);
			if (!parents || index === parents.length - 1 || index === -1) {
				close(e);
			}
		}
	};

	// The dialog isn't "ready" until the teleport moves it.
	// Rendering the the dialog's children only once it's ready fixes things like `autofocus`.
	let ready = $state(false);
</script>

<svelte:window onkeydown={active ? on_window_keydown : undefined} />

<!--
	The `tabindex` and `el.focus()` fix scrolling with the keyboard,
	needed because SvelteKit puts `tabindex` on the body,
	but there's more that needs to be done for accessibility, like focus capture.
	For more see: https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal
	and https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets
-->
<Teleport
	to={container_el}
	onmove={async () => {
		await wait(); // TODO this is a hack to get animations working, `Teleport` now mounts synchronously?!
		ready = true;
		dialog_el?.focus(); // TODO make this more declarative? probably want to focus only after moving though, not on mount, which makes an action trickier
	}}
>
	<div
		class="dialog"
		class:ready
		class:layout_page={layout === 'page'}
		role="dialog"
		aria-modal="true"
		bind:this={dialog_el}
		tabindex="-1"
		style:z-index={100 + index}
	>
		<div class="dialog_layout">
			<div
				class="dialog_wrapper"
				role="none"
				onmousedown={(e) => {
					// Close if clicking outside `content_el` but inside the wrapper
					const target = e.target as Element;
					if (
						content_el &&
						(content_el === target ||
							!content_el.contains(target) ||
							(content_selector && !target.closest(content_selector)))
					) {
						close(e);
					}
				}}
			>
				<div class="dialog_bg" aria-hidden="true"></div>
				<div class="dialog_content" bind:this={content_el}>
					<!-- mount the content only after teleporting to avoid issues -->
					{#if ready}{@render children(close)}{/if}
				</div>
			</div>
		</div>
	</div>
</Teleport>

<style>
	.dialog {
		--pane_shadow: var(--shadow_bottom_xl)
			color-mix(in hsl, var(--shadow_color) var(--shadow_alpha_5), transparent);
		position: fixed;
		inset: 0;
		overflow: auto;
		/* this simplifies the code a lot but doesn't prevent scrolling
		the underlying content when the dialog doesn't overflow, even when `overflow: scroll`
		TODO check if this behaves as desired after switching to use the `dialog` element */
		overscroll-behavior: contain;
	}

	.dialog_wrapper {
		position: relative; /* for the bg */
		min-height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.layout_page .dialog_wrapper {
		align-items: start;
	}

	.dialog_bg {
		position: absolute;
		inset: 0;
		z-index: 0;
		opacity: 0;
		transition: opacity var(--duration_3) ease;
		background-color: var(--dialog_bg, var(--darken_6));
	}
	.ready .dialog_bg {
		opacity: 1;
	}

	.dialog_layout {
		height: 100%;
		/* makes the content overflow downwards instead of upwards+downwards because it's centered */
		max-height: 100%;
	}

	.dialog_content {
		width: 100%;
		transform: scale(0.99);
		transition: transform var(--duration_1) ease;
		padding: 40px;
	}
	.ready .dialog_content {
		transform: scale(1);
	}
</style>
