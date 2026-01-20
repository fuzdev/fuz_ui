<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';
	import {resolve} from '$app/paths';

	import Mdz from '$lib/Mdz.svelte';
	import Details from '$lib/Details.svelte';
	import TomeSection from '$lib/TomeSection.svelte';
	import TomeSectionHeader from '$lib/TomeSectionHeader.svelte';

	const {data} = $props();

	const format_json = (obj: unknown): string => JSON.stringify(obj, null, '\t');
</script>

<main class="p_xl mx_auto width_atmost_md">
	<h1 class="mt_xl5" id="mdz-fixtures-debug">mdz fixtures debug</h1>
	<p>
		This page renders all of the test fixtures. See also the mdz <a href={resolve('/docs/mdz')}
			>docs page</a
		>.
	</p>
	<h2>{data.fixtures.length} fixtures</h2>

	{#each data.fixtures as fixture (fixture.name)}
		<TomeSection class="mb_xl">
			<TomeSectionHeader text={fixture.name} />

			<div class="mb_xl2">
				<Code lang="md" content={fixture.input} />
			</div>

			<Mdz content={fixture.input} />

			<Details summary="JSON" open={false}>
				<Code lang="json" content={format_json(fixture.expected)} />
			</Details>
		</TomeSection>
	{/each}
</main>
