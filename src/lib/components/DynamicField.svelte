<script lang="ts">
	import type { CustomFieldConfig } from "@crazygiscool/cap";

	let {
		field,
		value,
		onchange,
	}: {
		field: CustomFieldConfig;
		value: unknown;
		onchange: (key: string, val: unknown) => void;
	} = $props();
</script>

<div class="flex flex-col gap-1.5">
	<label for="field-{field.key}" class="label-mono">{field.label}</label>

	{#if field.type === "string"}
		<input
			id="field-{field.key}"
			type="text"
			class="input"
			value={(value as string) ?? ""}
			placeholder={field.label}
			oninput={(e) => onchange(field.key, (e.target as HTMLInputElement).value)}
		/>
	{:else if field.type === "number"}
		<input
			id="field-{field.key}"
			type="number"
			class="input"
			value={(value as number) ?? ""}
			placeholder={field.label}
			oninput={(e) => onchange(field.key, Number((e.target as HTMLInputElement).value))}
		/>
	{:else if field.type === "boolean"}
		<label class="flex cursor-pointer items-center gap-2" style="color: var(--muted)">
			<input
				id="field-{field.key}"
				type="checkbox"
				class="h-4 w-4 accent-accent"
				style="border: 1px solid var(--outline); background: color-mix(in srgb, var(--accent) 5%, var(--bg))"
				checked={(value as boolean) ?? false}
				onchange={(e) => onchange(field.key, (e.target as HTMLInputElement).checked)}
			/>
			<span class="text-sm">ACTIVE</span>
		</label>
	{:else if field.type === "date"}
		<input
			id="field-{field.key}"
			type="datetime-local"
			class="input"
			value={(value as string) ?? ""}
			oninput={(e) => onchange(field.key, (e.target as HTMLInputElement).value)}
		/>
	{/if}
</div>
