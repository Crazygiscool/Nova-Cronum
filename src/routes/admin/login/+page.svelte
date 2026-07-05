<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";

	let username = $state("");
	let password = $state("");
	let error = $state("");
	let loading = $state(false);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		loading = true;
		error = "";

		const res = await fetch("/admin/api/login", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ username, password }),
		});

		if (res.ok) {
			goto("/admin");
		} else {
			const data = await res.json();
			error = data.error || "Login failed";
		}
		loading = false;
	}
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="panel w-full max-w-sm p-8">
		<div class="mb-6 text-center">
			<h1 class="font-heading text-xl font-bold tracking-wider text-primary">ADMIN ACCESS</h1>
			<p class="serial-tag mt-2">CENTRAL ARCHIVE PROTOCOL</p>
		</div>

		<form class="space-y-5" onsubmit={handleSubmit}>
			{#if error}
				<div class="p-3 text-sm" style="border: 1px solid var(--secondary-red); color: var(--secondary); background: color-mix(in srgb, var(--secondary-red) 10%, transparent)">
					{error}
				</div>
			{/if}

			<div class="flex flex-col gap-1.5">
				<label for="username" class="label-mono">USERNAME</label>
				<input id="username" type="text" class="input" required bind:value={username} />
			</div>

			<div class="flex flex-col gap-1.5">
				<label for="password" class="label-mono">PASSWORD</label>
				<input id="password" type="password" class="input" required bind:value={password} />
			</div>

			<button type="submit" class="btn btn-primary w-full" disabled={loading}>
				{loading ? "AUTHENTICATING..." : "LOGIN"}
			</button>
		</form>
	</div>
</div>
