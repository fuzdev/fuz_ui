<script lang="ts">
	import type {Snippet} from 'svelte';
	import {swallow} from '@fuzdev/fuz_util/dom.js';

	import PendingAnimation from './PendingAnimation.svelte';
	import {contextmenu_context, type ContextmenuRun} from './contextmenu_state.svelte.js';

	const {
		run,
		icon,
		children,
		disabled: disabled_prop = false,
	}: {
		run: ContextmenuRun;
		icon?: string | Snippet;
		children: Snippet;
		disabled?: boolean;
	} = $props();

	const contextmenu = contextmenu_context.get();

	const entry = contextmenu.add_entry(
		() => run,
		() => disabled_prop,
	);

	const {selected, pending, error_message} = $derived(entry);
	const disabled = $derived(entry.disabled());
</script>

<!-- disabling the a11y warning because a parent element handles keyboard events -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<li
	class="menu_item plain selectable deselectable"
	class:selected
	class:disabled
	role="menuitem"
	aria-label="contextmenu entry"
	aria-disabled={disabled}
	tabindex="-1"
	title={error_message ? `Error: ${error_message}` : undefined}
	onclick={disabled
		? undefined
		: () => {
				// This timeout lets event handlers react to the current DOM
				// before the item's changes are applied.
				setTimeout(() => contextmenu.activate(entry));
			}}
	onmouseenter={disabled
		? undefined
		: (e) => {
				swallow(e);
				contextmenu.select(entry);
			}}
>
	<div class="content">
		<div class="icon">
			{#if typeof icon === 'string'}
				{icon}
			{:else if icon}
				{@render icon()}
			{/if}
		</div>
		<div class="title">{@render children()}</div>
		{#if pending}<PendingAnimation />{:else if error_message}⚠️{/if}
	</div>
</li>

<style>
	/* TODO hacky, needed because the base `.menu_item` added z-index */
	.menu_item {
		z-index: unset;
	}
</style>
