<script lang="ts">
	// TODO delete?

	const {
		text,
		tag = 'span',
		size,
		padding,
	}: {
		text: string;
		tag?: string;
		size?: string | undefined;
		padding?: string | undefined;
	} = $props();
</script>

<svelte:element this={tag} style:font-size={size} style:padding>{text}</svelte:element>
