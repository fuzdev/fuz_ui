<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	let cls = $state('foo');
</script>

<Mdz content="text" class={cls} />
