<script lang="ts">
	import type { CharacterEntry } from "$lib/server/db";

	let { data }: { data: { continuities: Record<string, CharacterEntry[]> } } = $props();

	const keys = $derived(Object.keys(data.continuities).sort());
</script>

<div class="mx-auto max-w-6xl">
	<div class="mb-8">
		<h2 class="font-heading text-3xl font-bold text-white">Continuity Streams</h2>
		<p class="mt-1 text-muted">Browse by timeline/continuity</p>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		{#each keys as c}
			{@const members = data.continuities[c]}
			<a href="/entries?continuity={c}" class="card block p-6">
				<div class="mb-3 flex items-center justify-between">
					<h3 class="font-heading text-xl font-semibold text-white">{c}</h3>
					<span class="badge border-accent text-accent">{members.length}</span>
				</div>
				<p class="line-clamp-2 text-sm text-muted">
					{members.map((m) => m.name).join(", ")}
				</p>
			</a>
		{/each}
	</div>
</div>
