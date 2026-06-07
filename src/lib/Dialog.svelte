<script lang="ts">
	import type {Snippet} from 'svelte';
	import {swallow} from '@fuzdev/fuz_util/dom.js';

	import type {DialogLayout} from './dialog.js';

	/*

	This component renders a native `<dialog>` opened with `showModal()`, which puts
	it in the top layer. The top layer escapes ancestor stacking/overflow contexts
	(so no `Teleport` is needed), traps focus, makes the rest of the page inert,
	closes on Escape, and restores focus to the previously focused element on close
	-- all natively. The dim background is the native `::backdrop`.

	We render a full-viewport overlay (a centered `.dialog-content`) inside the
	dialog rather than a content-sized box, to preserve the scrolling and
	`layout="page"` behaviors.

	*/

	const {
		show = true,
		layout = 'centered',
		content_selector = '.pane',
		onclose,
		children,
	}: {
		/**
		 * Whether the dialog is shown. When the `<dialog>` mounts it opens via
		 * `showModal()`; when it unmounts it closes.
		 * Defaults to `true` so the `{#if opened}<Dialog>...</Dialog>{/if}` pattern
		 * works without passing `show` -- mounting the component opens the dialog.
		 * Pass `show={opened}` to skip the outer `{#if}` and let the component manage
		 * its own conditional rendering.
		 * @default true
		 */
		show?: boolean;
		/**
		 * @default 'centered'
		 */
		layout?: DialogLayout;
		/**
		 * If set, clicks inside the dialog but outside the closest element matching
		 * this selector close the dialog. Set to `null` to disable click-outside.
		 * @default '.pane'
		 */
		content_selector?: string | null;
		onclose?: () => void;
		children: Snippet<[close: (e?: Event) => void]>;
	} = $props();

	let dialog_el: HTMLDialogElement | undefined;
	let content_el: HTMLElement | undefined = $state.raw();

	// Guards against a single dismissal firing `onclose` twice. Reset on mount.
	let closing = false;

	// Closes the native dialog (which restores focus to the trigger) and notifies
	// the consumer to unmount us. Closing here, while still mounted and connected,
	// is what makes focus restoration work -- closing on unmount would run on a
	// detached node, which doesn't restore focus.
	const request_close = () => {
		if (closing) return;
		closing = true;
		dialog_el?.close();
		onclose?.();
	};

	// The `close` passed to children also swallows the triggering event.
	const close = (e?: Event) => {
		if (e) swallow(e);
		request_close();
	};

	const setup_dialog = (el: HTMLDialogElement) => {
		dialog_el = el;
		closing = false;
		// Esc (and any platform close request) fires `cancel`. We swallow it and
		// close the dialog ourselves (above, while connected) so focus is restored,
		// and so the consumer's state stays in sync and we unmount.
		const oncancel = (e: Event) => {
			swallow(e);
			request_close();
		};
		el.addEventListener('cancel', oncancel);
		if (!el.open) el.showModal();
		return () => {
			el.removeEventListener('cancel', oncancel);
			dialog_el = undefined;
			// fallback for programmatic unmount (e.g. `show` set false directly)
			if (el.open) el.close();
		};
	};
</script>

{#if show}
	<dialog class="dialog" class:layout-page={layout === 'page'} {@attach setup_dialog}>
		<div class="dialog-layout">
			<div
				class="dialog-wrapper"
				role="none"
				onmousedown={(e) => {
					// Close if clicking outside `content_el` but inside the wrapper.
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
				<div class="dialog-content" bind:this={content_el}>
					{@render children(close)}
				</div>
			</div>
		</div>
	</dialog>
{/if}

<style>
	.dialog {
		--pane_shadow: var(--shadow_bottom_xl)
			color-mix(
				in hsl,
				var(--shadow_color, var(--shadow_color_umbra)) var(--shadow_alpha_70),
				transparent
			);
		/* reset the user-agent dialog styles; we render a full-viewport overlay */
		max-width: none;
		max-height: none;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		border: none;
		background: transparent;
		color: inherit;
		position: fixed;
		inset: 0;
		overflow: auto;
		overscroll-behavior: contain;
	}
	/* the native backdrop is the dim background; fade it in on open */
	.dialog::backdrop {
		background-color: var(--dialog_bg, var(--darken_60));
		transition: background-color var(--duration_2) ease;
	}
	@starting-style {
		.dialog::backdrop {
			background-color: transparent;
		}
	}

	/* Lock background scroll while a modal dialog is open. `scrollbar-gutter`
	reserves the scrollbar space so toggling the lock doesn't shift the layout. */
	:global(html:has(dialog.dialog[open])) {
		overflow: hidden;
		scrollbar-gutter: stable;
	}

	.dialog-wrapper {
		position: relative; /* for the surface */
		min-height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.layout-page .dialog-wrapper {
		align-items: start;
	}

	.dialog-layout {
		height: 100%;
		/* makes the content overflow downwards instead of upwards+downwards because it's centered */
		max-height: 100%;
	}

	.dialog-content {
		width: 100%;
		padding: 40px;
	}
</style>
