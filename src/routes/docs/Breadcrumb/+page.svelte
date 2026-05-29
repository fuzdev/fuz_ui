<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import {tome_get_by_slug} from '$lib/tome.js';
	import Breadcrumb from '$lib/Breadcrumb.svelte';
	import TomeContent from '$lib/TomeContent.svelte';
	import BreadcrumbExample from '$routes/docs/Breadcrumb/BreadcrumbExample.svelte';
	import TomeSectionHeader from '$lib/TomeSectionHeader.svelte';
	import TomeSection from '$lib/TomeSection.svelte';

	const TOME_SLUG = 'Breadcrumb';
	const tome = tome_get_by_slug(TOME_SLUG);
</script>

<!-- eslint-disable svelte/no-useless-mustaches -->

<TomeContent {tome}>
	<section>
		<!-- TODO make this a generic data-driven helper -->
		<Code lang="ts" content={`import Breadcrumb from '@fuzdev/fuz_ui/Breadcrumb.svelte';`} />
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
