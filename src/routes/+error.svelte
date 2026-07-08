<script lang="ts">
	import { page } from "$app/stores";
</script>

<div class="flex min-h-[60vh] items-center justify-center">
	<div class="panel mx-auto max-w-2xl p-8 text-center">
		<div class="mb-6 text-6xl font-bold" style="color: var(--secondary-red)">
			{$page.status}
		</div>
		<h2 class="font-heading mb-2 text-2xl font-bold text-white">ERROR</h2>
		<p class="serial-tag mb-6">{$page.error?.message || "UNKNOWN ERROR"}</p>
		<a href="/" class="btn btn-primary">&lt; RETURN HOME</a>
	</div>
</div>
