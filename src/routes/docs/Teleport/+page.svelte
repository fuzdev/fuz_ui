<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import {tome_get_by_slug} from '$lib/tome.js';
	import Teleport from '$lib/Teleport.svelte';
	import TomeContent from '$lib/TomeContent.svelte';
	import DeclarationLink from '$lib/DeclarationLink.svelte';

	const TOME_SLUG = 'Teleport';
	const tome = tome_get_by_slug(TOME_SLUG);

	let swap = $state.raw(true);
	let teleport_1: HTMLElement | undefined = $state.raw();
	let teleport_2: HTMLElement | undefined = $state.raw();
</script>

<!-- eslint-disable svelte/no-useless-mustaches -->

<TomeContent {tome}>
	<section>
		<p>
			Relocates elements in the DOM, in the rare cases that's useful and the best solution. (like
			when you need to escape overflow containment or avoid inheriting styles without restructuring
			the component tree) The API is restricted to manipulating DOM elements, so it does not work
			with SSR.
		</p>
		<aside>
			<p>Use only when necessary or fun.</p>
		</aside>
	</section>
	<section>
		<!-- TODO make this a generic data-driven helper -->
		<Code lang="ts" content={`import Teleport from '@fuzdev/fuz_ui/Teleport.svelte';`} />
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
	<section>
		<aside>
			The <DeclarationLink name="Dialog" /> previously used this but it no longer needs it after migrating
			to the native <code>&lt;dialog></code>. It's currently unused in fuz_ui and may be removed.
		</aside>
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
