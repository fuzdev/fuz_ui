<script lang="ts">
	import {swallow} from '@fuzdev/fuz_util/dom.js';
	import type {Theme} from '@fuzdev/fuz_css/theme.js';
	import {default_themes} from '@fuzdev/fuz_css/themes.js';

	import {themer_context} from './themer.svelte.js';

	const {
		selected_theme = themer_context.get(),
		themes = default_themes,
		enable_editing = false,
		select = (theme) => {
			selected_theme.theme = theme;
		},
		onselect,
		onedit,
	}: {
		selected_theme?: {theme: Theme};
		themes?: Array<Theme>;
		enable_editing?: boolean;
		select?: ((theme: Theme) => void | boolean) | null;
		onselect?: (theme: Theme) => void;
		onedit?: (theme: Theme) => void;
	} = $props();
</script>

<menu class="theme_input unstyled">
	{#each themes as theme (theme.name)}
		<!-- TODO @many proper equality check, won't work when we allow editing, need an id or unique names and a deep equality check -->
		{@const selected = theme.name === selected_theme.theme.name}
		<li class="row" role="none">
			<button
				type="button"
				class="theme_button color_a"
				role="menuitemradio"
				aria-label="{theme.name} theme"
				aria-checked={selected}
				class:selected
				onclick={(e) => {
					swallow(e);
					if (select?.(theme) !== false) {
						onselect?.(theme);
					}
				}}
			>
				{theme.name}
			</button>
			{#if enable_editing}
				<button
					type="button"
					class="icon_button plain ml_sm"
					onclick={(e) => {
						swallow(e);
						onedit?.(theme);
					}}>•••</button
				>
			{/if}
		</li>
	{/each}
</menu>

<style>
	.theme_button {
		flex: 1;
		border-radius: 0;
	}
	li:first-child .theme_button {
		border-top-left-radius: var(--border_radius_sm);
		border-top-right-radius: var(--border_radius_sm);
	}
	li:last-child .theme_button {
		border-bottom-left-radius: var(--border_radius_sm);
		border-bottom-right-radius: var(--border_radius_sm);
	}
</style>
