<script lang="ts">
	import { page } from "$app/stores";

	let { pages }: { pages: { id: string; label: string }[] } = $props();

	const active = $derived($page.url.pathname);
</script>

<nav class="glass fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-white/5 p-6">
	<div class="mb-8">
		<h1 class="font-heading text-xl font-bold text-primary">NOVA CRONUM</h1>
		<p class="mt-1 text-xs text-muted">Central Archive Protocol</p>
	</div>

	<div class="flex flex-col gap-1">
		{#each pages as p}
			{@const href = p.id === "dashboard" ? "/" : `/${p.id}`}
			{@const isActive = active === href}
			<a
				{href}
				class="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
				class:text-primary={isActive}
				class:text-muted={!isActive}
			>
				{p.label}
			</a>
		{/each}
	</div>
</nav>
