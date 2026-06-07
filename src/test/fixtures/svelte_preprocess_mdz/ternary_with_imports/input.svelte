<script lang="ts">
	// @ts-nocheck
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	let show = $state.raw(true);
</script>

<Mdz content={show ? '`fn_a`' : '[link](/docs)'} />
