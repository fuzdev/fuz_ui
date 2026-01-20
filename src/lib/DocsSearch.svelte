<script lang="ts">
	import type {SvelteHTMLElements} from 'svelte/elements';

	let {
		placeholder = 'search declarations and modules...',
		total_count,
		result_count,
		search_query = $bindable(),
		...rest
	}: SvelteHTMLElements['input'] & {
		placeholder?: string;
		total_count: number;
		result_count?: number;
		search_query: string;
	} = $props();

	const total_text = $derived(
		total_count === 1 ? `${total_count} declaration` : `${total_count} declarations`,
	);
	const result_text = $derived(
		result_count === 1 ? `${result_count} match found` : `${result_count} matches found`,
	);
	const has_search = $derived(search_query.trim().length > 0);
</script>

<label class="display:block position:relative">
	<input {...rest} type="search" {placeholder} bind:value={search_query} />
	{#if has_search}
		<button
			type="button"
			class="plain icon_button position:absolute right:0 top:0"
			onclick={() => {
				search_query = '';
			}}
			title="clear search"
			aria-label="clear search"
		>
			🗙
		</button>
	{/if}
</label>

<p>
	{total_text}
	{#if has_search && result_count !== undefined}
		· {result_text}
	{/if}
</p>
