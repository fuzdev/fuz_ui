<script lang="ts">
	import {slide} from 'svelte/transition';
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import Alert from '$lib/Alert.svelte';
	import TomeContent from '$lib/TomeContent.svelte';
	import {tome_get_by_slug} from '$lib/tome.js';
	import Dialog from '$lib/Dialog.svelte';
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
			A modal that overlays the entire page, built on the native <MdnLink
				path="Web/HTML/Element/dialog"
			/> element. Opening it with <code>showModal()</code> uses the browser's top layer, so it
			escapes ancestor stacking and overflow contexts without <TomeLink slug="Teleport" />, traps
			focus, makes the rest of the page <code>inert</code>, closes on <kbd>Escape</kbd>, and
			restores focus to the previously focused element on close.
		</p>
	</section>
	<section>
		<p>
			Mounting the component opens the dialog, so the simplest usage gates it with
			<code>{'{#if}'}</code>:
		</p>
		<Code
			content={`<button onclick={() => (opened = true)}>
	open a dialog
</button>
{#if opened}
	<Dialog onclose={() => (opened = false)}>
		{#snippet children(close)}
			<div class="box">
				<div class="pane p_xl box">
					<h1>attention</h1>
					<p>this is a dialog</p>
					<button onclick={close}>ok</button>
				</div>
			</div>
		{/snippet}
	</Dialog>
{/if}`}
		/>
		<p>
			Or pass <code>show</code> and let the component manage its own conditional rendering (it
			defaults to <code>true</code>):
		</p>
		<Code
			content={`<Dialog show={opened} onclose={() => (opened = false)}>
	{#snippet children(close)}
		<div class="pane p_xl box">
			<button onclick={close}>ok</button>
		</div>
	{/snippet}
</Dialog>`}
		/>
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
			>open a dialog with <code>content_selector={'{null}'}</code> (no click-outside)</button
		>
		<button type="button" class="mb_lg" onclick={() => (dialog_nested_1_opened = true)}
			>open a dialog containing another dialog</button
		>
	</section>
</TomeContent>
{#if opened}
	<Dialog onclose={() => (opened = false)}>
		{#snippet children(close)}
			<div class="box">
				<div class="pane p_xl box">
					<h1>attention</h1>
					<p>this is a dialog</p>
					<button type="button" onclick={close}>ok</button>
				</div>
			</div>
		{/snippet}
	</Dialog>
{/if}
{#if dialog_overflowing_opened}
	<Dialog onclose={() => (dialog_overflowing_opened = false)}>
		{#snippet children(close)}
			<div class="box">
				<div class="pane p_xl">
					<h1>attention</h1>
					{#each {length: 120} as _, i (i)}
						<p>this is a dialog that overflows vertically</p>
					{/each}
					<button type="button" onclick={close}>close</button>
				</div>
			</div>
		{/snippet}
	</Dialog>
{/if}
{#if dialog_layout_page_opened}
	<Dialog
		onclose={() => ((dialog_layout_page_opened = false), reset_items())}
		layout={selected_layout}
	>
		{#snippet children(close)}
			<div class="box">
				<div class="pane p_xl width_atmost_md">
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
							It's often the best choice, but it can be undesirable in some situations, like when
							the height of the content changes as the user does things, leading to a janky
							experience.
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
				</div>
			</div>
		{/snippet}
	</Dialog>
{/if}
{#if dialog_nested_1_opened}
	<Dialog onclose={() => (dialog_nested_1_opened = false)}>
		<div class="box">
			<div class="pane p_xl">
				<h1>dialog 1</h1>
				<p>dialogs can open more dialogs</p>
				<button type="button" onclick={() => (dialog_nested_2_opened = true)}
					>open another dialog</button
				>
			</div>
		</div>
	</Dialog>
{/if}
{#if dialog_nested_2_opened}
	<Dialog onclose={() => (dialog_nested_2_opened = false)}>
		<div class="box">
			<div class="pane p_xl">
				<h1>dialog 2</h1>
				<p>this dialog can open more dialogs</p>
				<p>this is the second dialog</p>
				<button type="button" onclick={() => (dialog_nested_3_opened = true)}
					>open another dialog</button
				>
			</div>
		</div>
	</Dialog>
{/if}
{#if dialog_no_dismiss_opened}
	<Dialog onclose={() => (dialog_no_dismiss_opened = false)} content_selector={null}>
		{#snippet children(close)}
			<div class="box">
				<div class="pane p_xl box width_atmost_md">
					<h1>no click-outside</h1>
					<p>
						This dialog passes <code>content_selector={'{null}'}</code>, so clicking outside the
						content does nothing. <kbd>Escape</kbd> and the button still close it.
					</p>
					<button type="button" onclick={close}>close</button>
				</div>
			</div>
		{/snippet}
	</Dialog>
{/if}
{#if dialog_nested_3_opened}
	<Dialog onclose={() => (dialog_nested_3_opened = false)}>
		<div class="box gap_xl3">
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
