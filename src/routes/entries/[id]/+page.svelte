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

		{#if entry.sources && entry.sources.length > 0}
			<div class="mt-6 border-t pt-6" style="border-color: color-mix(in srgb, var(--outline) 20%, transparent)">
				<h3 class="label-mono mb-3">SOURCES</h3>
				<div class="flex flex-col gap-2">
					{#each entry.sources as src}
						<a href={src.url} target="_blank" rel="noopener noreferrer"
							class="flex items-center gap-2 rounded px-3 py-2 text-sm transition-colors hover:bg-white/5"
							style="border: 1px solid color-mix(in srgb, var(--outline) 30%, transparent)"
						>
							<span style="color: var(--primary)">→</span>
							<span class="font-mono text-xs uppercase tracking-wider" style="color: var(--accent)">{src.wiki}</span>
							<span style="color: var(--muted)">{src.url}</span>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
