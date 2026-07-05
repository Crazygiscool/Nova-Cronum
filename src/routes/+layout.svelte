<script lang="ts">
	import "../app.css";
	import Nav from "$lib/components/Nav.svelte";

	let { data, children }: { data: { theme: { theme: Record<string, string>; pages: { id: string; label: string }[] }; enabledPages: { id: string; label: string }[] }; children: import("svelte").Snippet } = $props();

	const styles = $derived(`
		--primary: ${data.theme.theme.primaryColor};
		--primary-hover: ${data.theme.theme.primaryColor}cc;
		--accent: ${data.theme.theme.accentColor};
		--bg: ${data.theme.theme.backgroundColor};
		--surface: ${data.theme.theme.surfaceColor};
		--card: ${data.theme.theme.cardColor};
		--text: ${data.theme.theme.textColor};
		--muted: ${data.theme.theme.mutedTextColor};
		--heading-font: ${data.theme.theme.headingFont};
		--body-font: ${data.theme.theme.fontFamily};
	` as string);
</script>

<div style={styles}>
	<Nav pages={data.enabledPages} />
	<main class="ml-64 min-h-screen p-8">
		{@render children()}
	</main>
</div>
