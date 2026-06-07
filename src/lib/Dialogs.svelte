<script lang="ts">
	import type {Snippet} from 'svelte';

	import type {DialogParams} from './dialog.js';
	import Dialog from './Dialog.svelte';

	// TODO this is experimental

	const {
		dialogs,
		onclose,
		children,
	}: {
		dialogs: Array<DialogParams>;
		onclose?: () => void;
		children?: Snippet<[dialog: DialogParams]>;
	} = $props();
</script>

{#each dialogs as dialog, index (dialog)}<Dialog
		{onclose}
		{...dialog.dialog_props}
		{index}
		active={index === dialogs.length - 1}
		>{#if children}{@render children(dialog)}{:else}<dialog.Component
				{...dialog.props}
			/>{/if}</Dialog
	>{/each}
