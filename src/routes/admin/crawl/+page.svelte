<script lang="ts">
	interface SourceConfig {
		id: string;
		label: string;
		baseUrl: string;
		categories: { id: string; label: string; path: string }[];
	}

	interface DiscoverResult {
		sourceId: string;
		title: string;
	}

	interface PerCategoryResult {
		category: string;
		count: number;
		error?: string;
	}

	const CHUNK_SIZE = 5;

	let sources = $state<SourceConfig[]>([]);
	let selectedSourceIds = $state<Set<string>>(new Set());

	let crawling = $state(false);
	let discoveredCount = $state(0);
	let totalCount = $state(0);
	let scraperrorsCount = $state(0);
	let sentCount = $state(0);
	let newCount = $state(0);
	let mergedCount = $state(0);
	let skippedCount = $state(0);
	let importErrors = $state(0);
	let errorLog = $state<{ title: string; source: string; error: string }[]>([]);
	let done = $state(false);
	let stage = $state<"idle" | "discovering" | "scraping" | "done">("idle");

	let perSourceDiscover = $state<Record<string, PerCategoryResult[]>>({});

	let pages: DiscoverResult[] = [];

	$effect(() => {
		fetch("/admin/api/crawl/sources")
			.then((r) => r.json())
			.then((data) => {
				sources = data.sources;
				selectedSourceIds = new Set(data.sources.map((s: SourceConfig) => s.id));
			});
	});

	async function handleCrawlAll() {
		if (crawling) return;
		crawling = true;
		done = false;
		discoveredCount = 0;
		totalCount = 0;
		scraperrorsCount = 0;
		sentCount = 0;
		newCount = 0;
		mergedCount = 0;
		skippedCount = 0;
		importErrors = 0;
		errorLog = [];
		pages = [];

		// Discover
		stage = "discovering";
		const discRes = await fetch("/admin/api/crawl/bulk/discover", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ sourceIds: [...selectedSourceIds] }),
		});
		const discData = await discRes.json();
		if (!discRes.ok) {
			errorLog = [{ title: "DISCOVERY", source: "", error: discData.error || "Unknown error" }];
			crawling = false;
			stage = "done";
			done = true;
			return;
		}

		pages = discData.pages;
		discoveredCount = pages.length;
		totalCount = pages.length;
		perSourceDiscover = discData.perSource ?? {};
		for (const e of discData.errors ?? []) {
			errorLog = [...errorLog, { title: `[${e.sourceId}] ${e.category}`, source: e.sourceId, error: e.error }];
		}

		if (pages.length === 0) {
			crawling = false;
			stage = "done";
			done = true;
			return;
		}

		// Scrape + Import in chunks
		stage = "scraping";
		let processed = 0;
		for (let i = 0; i < pages.length; i += CHUNK_SIZE) {
			const chunk = pages.slice(i, i + CHUNK_SIZE);
			const grouped = new Map<string, string[]>();
			for (const p of chunk) {
				if (!grouped.has(p.sourceId)) grouped.set(p.sourceId, []);
				grouped.get(p.sourceId)!.push(p.title);
			}

			const allEntries: any[] = [];
			for (const [sourceId, titles] of grouped) {
				try {
					const scrapeRes = await fetch("/admin/api/crawl/scrape", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({ sourceId, pageTitles: titles }),
					});
					const scrapeData = await scrapeRes.json();
					if (scrapeData.entries) allEntries.push(...scrapeData.entries);
					if (scrapeData.errors) {
						for (const e of scrapeData.errors) {
							errorLog = [...errorLog, { title: e.title, source: sourceId, error: e.error }];
						}
						scraperrorsCount += scrapeData.errors.length;
					}
				} catch (err: unknown) {
					for (const t of titles) {
						errorLog = [...errorLog, { title: t, source: sourceId, error: "Fetch failed" }];
					}
					scraperrorsCount += titles.length;
				}
			}

			if (allEntries.length > 0) {
				try {
					const importRes = await fetch("/admin/api/crawl/import", {
						method: "POST",
						headers: { "content-type": "application/json" },
						body: JSON.stringify({ entries: allEntries }),
					});
					const importData = await importRes.json();
					if (importData.results) {
						for (const r of importData.results) {
							if (r.action === "new") newCount++;
							else if (r.action === "merged") mergedCount++;
							else if (r.action === "skipped") skippedCount++;
							else if (r.action === "error") {
								errorLog = [...errorLog, { title: r.name, source: "", error: r.error || "Import failed" }];
								importErrors++;
							}
						}
					}
				} catch (err: unknown) {
					for (const e of allEntries) {
						errorLog = [...errorLog, { title: e.name, source: "", error: "Import request failed" }];
					}
					importErrors += allEntries.length;
				}
			}

			processed += chunk.length;
			sentCount = processed;

			// Yield to let the UI paint
			await new Promise((r) => setTimeout(r, 0));
		}

		crawling = false;
		stage = "done";
		done = true;
	}
</script>

<div class="mx-auto" style="max-width: 900px">
	<div class="mb-8">
		<h2 class="font-heading text-3xl font-bold tracking-tight text-white">WIKI CRAWLER</h2>
		<p class="serial-tag mt-2">BULK IMPORT FROM EXTERNAL DATABASES</p>
	</div>

	<!-- Source Selection -->
	<div class="panel mb-6 p-6">
		<h3 class="font-heading mb-4 text-lg font-semibold text-white">SOURCES</h3>
		<div class="flex flex-wrap gap-3">
			{#each sources as s}
				<label
					class="flex cursor-pointer items-center gap-3 rounded px-4 py-3 transition-colors hover:bg-white/5"
					style="border: 1px solid {selectedSourceIds.has(s.id) ? 'var(--primary)' : 'color-mix(in srgb, var(--outline) 30%, transparent)'}"
				>
					<input
						type="checkbox"
						checked={selectedSourceIds.has(s.id)}
						disabled={crawling}
						onchange={() => {
							const next = new Set(selectedSourceIds);
							if (next.has(s.id)) next.delete(s.id);
							else next.add(s.id);
							selectedSourceIds = next;
						}}
					/>
					<div>
						<p class="font-medium text-white">{s.label}</p>
						<p class="serial-tag">{s.categories.length} CATEGORIES</p>
					</div>
				</label>
			{/each}
		</div>

		<div class="mt-4">
			<button
				class="btn btn-accent"
				disabled={crawling || selectedSourceIds.size === 0}
				onclick={handleCrawlAll}
			>
				{crawling ? "CRAWLING..." : "CRAWL ALL"}
			</button>
		</div>
	</div>

	<!-- Progress -->
	{#if stage !== "idle"}
		<div class="panel mb-6 p-6">
			<h3 class="font-heading mb-4 text-lg font-semibold text-white">PROGRESS</h3>

			<div class="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
				<div class="rounded p-3" style="background: color-mix(in srgb, var(--surface) 50%, transparent)">
					<p class="label-mono">DISCOVERED</p>
					<p class="mt-1 font-heading text-2xl font-bold" style="color: var(--muted)">{discoveredCount}</p>
				</div>
				<div class="rounded p-3" style="background: color-mix(in srgb, var(--surface) 50%, transparent)">
					<p class="label-mono">PAGES SENT</p>
					<p class="mt-1 font-heading text-2xl font-bold text-white">{sentCount}<span class="text-sm" style="color: var(--muted)">/{totalCount}</span></p>
				</div>
				<div class="rounded p-3" style="background: color-mix(in srgb, var(--surface) 50%, transparent)">
					<p class="label-mono">NEW</p>
					<p class="mt-1 font-heading text-2xl font-bold" style="color: var(--accent)">{newCount}</p>
				</div>
				<div class="rounded p-3" style="background: color-mix(in srgb, var(--surface) 50%, transparent)">
					<p class="label-mono">MERGED</p>
					<p class="mt-1 font-heading text-2xl font-bold" style="color: var(--primary)">{mergedCount}</p>
				</div>
			</div>

			{#if stage === "discovering"}
				<p class="serial-tag">DISCOVERING PAGES FROM SELECTED SOURCES...</p>
			{:else if stage === "scraping"}
				<div class="mb-2 h-2 w-full overflow-hidden rounded-full" style="background: color-mix(in srgb, var(--outline) 20%, transparent)">
					<div
						class="h-full rounded-full transition-all"
						style="width: {totalCount > 0 ? (sentCount / totalCount) * 100 : 0}%; background: var(--accent)"
					></div>
				</div>
				<p class="serial-tag">SCRAPING & IMPORTING: {sentCount} / {totalCount}</p>
			{/if}

			{#if stage === "scraping" || stage === "done"}
				<div class="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
					{#each Object.entries(perSourceDiscover) as [sourceId, cats]}
						{@const sourceLabel = sources.find((s) => s.id === sourceId)?.label ?? sourceId}
						{#each cats as c}
							<div class="rounded px-2 py-1" class:opacity-50={c.count === 0 && !c.error} style="background: color-mix(in srgb, var(--surface) 30%, transparent)">
								<span class="font-bold text-white">{sourceLabel}</span>
								<span class="serial-tag ms-1">{c.category.replace("Category:", "")}</span>
								<br>
								<span style="color: var(--muted)">
									{#if c.error}
										<span style="color: var(--secondary)">ERR: {c.error}</span>
									{:else}
										{c.count} pages
									{/if}
								</span>
							</div>
						{/each}
					{/each}
				</div>
			{/if}

			{#if scraperrorsCount > 0}
				<div class="mt-3" style="color: var(--secondary)">
					<p class="serial-tag">SCRAPE ERRORS: {scraperrorsCount}</p>
				</div>
			{/if}

			{#if skippedCount > 0}
				<div class="mt-3" style="color: var(--muted)">
					<p class="serial-tag">SKIPPED: {skippedCount} (already imported)</p>
				</div>
			{/if}

			{#if importErrors > 0}
				<div class="mt-3" style="color: var(--secondary)">
					<p class="serial-tag">IMPORT ERRORS: {importErrors}</p>
				</div>
			{/if}

			{#if errorLog.length > 0}
				<details class="mt-4">
					<summary class="cursor-pointer text-sm" style="color: var(--secondary)">ERROR LOG ({errorLog.length})</summary>
					<div class="mt-2 max-h-48 overflow-y-auto space-y-1">
						{#each errorLog as e}
							<div class="rounded px-3 py-1.5 text-xs" style="background: color-mix(in srgb, var(--secondary-red) 10%, transparent); color: var(--secondary)">
								<span class="font-bold">[{e.source}]</span> {e.title}: {e.error}
							</div>
						{/each}
					</div>
				</details>
			{/if}
		</div>
	{/if}

	<!-- Done -->
	{#if done && !crawling}
		<div class="panel p-6 text-center">
			<p class="font-heading text-xl font-bold" style="color: var(--accent)">CRAWL COMPLETE</p>
			<p class="serial-tag mt-2">{newCount} NEW, {mergedCount} MERGED, {skippedCount} SKIPPED, {errorLog.length} LOGGED</p>
		</div>
	{/if}
</div>
