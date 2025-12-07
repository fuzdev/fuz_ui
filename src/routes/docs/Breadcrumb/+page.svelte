<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import {get_tome_by_name} from '$lib/tome.js';
	import Breadcrumb from '$lib/Breadcrumb.svelte';
	import TomeContent from '$lib/TomeContent.svelte';
	import BreadcrumbExample from '$routes/docs/Breadcrumb/BreadcrumbExample.svelte';
	import TomeSectionHeader from '$lib/TomeSectionHeader.svelte';
	import TomeSection from '$lib/TomeSection.svelte';

	const LIBRARY_ITEM_NAME = 'Breadcrumb';
	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);
</script>

<!-- eslint-disable svelte/no-useless-mustaches -->

<TomeContent {tome}>
	<section>
		<!-- TODO make this a generic data-driven helper -->
		<Code content={`import Breadcrumb from '@fuzdev/fuz_ui/Breadcrumb.svelte';`} lang="ts" />
		<Code content={`<Breadcrumb />`} />
		<Breadcrumb />
	</section>
	<TomeSection>
		<TomeSectionHeader text="With custom icon" />
		<Code content={`<Breadcrumb>🏠</Breadcrumb>`} />
		<Breadcrumb>🏠</Breadcrumb>
	</TomeSection>
	<TomeSection>
		<TomeSectionHeader text="With custom separator" />
		<Code
			content={`<Breadcrumb>
	{#snippet separator()}.{/snippet}
</Breadcrumb>`}
		/>
		<Breadcrumb>{#snippet separator()}.{/snippet}</Breadcrumb>
	</TomeSection>
	<TomeSection>
		<TomeSectionHeader text="With custom paths" />
		<BreadcrumbExample selected_path="/a/b" />
	</TomeSection>
</TomeContent>
