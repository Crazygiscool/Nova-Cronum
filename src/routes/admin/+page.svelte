<script lang="ts">
	import { goto } from "$app/navigation";
	let { data }: { data: { entryCount: number; keys: { id: string; label: string; createdAt: Date; lastUsedAt: Date | null }[] } } = $props();

	let newLabel = $state("");
	let newKey = $state("");
	let keys = $state($state.snapshot(data.keys));

	// Change password
	let showPasswordForm = $state(false);
	let oldPassword = $state("");
	let newPassword = $state("");
	let confirmPassword = $state("");
	let passwordError = $state("");
	let passwordOk = $state(false);

	async function handleLogout() {
		await fetch("/admin/api/logout", { method: "POST" });
		goto("/admin/login");
	}

	async function handlePasswordChange(e: SubmitEvent) {
		e.preventDefault();
		passwordError = "";
		passwordOk = false;

		if (newPassword !== confirmPassword) {
			passwordError = "Passwords do not match";
			return;
		}
		if (newPassword.length < 8) {
			passwordError = "New password must be at least 8 characters";
			return;
		}

		const res = await fetch("/admin/api/password", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ oldPassword, newPassword }),
		});

		if (res.ok) {
			passwordOk = true;
			oldPassword = "";
			newPassword = "";
			confirmPassword = "";
			showPasswordForm = false;
		} else {
			const data = await res.json();
			passwordError = data.error || "Failed to change password";
		}
	}
</script>

<div class="mx-auto" style="max-width: 1000px">
	<div class="mb-8 flex items-start justify-between">
		<div>
			<h2 class="font-heading text-3xl font-bold tracking-tight text-white">ADMIN PANEL</h2>
			<p class="serial-tag mt-2">MANAGE ENTRIES &amp; API KEYS</p>
		</div>
		<div class="flex gap-3">
			<button class="btn btn-sm" onclick={() => (showPasswordForm = !showPasswordForm)}>
				CHANGE PASSWORD
			</button>
			<button class="btn btn-red btn-sm" onclick={handleLogout}>LOGOUT</button>
		</div>
	</div>

	{#if showPasswordForm}
		<div class="panel mb-8 p-6">
			<h3 class="font-heading mb-4 text-lg font-semibold text-white">CHANGE PASSWORD</h3>
			{#if passwordOk}
				<div class="mb-4 p-3 text-sm" style="border: 1px solid var(--accent); color: var(--accent); background: color-mix(in srgb, var(--accent) 8%, transparent)">
					PASSWORD CHANGED SUCCESSFULLY
				</div>
			{/if}
			{#if passwordError}
				<div class="mb-4 p-3 text-sm" style="border: 1px solid var(--secondary-red); color: var(--secondary); background: color-mix(in srgb, var(--secondary-red) 10%, transparent)">
					{passwordError}
				</div>
			{/if}
			<form class="flex flex-col gap-3" onsubmit={handlePasswordChange}>
				<div class="flex flex-col gap-1.5">
					<label for="oldpw" class="label-mono">CURRENT PASSWORD</label>
					<input id="oldpw" type="password" class="input" required bind:value={oldPassword} />
				</div>
				<div class="flex flex-col gap-1.5">
					<label for="newpw" class="label-mono">NEW PASSWORD</label>
					<input id="newpw" type="password" class="input" required bind:value={newPassword} />
				</div>
				<div class="flex flex-col gap-1.5">
					<label for="confirmpw" class="label-mono">CONFIRM NEW PASSWORD</label>
					<input id="confirmpw" type="password" class="input" required bind:value={confirmPassword} />
				</div>
				<button type="submit" class="btn btn-primary w-full">UPDATE PASSWORD</button>
			</form>
		</div>
	{/if}

	<div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
		<div class="panel p-6">
			<p class="label-mono">DATABASE STATS</p>
			<p class="mt-2 font-heading text-4xl font-bold text-primary">{data.entryCount}</p>
			<p class="serial-tag">ENTRIES</p>
			<div class="mt-4 flex gap-2">
				<a href="/admin/entries/new" class="btn btn-primary btn-sm">NEW ENTRY</a>
				<a href="/admin/crawl" class="btn btn-accent btn-sm">WIKI CRAWLER</a>
			</div>
		</div>
	</div>

	<div class="panel p-6">
		<h3 class="font-heading mb-4 text-lg font-semibold text-white">API KEYS</h3>

		<form
			class="mb-6 flex gap-3"
			onsubmit={async (e: SubmitEvent) => {
				e.preventDefault();
				if (!newLabel) return;
				const res = await fetch("/api/v1/admin/keys", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ label: newLabel }),
				});
				if (res.ok) {
					const key = await res.json();
					newKey = key.key;
					keys = [...keys, { id: key.id, label: key.label, createdAt: key.createdAt, lastUsedAt: null }];
					newLabel = "";
				} else {
					alert("FAILED TO CREATE KEY. CHECK ADMIN KEY.");
				}
			}}
		>
			<input type="text" class="input flex-1" placeholder="KEY LABEL..." bind:value={newLabel} />
			<button type="submit" class="btn btn-accent btn-sm">GENERATE</button>
		</form>

		{#if newKey}
			<div class="mb-6 p-4" style="border: 1px solid var(--accent); background: color-mix(in srgb, var(--accent) 8%, transparent)">
				<p class="label-mono" style="color: var(--accent)">NEW API KEY — COPY NOW:</p>
				<code class="mt-1 block break-all font-mono text-sm text-white">{newKey}</code>
			</div>
		{/if}

		<table class="w-full text-left text-sm">
			<thead>
				<tr class="readout-row">
					<th class="readout-label py-2">LABEL</th>
					<th class="readout-label py-2">CREATED</th>
					<th class="readout-label py-2">LAST USED</th>
					<th class="py-2"></th>
				</tr>
			</thead>
			<tbody>
				{#each keys as k (k.id)}
					<tr class="readout-row">
						<td class="readout-value py-2 text-left">{k.label}</td>
						<td class="py-2" style="color: var(--muted)">{new Date(k.createdAt).toLocaleDateString()}</td>
						<td class="py-2" style="color: var(--muted)">{k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : "NEVER"}</td>
						<td class="py-2">
							<button
								class="btn btn-red btn-sm"
								onclick={async () => {
									if (!confirm("DELETE THIS KEY?")) return;
									const res = await fetch(`/api/v1/admin/keys/${k.id}`, { method: "DELETE" });
									if (res.ok) {
										keys = keys.filter((x) => x.id !== k.id);
									}
								}}
							>
								DELETE
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
