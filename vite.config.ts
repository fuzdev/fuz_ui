import {defineConfig} from 'vite';
import {sveltekit} from '@sveltejs/kit/vite';

import {vite_plugin_well_known} from './src/lib/vite_plugin_well_known.ts';

export default defineConfig(({mode}) => ({
	plugins: [sveltekit(), vite_plugin_well_known()],
	// In test mode, use browser conditions so Svelte's mount() resolves to the client version
	resolve: mode === 'test' ? {conditions: ['browser']} : undefined,
}));
