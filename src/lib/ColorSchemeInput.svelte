<script lang="ts">
	import {swallow} from '@fuzdev/fuz_util/dom.js';
	import {color_schemes, type ColorScheme} from '@fuzdev/fuz_css/theme.js';

	import {themer_context} from './themer.svelte.js';

	const {
		value = themer_context.get(),
		onchange = (color_scheme) => {
			value.color_scheme = color_scheme; // won't work with POJOs but users could provide their own onchange in that case
		},
	}: {
		value?: {color_scheme: ColorScheme};
		onchange?: (color_scheme: ColorScheme) => void;
	} = $props();
</script>

<!-- TODO maybe support menubar aria
https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/menubar_role -->
<menu class="color_scheme_control unstyled">
	{#each color_schemes as color_scheme (color_scheme)}
		{@const selected = color_scheme === value.color_scheme}
		<button
			type="button"
			class="color_scheme color_a"
			role="menuitemradio"
			title={selected
				? `${color_scheme} color scheme is selected`
				: `select ${color_scheme} color scheme`}
			class:selected
			aria-checked={selected}
			onclick={(e) => {
				swallow(e);
				onchange(color_scheme);
			}}
		>
			<div class="content">{color_scheme}</div>
		</button>
	{/each}
</menu>

<style>
	.color_scheme_control {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}
	.content {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 var(--space_lg);
	}
	.color_scheme {
		border-radius: 0;
	}
	.color_scheme:first-child {
		border-top-left-radius: var(--border_radius, var(--border_radius_md));
		border-bottom-left-radius: var(--border_radius, var(--border_radius_md));
	}
	.color_scheme:last-child {
		border-top-right-radius: var(--border_radius, var(--border_radius_md));
		border-bottom-right-radius: var(--border_radius, var(--border_radius_md));
	}
</style>
