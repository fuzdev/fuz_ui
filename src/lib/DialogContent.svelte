<script lang="ts">
	import type {Snippet} from 'svelte';
	import type {HTMLAttributes} from 'svelte/elements';

	import {dialog_context, type DialogContext} from './dialog.js';

	/**
	 * The default content surface for `Dialog`: a gutter that centers a fuz_css
	 * `.pane` card. It reads `close` from `dialog_context` (set by `Dialog`) and
	 * passes it to `children`, so content can close the dialog without the consumer
	 * threading `close` down from `Dialog`'s own `children` snippet.
	 *
	 * Must be rendered inside a `Dialog`. The `.pane` class matches `Dialog`'s
	 * default `content_selector`, so click-outside-to-close works out of the box;
	 * pass `pane={false}` to drop the card (see that prop for the `content_selector`
	 * caveat).
	 *
	 * By default it renders a `close_button` in the surface's top-right corner. The
	 * surface is a containing block (`position: relative`), so the button -- and any
	 * absolutely-positioned content in `children` -- anchors to it.
	 *
	 * @module
	 */

	const {
		class: class_prop = 'box p_xl',
		pane = true,
		gutter = 'var(--space_xl3)',
		max_width = 'var(--distance_md)',
		close_button = true,
		children,
		...rest
	}: Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'> & {
		/**
		 * Classes for the content surface. Defaults to the `box` layout (centered
		 * column) and comfortable padding; pass your own to replace these. The `pane`
		 * card class is applied separately, toggled by the `pane` prop. Avoid width
		 * utilities like `width_atmost_md` here, since they set `width: 100%`, which
		 * fills the card to `max_width` instead of letting it shrink to its content;
		 * use `max_width`.
		 * @default 'box p_xl'
		 */
		class?: string;
		/**
		 * Whether to apply the fuz_css `.pane` card class to the content surface --
		 * its opaque background, shadow, and rounded corners. `true` (the default) is
		 * the standard dialog card.
		 *
		 * Set `false` for a chromeless surface, but note `Dialog`'s
		 * `content_selector` defaults to `.pane`: without the class,
		 * click-outside-to-close treats presses inside the surface as outside and
		 * closes the dialog. When opting out, also set `Dialog`'s `content_selector`
		 * to match your surface (or pass `dismissable={false}`).
		 * @default true
		 */
		pane?: boolean;
		/**
		 * The gutter between the viewport edges and the `.pane` card: the area
		 * outside the card where a press dismisses the dialog. Set to `''` to remove.
		 * @default 'var(--space_xl3)'
		 */
		gutter?: string;
		/**
		 * The card's max width. The card shrinks to its content and is capped here,
		 * so narrow content stays narrow while wide content doesn't sprawl. Set to
		 * `''` for no cap (pure shrink-to-content).
		 * @default 'var(--distance_md)'
		 */
		max_width?: string;
		/**
		 * The close button anchored to the top-right corner of the content surface.
		 * `true` (the default) renders a `.plain` icon button that closes the dialog;
		 * `false` removes it. Pass a `Snippet` to render your own, receiving the
		 * `DialogContext` (e.g. `{close}`). The surface is a containing block
		 * (`position: relative`), so the button anchors to it.
		 * @default true
		 */
		close_button?: boolean | Snippet<[dialog: DialogContext]>;
		/**
		 * Rendered inside the content surface. Receives the `DialogContext` (e.g.
		 * `{close}`) so content can close the dialog without reaching into `Dialog`'s
		 * `children` snippet.
		 */
		children: Snippet<[dialog: DialogContext]>;
	} = $props();

	const dialog = dialog_context.get('DialogContent must be rendered inside a Dialog');
</script>

<div class="dialog-content" style:padding={gutter}>
	<div {...rest} class={class_prop} class:pane style:max-width={max_width}>
		{#if close_button}
			{#if typeof close_button === 'boolean'}
				<button
					type="button"
					class="dialog-close-button plain icon_button"
					onclick={dialog.close}
					title="close"
					aria-label="close"
				>
					✕
				</button>
			{:else}
				{@render close_button(dialog)}
			{/if}
		{/if}
		{@render children(dialog)}
	</div>
</div>

<style>
	.dialog-content {
		width: 100%;
		/* center the card and let it shrink to its content (capped by `max_width`);
		`align-items: center` keeps the flex child from stretching to full width */
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	/* the surface is a containing block so absolutely-positioned content -- the
	close button, and anything in `children` -- anchors to it */
	.dialog-content > div {
		position: relative;
	}
	.dialog-close-button {
		position: absolute;
		top: 0;
		right: 0;
	}
</style>
