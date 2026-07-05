<script lang="ts">
	import type { CharacterEntry } from "$lib/server/db";

	let { data }: { data: { factions: Record<string, CharacterEntry[]> } } = $props();

	const factionKeys = $derived(Object.keys(data.factions).sort());
</script>

<div class="mx-auto max-w-6xl">
	<div class="mb-8">
		<h2 class="font-heading text-3xl font-bold text-white">Faction Manifests</h2>
		<p class="mt-1 text-muted">Browse by faction affiliation</p>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		{#each factionKeys as faction}
			{@const members = data.factions[faction]}
			<a href="/entries?faction={faction}" class="card block p-6">
				<div class="mb-3 flex items-center justify-between">
					<h3 class="font-heading text-xl font-semibold text-white">{faction}</h3>
					<span class="badge border-primary text-primary">{members.length}</span>
				</div>
				<p class="line-clamp-2 text-sm text-muted">
					{members.map((m) => m.name).join(", ")}
				</p>
			</a>
		{/each}
	</div>
</div>
