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
	 * Must be rendered inside a `Dialog`, with which it registers its surface, so
	 * click-outside-to-close treats presses inside the card as inside regardless of
	 * classes -- `pane={false}` works without further setup.
	 *
	 * By default it renders a `close_button` floating just outside the surface's
	 * top-right corner. The surface is a containing block (`position: relative`) for
	 * that button and any absolutely-positioned content in `children`.
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
		 * the standard dialog card; `false` gives a chromeless surface. Either way the
		 * surface registers with `Dialog`, so click-outside-to-close keeps working.
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
		 * The close button floating just outside the content surface's top-right
		 * corner. `true` (the default) renders an absolutely-positioned `.plain` icon
		 * button that closes the dialog; `false` removes it. It renders after
		 * `children`, so a content control (or an `autofocus` element) takes initial
		 * focus on open rather than the close button. Pass a `Snippet` to render your
		 * own, receiving the `DialogContext` (e.g. `{close}`); the surface is a
		 * containing block (`position: relative`), so an absolutely-positioned custom
		 * button anchors to it.
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
	<div
		{...rest}
		class={class_prop}
		class:pane
		style:max-width={max_width}
		{@attach dialog.register_surface}
	>
		{@render children(dialog)}
		<!-- rendered after `children` so a content control (or an `autofocus` element)
		takes initial focus on open, not the close button -->
		{#if close_button}
			{#if typeof close_button === 'boolean'}
				<button
					type="button"
					class="dialog-close-button sm plain icon_button"
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
	/* the surface is a containing block for absolutely-positioned content in
	`children` (and custom close buttons) */
	.dialog-content > div {
		position: relative;
	}
	.dialog-close-button {
		/* out of flow, floating just outside the pane's top-right corner -- offset
		by the button's own width and height */
		position: absolute;
		top: 0;
		right: 0;
		transform: translate(calc(100% - 4px), calc(-100% + 4px));
	}
</style>
