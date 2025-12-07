<script lang="ts">
	import Svg from './Svg.svelte';
	import {gro_logo, fuz_logo, moss_logo, fuz_template_logo} from './logos.js';

	const size = 'var(--icon_size_lg)';
</script>

<!--<a href="https://www.spiderspace.org/"></a>--><!--<a href="https://www.webdevladder.net/"></a>-->
<!-- <a
	class="project_link"
	title="Zzz - bot control hq"
	href="https://www.zzz.software/"><Svg data={zzz_logo} {size} /><span class="name">Zzz</span></a
> -->
<a
	class="project_link"
	title="Gro - task runner and toolkit extending SvelteKit"
	href="https://gro.ryanatkn.com/"><Svg data={gro_logo} {size} /><span class="name">Gro</span></a
>
<a class="project_link" title="Moss - CSS framework" href="https://css.fuz.dev/"
	><Svg data={moss_logo} {size} /><span class="name">Moss</span></a
>
<a class="project_link" title="Fuz - Svelte UI library" href="https://ui.fuz.dev/"
	><Svg data={fuz_logo} {size} /><span class="name">Fuz</span></a
>
<a
	class="project_link"
	title="fuz_template - a static web app and Node library template with TypeScript, Svelte, SvelteKit, Vite, esbuild, Fuz, and Gro"
	href="https://template.fuz.dev/"
	><Svg data={fuz_template_logo} {size} /><span class="name">fuz_template</span></a
>

<style>
	.project_link {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--space_md);
		text-align: center;
	}

	.project_link:hover {
		text-decoration: none;
	}
	.project_link:hover .name {
		text-decoration: underline;
	}

	.project_link .name {
		display: block;
		margin-top: var(--font_size_sm);
		font-size: var(--font_size_lg);
		font-weight: 400;
	}
</style>
