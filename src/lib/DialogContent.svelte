<script lang="ts">
	import type {Snippet} from 'svelte';
	import type {HTMLAttributes} from 'svelte/elements';

	import {dialog_context, type DialogContext} from './dialog.js';

	/*

	The default content surface for `Dialog`: a gutter that centers a fuz_css
	`.pane` card. It reads `close` from `dialog_context` (set by `Dialog`) and
	passes it to `children`, so content can close the dialog without the consumer
	threading `close` down from `Dialog`'s own `children` snippet.

	Must be rendered inside a `Dialog`. The `.pane` class matches `Dialog`'s
	default `content_selector`, so click-outside-to-close works out of the box.

	*/

	const {
		class: class_prop = 'box p_xl',
		gutter = 'var(--space_xl3)',
		max_width = 'var(--distance_md)',
		children,
		...rest
	}: Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'> & {
		/**
		 * Classes for the `.pane` card. Defaults to the `box` layout (centered
		 * column) and comfortable padding; pass your own to replace these. The
		 * `pane` class is always applied. Avoid width utilities like
		 * `width_atmost_md` here, since they set `width: 100%`, which fills the card
		 * to `max_width` instead of letting it shrink to its content; use `max_width`.
		 * @default 'box p_xl'
		 */
		class?: string;
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
		 * Rendered inside the `.pane`. Receives the `DialogContext` (e.g. `{close}`)
		 * so content can close the dialog without reaching into `Dialog`'s
		 * `children` snippet.
		 */
		children: Snippet<[dialog: DialogContext]>;
	} = $props();

	const dialog = dialog_context.get('DialogContent must be rendered inside a Dialog');
</script>

<div class="dialog-content" style:padding={gutter}>
	<div {...rest} class="pane {class_prop}" style:max-width={max_width}>
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
</style>
