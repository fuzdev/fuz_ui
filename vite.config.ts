import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';
import { execSync } from 'node:child_process';
import svelte_docinfo from 'svelte-docinfo/vite.js';
import { svelte_preprocess_mdz } from '@fuzdev/mdz/svelte_preprocess_mdz.ts';
import { svelte_preprocess_fuz_code } from '@fuzdev/fuz_code/svelte_preprocess_fuz_code.ts';
import { vite_plugin_fuz_css } from '@fuzdev/fuz_css/vite_plugin_fuz_css.ts';

// fuz_ui's own modules import from source, not via the `@fuzdev/fuz_ui` self-reference,
// so the config loads on a fresh checkout with no `dist/`
import { vite_plugin_pkg_json } from './src/lib/vite_plugin_pkg_json.ts';
import { create_csp_directives } from './src/lib/csp.ts';
import { csp_directives_of_fuzdev } from './src/lib/csp_of_fuzdev.ts';

export default defineConfig(({ mode }) => ({
	server: {
		// Vite watches the whole root, an inotify watch per file, and gro's `.gro/` output
		// needn't come out of the user's `max_user_watches` budget
		watch: { ignored: ['**/.gro/**'] }
	},
	plugins: [
		sveltekit({
			preprocess: [svelte_preprocess_mdz(), svelte_preprocess_fuz_code(), vitePreprocess()],
			compilerOptions: { runes: true },
			inspector: true,
			adapter: adapter(),
			paths: { relative: false }, // use root-absolute paths for SSR path comparison: https://svelte.dev/docs/kit/configuration#paths
			csp: { directives: create_csp_directives({ extend: [csp_directives_of_fuzdev] }) },
			version: { name: execSync('git rev-parse HEAD').toString().trim() }
		}),
		svelte_docinfo({ onDuplicates: 'throw' }),
		vite_plugin_fuz_css(),
		vite_plugin_pkg_json()
	],
	// In test mode, use browser conditions so Svelte's mount() resolves to the client version
	resolve: mode === 'test' ? { conditions: ['browser'] } : undefined,
	optimizeDeps: { exclude: ['@fuzdev/blake3-wasm'] }
}));
