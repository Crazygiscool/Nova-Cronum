<script lang="ts">
	import EntryCard from "$lib/components/EntryCard.svelte";
	import type { CharacterEntry } from "$lib/server/db";

	let { data }: { data: { entries: CharacterEntry[]; factions: string[] } } = $props();

	let selectedFaction = $state("");
	let search = $state("");

	const filtered = $derived(
		data.entries.filter((e) => {
			if (selectedFaction && !e.factions?.includes(selectedFaction)) return false;
			if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
			return true;
		}),
	);
</script>

<div class="mx-auto" style="max-width: 1200px">
	<div class="mb-8">
		<h2 class="font-heading text-3xl font-bold tracking-tight text-white">MATRIX REGISTRY</h2>
		<p class="serial-tag mt-2">CHARACTER DATABASE OVERVIEW</p>
	</div>

	<div class="mb-6 flex flex-wrap items-center gap-4">
		<input
			type="text"
			class="input w-72"
			placeholder="SEARCH ENTRIES..."
			bind:value={search}
		/>

		<select class="input w-48" bind:value={selectedFaction}>
			<option value="">ALL FACTIONS</option>
			{#each data.factions as f}
				<option value={f}>{f}</option>
			{/each}
		</select>
	</div>

	{#if filtered.length === 0}
		<p class="serial-tag">NO ENTRIES FOUND.</p>
	{:else}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each filtered as entry (entry.id)}
				<EntryCard {entry} />
			{/each}
		</div>
	{/if}
</div>
