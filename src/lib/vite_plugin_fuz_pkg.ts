/**
 * Vite plugin serving a curated, publish-safe `package.json` as the virtual
 * module `virtual:pkg.json`.
 *
 * Consumers' `src/routes/library.ts` (and root layouts) need package identity —
 * name, version, the Fuz extension fields — in the client. Importing the root
 * `package.json` directly inlines the *whole* file into the client bundle
 * (`scripts`, `dependencies`, `devDependencies`, private config) and trips
 * SvelteKit's `server.fs.allow` on cold HMR reloads. This plugin reads the
 * project's `package.json` at build time, strips it to `pkg_json_keys`, and
 * serves only that subset.
 *
 * The `.json` suffix on the virtual id is load-bearing, mirroring how
 * `vite_plugin_fuz_css`'s `virtual:fuz.css` relies on `.css`: `load()` returns
 * raw JSON text and Vite's built-in `vite:json` plugin transforms it into an ES
 * module (default export plus named exports), so consumers write
 * `import package_json from 'virtual:pkg.json'`. Do *not* return a JS module
 * here — the `.json` id would double-transform it.
 *
 * ```ts
 * // vite.config.ts
 * import {vite_plugin_fuz_pkg} from '@fuzdev/fuz_ui/vite_plugin_fuz_pkg.js';
 * export default defineConfig({plugins: [vite_plugin_fuz_pkg(), sveltekit()]});
 * ```
 *
 * @module
 */

import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import type {Plugin} from 'vite';
import {pkg_json_keys} from '@fuzdev/fuz_util/pkg_json.js';

const VIRTUAL_ID = 'virtual:pkg.json';
const RESOLVED_VIRTUAL_ID = '\0virtual:pkg.json';

/**
 * Creates the `virtual:pkg.json` plugin. Zero-config for canonical fuz usage —
 * the publish-safe field set ships with `pkg_json_keys`.
 */
export const vite_plugin_fuz_pkg = (): Plugin => {
	let root = '';
	return {
		name: 'vite-plugin-fuz-pkg',
		// Resolve the virtual id before other plugins claim it.
		enforce: 'pre',
		configResolved(config) {
			root = config.root;
		},
		resolveId(id) {
			if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID;
			return undefined;
		},
		load(id) {
			if (id !== RESOLVED_VIRTUAL_ID) return undefined;
			const package_json_path = join(root, 'package.json');
			this.addWatchFile(package_json_path); // re-emit when package.json changes
			const raw = JSON.parse(readFileSync(package_json_path, 'utf8')) as Record<string, unknown>;
			const curated: Record<string, unknown> = {};
			for (const key of pkg_json_keys) {
				if (raw[key] !== undefined) curated[key] = raw[key];
			}
			return JSON.stringify(curated);
		},
	};
};
