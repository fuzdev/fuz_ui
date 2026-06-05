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
 * serves only that subset. Consumers combine it with `virtual:svelte-docinfo`'s
 * analyzed `modules` via `library_json_from_modules` to build a `LibraryJson`
 * (see `src/routes/library.ts` for the canonical pattern).
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
 * import {vite_plugin_pkg_json} from '@fuzdev/fuz_ui/vite_plugin_pkg_json.js';
 * export default defineConfig({plugins: [vite_plugin_pkg_json(), sveltekit()]});
 * ```
 *
 * @module
 */

import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import type {Plugin, Rollup} from 'vite';
import {pkg_json_keys} from '@fuzdev/fuz_util/pkg_json.js';

const VIRTUAL_ID = 'virtual:pkg.json';
/**
 * Resolved id, `\0`-prefixed — the conventional Rollup marker for "this id is
 * mine," hiding the virtual module from other plugins and the dev module graph.
 *
 * This deliberately diverges from `vite_plugin_fuz_css`, which avoids the `\0`
 * on its resolved id: SvelteKit's dev FOUC prevention inlines `virtual:fuz.css`
 * into the SSR'd `<head>` via URL lookup and can't resolve the `\0`-encoded
 * form, so the page would flash unstyled. JSON is never inlined into `<head>`,
 * so that constraint doesn't apply here and the `\0` is free to do its normal
 * job. The trailing `.json` survives the prefix, so Vite's built-in `vite:json`
 * plugin still matches and transforms the loaded text (see the module comment).
 */
const RESOLVED_VIRTUAL_ID = '\0virtual:pkg.json';

/**
 * Creates the `virtual:pkg.json` plugin. Zero-config for canonical fuz usage —
 * the publish-safe field set ships with `pkg_json_keys`.
 */
export const vite_plugin_pkg_json = (): Plugin => {
	let root = '';
	let is_dev = false;
	/** Curated JSON cached for build; left `null` in dev so `load` re-reads. */
	let cached: string | null = null;

	/**
	 * Reads `package.json`, strips it to `pkg_json_keys`, and returns the curated
	 * JSON text. Routes failures through the plugin context (`ctx.error`/`ctx.warn`)
	 * so a missing or malformed file surfaces as a named, actionable diagnostic
	 * rather than a raw `readFileSync`/`JSON.parse` stack trace.
	 */
	const read_curated = (ctx: Rollup.PluginContext): string => {
		const package_json_path = join(root, 'package.json');
		ctx.addWatchFile(package_json_path); // re-emit when package.json changes
		let raw: Record<string, unknown>;
		try {
			raw = JSON.parse(readFileSync(package_json_path, 'utf8')) as Record<string, unknown>;
		} catch (err) {
			// ctx.error throws, so this never returns
			return ctx.error(
				`vite_plugin_pkg_json: failed to read or parse ${package_json_path}: ${(err as Error).message}`,
			);
		}
		if (raw.name === undefined) {
			ctx.warn(`vite_plugin_pkg_json: ${package_json_path} has no "name" field`);
		}
		const curated: Record<string, unknown> = {};
		for (const key of pkg_json_keys) {
			if (raw[key] !== undefined) curated[key] = raw[key];
		}
		return JSON.stringify(curated);
	};

	return {
		name: 'vite-plugin-pkg-json',
		// Resolve the virtual id before other plugins claim it.
		enforce: 'pre',
		configResolved(config) {
			root = config.root;
			is_dev = config.command === 'serve';
		},
		buildStart() {
			// Read package.json once up front so a missing or malformed file fails
			// immediately — at build start, or at dev-server startup — rather than
			// only when something first imports the virtual module. In build the
			// result is cached for `load`; in dev `load` re-reads each time so edits
			// to package.json propagate through the `addWatchFile`-driven reload.
			const curated = read_curated(this);
			if (!is_dev) cached = curated;
		},
		resolveId(id) {
			if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID;
			return undefined;
		},
		load(id) {
			if (id !== RESOLVED_VIRTUAL_ID) return undefined;
			return cached ?? read_curated(this);
		},
	};
};
