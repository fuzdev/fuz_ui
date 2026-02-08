<script lang="ts">
	// @ts-nocheck
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	const text_a = '**bold**';
	const text_b = '_italic_';
	let show = $state(true);
</script>

<Mdz content={show ? text_a : text_b} />
