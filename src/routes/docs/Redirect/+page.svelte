<script lang="ts">
	import Code from '@fuzdev/fuz_code/Code.svelte';

	import {get_tome_by_name} from '$lib/tome.js';
	import Redirect from '$lib/Redirect.svelte';
	import MdnLink from '$lib/MdnLink.svelte';
	import TomeContent from '$lib/TomeContent.svelte';

	const LIBRARY_ITEM_NAME = 'Redirect';
	const tome = get_tome_by_name(LIBRARY_ITEM_NAME);
</script>

<!-- eslint-disable svelte/no-useless-mustaches -->

<TomeContent {tome}>
	<section>
		<p>
			Adds a redirect for a page using <MdnLink path="Web/HTTP/Redirections#html_redirections"
				>a meta tag</MdnLink
			>
			with
			<MdnLink path="Web/HTML/Element/meta#http-equiv"
				>the <span class="font_family_mono">refresh</span> header</MdnLink
			>. Includes a rendered link and JS navigation fallback.
		</p>
		<!-- TODO make this a generic data-driven helper -->
		<Code lang="ts" content={`import Redirect from '@fuzdev/fuz_ui/Redirect.svelte';`} />
		<aside>
			Note that <code>auto={'{'}false}</code> is only used here to prevent the page from
			redirecting! Typical usage lets it default to <code>true</code>.
		</aside>
		<Code content={`<Redirect auto={false} />`} />
		<Redirect auto={false} />
	</section>
	<section>
		<Code
			content={`<Redirect
	host="https://www.felt.dev"
	path="/docs"
	let:url
	auto={false}
>
	the redirect url is {url}
</Redirect>`}
		/>
		<Redirect host="https://www.felt.dev" path="/docs" auto={false}>
			{#snippet children(url)}
				the redirect url is {url}
			{/snippet}
		</Redirect>
	</section>
</TomeContent>
