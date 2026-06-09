<script lang="ts">
	import type {Snippet} from 'svelte';
	import type {HTMLAttributes, SvelteHTMLElements} from 'svelte/elements';

	import {dialog_context, type DialogContext, type DialogCloseButtonAttrs} from './dialog.js';

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
	 * The surface has no layout of its own -- it's a plain block, so children flow
	 * top-to-bottom in normal document order. Pass `class` through (e.g. `box` for a
	 * centered column, `column` for an uncentered one) to add one.
	 *
	 * @module
	 */

	const {
		padding = 'var(--space_xl)',
		pane = true,
		gutter = 'var(--space_xl3)',
		max_width = 'var(--distance_md)',
		close_button = true,
		children,
		...rest
	}: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		/**
		 * The content surface's padding, set as an inline style. Defaults to
		 * `var(--space_xl)` for a comfortable gutter between the card edge and its
		 * content. Set to `''` or `'0'` for no padding (e.g. a flush image or a
		 * surface that manages its own spacing).
		 * @default 'var(--space_xl)'
		 */
		padding?: string;
		/**
		 * Whether to apply the fuz_css `.pane` card class to the content surface --
		 * its opaque background, shadow, and rounded corners. `true` (the default) is
		 * the standard dialog card; `false` gives a chromeless surface. Either way the
		 * surface registers with `Dialog`, so click-outside-to-close keeps working.
		 * @default true
		 */
		pane?: boolean;
		/**
		 * The gutter padding between the viewport edges and the `.pane` card: the area
		 * outside the card where a press dismisses the dialog. Set to `''` or `'0'` to remove.
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
		 * corner. `true` (the default) renders an absolutely-positioned `.sm.plain.icon_button`
		 * that closes the dialog; `false` removes it. It renders after
		 * `children`, so a content control (or an `autofocus` element) takes initial
		 * focus on open rather than the close button.
		 *
		 * Pass a `Snippet` to render your own. It receives `attrs`
		 * (`DialogCloseButtonAttrs`) carrying the default's placement, styling, a11y,
		 * and `onclick` (closes the dialog), plus the `DialogContext` (e.g. `{close}`).
		 * Spread `attrs` onto a `<button>` to inherit the corner anchoring and override
		 * only what differs (e.g. the glyph), or drop it to place the button freely. The
		 * surface is a containing block (`position: relative`), so an absolutely-positioned
		 * custom button anchors to it.
		 * @default true
		 */
		close_button?: boolean | Snippet<[attrs: DialogCloseButtonAttrs, dialog: DialogContext]>;
		/**
		 * Rendered inside the content surface. Receives the `DialogContext` (e.g.
		 * `{close}`) so content can close the dialog without reaching into `Dialog`'s
		 * `children` snippet.
		 */
		children: Snippet<[dialog: DialogContext]>;
	} = $props();

	const dialog = dialog_context.get('DialogContent must be rendered inside a Dialog');

	// the default close button's attributes; `onclick` closes the dialog and the rest
	// is handed to a custom `close_button` snippet so it can inherit the corner-anchored
	// button by spreading them. positioning is inline (not a scoped class) so it travels
	// into the consumer's snippet, which carries its own style scope
	const close_button_attrs: DialogCloseButtonAttrs = {
		type: 'button',
		class: 'sm plain icon_button',
		style: 'position: absolute; top: 0; right: 0;',
		onclick: dialog.close,
		title: 'close',
		'aria-label': 'close',
	} satisfies SvelteHTMLElements['button'];
</script>

<div class="dialog-content" style:padding={gutter}>
	<div
		{...rest}
		class:pane
		style:padding
		style:max-width={max_width}
		{@attach dialog.register_surface}
	>
		{@render children(dialog)}
		<!-- rendered after `children` so a content control (or an `autofocus` element)
		takes initial focus on open, not the close button -->
		{#if close_button === true}
			<button {...close_button_attrs}>✕</button>
		{:else if close_button}
			{@render close_button(close_button_attrs, dialog)}
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
</style>
