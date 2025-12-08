<script lang="ts">
	import type {Snippet} from 'svelte';

	import Docs from '$lib/Docs.svelte';
	import {tomes} from '$routes/docs/tomes.js';
	import {selected_variable_context} from '$routes/style_variable_helpers.svelte.js';
	import StyleVariableDetail from '$routes/StyleVariableDetail.svelte';
	import Dialog from '$lib/Dialog.svelte';
	import {library_context} from '$lib/library.svelte.js';
	import Svg from '$lib/Svg.svelte';
	import {logo_fuz} from '$lib/logos.js';

	const {
		children,
	}: {
		children: Snippet;
	} = $props();

	const selected_variable = selected_variable_context.set();

	const library = library_context.get();
</script>

<Docs {tomes} {library}>
	{#snippet breadcrumb_children(is_primary_nav)}
		{#if is_primary_nav}
			<div class="icon row">
				<Svg data={logo_fuz} size="var(--icon_size_sm)" /> <span class="ml_sm">fuz</span>
			</div>
		{:else}
			<Svg data={logo_fuz} size="var(--icon_size_sm)" />
		{/if}
	{/snippet}
	{@render children()}
</Docs>

{#if selected_variable.value}
	<Dialog onclose={() => (selected_variable.value = null)}>
		{#snippet children(close)}
			<div class="pane p_md width_upto_md mx_auto">
				<div class="panel p_lg box">
					<StyleVariableDetail variable={selected_variable.value} />
					<aside>⚠️ This is unfinished and will change.</aside>
					<button type="button" onclick={close}>ok</button>
				</div>
			</div>
		{/snippet}
	</Dialog>
{/if}
