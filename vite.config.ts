import {defineConfig} from 'vite';
import {sveltekit} from '@sveltejs/kit/vite';
import svelte_docinfo from 'svelte-docinfo/vite.js';
import {vite_plugin_fuz_css} from '@fuzdev/fuz_css/vite_plugin_fuz_css.ts';

import {vite_plugin_pkg_json} from './src/lib/vite_plugin_pkg_json.js';
import {vite_plugin_docs_mdz} from './src/lib/vite_plugin_docs_mdz.js';

export default defineConfig(({mode}) => ({
	plugins: [
		sveltekit(),
		svelte_docinfo(),
		vite_plugin_docs_mdz(), // pre-parses svelte-docinfo's markdown fields to MdzNode trees
		vite_plugin_fuz_css(),
		vite_plugin_pkg_json(),
	],
	// In test mode, use browser conditions so Svelte's mount() resolves to the client version
	resolve: mode === 'test' ? {conditions: ['browser']} : undefined,
	optimizeDeps: {exclude: ['@fuzdev/blake3_wasm']},
}));
