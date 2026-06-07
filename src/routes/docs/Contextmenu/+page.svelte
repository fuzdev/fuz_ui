<script lang="ts">
	import TomeContent from '$lib/TomeContent.svelte';
	import {tome_get_by_slug} from '$lib/tome.js';
	import Introduction from '$routes/docs/Contextmenu/Introduction.svelte';
	import Discussion from '$routes/docs/Contextmenu/Discussion.svelte';
	import ExampleFull from '$routes/docs/Contextmenu/ExampleFull.svelte';
	import ExampleBasic from '$routes/docs/Contextmenu/ExampleBasic.svelte';
	import ExampleCustomInstance from '$routes/docs/Contextmenu/ExampleCustomInstance.svelte';
	import ExampleSelectText from '$routes/docs/Contextmenu/ExampleSelectText.svelte';
	import ExampleDisableDefaultBehaviors from '$routes/docs/Contextmenu/ExampleDisableDefaultBehaviors.svelte';
	import ExampleDefaultBehaviors from '$routes/docs/Contextmenu/ExampleDefaultBehaviors.svelte';
	import {selected_contextmenu_root_component_context} from '$routes/docs/Contextmenu/selected_root_component.svelte.js';

	const TOME_SLUG = 'Contextmenu';

	const tome = tome_get_by_slug(TOME_SLUG);

	selected_contextmenu_root_component_context.set();

	// TODO examples for error, async
</script>

<!-- TODO demonstrate usage of a custom `link_snippet` and `linkProps`  -->
<TomeContent {tome}>
	<Introduction />
	<ExampleBasic />
	<ExampleDefaultBehaviors />
	<ExampleSelectText />
	<ExampleDisableDefaultBehaviors />
	<ExampleCustomInstance />
	<ExampleFull />
	<Discussion />
	<section>
		<aside>
			<p>
				todo: demonstrate using <code>contextmenu_attachment</code> to avoid the wrapper element
			</p>
		</aside>
		<aside>
			<p>todo: for mobile, probably change to a drawer-from-bottom design</p>
		</aside>
	</section>
</TomeContent>
