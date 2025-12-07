<script lang="ts">
	import {parse_path_pieces} from '@fuzdev/fuz_util/path.js';
	import {resolve} from '$app/paths';
	import {page} from '$app/state';
	import type {Snippet} from 'svelte';
	import {strip_start, ensure_end} from '@fuzdev/fuz_util/string.js';

	const {
		path,
		selected_path,
		base_path,
		separator,
		children,
	}: {
		/**
		 * Prefixed with a slash and relative to the base path.
		 */
		path?: string | undefined;
		/**
		 * Prefixed with a slash and relative to the base path.
		 * `null` means none and `undefined` is detected from the current url.
		 */
		selected_path?: string | null | undefined;
		/**
		 * Sets a custom base path of `path` and `selected_path`.
		 * Defaults to `base` from `$app/paths`.
		 */
		base_path?: string;
		separator?: Snippet;
		children?: Snippet;
	} = $props();

	const final_base_path = $derived(base_path ?? resolve('/').slice(0, -1));

	const final_path = $derived(path ?? strip_start(page.url.pathname, final_base_path));

	const final_selected_path = $derived(
		selected_path === null ? null : (selected_path ?? final_path),
	);

	const path_pieces = $derived(parse_path_pieces(final_path));

	const root_path = $derived(ensure_end(final_base_path, '/'));

	// TODO animate these
	// `transition:slide={{axis: 'x'}}`
</script>

<div class="breadcrumb">
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a href={root_path} class:selected={root_path === final_base_path + final_selected_path}
		>{#if children}{@render children()}{:else}•{/if}</a
	>{#each path_pieces as path_piece (path_piece)}{#if path_piece.type === 'piece'}<!-- eslint-disable-next-line svelte/no-navigation-without-resolve --><a
				href={final_base_path + path_piece.path}
				class:selected={path_piece.path === final_selected_path}>{path_piece.name}</a
			>{:else}<span class="separator"
				>{#if separator}{@render separator()}{:else}/{/if}</span
			>{/if}{/each}
</div>

<style>
	.breadcrumb {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		font-size: var(--font_size, var(--font_size_md));
	}
	a {
		position: relative;
		z-index: 1;
		padding: 0 calc(var(--font_size, var(--font_size_md)) * 0.5);
		display: flex;
		align-items: center;
	}
	.separator {
		position: relative;
		z-index: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 0;
	}
</style>
