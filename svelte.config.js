import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';
import {svelte_preprocess_fuz_code} from '@fuzdev/fuz_code/svelte_preprocess_fuz_code.js';

// Self-referencing import from dist — unavailable on first build after clean checkout,
// but subsequent builds use the preprocessor for static Mdz compilation.
/** @type {Array<import('svelte/compiler').PreprocessorGroup>} */
let fuz_mdz_preprocessors = [];
try {
	const {svelte_preprocess_mdz} = await import('@fuzdev/fuz_ui/svelte_preprocess_mdz.js');
	fuz_mdz_preprocessors = [
		svelte_preprocess_mdz({
			component_imports: ['$lib/Mdz.svelte'],
			compiled_component_import: '$lib/MdzPrecompiled.svelte',
		}),
	];
} catch {}

// TODO see `csp_trusted_sources_of_fuzdev`, it shouldn't be in fuz
/** @type {any[]} */
const csp_trusted_sources_of_fuz = ['https://*.fuz.dev/', 'https://*.zzz.software/'];

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: [...fuz_mdz_preprocessors, svelte_preprocess_fuz_code(), vitePreprocess()],
	compilerOptions: {runes: true},
	vitePlugin: {inspector: true},
	kit: {
		adapter: adapter(),
		paths: {relative: false}, // use root-absolute paths for SSR path comparison: https://svelte.dev/docs/kit/configuration#paths
		alias: {$routes: 'src/routes', '@fuzdev/fuz_ui': 'src/lib'},
		csp: {
			directives: {
				'default-src': ['none'],
				'script-src': ['self', 'sha256-QOxqn7EUzb3ydF9SALJoJGWSvywW9R0AfTDSenB83Z8='],
				'script-src-elem': ['self', 'sha256-QOxqn7EUzb3ydF9SALJoJGWSvywW9R0AfTDSenB83Z8='],
				'script-src-attr': ['none'],
				'style-src': ['self', 'unsafe-inline'],
				'style-src-elem': ['self', 'unsafe-inline'],
				'style-src-attr': ['unsafe-inline'],
				'img-src': ['self', 'data:', 'blob:', 'filesystem:', ...csp_trusted_sources_of_fuz],
				'media-src': [
					'self',
					'blob:',
					'mediastream:',
					'filesystem:',
					...csp_trusted_sources_of_fuz,
				],
				'font-src': ['self', 'data:', ...csp_trusted_sources_of_fuz],
				'manifest-src': ['self'],
				'child-src': ['none'],
				'connect-src': ['self'],
				'frame-src': ['self'],
				'frame-ancestors': ['self'],
				'form-action': ['self'],
				'worker-src': ['self', 'blob:'],
				'object-src': ['none'],
				'base-uri': ['none'],
				'upgrade-insecure-requests': true,
			},
		},
	},
};
