import {defineConfig} from 'vite';
import {sveltekit} from '@sveltejs/kit/vite';
import svelte_docinfo from 'svelte-docinfo/vite.js';
import {vite_plugin_fuz_css} from '@fuzdev/fuz_css/vite_plugin_fuz_css.js';

import {vite_plugin_pkg_json} from './src/lib/vite_plugin_pkg_json.js';

export default defineConfig(({mode}) => ({
	plugins: [vite_plugin_fuz_css(), vite_plugin_pkg_json(), sveltekit(), svelte_docinfo()],
	// In test mode, use browser conditions so Svelte's mount() resolves to the client version
	resolve: mode === 'test' ? {conditions: ['browser']} : undefined,
	optimizeDeps: {exclude: ['@fuzdev/blake3_wasm']},
}));
