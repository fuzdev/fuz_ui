<script lang="ts">
	import type {Snippet} from 'svelte';

	import EcosystemLinks from './EcosystemLinks.svelte';
	import ProjectLinks from './ProjectLinks.svelte';

	const {
		children,
	}: {
		children?: Snippet;
	} = $props();
</script>

<section class="panel p_lg">
	{#if children}
		{@render children()}
	{:else}
		<h2 class="mt_0 mb_lg">Links</h2>
	{/if}
	<section>
		<EcosystemLinks />
	</section>
	<section>
		<ProjectLinks />
	</section>
</section>
