<script lang="ts">
	import type { CustomFieldConfig } from "@crazygiscool/cap";
	import type { CharacterEntry } from "$lib/server/db";
	import DynamicField from "$lib/components/DynamicField.svelte";
	import { goto } from "$app/navigation";

	let { data }: { data: { entry: CharacterEntry; customFields: CustomFieldConfig[] } } = $props();

	const entry = $state.snapshot(data.entry);
	const fields = $state.snapshot(data.customFields);

	let name = $state(entry.name);
	let description = $state(entry.description ?? "");
	let continuityId = $state(entry.continuityId ?? "");
	let factions = $state((entry.factions ?? []).join(", "));
	let customValues = $state<Record<string, unknown>>(() => {
		const vals: Record<string, unknown> = {};
		for (const f of fields) {
			const v = entry[f.key as keyof CharacterEntry];
			if (v !== undefined) vals[f.key] = v;
		}
		return vals;
	});
	let error = $state("");
	let saving = $state(false);

	function handleCustom(key: string, val: unknown) {
		customValues[key] = val;
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		saving = true;
		error = "";

		if (!name || !continuityId) {
			error = "Name and Continuity ID are required";
			saving = false;
			return;
		}

		const body = {
			name,
			description,
			continuityId: continuityId || undefined,
			factions: factions
				.split(",")
				.map((f) => f.trim())
				.filter(Boolean),
			...customValues,
		};

		const res = await fetch(`/api/v1/entries/${entry.id}`, {
			method: "PUT",
			headers: {
				"content-type": "application/json",
				authorization: `Bearer ${localStorage.getItem("admin_key")}`,
			},
			body: JSON.stringify(body),
		});

		if (res.ok) {
			goto(`/entries/${entry.id}`);
		} else {
			const err = await res.json();
			error = err.error || "Failed to update entry";
		}
		saving = false;
	}
</script>

<div class="mx-auto max-w-3xl">
	<nav class="mb-6">
		<a href="/entries/{entry.id}" class="text-sm text-muted hover:text-accent">&larr; Back to Entry</a>
	</nav>

	<div class="mb-8">
		<h2 class="font-heading text-3xl font-bold text-white">Edit Entry</h2>
		<p class="mt-1 text-muted">{entry.name}</p>
	</div>

	<form class="card space-y-6 p-8" onsubmit={handleSubmit}>
		{#if error}
			<div class="rounded-lg border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-400">{error}</div>
		{/if}

		<div class="flex flex-col gap-1.5">
			<label for="name" class="text-sm font-medium text-muted">Name *</label>
			<input id="name" type="text" class="input" required bind:value={name} />
		</div>

		<div class="flex flex-col gap-1.5">
			<label for="description" class="text-sm font-medium text-muted">Description</label>
			<textarea id="description" class="input min-h-24 resize-y" bind:value={description}></textarea>
		</div>

		<div class="flex flex-col gap-1.5">
			<label for="continuity" class="text-sm font-medium text-muted">Continuity ID *</label>
			<input id="continuity" type="text" class="input" required bind:value={continuityId} />
		</div>

		<div class="flex flex-col gap-1.5">
			<label for="factions" class="text-sm font-medium text-muted">Factions (comma-separated)</label>
			<input id="factions" type="text" class="input" placeholder="Autobot, Decepticon" bind:value={factions} />
		</div>

		<hr class="border-white/5" />

		<h3 class="font-heading text-lg font-semibold text-white">Custom Fields</h3>

		{#each fields as field}
			<DynamicField {field} value={customValues[field.key]} onchange={handleCustom} />
		{/each}

		<button type="submit" class="btn btn-primary w-full" disabled={saving}>
			{saving ? "Saving..." : "Save Changes"}
		</button>
	</form>
</div>
