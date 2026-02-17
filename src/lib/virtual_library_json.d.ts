/**
 * Type declaration for the `virtual:library.json` virtual module
 * provided by `vite_plugin_library_json`.
 *
 * Reference in your `app.d.ts`:
 *
 * ```ts
 * /// <reference types="@fuzdev/fuz_ui/virtual_library_json.js" />
 * ```
 */
declare module 'virtual:library.json' {
	import type {LibraryJson} from '@fuzdev/fuz_util/library_json.js';
	export const library_json: LibraryJson;
}
