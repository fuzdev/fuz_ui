<!--
	Renders a docs markdown field, preferring the build-time pre-parsed tree
	(`nodes`, from `vite_plugin_docs_mdz`) over parsing the raw string at render.
	Falls back to `content` when the pre-parse didn't run (a plain `vite dev`
	without the plugin) so the docs always render either way. Isolates the
	`<Mdz nodes={…}>` usage — which needs `@fuzdev/mdz` with the `nodes` prop — to
	one component.
-->
<script lang="ts">
	import Mdz from '@fuzdev/mdz/Mdz.svelte';
	import type {MdzNode} from '@fuzdev/mdz/mdz.js';

	const {content, nodes}: {content?: string; nodes?: Array<MdzNode>} = $props();
</script>

{#if nodes}
	<Mdz {nodes} />
{:else if content}
	<Mdz {content} />
{/if}
