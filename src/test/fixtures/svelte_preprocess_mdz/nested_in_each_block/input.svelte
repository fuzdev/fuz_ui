<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	const items = ['**bold**', '_italic_'];
</script>

{#each items as item}
	<Mdz content="**static content**" />
{/each}
