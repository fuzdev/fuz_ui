<script module lang="ts">
	/** Width in pixels of the docs sidebar, passed to `AppShell`. */
	const DOCS_SIDEBAR_WIDTH = 240;
</script>

<script lang="ts">
	/**
	 * The docs layout: a primary nav with the breadcrumb, the tome menu in an
	 * `AppShell` sidebar, the page, and a column of the page's links and related
	 * docs on wide screens.
	 *
	 * Below `SIDEBAR_NARROW_QUERY_DEFAULT` the menu is `AppShell`'s overlay,
	 * opened from the primary nav's menu button. Below 1000px the page links
	 * leave their column for the sidebar, under the menu. Both moves are CSS,
	 * so the server render paints the right layout at any width.
	 *
	 * Nested in an outer `AppShell` (a site whose shell spans more than its
	 * docs), `Docs` renders no shell or primary nav of its own: the outer shell
	 * owns the sidebar and renders the tome menu there (a `DocsMenu` of the same
	 * `tomes`), and the page links show only in the column, so they're absent
	 * below 1000px. `primary_nav`, `secondary_nav_header`, and
	 * `secondary_nav_footer` render only in the standalone layout; nested, put
	 * that content in the outer shell. `--docs_nested_top` offsets the sticky
	 * column below an outer header.
	 *
	 * @module
	 */

	import type { Snippet } from 'svelte';
	import { page } from '$app/state';

	import AppShell from './AppShell.svelte';
	import Breadcrumb from './Breadcrumb.svelte';
	import { type Tome, tomes_context } from './tome.ts';
	import DocsPrimaryNav from './DocsPrimaryNav.svelte';
	import DocsSecondaryNav from './DocsSecondaryNav.svelte';
	import DocsTertiaryNav from './DocsTertiaryNav.svelte';
	import DocsFooter from './DocsFooter.svelte';
	import { site_context } from './site.svelte.ts';
	import { FUZ_DEV_URL } from './constants.ts';
	import { DocsLinks, docs_links_context } from './docs_helpers.svelte.ts';
	import { SidebarState, sidebar_state_context } from './sidebar_state.svelte.ts';

	const {
		tomes,
		primary_nav,
		secondary_nav_header,
		secondary_nav_footer,
		footer,
		children
	}: {
		tomes: Array<Tome>;
		/**
		 * Rendered in the primary nav after the breadcrumb, at its end, e.g. links to the
		 * site's other sections.
		 */
		primary_nav?: Snippet;
		/**
		 * Rendered above the tome menu in the sidebar, which is the overlay on narrow
		 * screens, where the primary nav has little room.
		 */
		secondary_nav_header?: Snippet;
		/** Rendered below the tome menu in the sidebar. */
		secondary_nav_footer?: Snippet;
		/**
		 * Replaces the default footer, a `DocsFooter` with the site's repo and a link to
		 * fuz.dev, e.g. for a site that isn't part of the Fuz stack.
		 */
		footer?: Snippet;
		children: Snippet;
	} = $props();

	const site = site_context.get('`Docs` requires `site_context`; set it in your root layout');

	// TODO this API is messy, inconsistent usage of props/context
	const tomes_by_slug = $derived(new Map(tomes.map((t) => [t.slug, t])));
	tomes_context.set(() => tomes_by_slug);

	docs_links_context.set(new DocsLinks());

	// read before this component's own `AppShell` sets the context, so it finds only an outer one
	const nested = sidebar_state_context.get_maybe() !== undefined;

	const uid = $props.id();
	// named so the primary nav's menu button can carry `aria-controls`
	const sidebar_state = nested ? undefined : new SidebarState({ sidebar_id: `${uid}-docs-menu` });
</script>

{#snippet sidebar()}
	<DocsSecondaryNav {tomes} header={secondary_nav_header} footer={secondary_nav_footer} />
	<div class="tertiary-in-sidebar">
		<DocsTertiaryNav {tomes} {tomes_by_slug} />
	</div>
{/snippet}

{#snippet content()}
	<div class={['docs', { nested }]}>
		{#if sidebar_state}
			<DocsPrimaryNav>
				{#if primary_nav}
					<div class="primary-nav-end">
						{@render primary_nav()}
					</div>
				{/if}
				<div class="nav-menu-toggle">
					<button
						class="plain"
						type="button"
						aria-expanded={sidebar_state.show_sidebar_narrow}
						aria-controls={sidebar_state.sidebar_id}
						onclick={() => sidebar_state.toggle_sidebar()}
					>
						menu
					</button>
				</div>
			</DocsPrimaryNav>
		{/if}
		<div class="columns">
			<main>
				{#key page.url.pathname}
					{@render children()}
				{/key}
				<section class="box">
					{#if footer}
						{@render footer()}
					{:else}
						<DocsFooter repo_url={site.repo_url} root_url={FUZ_DEV_URL}>
							<div class="mb_xl5">
								<Breadcrumb />
							</div>
						</DocsFooter>
					{/if}
				</section>
			</main>
			<div class="tertiary-column">
				<DocsTertiaryNav {tomes} {tomes_by_slug} />
			</div>
		</div>
	</div>
{/snippet}

{#if sidebar_state}
	<AppShell
		class="docs-shell"
		{sidebar}
		{sidebar_state}
		sidebar_width={DOCS_SIDEBAR_WIDTH}
		sidebar_label="docs menu"
		show_toggle={false}
	>
		{@render content()}
	</AppShell>
{:else}
	{@render content()}
{/if}

<style>
	.docs {
		--docs_menu_width: 180px;
		--docs_content_padding: var(--space_xl5);
		--docs_content_max_width: calc(var(--distance_md) + var(--docs_content_padding) * 2);
		--docs_tertiary_width: 240px; /* matches `DOCS_SIDEBAR_WIDTH` */
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.docs:not(.nested) {
		/* the primary nav spans the sidebar's column too */
		margin-left: calc(-1 * var(--sidebar_offset, 0px));
	}
	.columns {
		flex: 1;
		display: flex;
		justify-content: center;
	}
	.docs:not(.nested) .columns {
		margin-left: var(--sidebar_offset, 0px);
	}
	main {
		position: relative;
		min-width: 0;
		flex: 1;
		max-width: var(--docs_content_max_width);
		padding: var(--docs_content_padding);
		padding-top: 0;
		background-color: var(--shade_00);
	}
	.tertiary-column {
		position: sticky;
		top: var(--docs_primary_nav_height);
		align-self: flex-start;
		flex-shrink: 0;
		width: var(--docs_tertiary_width);
		max-height: calc(100svh - var(--docs_primary_nav_height));
		padding: var(--space_md);
		overflow: auto;
		scrollbar-width: thin;
	}
	.docs.nested .tertiary-column {
		top: var(--docs_nested_top, 0px);
		max-height: calc(100svh - var(--docs_nested_top, 0px));
	}
	.primary-nav-end {
		display: flex;
		align-items: center;
		gap: var(--space_md);
		padding: 0 var(--space_md);
	}
	.nav-menu-toggle {
		display: none;
	}
	.nav-menu-toggle button {
		height: 100%;
		padding-left: var(--space_xl3);
		padding-right: var(--space_xl3);
		border-radius: 0;
	}
	section {
		padding: var(--space_xl2);
	}
	.tertiary-in-sidebar {
		display: none;
		padding: 0 var(--space_md);
	}

	/* the shell's sidebar sits below the primary nav while it's beside the content */
	@media not (max-width: 800px) {
		:global(.docs-shell.app-shell > .app-shell-sidebar) {
			top: var(--docs_primary_nav_height);
			height: calc(100% - var(--docs_primary_nav_height));
		}
	}
	:global(.docs-shell.app-shell) {
		--docs_primary_nav_height: 60px;
		--sidebar_bg: var(--shade_10);
		background-color: var(--shade_10);
	}

	/* the page links move from their column into the sidebar */
	@media (max-width: 1000px) {
		.docs {
			--docs_content_padding: var(--space_xl);
		}
		.tertiary-column {
			display: none;
		}
		.tertiary-in-sidebar {
			display: block;
		}
	}
	/* sync with `SIDEBAR_NARROW_QUERY_DEFAULT`, `AppShell`'s narrow mode */
	@media (max-width: 800px) {
		.nav-menu-toggle {
			display: contents;
		}
	}
</style>
