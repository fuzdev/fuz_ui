<script lang="ts">
	import type {SvelteHTMLElements} from 'svelte/elements';

	// TODO @many should this have the Button suffix?

	const {
		onclipboardtext,
		onerror,
		children,
		...rest
	}: SvelteHTMLElements['button'] & {
		onclipboardtext: (text: string) => void;
		onerror?: (error: Error) => void;
	} = $props();

	// TODO add docs entry, see also CopyToClipboard.svelte
</script>

<button
	type="button"
	title="paste from clipboard"
	{...rest}
	class="paste_from_clipboard {rest.class}"
	onclick={async () => {
		try {
			const text = await navigator.clipboard.readText();
			onclipboardtext(text);
		} catch (error) {
			onerror?.(error);
		}
	}}
>
	{#if children}{@render children()}{:else}paste{/if}
</button>
