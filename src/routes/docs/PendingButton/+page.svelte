<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import {get_tome_by_name} from '$lib/tome.js';
	import PendingButton from '$lib/PendingButton.svelte';
	import TomeContent from '$lib/TomeContent.svelte';

	const LIBRARY_ITEM_NAME = 'PendingButton';
	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);

	let pending_1 = $state(false);
	let pending_2 = $state(true);
</script>

<!-- eslint-disable svelte/no-useless-mustaches -->

<TomeContent {tome}>
	<section>
		<p>Preserves a button's normal width while animating.</p>
		<aside>
			<p>This component may be replaced with an action in the future or otherwise change.</p>
		</aside>
		<!-- TODO make this a generic data-driven helper -->
		<Code content={`import PendingButton from '@ryanatkn/fuz/PendingButton.svelte';`} lang="ts" />
		<p>
			<button
				type="button"
				onclick={() => {
					pending_1 = !pending_1;
					pending_2 = !pending_2;
				}}>toggle the pending status of the buttons below</button
			>
		</p>
		<Code
			content={`<PendingButton
	pending={${pending_1}}
	onclick={() => (pending_1 = !pending_1)}
>
	do something async
</PendingButton>`}
		/>
		<p>
			<PendingButton pending={pending_1} onclick={() => (pending_1 = !pending_1)}>
				do something async
			</PendingButton>
		</p>
		<Code
			content={`<PendingButton
	pending={${pending_2}}
	onclick={() => (pending_2 = !pending_2)}
>
	do another
</PendingButton>`}
		/>
		<PendingButton pending={pending_2} onclick={() => (pending_2 = !pending_2)}>
			do another
		</PendingButton>
	</section>
</TomeContent>
