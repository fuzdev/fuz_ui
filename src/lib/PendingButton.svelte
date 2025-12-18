<script lang="ts">
	import type {Snippet} from 'svelte';

	import PendingAnimation from './PendingAnimation.svelte';
	import type {SvelteHTMLElements} from 'svelte/elements';

	const {
		pending,
		onclick,
		running,
		title: title_prop,
		disabled: disabled_prop,
		animation,
		children,
		...rest
	}: SvelteHTMLElements['button'] & {
		pending: boolean;
		onclick: () => void;
		running?: boolean;
		title?: string;
		disabled?: boolean;
		animation?: Snippet;
		children: Snippet;
	} = $props();

	let el: HTMLButtonElement | undefined = $state();

	export const focus = (options?: FocusOptions): void => el?.focus(options);

	// TODO maybe this shouldn't disable? just visually look disabled, maybe with `.disabled`?
</script>

<button
	bind:this={el}
	type="button"
	{...rest}
	class="pending_button {rest.class}"
	disabled={disabled_prop ?? pending}
	title={title_prop}
	class:pending
	{onclick}
>
	<span class="content">
		{@render children()}
	</span>
	{#if pending}
		<span class="animation">
			{#if animation}
				{@render animation()}
			{:else}
				<PendingAnimation {running} />
			{/if}
		</span>
	{/if}
</button>

<style>
	button {
		position: relative;
	}
	.content {
		display: contents;
	}
	.pending .content {
		visibility: hidden; /* preserve the size */
	}
	.animation {
		position: absolute;
		inset: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
