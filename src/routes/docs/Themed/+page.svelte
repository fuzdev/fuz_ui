<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';
	import type {Theme} from '@fuzdev/fuz_css/theme.js';
	import {default_themes} from '@fuzdev/fuz_css/themes.js';

	import TomeContent from '$lib/TomeContent.svelte';
	import Details from '$lib/Details.svelte';
	import Dialog from '$lib/Dialog.svelte';
	import {get_tome_by_name} from '$lib/tome.js';
	import ColorSchemeInput from '$lib/ColorSchemeInput.svelte';
	import TomeSectionHeader from '$lib/TomeSectionHeader.svelte';
	import TomeSection from '$lib/TomeSection.svelte';
	import ThemeInput from '$lib/ThemeInput.svelte';
	import ThemeForm from '$routes/ThemeForm.svelte';
	import MdnLink from '$lib/MdnLink.svelte';
	import {themer_context} from '$lib/themer.svelte.js';

	const LIBRARY_ITEM_NAME = 'Themed';

	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);

	const themes = default_themes.slice();

	const themer = themer_context.get();

	// let show_create_theme_dialog = false;
	let editing_theme: null | Theme = $state(null);
</script>

<!-- eslint-disable svelte/no-useless-mustaches -->

<TomeContent {tome}>
	<section class="theme">
		<p>
			Fuz provides UI components that use <a href="https://css.fuz.dev/docs/themes"
				>Fuz CSS' theming system</a
			> for dark mode and custom themes.
		</p>
		<p>
			<code>Themed</code> adds global support for both the browser's
			<MdnLink path="Web/CSS/color-scheme" />
			and custom themes based on
			<a href="https://css.fuz.dev/docs/variables">Fuz CSS style variables</a>, which use
			<MdnLink path="Web/CSS/--*">CSS custom properties</MdnLink>.
			<code>Themed</code> is a singleton component that's mounted at the top-level of the page:
		</p>
		<Code content={`import Themed from '@fuzdev/fuz_ui/Themed.svelte';`} lang="ts" />
		<Code content={`<!-- +layout.svelte -->\n<Themed>\n\t{@render children()}\n</Themed>`} />
		<Details>
			{#snippet summary()}Why the singleton?{/snippet}
			<aside>
				<p>Most theme usage affects the whole page, so Fuz makes that easy.</p>
				<p>
					By default <code>Themed</code> syncs its settings to the global <code>:root</code> tag and
					persists to <code>localStorage</code>.
				</p>
				<p>These behaviors can be customized with its props:</p>
				<ul>
					<li><code>sync_color_scheme</code></li>
					<li><code>load_color_scheme</code></li>
					<li><code>save_color_scheme</code></li>
					<li><code>load_theme</code></li>
					<li><code>save_theme</code></li>
				</ul>
			</aside>
		</Details>
		<Details>
			{#snippet summary()}Why nested children?{/snippet}
			<aside>
				<p>
					<code>Themed</code> is designed to wrap every page at the top level so it can provide the
					selected theme and color scheme in the Svelte context via a <code>themer</code> instance.
					It works without children, but <code>themer_context.get()</code> will fail unless you call
					<code>themer_context.set()</code> yourself.
				</p>
				<p>
					This lets you call <code>themer_context.get()</code> to access the reactive
					<code>Themer</code>
					class instance anywhere in your code. The helper components on this page like
					<code>ColorSchemeInput</code> and <code>ThemeInput</code> use it so they don't require a
					<code>themer</code> prop.
				</p>
				<p>
					If you don't don't want to wrap everything in <code>Themed</code> for some reason, you can
					set a <code>Themer</code> in context manually. It must be the same reference as the
					<code>Themed</code> prop:
				</p>
				<Code
					content={'<' +
						`script>
	const themer = new Themer(...);
	set_themer(themer);
</script>
<Themed {themer} />
<!--
	sibling components not nested in \`Themed\`
	can now call \`themer_context.get()\`
-->`}
				/>
			</aside>
		</Details>
	</section>
	<TomeSection>
		<TomeSectionHeader text="Color scheme" />
		<p>
			<code>Themed</code> defaults to automatic
			<MdnLink path="Web/CSS/color-scheme" />
			detection with
			<MdnLink path="Web/CSS/@media/prefers-color-scheme" />, and users can also set it directly:
		</p>
		<div class="mb_lg">
			<ColorSchemeInput />
		</div>
		<Code
			content={`import ColorSchemeInput from '@fuzdev/fuz_ui/ColorSchemeInput.svelte';`}
			lang="ts"
		/>
		<Code content="<ColorSchemeInput />" />
		<p>Pass props to override the default:</p>
		<!-- TODO this is bugged on page load, auto is SSR'd but doesn't update here, can we fix? Should Svelte prefer the client value? -->
		<Code
			content={`<ColorSchemeInput\n\tvalue={{color_scheme: ${
				"'" + JSON.stringify(themer.color_scheme).replace(/"/g, '') + "'"
			}}}\n\tonchange={...}\n/>`}
		/>
		<p>
			The builtin themes support both dark and light color schemes. Custom themes may support one or
			both color schemes.
		</p>
		<Details>
			{#snippet summary()}More about <code>ColorSchemeInput</code>{/snippet}
			<aside>
				<p>
					<code>ColorSchemeInput</code> enables users to choose and persist the color scheme without boilerplate.
				</p>
				<p>
					By default, <code>ColorSchemeInput</code> works with <code>Themed</code>'s
					<code>themer</code> in context to save the user's preference to <code>localStorage</code>.
					To customize this behavior, pass your own <code>value</code> or <code>onchange</code>
					props. The <code>value</code> defaults to <code>themer_context.get()</code> so technically
					you could call <code>set_themer</code>, but it's unlikely you want to override it in
					context.
				</p>
			</aside>
		</Details>
	</TomeSection>
	<TomeSection>
		<TomeSectionHeader text="Builtin themes" />
		<p>
			A theme is a simple JSON collection of <a href="https://css.fuz.dev/docs/variables"
				>Fuz CSS style variables</a
			> that can be transformed into CSS that set custom properties. Each variable can have values for
			light and/or dark color schemes. In other words, "dark" isn't a theme, it's a mode that any theme
			can implement.
		</p>
		<!-- TODO explain when exported <Code code={`<ThemeInput\n\t{themes}\n\t{selected_theme}\n/>`} /> -->
		<div class="width_upto_sm mb_lg">
			<ThemeInput {themes} enable_editing onedit={(t) => (editing_theme = t)} />
		</div>
		<!-- <button class="mb_lg" onclick={() => (show_create_theme_dialog = true)} disabled
				>create a new theme (todo)</button
			> -->
		<aside>
			⚠️ The builtin themes need a lot more work, but the proof of concept seems to work.
		</aside>
		<aside>
			⚠️ Custom themes currently pop in on page load. To see this, change from the base theme and
			refresh the page. This can be fixed using a similar strategy that we use to avoid pop-in of
			user-defined color schemes, but it's more involved.
		</aside>
	</TomeSection>
	<TomeSection>
		<TomeSectionHeader text="Example usage" />
		<p>Themes are plain CSS that can be sourced in a variety of ways.</p>
		<p>To use Fuz's base theme:</p>
		<Code
			content={`<!-- +layout.svelte -->
<` +
				`script>
	import '@fuzdev/fuz_css/style.css';
	import '@fuzdev/fuz_css/theme.css';
	import Themed from '@fuzdev/fuz_ui/Themed.svelte';
	import type {Snippet} from 'svelte';
	
	const {children}: {children: Snippet} = $props();
</script>

<!-- enable theme and color-scheme support -->
<Themed>
	{@render children()}
</Themed>`}
		/>
		<p>
			<code>Themed</code> can be customized with the the nonreactive prop
			<code>themer</code>:
		</p>
		<Code
			content={`import {Themer} from '@fuzdev/fuz_ui/themer.svelte.js';\nconst themer = new Themer(...);`}
			lang="ts"
		/>
		<Code
			content={`<Themed {themer}>
	{@render children()}
</Themed>`}
		/>
		<aside>
			The <code>themer</code> prop is not reactive because it's put in Svelte context without a wrapper.
			This could be fixed, let me know if you have a usecase.
		</aside>
		<p>
			<code>Themed</code> sets the <code>themer</code> in the Svelte context:
		</p>
		<Code
			content={`// get values from the Svelte context provided by
// the nearest \`Themed\` ancestor:
import {themer_context} from '@fuzdev/fuz_ui/themer.svelte.js';
const themer = themer_context.get();
themer.theme.name; // '${themer.theme.name}'
themer.color_scheme; // '${themer.color_scheme}'`}
			lang="ts"
		/>
		<p>
			For a more complete example, see <a href="https://github.com/fuzdev/fuz_template"
				>fuz_template</a
			>.
		</p>
	</TomeSection>
	<TomeSection>
		<TomeSectionHeader text="More details" />
		<p>
			<code>Themed</code> initializes the system's theme support. Without it, the page will not
			reflect the user's system
			<code>color-scheme</code>. By default, <code>Themed</code> applies the base theme to the root
			of the page via <code>create_theme_setup_script</code>. It uses JS to add the
			<code>.dark</code> CSS class to the <code>:root</code> element.
		</p>
		<p>
			This strategy enables color scheme and theme support with minimal CSS and optimal performance
			for most use cases. The system supports plain CSS usage that can be static or dynamic, or
			imported at buildtime or runtime. It also allows runtime access to the underlying data like
			the <a href="https://css.fuz.dev/docs/variables">style variables</a> if you want to pay the performance
			costs. Scoped theming to one part of the page is planned.
		</p>
		<p>
			The theme setup script interacts with <code>sync_color_scheme</code> to save the user's
			preference to <code>localStorage</code>. See also <code>ColorSchemeInput</code>.
		</p>
		<p>
			The setup script avoids flash-on-load due to color scheme, but currently themes flash in after
			loading. We'll try to fix this when the system stabilizes.
		</p>
	</TomeSection>
</TomeContent>

<!-- TODO enable creating themes -->
<!-- {#if show_create_theme_dialog}
	<Dialog onclose={() => (show_create_theme_dialog = false)} let:close>
		<div class="pane p_md width_upto_md mx_auto">
			<div class="theme_editor_wrapper panel">
				<ThemeForm
					oncreate={(theme) => {
						themes = themes.concat(theme);
						close();
					}}
				/>
			</div>
		</div>
	</Dialog>
{/if} -->
{#if editing_theme}
	<Dialog onclose={() => (editing_theme = null)}>
		<div class="pane p_md width_upto_md mx_auto">
			<div class="theme_editor_wrapper panel">
				<ThemeForm
					theme={editing_theme}
					onsave={(theme) => {
						console.log(`update theme`, theme); // eslint-disable-line no-console
						alert('todo'); // eslint-disable-line no-alert
					}}
				/>
			</div>
		</div>
	</Dialog>
{/if}

<style>
	.theme_editor_wrapper {
		width: var(--distance_md);
		padding: var(--space_lg);
	}
</style>
