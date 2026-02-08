<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	let show = $state(true);
</script>

{#if show}
	<Mdz content="**bold**" />
{/if}
