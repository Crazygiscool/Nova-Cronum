<script lang="ts">
	import type { CharacterEntry } from "$lib/server/db";
	import type { CustomFieldConfig } from "@crazygiscool/cap";

	let { data }: { data: { entry: CharacterEntry; customFields: CustomFieldConfig[] } } = $props();

	const entry = $state.snapshot(data.entry);
	const fields = $state.snapshot(data.customFields);
</script>

<div class="mx-auto max-w-4xl">
	<nav class="mb-6">
		<a href="/entries" class="text-sm text-muted hover:text-accent">&larr; Back to Registry</a>
	</nav>

	<div class="card p-8">
		<div class="mb-6 flex items-start justify-between gap-4">
			<div>
				<h1 class="font-heading text-3xl font-bold text-white">{entry.name}</h1>
				{#if entry.description}
					<p class="mt-2 text-lg text-muted">{entry.description}</p>
				{/if}
			</div>
			<div class="flex shrink-0 flex-wrap gap-2">
				{#each entry.factions ?? [] as faction}
					<span class="badge border-accent text-accent">{faction}</span>
				{/each}
			</div>
		</div>

		<div class="mb-6 flex flex-wrap gap-6 text-sm">
			{#if entry.continuityId}
				<div>
					<span class="text-muted">Continuity</span>
					<p class="font-medium text-white">{entry.continuityId}</p>
				</div>
			{/if}
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each fields as field}
				{@const val = entry[field.key as keyof CharacterEntry]}
				{#if val !== undefined && val !== null && val !== ""}
					<div>
						<span class="text-xs font-medium uppercase tracking-wider text-muted">{field.label}</span>
						<p class="mt-1 text-white">
							{typeof val === "boolean" ? (val ? "Yes" : "No") : String(val)}
						</p>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>
