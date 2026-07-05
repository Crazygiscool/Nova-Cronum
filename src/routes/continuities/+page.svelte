<script lang="ts">
	import type { CharacterEntry } from "$lib/server/db";

	let { data }: { data: { continuities: Record<string, CharacterEntry[]> } } = $props();

	const keys = $derived(Object.keys(data.continuities).sort());
</script>

<div class="mx-auto" style="max-width: 1200px">
	<div class="mb-8">
		<h2 class="font-heading text-3xl font-bold tracking-tight text-white">CONTINUITY STREAMS</h2>
		<p class="serial-tag mt-2">BROWSE BY TIMELINE / CONTINUITY</p>
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		{#each keys as c}
			{@const members = data.continuities[c]}
			<a href="/entries?continuity={c}" class="panel p-6" class:panel-glow={true}>
				<div class="mb-3 flex items-center justify-between">
					<h3 class="font-heading text-xl font-semibold text-white">{c}</h3>
					<span class="badge-bracket">{members.length}</span>
				</div>
				<p class="line-clamp-2 text-sm" style="color: var(--muted)">
					{members.map((m) => m.name).join(", ")}
				</p>
			</a>
		{/each}
	</div>
</div>
