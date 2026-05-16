<script lang="ts">
	import type {Snippet} from 'svelte';

	import {
		mdz_base_context,
		mdz_components_context,
		mdz_elements_context,
		set_mdz_context_with_fallback,
		type MdzComponents,
		type MdzElements,
	} from './mdz_components.js';

	const {
		base,
		components,
		elements,
		children,
	}: {
		base?: string;
		components?: MdzComponents;
		elements?: MdzElements;
		children: Snippet;
	} = $props();

	set_mdz_context_with_fallback(mdz_base_context, () => base);
	set_mdz_context_with_fallback(mdz_components_context, () => components);
	set_mdz_context_with_fallback(mdz_elements_context, () => elements);
</script>

{@render children()}
