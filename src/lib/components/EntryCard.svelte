<script lang="ts">
	import type { CharacterEntry } from "$lib/server/db";

	let { entry }: { entry: CharacterEntry } = $props();
</script>

<a href="/entries/{entry.id}" class="card block overflow-hidden p-5">
	<div class="mb-3 flex items-start justify-between gap-4">
		<h3 class="font-heading text-lg font-semibold text-white">{entry.name}</h3>
		{#if entry.factions?.length}
			<div class="flex shrink-0 flex-wrap gap-1">
				{#each entry.factions as faction}
					<span class="badge border-accent text-accent">{faction}</span>
				{/each}
			</div>
		{/if}
	</div>

	<p class="mb-3 line-clamp-2 text-sm text-muted">{entry.description}</p>

	<div class="flex items-center gap-4 text-xs text-muted">
		{#if entry.continuityId}
			<span>{entry.continuityId}</span>
		{/if}
		{#if entry.sparkId}
			<span>{entry.sparkId}</span>
		{/if}
	</div>
</a>
