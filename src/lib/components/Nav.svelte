<script lang="ts">
	import { page } from "$app/stores";

	let { pages }: { pages: { id: string; label: string }[] } = $props();

	const active = $derived($page.url.pathname);

	function href(p: { id: string }): string {
		return p.id === "dashboard" ? "/" : `/${p.id}`;
	}

	function isActive(p: { id: string }): boolean {
		const h = href(p);
		return active === h;
	}
</script>

<nav class="sidebar fixed left-0 top-0 z-50 flex h-full w-64 flex-col py-6">
	<div class="mb-8 px-6">
		<h1 class="font-heading text-lg font-bold tracking-wider text-white">NOVA CRONUM</h1>
		<p class="serial-tag mt-1">CENTRAL ARCHIVE PROTOCOL</p>
	</div>

	<div class="flex flex-col gap-0.5 px-3">
		{#each pages as p}
			<a
				href={href(p)}
				class="nav-item"
				class:nav-item-active={isActive(p)}
			>
				{p.label}
			</a>
		{/each}
	</div>

	<div class="mt-auto border-t border-outline/20 px-6 pt-4">
		<p class="serial-tag">v0.1 // CYBERTRON ARCHIVE</p>
	</div>
</nav>
