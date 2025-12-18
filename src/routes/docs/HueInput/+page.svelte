<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import {get_tome_by_name} from '$lib/tome.js';
	import HueInput from '$lib/HueInput.svelte';
	import TomeContent from '$lib/TomeContent.svelte';
	import TomeSectionHeader from '$lib/TomeSectionHeader.svelte';
	import TomeSection from '$lib/TomeSection.svelte';

	const LIBRARY_ITEM_NAME = 'HueInput';
	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);

	let value: number = $state(180);
</script>

<!-- eslint-disable svelte/no-useless-mustaches -->

<TomeContent {tome}>
	<section>
		<Code content={`import HueInput from '@fuzdev/fuz_ui/HueInput.svelte';`} lang="ts" />
	</section>
	<TomeSection>
		<TomeSectionHeader text="With bind:value">With <code>bind:value</code></TomeSectionHeader>
		<Code content={`<HueInput bind:value />`} />
		<HueInput bind:value />
		<div class="mt_md" style:--text_color="hsl({value} 62% 31%)">
			<code>bind:value === {value}</code>
		</div>
	</TomeSection>
	<TomeSection>
		<TomeSectionHeader text="With children">With <code>children</code></TomeSectionHeader>
		<Code
			content={`<HueInput>
	Some colorful hue input
</HueInput>`}
		/>
		<HueInput>Some colorful hue input</HueInput>
	</TomeSection>
</TomeContent>
