<script lang="ts">
	import "../app.css";
	import Nav from "$lib/components/Nav.svelte";

	let { data, children }: { data: { theme: { theme: Record<string, string>; pages: { id: string; label: string }[] }; enabledPages: { id: string; label: string }[] }; children: import("svelte").Snippet } = $props();

	const t = $derived(data.theme.theme);
	const styles = $derived(`
		--primary: ${t.primaryColor};
		--primary-on: ${t.primaryOnColor};
		--accent: ${t.accentColor};
		--secondary: ${t.secondaryColor};
		--secondary-red: ${t.secondaryRedColor};
		--bg: ${t.backgroundColor};
		--surface: ${t.surfaceColor};
		--surface-low: ${t.surfaceLowColor};
		--card: ${t.cardColor};
		--text: ${t.textColor};
		--muted: ${t.mutedTextColor};
		--outline: ${t.outlineColor};
		--outline-variant: ${t.outlineVariantColor};
		--heading-font: ${t.headingFont};
		--body-font: ${t.fontFamily};
		--mono-font: ${t.monoFont};
		background-color: ${t.backgroundColor};
		background-image:
			linear-gradient(rgba(0, 219, 233, 0.02) 1px, transparent 1px),
			linear-gradient(90deg, rgba(0, 219, 233, 0.02) 1px, transparent 1px);
		background-size: 60px 60px;
		min-height: 100vh;
	` as string);
</script>

<div style={styles}>
	<Nav pages={data.enabledPages} />
	<main class="ml-64 min-h-screen p-8">
		{@render children()}
	</main>
</div>
