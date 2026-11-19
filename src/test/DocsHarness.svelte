<!--
@component

Test harness: sets the contexts `Docs` requires (`site_context`,
`library_context`) around it, optionally inside an outer `AppShell` for the
nested mode.
-->
<script lang="ts">
	import type { ComponentProps } from 'svelte';

	import AppShell from '#lib/AppShell.svelte';
	import Docs from '#lib/Docs.svelte';
	import { library_context, type Library } from '#lib/library.svelte.ts';
	import { SiteState, site_context } from '#lib/site.svelte.ts';

	const {
		nested = false,
		...rest
	}: ComponentProps<typeof Docs> & {
		nested?: boolean;
	} = $props();

	site_context.set(new SiteState());
	library_context.set(
		() => ({ module_by_path: new Map(), declaration_by_name: new Map() }) as unknown as Library
	);
</script>

{#if nested}
	<AppShell class="outer-shell">
		{#snippet sidebar()}
			<nav aria-label="site"></nav>
		{/snippet}
		<Docs {...rest} />
	</AppShell>
{:else}
	<Docs {...rest} />
{/if}
