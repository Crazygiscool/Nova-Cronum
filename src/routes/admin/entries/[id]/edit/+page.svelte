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
			error = "NAME AND CONTINUITY ID ARE REQUIRED";
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
			error = err.error || "FAILED TO UPDATE ENTRY";
		}
		saving = false;
	}
</script>

<div class="mx-auto" style="max-width: 800px">
	<nav class="mb-6">
		<a href="/entries/{entry.id}" class="serial-tag hover:text-accent">&lt; BACK TO ENTRY</a>
	</nav>

	<div class="mb-8">
		<h2 class="font-heading text-3xl font-bold tracking-tight text-white">EDIT ENTRY</h2>
		<p class="serial-tag mt-2">{entry.name}</p>
	</div>

	<form class="panel space-y-6 p-8" onsubmit={handleSubmit}>
		{#if error}
			<div class="p-4 text-sm" style="border: 1px solid var(--secondary-red); color: var(--secondary); background: color-mix(in srgb, var(--secondary-red) 10%, transparent)">
				{error}
			</div>
		{/if}

		<div class="flex flex-col gap-1.5">
			<label for="name" class="label-mono">NAME *</label>
			<input id="name" type="text" class="input" required bind:value={name} />
		</div>

		<div class="flex flex-col gap-1.5">
			<label for="description" class="label-mono">DESCRIPTION</label>
			<textarea id="description" class="input min-h-24" bind:value={description}></textarea>
		</div>

		<div class="flex flex-col gap-1.5">
			<label for="continuity" class="label-mono">CONTINUITY ID *</label>
			<input id="continuity" type="text" class="input" required bind:value={continuityId} />
		</div>

		<div class="flex flex-col gap-1.5">
			<label for="factions" class="label-mono">FACTIONS</label>
			<input id="factions" type="text" class="input" placeholder="AUTOBOT, DECEPTICON" bind:value={factions} />
			<p class="serial-tag">COMMA-SEPARATED</p>
		</div>

		<hr style="border-color: color-mix(in srgb, var(--outline) 20%, transparent)" />

		<h3 class="font-heading text-lg font-semibold text-white">CUSTOM FIELDS</h3>

		{#each fields as field}
			<DynamicField {field} value={customValues[field.key]} onchange={handleCustom} />
		{/each}

		<button type="submit" class="btn btn-primary w-full" disabled={saving}>
			{saving ? "PROCESSING..." : "SAVE CHANGES"}
		</button>
	</form>
</div>
