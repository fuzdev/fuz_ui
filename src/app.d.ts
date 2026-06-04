// Registers ambient types for the `virtual:svelte-docinfo` module (Vite plugin).
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="svelte-docinfo/virtual-svelte-docinfo.js" />

declare module 'virtual:fuz.css' {
	const css: string;
	export default css;
}

// `virtual:pkg.json` is served by `vite_plugin_fuz_pkg` — the curated package.json.
declare module 'virtual:pkg.json' {
	import type {PkgJson} from '@fuzdev/fuz_util/pkg_json.js';
	const package_json: PkgJson;
	export default package_json;
}
