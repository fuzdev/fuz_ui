<script lang="ts">
	import type {OmitStrict} from '@fuzdev/fuz_util/types.js';
	import type {Snippet} from 'svelte';
	import type {SvelteHTMLElements} from 'svelte/elements';
	import {scale, slide} from 'svelte/transition';

	// TODO @many should this have the Button suffix?

	// TODO add docs entry, see also PasteFromClipboard.svelte

	const {
		text,
		copied_display_duration = 1000,
		allow_copying_empty_string,
		icon_button = true,
		oncopy,
		disabled: disabled_prop,
		children,
		...rest
	}: OmitStrict<SvelteHTMLElements['button'], 'children'> & {
		text: string | null;
		copied_display_duration?: number;
		allow_copying_empty_string?: boolean;
		/**
		 * Defaults to `true`, ignored if `children` is provided.
		 */
		icon_button?: boolean;
		oncopy?: (text: string | null, e: MouseEvent) => void;
		children?: Snippet<[copied: boolean, failed: boolean]>;
	} = $props();

	// These are for visual feedback
	let copied = $state(false);
	let failed = $state(false);
	let copy_timeout: NodeJS.Timeout | undefined;

	const copy = async (e: MouseEvent) => {
		clearTimeout(copy_timeout);
		if (text === null) return; // allows copying ''

		copied = false;
		failed = false;

		try {
			await navigator.clipboard.writeText(text);
			copied = true;
		} catch (_err) {
			failed = true;
			return;
		}

		// Reset after display duration
		copy_timeout = setTimeout(() => {
			copied = false;
		}, copied_display_duration);

		oncopy?.(text, e);
	};
</script>

<button
	type="button"
	title="copy to clipboard"
	{...rest}
	class="copy_to_clipboard {rest.class}"
	class:icon_button={children ? false : icon_button}
	class:copied
	class:failed
	class:color_c={failed}
	onclick={copy}
	disabled={disabled_prop ?? (allow_copying_empty_string ? text === null : !text)}
>
	{#if children}
		{@render children(copied, failed)}
	{:else if copied}
		<div in:scale={{duration: 200}}>✓</div>
	{:else}
		<div in:slide>⧉</div>
	{/if}
</button>
