<script lang="ts">
	// @ts-nocheck
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	let show = $state(true);
</script>

<Mdz content={show ? '**a**' : '**b**'} class="mb_lg" inline />
