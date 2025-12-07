import {vitePreprocess} from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-static';

// SvelteKit currently can't import local TS directly,
// so this is my one project that hardcodes the CSP for now. Needs to be kept in sync.
//
// import {create_csp_directives} from './dist/csp.js';
// import {csp_trusted_sources_of_ryanatkn} from './dist/csp_of_ryanatkn.js';
// const directives = create_csp_directives({trusted_sources: csp_trusted_sources_of_ryanatkn});
/** @type {any[]} */
const csp_trusted_sources_of_ryanatkn = [
	'https://*.ryanatkn.com/',
	'https://*.spiderspace.org/',
	'https://*.webdevladder.net/',
	'https://*.dealt.dev/',
	'https://*.fuz.dev/',
	'https://*.zzz.software/',
	'https://*.cosmicplayground.org/',
	'https://ryanatkn.github.io/',
];

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: [vitePreprocess()],
	compilerOptions: {runes: true},
	vitePlugin: {inspector: true},
	kit: {
		adapter: adapter(),
		paths: {relative: false}, // use root-absolute paths for SSR path comparison: https://kit.svelte.dev/docs/configuration#paths
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
				'img-src': ['self', 'data:', 'blob:', 'filesystem:', ...csp_trusted_sources_of_ryanatkn],
				'media-src': [
					'self',
					'blob:',
					'mediastream:',
					'filesystem:',
					...csp_trusted_sources_of_ryanatkn,
				],
				'font-src': ['self', 'data:', ...csp_trusted_sources_of_ryanatkn],
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
