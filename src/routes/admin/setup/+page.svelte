<script lang="ts">
	import { goto } from "$app/navigation";

	let username = $state("");
	let password = $state("");
	let confirmPassword = $state("");
	let adminKey = $state("");
	let error = $state("");
	let loading = $state(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		error = "";

		if (password !== confirmPassword) {
			error = "Passwords do not match";
			loading = false;
			return;
		}

		if (password.length < 8) {
			error = "Password must be at least 8 characters";
			loading = false;
			return;
		}

		const res = await fetch("/admin/api/setup", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ username, password, adminKey }),
		});

		if (res.ok) {
			const loginRes = await fetch("/admin/api/login", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ username, password }),
			});
			if (loginRes.ok) {
				goto("/admin");
			} else {
				goto("/admin/login");
			}
		} else {
			const data = await res.json();
			error = data.error || "Setup failed";
		}
		loading = false;
	}
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="panel w-full max-w-sm p-8">
		<div class="mb-6 text-center">
			<h1 class="font-heading text-xl font-bold tracking-wider text-primary">INITIAL SETUP</h1>
			<p class="serial-tag mt-2">CONFIGURE ADMIN ACCESS</p>
		</div>

		{#if error}
			<div class="mb-6 p-3 text-sm" style="border: 1px solid var(--secondary-red); color: var(--secondary); background: color-mix(in srgb, var(--secondary-red) 10%, transparent)">
				{error}
			</div>
		{/if}

		<form class="space-y-5" onsubmit={handleSubmit}>
			<div class="flex flex-col gap-1.5">
				<label for="adminkey" class="label-mono">ADMIN KEY</label>
				<input id="adminkey" type="password" class="input" placeholder="ENTER THE ADMIN_KEY FROM ENV" required bind:value={adminKey} />
				<p class="serial-tag">ONE-TIME SETUP KEY FROM YOUR .ENV FILE</p>
			</div>

			<hr style="border-color: color-mix(in srgb, var(--outline) 20%, transparent)" />

			<div class="flex flex-col gap-1.5">
				<label for="username" class="label-mono">USERNAME</label>
				<input id="username" type="text" class="input" required bind:value={username} />
			</div>

			<div class="flex flex-col gap-1.5">
				<label for="password" class="label-mono">PASSWORD</label>
				<input id="password" type="password" class="input" required bind:value={password} />
			</div>

			<div class="flex flex-col gap-1.5">
				<label for="confirm" class="label-mono">CONFIRM PASSWORD</label>
				<input id="confirm" type="password" class="input" required bind:value={confirmPassword} />
			</div>

			<button type="submit" class="btn btn-primary w-full" disabled={loading}>
				{loading ? "CONFIGURING..." : "SET UP ADMIN"}
			</button>
		</form>
	</div>
</div>
