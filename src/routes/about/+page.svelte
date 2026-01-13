<script lang="ts">
	import {library_context} from '$lib/library.svelte.js';
	import EcosystemLinksPanel from '$lib/EcosystemLinksPanel.svelte';
	import LibraryDetail from '$lib/LibraryDetail.svelte';
	import DocsFooter from '$lib/DocsFooter.svelte';
	import Breadcrumb from '$lib/Breadcrumb.svelte';
	import Svg from '$lib/Svg.svelte';
	import {logo_fuz} from '$lib/logos.js';
	import {MAIN_HEADER_MARGIN_TOP} from '$lib/constants.js';

	const library = library_context.get();

	// TODO standardize
</script>

<main class="width_upto_md">
	<section>
		<header class="box">
			<h1 class="mb_xl5" style:margin-top={MAIN_HEADER_MARGIN_TOP}>
				{library.repo_name}
			</h1>
		</header>
		<Breadcrumb><Svg data={logo_fuz} size="var(--icon_size_sm)" /></Breadcrumb>
	</section>
	<EcosystemLinksPanel />
	<section class="box width:100% mb_lg">
		<div class="panel p_md width_upto_md">
			<LibraryDetail {library} />
		</div>
	</section>
	<section class="box mb_xl7">
		<DocsFooter {library}>
			<div class="mb_xl5">
				<Breadcrumb><Svg data={logo_fuz} size="var(--icon_size_sm)" /></Breadcrumb>
			</div>
		</DocsFooter>
	</section>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0 auto;
	}
	h1 {
		display: flex;
		align-items: baseline;
		text-align: center;
	}
</style>
