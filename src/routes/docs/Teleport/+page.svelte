<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import {get_tome_by_name} from '$lib/tome.js';
	import Teleport from '$lib/Teleport.svelte';
	import TomeContent from '$lib/TomeContent.svelte';
	import TomeLink from '$lib/TomeLink.svelte';

	const LIBRARY_ITEM_NAME = 'Teleport';
	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);

	let swap = $state(true);
	let teleport_1: HTMLElement | undefined = $state();
	let teleport_2: HTMLElement | undefined = $state();
</script>

<!-- eslint-disable svelte/no-useless-mustaches -->

<TomeContent {tome}>
	<section>
		<p>
			Relocates elements in the DOM, in the rare cases that's useful and the best solution. The <TomeLink
				name="Dialog"
			/> uses this to mount dialogs from any component without inheriting styles.
		</p>
		<aside>
			<p>Use only when necessary or fun.</p>
		</aside>
	</section>
	<section>
		<div class="mb_lg">
			<!-- TODO make this a generic data-driven helper -->
			<Code content={`import Teleport from '@ryanatkn/fuz/Teleport.svelte';`} lang="ts" />
		</div>
		<Code
			content={`<Teleport to={swap ? teleport_1 : teleport_2}>
	🐰
</Teleport>
<div class="teleports">
	<div class="panel" bind:this={teleport_1} />
	<div class="panel" bind:this={teleport_2} />
</div>
<button onclick={() => (swap = !swap)}>
	teleport the bunny
</button>`}
		/>
	</section>
	<section>
		<!-- TODO how to do this with the `state` API? the `bind` in particular -- maybe make them stores? -->
		<Teleport to={swap ? teleport_1 : teleport_2}>🐰</Teleport>
		<div class="teleports">
			<div class="panel" bind:this={teleport_1}></div>
			<div class="panel" bind:this={teleport_2}></div>
		</div>
		<button type="button" onclick={() => (swap = !swap)}> teleport the bunny </button>
	</section>
</TomeContent>

<style>
	.teleports {
		display: flex;
		gap: var(--space_sm);
		margin-bottom: var(--space_sm);
	}
	.teleports > div {
		width: var(--space_xl8);
		height: var(--space_xl8);
		font-size: var(--font_size_xl3);
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
