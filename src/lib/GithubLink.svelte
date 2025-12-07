<script lang="ts">
	import {strip_start} from '@fuzdev/fuz_util/string.js';
	import type {SvelteHTMLElements} from 'svelte/elements';
	import {DEV} from 'esm-env';

	import Svg from './Svg.svelte';
	import {github_logo} from './logos.js';

	const {
		path,
		href: href_prop,
		children,
		class: class_prop,
		...rest
	}: SvelteHTMLElements['a'] & {
		/**
		 * GitHub path - can be a full URL or a relative path like `owner/repo` or `owner/repo/blob/main/file.ts`
		 * @example ryanatkn/fuz
		 * @example ryanatkn/fuz/blob/main/src/lib/Card.svelte
		 * @example https://github.com/ryanatkn/fuz/issues/123
		 */
		path?: string;
	} = $props();

	if (DEV && !path && !href_prop) {
		throw new Error('GithubLink requires either `path` or `href` prop');
	}

	const href = $derived(
		href_prop ??
			(path
				? path.startsWith('https://')
					? path
					: `https://github.com/${strip_start(path, '/')}`
				: ''),
	);

	// extract meaningful display text from the path
	const final_children = $derived(
		children ??
			(() => {
				if (!path) return href || '';
				const path_part = strip_start(path.replace('https://github.com/', ''), '/');

				// for file/tree paths like "owner/repo/blob/main/src/file.ts" -> "src/file.ts"
				const blob_regex = /^[^/]+\/[^/]+\/(?:blob|tree)\/[^/]+\/(.+)$/;
				const blob_match = blob_regex.exec(path_part);
				if (blob_match) return blob_match[1]!;

				// for issue/PR like "owner/repo/issues/123" -> "owner/repo#123"
				const issue_regex = /^([^/]+\/[^/]+)\/(issues|pull)\/(\d+)/;
				const issue_match = issue_regex.exec(path_part);
				if (issue_match) return `${issue_match[1]}#${issue_match[3]}`;

				// default to the full path (typically "owner/repo")
				return path_part;
			})(),
	);
</script>

<!-- TODO -next-line doesnt work? -->
<!-- eslint-disable svelte/no-navigation-without-resolve -->
<a {...rest} {href} class="github_link chip white_space_nowrap {class_prop}" rel="noopener"
	><Svg
		data={github_logo}
		inline
		size="var(--icon_size_xs)"
		attrs={{class: 'mx_xs3 vertical_align_middle'}}
	/>
	{#if typeof final_children === 'string'}
		<span class="font_family_mono">{final_children}</span>
	{:else if final_children}
		{@render final_children()}
	{/if}</a
>
