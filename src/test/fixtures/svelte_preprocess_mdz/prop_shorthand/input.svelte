<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	let inline = $state.raw(true);
</script>

<Mdz content="text" {inline} />
