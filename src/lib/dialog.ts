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
}

export const dialog_context = create_context<DialogContext>();
