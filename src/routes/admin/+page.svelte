<script lang="ts">
	let { data }: { data: { entryCount: number; keys: { id: string; label: string; createdAt: Date; lastUsedAt: Date | null }[] } } = $props();

	let newLabel = $state("");
	let newKey = $state("");
	let keys = $state($state.snapshot(data.keys));
</script>

<div class="mx-auto max-w-4xl">
	<div class="mb-8">
		<h2 class="font-heading text-3xl font-bold text-white">Admin Panel</h2>
		<p class="mt-1 text-muted">Manage entries and API keys</p>
	</div>

	<div class="mb-8">
		<div class="card p-6">
			<h3 class="mb-2 font-heading text-lg font-semibold text-white">Database Stats</h3>
			<p class="text-muted">{data.entryCount} entries</p>
			<a href="/admin/entries/new" class="btn btn-primary mt-4 inline-block">New Entry</a>
		</div>
	</div>

	<div class="card p-6">
		<h3 class="mb-4 font-heading text-lg font-semibold text-white">API Keys</h3>

		<form
			class="mb-6 flex gap-3"
			onsubmit={async (e: SubmitEvent) => {
				e.preventDefault();
				if (!newLabel) return;
				const res = await fetch("/api/v1/admin/keys", {
					method: "POST",
					headers: {
						"content-type": "application/json",
						authorization: `Bearer ${localStorage.getItem("admin_key")}`,
					},
					body: JSON.stringify({ label: newLabel }),
				});
				if (res.ok) {
					const key = await res.json();
					newKey = key.key;
					keys = [...keys, { id: key.id, label: key.label, createdAt: key.createdAt, lastUsedAt: null }];
					newLabel = "";
				} else {
					alert("Failed to create key. Check your admin key.");
				}
			}}
		>
			<input type="text" class="input flex-1" placeholder="Key label..." bind:value={newLabel} />
			<button type="submit" class="btn btn-accent">Generate</button>
		</form>

		{#if newKey}
			<div class="mb-6 rounded-lg border border-accent/30 bg-accent/5 p-4">
				<p class="text-sm font-medium text-accent">New API Key (copy now — won't be shown again):</p>
				<code class="mt-1 block break-all font-mono text-sm text-white">{newKey}</code>
			</div>
		{/if}

		<table class="w-full text-left text-sm">
			<thead>
				<tr class="border-b border-white/5 text-muted">
					<th class="pb-2 font-medium">Label</th>
					<th class="pb-2 font-medium">Created</th>
					<th class="pb-2 font-medium">Last Used</th>
					<th class="pb-2"></th>
				</tr>
			</thead>
			<tbody>
				{#each keys as k (k.id)}
					<tr class="border-b border-white/5">
						<td class="py-2 text-white">{k.label}</td>
						<td class="py-2 text-muted">{new Date(k.createdAt).toLocaleDateString()}</td>
						<td class="py-2 text-muted">{k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : "Never"}</td>
						<td class="py-2">
							<button
								class="text-sm text-red-400 hover:text-red-300"
								onclick={async () => {
									if (!confirm("Delete this key?")) return;
									const res = await fetch(`/api/v1/admin/keys/${k.id}`, {
										method: "DELETE",
										headers: { authorization: `Bearer ${localStorage.getItem("admin_key")}` },
									});
									if (res.ok) {
										keys = keys.filter((x) => x.id !== k.id);
									}
								}}
							>
								Delete
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
