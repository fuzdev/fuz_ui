<script lang="ts">
	import {slide} from 'svelte/transition';
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import Alert from '$lib/Alert.svelte';
	import TomeContent from '$lib/TomeContent.svelte';
	import {get_tome_by_name} from '$lib/tome.js';
	import Dialog from '$lib/Dialog.svelte';
	import TomeLink from '$lib/TomeLink.svelte';
	import MdnLink from '$lib/MdnLink.svelte';
	import Dialogs from '$lib/Dialogs.svelte';
	import {
		dialog_layouts,
		type DialogParams,
		type DialogLayout,
		to_dialog_params,
	} from '$lib/dialog.js';
	import Text from '$routes/docs/Dialog/Text.svelte';

	const LIBRARY_ITEM_NAME = 'Dialog';

	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);

	let opened = $state(false);
	let dialog_overflowing_opened = $state(false);
	let dialog_layout_page_opened = $state(false);
	let dialog_nested_1_opened = $state(false);
	let dialog_nested_2_opened = $state(false);
	let dialog_nested_3_opened = $state(false);

	let selected_layout: DialogLayout = $state('page');

	let items: Array<object> = $state([]);
	const remove_item = (item: object) => {
		items = items.filter((i) => i !== item);
	};
	const add_item = () => {
		items = items.concat({});
	};
	const reset_items = () => {
		items = [];
	};

	let dialogs: Array<DialogParams> = $state([]);
	const add_dialogs = (count: number) => {
		const to_text = (index: number) => '!'.repeat(count * 3 - index * 3);
		dialogs = Array.from({length: count}, (_, i) =>
			to_dialog_params(Text, {
				text: to_text(i),
				size: 'var(--font_size_xl4)',
				padding: 'var(--space_sm) var(--space_lg)',
			}),
		);
	};
</script>

<TomeContent {tome}>
	<section>
		<p>
			A modal that overlays the entire page. Uses <TomeLink name="Teleport" /> to allow usage from any
			component without inheriting styles.
		</p>
		<aside>
			⚠️ This will change to use and align APIs with the builtin <MdnLink
				path="Web/HTML/Element/dialog"
			/>. API
		</aside>
	</section>
	<section>
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
		<button type="button" class="mb_lg" onclick={() => (dialog_nested_1_opened = true)}
			>open a dialog containing another dialog</button
		>
		<button type="button" class="mb_lg" onclick={() => add_dialogs(5)}>open many dialogs</button>
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
							This is a <code>Dialog</code> with
							<code
								>layout="<select bind:value={selected_layout}
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
							This is a <code>Dialog</code> with
							<code
								>layout="<select bind:value={selected_layout}
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
<Dialogs
	{dialogs}
	onclose={() => {
		dialogs = dialogs.slice(0, -1);
	}}
>
	{#snippet children(dialog)}
		<div class="pane p_md width_atmost_md mx_auto">
			<dialog.Component {...dialog.props} />
		</div>
	{/snippet}
</Dialogs>
