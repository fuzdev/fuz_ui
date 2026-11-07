<script lang="ts">
	// Test harness: mounts `ThemeRoot` with forwarded props, rendering the style
	// it passes its children so tests can read what it would put in the head.
	import ThemeRoot from '#lib/ThemeRoot.svelte';

	const props: Record<string, any> = $props();
</script>

<ThemeRoot {...props}>
	{#snippet children(theme_state, style)}
		<pre data-testid="style">{style ?? ''}</pre>
		<span data-testid="theme_name">{theme_state.theme.name}</span>
	{/snippet}
</ThemeRoot>
