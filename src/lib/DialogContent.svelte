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
		class: class_prop = 'box p_xl width_atmost_md',
		gutter = 'var(--space_xl3)',
		children,
		...rest
	}: Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'> & {
		/**
		 * Classes for the `.pane` card. Defaults to the `box` layout (centered
		 * column), comfortable padding, and a readable max width; pass your own to
		 * replace these (e.g. `'p_lg'` for a full-width card). The `pane` class is
		 * always applied.
		 * @default 'box p_xl width_atmost_md'
		 */
		class?: string;
		/**
		 * The gutter between the viewport edges and the `.pane` card -- the area
		 * outside the card where a press dismisses the dialog. Set to `''` to remove.
		 * @default 'var(--space_xl3)'
		 */
		gutter?: string;
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
	<div {...rest} class="pane {class_prop}">
		{@render children(dialog)}
	</div>
</div>

<style>
	.dialog-content {
		width: 100%;
		/* center the card; the card shrink-wraps unless a width class constrains it */
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
