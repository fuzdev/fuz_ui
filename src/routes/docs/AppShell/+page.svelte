<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import { tome_get_by_slug } from '#lib/tome.ts';
	import TomeContent from '#lib/TomeContent.svelte';
	import TomeLink from '#lib/TomeLink.svelte';
	import DeclarationLink from '#lib/DeclarationLink.svelte';

	const TOME_SLUG = 'AppShell';
	const tome = tome_get_by_slug(TOME_SLUG);
</script>

<TomeContent {tome}>
	<section>
		<p>
			<DeclarationLink name="AppShell" /> lays out an app around a responsive navigation sidebar. On
			wide screens it sits beside the content, and on narrow ones it opens as an overlay. It
			provides <DeclarationLink name="sidebar_state_context" /> so descendants can read and toggle
			the sidebar through <DeclarationLink name="SidebarState" />, and it requires the SvelteKit
			runtime. This page is rendered inside one by <TomeLink slug="Docs" />.
		</p>
		<p>
			The sidebar is a plain <code>div</code>, so render the landmark inside the snippet:
		</p>
		<Code
			lang="svelte"
			content={`<AppShell>
  {#snippet sidebar()}
    <nav aria-label="site">
      <!-- links -->
    </nav>
  {/snippet}
  {@render children()}
</AppShell>`}
		/>
		<p>
			See the <DeclarationLink name="AppShell" /> API docs for its modes, focus behavior, and CSS
			hooks. For a two-column layout within a page, see <DeclarationLink name="ColumnLayout" />.
		</p>
	</section>
</TomeContent>
