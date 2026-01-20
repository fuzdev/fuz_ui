<script lang="ts">
	import {DEV} from 'esm-env';
	import type {SvelteHTMLElements} from 'svelte/elements';

	import {get_tome_by_name, to_tome_pathname} from './tome.js';
	import {DOCS_PATH_DEFAULT} from './docs_helpers.svelte.js';

	const {
		name,
		docs_path = DOCS_PATH_DEFAULT,
		hash,
		children,
		class: class_prop = 'chip',
		...rest
	}: SvelteHTMLElements['a'] & {
		name: string; // TODO type, generate from `tomes`?
		docs_path?: string;
		/** URL fragment to append, with or without the `#`. */
		hash?: string;
	} = $props();

	if (DEV) {
		$effect(() => {
			get_tome_by_name(name); // throws if not found
		});
	}

	// TODO add contextmenu behavior
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a {...rest} class="tome_link {class_prop}" href={to_tome_pathname(name, docs_path, hash)}
	>{#if children}{@render children()}{:else}{name}{/if}</a
>
