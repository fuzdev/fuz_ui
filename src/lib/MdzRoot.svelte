<script lang="ts">
	import type {Snippet} from 'svelte';

	import {
		mdz_base_context,
		mdz_components_context,
		mdz_elements_context,
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

	const get_ancestor_base = mdz_base_context.get_maybe();
	const get_ancestor_components = mdz_components_context.get_maybe();
	const get_ancestor_elements = mdz_elements_context.get_maybe();

	mdz_base_context.set(() => base ?? get_ancestor_base?.());
	mdz_components_context.set(() => components ?? get_ancestor_components?.());
	mdz_elements_context.set(() => elements ?? get_ancestor_elements?.());
</script>

{@render children()}
