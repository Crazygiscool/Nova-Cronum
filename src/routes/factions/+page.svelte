<script lang="ts">
	import type { CharacterEntry } from "$lib/server/db";

	let { data }: { data: { factions: Record<string, CharacterEntry[]> } } = $props();

	const factionKeys = $derived(Object.keys(data.factions).sort());
</script>

<div class="mx-auto" style="max-width: 1200px">
	<div class="mb-8">
		<h2 class="font-heading text-3xl font-bold tracking-tight text-white">FACTION MANIFESTS</h2>
		<p class="serial-tag mt-2">BROWSE BY FACTION AFFILIATION</p>
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		{#each factionKeys as faction}
			{@const members = data.factions[faction]}
			<a href="/entries?faction={faction}" class="panel p-6" class:panel-glow={true}>
				<div class="mb-3 flex items-center justify-between">
					<h3 class="font-heading text-xl font-semibold text-white">{faction}</h3>
					<span class="badge-bracket">{members.length}</span>
				</div>
				<p class="line-clamp-2 text-sm" style="color: var(--muted)">
					{members.map((m) => m.name).join(", ")}
				</p>
			</a>
		{/each}
	</div>
</div>
