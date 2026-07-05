<script lang="ts">
	import type { CharacterEntry } from "$lib/server/db";

	let { entry }: { entry: CharacterEntry } = $props();
</script>

<a href="/entries/{entry.id}" class="panel block overflow-hidden p-5" class:panel-glow={true}>
	<div class="mb-2 flex items-start justify-between gap-4">
		<div>
			<p class="serial-tag">ENTRY-{entry.id.slice(0, 8).toUpperCase()}</p>
			<h3 class="font-heading mt-1 text-lg font-semibold text-white">{entry.name}</h3>
		</div>
		{#if entry.factions?.length}
			<div class="flex shrink-0 flex-wrap gap-1.5">
				{#each entry.factions as faction}
					<span class="badge-bracket">{faction}</span>
				{/each}
			</div>
		{/if}
	</div>

	<p class="mb-3 line-clamp-2 text-sm" style="color: var(--muted)">{entry.description}</p>

	<div class="flex items-center gap-4 text-xs" style="color: var(--outline-variant)">
		{#if entry.continuityId}
			<span class="badge-bracket">{entry.continuityId}</span>
		{/if}
		{#if entry.sparkId}
			<span>{entry.sparkId}</span>
		{/if}
	</div>
</a>
