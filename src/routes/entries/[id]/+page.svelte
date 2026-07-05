<script lang="ts">
	import type { CharacterEntry } from "$lib/server/db";
	import type { CustomFieldConfig } from "@crazygiscool/cap";

	let { data }: { data: { entry: CharacterEntry; customFields: CustomFieldConfig[] } } = $props();

	const entry = $state.snapshot(data.entry);
	const fields = $state.snapshot(data.customFields);
</script>

<div class="mx-auto" style="max-width: 900px">
	<nav class="mb-6">
		<a href="/entries" class="serial-tag hover:text-accent">&lt; BACK TO REGISTRY</a>
	</nav>

	<div class="panel p-8" class:panel-glow={true}>
		<div class="mb-6 flex items-start justify-between gap-4">
			<div>
				<p class="serial-tag">ENTRY-{entry.id.slice(0, 8).toUpperCase()}</p>
				<h1 class="font-heading mt-2 text-3xl font-bold text-white">{entry.name}</h1>
				{#if entry.description}
					<p class="mt-2" style="color: var(--muted)">{entry.description}</p>
				{/if}
			</div>
			<div class="flex shrink-0 flex-wrap gap-2">
				{#each entry.factions ?? [] as faction}
					<span class="badge-bracket">{faction}</span>
				{/each}
			</div>
		</div>

		<div class="mb-6 flex flex-wrap gap-6">
			{#if entry.continuityId}
				<div>
					<span class="label-mono">CONTINUITY</span>
					<p class="mt-1 font-medium text-white">{entry.continuityId}</p>
				</div>
			{/if}
		</div>

		<div class="border-t" style="border-color: color-mix(in srgb, var(--outline) 20%, transparent)">
			{#each fields as field}
				{@const val = entry[field.key as keyof CharacterEntry]}
				{#if val !== undefined && val !== null && val !== ""}
					<div class="readout-row">
						<span class="readout-label">{field.label}</span>
						<span class="readout-value">
							{typeof val === "boolean" ? (val ? "ACTIVE" : "INACTIVE") : String(val)}
						</span>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</div>
