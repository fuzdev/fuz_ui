<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	let dynamic = $state('text');
</script>

<Mdz content="**bold**" />
<Mdz content={dynamic} />
