<script lang="ts">
	import Mdz from '@fuzdev/fuz_ui/Mdz.svelte';
	import Foo from '../Foo.svelte';
</script>

<Mdz content="**bold**" />
<Foo comp={Mdz} />
