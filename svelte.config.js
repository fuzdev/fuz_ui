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

// fuz_ui's own CSP — hand-rolled because self-import-from-dist is fragile during builds.
// Kept in sync with `create_csp_directives({extend: [csp_directives_of_fuzdev]})` by
// `src/test/svelte_config.csp.test.ts`. TODO swap to the helper once the dist round-trip settles.
const csp_fuzdev_extensions = /** @type {const} */ ([
	'https://*.fuz.dev/',
	'https://*.zzz.software/',
]);

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
				'script-src': [
					'self',
					'wasm-unsafe-eval',
					'sha256-QOxqn7EUzb3ydF9SALJoJGWSvywW9R0AfTDSenB83Z8=',
				],
				'script-src-elem': ['self', 'sha256-QOxqn7EUzb3ydF9SALJoJGWSvywW9R0AfTDSenB83Z8='],
				'script-src-attr': ['none'],
				'style-src': ['self', 'unsafe-inline'],
				'style-src-elem': ['self', 'unsafe-inline'],
				'style-src-attr': ['unsafe-inline'],
				'img-src': ['self', 'data:', 'blob:', 'filesystem:', ...csp_fuzdev_extensions],
				'media-src': [
					'self',
					'data:',
					'blob:',
					'mediastream:',
					'filesystem:',
					...csp_fuzdev_extensions,
				],
				'font-src': ['self', 'data:', ...csp_fuzdev_extensions],
				'manifest-src': ['self'],
				'child-src': ['none'],
				'connect-src': ['self', ...csp_fuzdev_extensions],
				'frame-src': ['self', ...csp_fuzdev_extensions],
				'frame-ancestors': ['self', ...csp_fuzdev_extensions],
				'form-action': ['self'],
				'worker-src': ['self', 'blob:', 'wasm-unsafe-eval'],
				'object-src': ['none'],
				'base-uri': ['none'],
				'upgrade-insecure-requests': true,
			},
		},
	},
};
