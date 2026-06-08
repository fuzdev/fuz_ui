import {create_context} from './context_helpers.js';

export type DialogLayout = 'centered' | 'page';
export const dialog_layouts: Array<DialogLayout> = ['centered', 'page'];

/**
 * Set by `Dialog`, read by `DialogContent`. Lets the content surface close the
 * dialog without the consumer threading `close` through the `children` snippet.
 */
export interface DialogContext {
	/**
	 * Closes the dialog. When passed an event it's swallowed (default-prevented
	 * and propagation-stopped) before closing.
	 */
	close: (e?: Event) => void;
	/**
	 * Registers a content-surface element so a press inside it isn't treated as an
	 * outside-dismiss -- the surface is known by node identity, independent of any
	 * class. Use as an attachment on the surface: `{@attach register_surface}`.
	 * Returns a cleanup that unregisters on unmount.
	 */
	register_surface: (element: Element) => () => void;
}

export const dialog_context = create_context<DialogContext>();
