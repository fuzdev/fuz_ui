<script lang="ts">
	import {slide} from 'svelte/transition';
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import Alert from '$lib/Alert.svelte';
	import TomeContent from '$lib/TomeContent.svelte';
	import {tome_get_by_slug} from '$lib/tome.js';
	import Dialog from '$lib/Dialog.svelte';
	import DialogContent from '$lib/DialogContent.svelte';
	import TomeLink from '$lib/TomeLink.svelte';
	import MdnLink from '$lib/MdnLink.svelte';
	import DeclarationLink from '$lib/DeclarationLink.svelte';
	import {dialog_layouts, type DialogLayout} from '$lib/dialog.js';

	const TOME_SLUG = 'Dialog';

	const tome = tome_get_by_slug(TOME_SLUG);

	let opened = $state.raw(false);
	let dialog_overflowing_opened = $state.raw(false);
	let dialog_layout_page_opened = $state.raw(false);
	let dialog_nested_1_opened = $state.raw(false);
	let dialog_nested_2_opened = $state.raw(false);
	let dialog_nested_3_opened = $state.raw(false);
	let dialog_no_dismiss_opened = $state.raw(false);

	let selected_layout: DialogLayout = $state.raw('page');

	let items: Array<object> = $state.raw([]);
	const remove_item = (item: object) => {
		items = items.filter((i) => i !== item);
	};
	const add_item = () => {
		items = items.concat({});
	};
	const reset_items = () => {
		items = [];
	};
</script>

<TomeContent {tome}>
	<section>
		<p>
			A <DeclarationLink name="Dialog" /> is a modal that overlays the entire page. It's built on the
			native
			<MdnLink path="Web/HTML/Element/dialog" /> element, so opening it with
			<MdnLink path="Web/API/HTMLDialogElement/showModal">showModal()</MdnLink>
			puts children in the browser's top layer, escaping ancestor stacking with its bugs and caveats,
			like cascading styles and overflow hiding, without using <TomeLink slug="Teleport" />. The
			native element also traps focus, makes the rest of the page inert, closes on
			<kbd>Escape</kbd>, and restores focus to the previously focused element on close.
		</p>
		<aside>
			Is this truly a simple, accessible, powerful Dialog? Actually simple, finally? You be the
			judge
		</aside>
	</section>
	<section>
		<button type="button" class="mb_lg" onclick={() => (opened = true)}> open a dialog </button>
		<button type="button" class="mb_lg" onclick={() => (dialog_overflowing_opened = true)}
			>open a dialog that overflows vertically</button
		>
		<button type="button" class="mb_lg" onclick={() => (dialog_layout_page_opened = true)}
			>open a dialog with <code>layout="page"</code> instead of the default
			<code>layout='centered'</code></button
		>
		<button type="button" class="mb_lg" onclick={() => (dialog_no_dismiss_opened = true)}
			>open a dialog with <code>dismissable={'{false}'}</code> (no click-outside)</button
		>
		<button type="button" class="mb_lg" onclick={() => (dialog_nested_1_opened = true)}
			>open a dialog containing another dialog</button
		>
	</section>

	<section>
		<p>
			Mounting the component opens the dialog, so the simplest usage gates it with
			<code>{'{#if}'}</code>. Wrap the content in a <DeclarationLink name="DialogContent" /> for a padded,
			centered <code>.pane</code> card by default. It reads <code>close</code> from context, so you
			don't thread it down from <DeclarationLink name="Dialog" />:
		</p>
		<Code
			content={`<button onclick={() => (opened = true)}>
	open a dialog
</button>
{#if opened}
	<Dialog onclose={() => (opened = false)}>
		<DialogContent>
			{#snippet children({close})}
				<h1>attention</h1>
				<p>this is a dialog</p>
				<button onclick={close}>ok</button>
			{/snippet}
		</DialogContent>
	</Dialog>
{/if}`}
		/>
		<p>
			Or pass <code>show</code> and let the component manage its own conditional rendering (it
			defaults to <code>true</code>):
		</p>
		<Code
			content={`<Dialog show={opened} onclose={() => (opened = false)}>
	<DialogContent>
		{#snippet children({close})}
			<button onclick={close}>ok</button>
		{/snippet}
	</DialogContent>
</Dialog>`}
		/>
		<p>
			The card shrinks to its content, capped at <code>max_width</code> (default
			<code>var(--distance_md)</code>), so narrow content stays narrow and wide content doesn't
			sprawl. Override the <DeclarationLink name="DialogContent" />'s classes with
			<code>class</code>
			(default <code>box p_xl</code>; the <code>pane</code> class is always applied) and the
			surrounding gutter with <code>gutter</code>. <DeclarationLink name="DialogContent" /> is also optional;
			render your own content directly in <DeclarationLink name="Dialog" />'s
			<code>children</code> snippet (which also receives the dialog context, e.g.
			<code>{'{close}'}</code>) when you need a custom layout, multiple <code>.pane</code>s, or non-<code
				>.pane</code
			>
			content (set <code>content_selector</code> to match).
		</p>
		<p>
			The content can be simply a text node, no <code>DialogContent</code> or
			<code>close</code> needed:
		</p>
		<Code
			content={`{#if opened}
	<Dialog onclose={() => (opened = false)}>\n\t\thello world\n\t</Dialog>
{/if}`}
		/>
	</section>
</TomeContent>
{#if opened}
	<Dialog onclose={() => (opened = false)}>
		<DialogContent>
			{#snippet children({close})}
				<h1>attention</h1>
				<p>this is a dialog</p>
				<button type="button" onclick={close}>ok</button>
			{/snippet}
		</DialogContent>
	</Dialog>
{/if}
{#if dialog_overflowing_opened}
	<Dialog onclose={() => (dialog_overflowing_opened = false)}>
		<DialogContent>
			{#snippet children({close})}
				<!-- focus a static element at the top so the dialog opens scrolled to the top;
				otherwise `showModal()` focuses the close button at the bottom and scrolls to it -->
				<!-- svelte-ignore a11y_autofocus -->
				<h1 tabindex="-1" autofocus>attention</h1>
				{#each {length: 120} as _, i (i)}
					<p>this is a dialog that overflows vertically</p>
				{/each}
				<button type="button" onclick={close}>close</button>
			{/snippet}
		</DialogContent>
	</Dialog>
{/if}
{#if dialog_layout_page_opened}
	<Dialog
		onclose={() => ((dialog_layout_page_opened = false), reset_items())}
		layout={selected_layout}
	>
		<DialogContent>
			{#snippet children({close})}
				{#if selected_layout === 'page'}
					<p>
						This is a <DeclarationLink name="Dialog" /> with
						<code
							>layout="<select bind:value={selected_layout} style:width="120px"
								>{#each dialog_layouts as layout (layout)}
									<option value={layout}>{layout}</option>
								{/each}
							</select>"</code
						>.
					</p>
					<p>
						Instead of being centered by default, the dialog's contents are aligned to the top of
						the page and grow downward. It's useful when the dialog's contents change in height.
					</p>
				{:else if selected_layout === 'centered'}
					<p>
						This is a <DeclarationLink name="Dialog" /> with
						<code
							>layout="<select bind:value={selected_layout} style:width="120px"
								>{#each dialog_layouts as layout (layout)}
									<option value={layout}>{layout}</option>
								{/each}
							</select>"</code
						>, the default value.
					</p>
					<p>
						It's often the best choice, but it can be undesirable in some situations, like when the
						height of the content changes as the user does things, leading to a janky experience.
					</p>
				{:else}
					<Alert status="error">eek a bug! unknown layout "{selected_layout}"</Alert>
				{/if}
				<p>
					<button type="button" onclick={() => add_item()}>add item</button>
					<button type="button" disabled={!items.length} onclick={() => reset_items()}
						>remove all</button
					>
				</p>
				{#each items as item (item)}
					<p transition:slide>
						<button type="button" onclick={() => remove_item(item)}>✕</button>
						new stuff appears {#if selected_layout === 'page'}gracefully{:else if selected_layout === 'centered'}ungracefully{/if}
					</p>
				{/each}
				<button type="button" onclick={close}>close</button>
			{/snippet}
		</DialogContent>
	</Dialog>
{/if}
{#if dialog_nested_1_opened}
	<Dialog onclose={() => (dialog_nested_1_opened = false)}>
		<DialogContent>
			<h1>dialog 1</h1>
			<p>dialogs can open more dialogs</p>
			<button type="button" onclick={() => (dialog_nested_2_opened = true)}
				>open another dialog</button
			>
		</DialogContent>
	</Dialog>
{/if}
{#if dialog_nested_2_opened}
	<Dialog onclose={() => (dialog_nested_2_opened = false)}>
		<DialogContent>
			<h1>dialog 2</h1>
			<p>this dialog can open more dialogs</p>
			<p>this is the second dialog</p>
			<button type="button" onclick={() => (dialog_nested_3_opened = true)}
				>open another dialog</button
			>
		</DialogContent>
	</Dialog>
{/if}
{#if dialog_no_dismiss_opened}
	<Dialog onclose={() => (dialog_no_dismiss_opened = false)} dismissable={false}>
		<DialogContent>
			{#snippet children({close})}
				<h1>no click-outside</h1>
				<p>
					This dialog passes <code>dismissable={'{false}'}</code>, so clicking outside the content
					does nothing. <kbd>Escape</kbd> and the button still close it.
				</p>
				<button type="button" onclick={close}>close</button>
			{/snippet}
		</DialogContent>
	</Dialog>
{/if}
{#if dialog_nested_3_opened}
	<!-- the bare-children path (no DialogContent): render your own surface, here multiple panes -->
	<Dialog onclose={() => (dialog_nested_3_opened = false)}>
		<div class="box gap_xl3 p_xl3">
			<div class="pane p_xl">
				<h1>3 dialogs!</h1>
				<button type="button" onclick={() => (dialog_nested_3_opened = false)}>close dialog</button>
			</div>
			<div class="pane p_xl">
				<h1>and another <code>.pane</code></h1>
				<button
					type="button"
					onclick={() => {
						dialog_nested_1_opened = dialog_nested_2_opened = dialog_nested_3_opened = false;
					}}>close all dialogs</button
				>
			</div>
		</div>
	</Dialog>
{/if}
