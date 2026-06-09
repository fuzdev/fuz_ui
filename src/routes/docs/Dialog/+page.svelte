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
	import {dialog_aligns, type DialogAlign} from '$lib/dialog.js';

	const TOME_SLUG = 'Dialog';

	const tome = tome_get_by_slug(TOME_SLUG);

	let opened = $state.raw(false);
	let dialog_overflowing_opened = $state.raw(false);
	let dialog_align_top_opened = $state.raw(false);
	let dialog_nested_1_opened = $state.raw(false);
	let dialog_nested_2_opened = $state.raw(false);
	let dialog_nested_3_opened = $state.raw(false);
	let dialog_no_dismiss_opened = $state.raw(false);
	let dialog_guarded_opened = $state.raw(false);
	let dirty = $state.raw(true);

	let selected_align: DialogAlign = $state.raw('top');

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

	// docs demo for `onbeforeclose`; `confirm` is fine here to illustrate the veto
	// eslint-disable-next-line no-alert
	const guard_unsaved = () => !dirty || confirm('Discard unsaved changes?');
</script>

<TomeContent {tome}>
	<section>
		<p>
			A <DeclarationLink name="Dialog" /> is a modal that overlays the entire page. It uses the native
			<MdnLink path="Web/HTML/Element/dialog" /> element, so opening it with
			<MdnLink path="Web/API/HTMLDialogElement/showModal">showModal()</MdnLink>
			puts children in the browser's top layer, escaping ancestor stacking (avoiding bugs and caveats,
			like unwanted overflow containment and cascading styles), without using <TomeLink
				slug="Teleport"
			/>. The native element also traps focus, makes the rest of the page inert, closes on
			<kbd>Escape</kbd>, and restores focus to the previously focused element on close.
		</p>
	</section>
	<section>
		<button type="button" class="mb_lg" onclick={() => (opened = true)}> open a dialog </button>
		<button type="button" class="mb_lg" onclick={() => (dialog_overflowing_opened = true)}
			>open a dialog that overflows vertically</button
		>
		<button type="button" class="mb_lg" onclick={() => (dialog_align_top_opened = true)}
			>open a dialog with <code>align="top"</code> instead of the default
			<code>align='center'</code></button
		>
		<button type="button" class="mb_lg" onclick={() => (dialog_no_dismiss_opened = true)}
			>open a dialog with <code>dismissable={'{false}'}</code> (no click-outside)</button
		>
		<button type="button" class="mb_lg" onclick={() => (dialog_nested_1_opened = true)}
			>open a dialog containing another dialog</button
		>
		<button
			type="button"
			class="mb_lg"
			onclick={() => ((dirty = true), (dialog_guarded_opened = true))}
			>open a dialog with <code>onbeforeclose</code> to confirm before closing</button
		>
	</section>

	<section>
		<p>
			Mounting the component opens the dialog, so the simplest usage guards it with
			<code>{'{#if}'}</code>. Wrap the content in <DeclarationLink name="DialogContent" /> to default
			to a padded, centered <code>.pane</code> card with a close button:
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
			<code>DialogContent</code> is optional if you want full control:
		</p>
		<Code
			content={`{#if opened}
	<Dialog onclose={() => (opened = false)}>\n\t\thello world\n\t</Dialog>
{/if}`}
		/>
		<p>
			The <code>{'{#if}'}</code> guard isn't required; you can pass <code>show</code> and let the
			component manage its own rendering (it defaults to <code>true</code>):
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
			(default <code>box p_xl</code>) and the surrounding gutter with <code>gutter</code>. The
			fuz_css
			<code>.pane</code> card class is toggled by the <code>pane</code> prop (default
			<code>true</code>; pass <code>pane={'{false}'}</code> for a chromeless surface --
			<DeclarationLink name="DialogContent" /> registers its surface with the
			<DeclarationLink name="Dialog" />, so click-outside-to-close keeps working regardless).
		</p>
		<p>
			<DeclarationLink name="DialogContent" /> renders a <code>close_button</code> positioned
			aboslutely in the surface's top-right corner by default. It renders after the content, so it
			doesn't take initial focus when the dialog opens. Pass
			<code>close_button={'{false}'}</code> to remove it, or a <code>Snippet</code> (receiving <DeclarationLink
				name="DialogContext"
			/>) to render your own. The surface is a containing block with
			<code>position: relative</code>.
		</p>
		<Code
			content={`<Dialog show={opened} onclose={() => (opened = false)}>
	<DialogContent>
		{#snippet close_button({close})}
			<button type="button" class="plain icon_button position:absolute right:0 top:0" onclick={close}>✕</button>
		{/snippet}
		{#snippet children()}
			<p>custom close button</p>
		{/snippet}
	</DialogContent>
</Dialog>`}
		/>
		<p>
			To intercept closing, pass <code>onbeforeclose</code> and return <code>false</code> to keep
			the dialog open. Programmatically closing via <code>show={'{false}'}</code> bypasses it.
		</p>
		<Code
			content={`<Dialog
	show={opened}
	onbeforeclose={() => !dirty || confirm('Discard unsaved changes?')}
	onclose={() => (opened = false)}
>
	<DialogContent>
		{#snippet children({close})}
			<button onclick={close}>close</button>
		{/snippet}
	</DialogContent>
</Dialog>`}
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
				<!-- the close button no longer takes initial focus, so focus a top element to
				open the overflowing dialog scrolled to the top -->
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
{#if dialog_align_top_opened}
	<Dialog onclose={() => ((dialog_align_top_opened = false), reset_items())} align={selected_align}>
		<DialogContent>
			{#snippet children({close})}
				{#if selected_align === 'top'}
					<p>
						This is a <DeclarationLink name="Dialog" /> with
						<code
							>align="<select class="ml_0" bind:value={selected_align}
								>{#each dialog_aligns as align (align)}
									<option value={align}>{align}</option>
								{/each}
							</select>"</code
						>.
					</p>
					<p>
						Instead of being centered by default, the dialog's contents are aligned to the top of
						the page and grow downward. It's useful when the dialog's contents change in height.
					</p>
				{:else if selected_align === 'center'}
					<p>
						This is a <DeclarationLink name="Dialog" /> with
						<code
							>align="<select class="ml_0" bind:value={selected_align}
								>{#each dialog_aligns as align (align)}
									<option value={align}>{align}</option>
								{/each}
							</select>"</code
						>, the default value.
					</p>
					<p>
						It's often the best choice, but it can be undesirable in some situations, like when the
						height of the content changes as the user does things, leading to a janky experience.
					</p>
				{:else}
					<Alert status="error">eek a bug! unknown align "{selected_align}"</Alert>
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
						new stuff appears {#if selected_align === 'top'}gracefully{:else if selected_align === 'center'}ungracefully{/if}
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
{#if dialog_guarded_opened}
	<Dialog onbeforeclose={guard_unsaved} onclose={() => (dialog_guarded_opened = false)}>
		<DialogContent>
			{#snippet children({close})}
				<h1>unsaved changes</h1>
				<p>
					This dialog passes <code>onbeforeclose</code>. While "unsaved changes" is checked, closing
					via <kbd>Escape</kbd>, click-outside, or the buttons asks for confirmation first.
				</p>
				<label class="row gap_sm">
					<input type="checkbox" bind:checked={dirty} />
					unsaved changes
				</label>
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
