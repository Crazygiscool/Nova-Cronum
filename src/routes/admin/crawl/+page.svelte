<script lang="ts">
	interface SourceConfig {
		id: string;
		label: string;
		baseUrl: string;
		categories: { id: string; label: string; path: string }[];
	}

	interface CrawledEntry {
		name: string;
		description: string;
		continuityId: string;
		factions: string[];
		customFields: Record<string, unknown>;
		source: { url: string; wiki: string };
	}

	interface MergeRuleConfig {
		sourcesMerge: boolean;
		longerDescription: boolean;
		factionsUnion: boolean;
		fillEmptyFields: boolean;
		existingWins: boolean;
		crawledWins: boolean;
		continuityExisting: boolean;
		skipIfSourceExists: boolean;
	}

	let sources = $state<SourceConfig[]>([]);
	let mergeRules = $state<Record<string, boolean>>({});

	let selectedSource = $state("");
	let selectedCategory = $state("");

	let discoveredTitles = $state<string[]>([]);
	let discoveredLoading = $state(false);
	let discoverError = $state("");

	let scrapeResults = $state<CrawledEntry[]>([]);
	let scrapeErrors = $state<{ title: string; error: string }[]>([]);
	let scrapeLoading = $state(false);

	let importResults = $state<{ name: string; action: string; changes?: string[]; error?: string }[]>([]);
	let importLoading = $state(false);

	let activeTab: "discover" | "scrape" | "import" = "discover";

	// Editable fields per crawled entry
	let editable = $state<Map<string, { description: string; continuityId: string; factions: string }>>(new Map());
	let selectedForImport = $state<Set<string>>(new Set());

	$effect(() => {
		fetch("/admin/api/crawl/sources")
			.then((r) => r.json())
			.then((data) => {
				sources = data.sources;
				mergeRules = data.mergeRules;
			});
	});

	function getCategories(): { id: string; label: string; path: string }[] {
		const s = sources.find((s) => s.id === selectedSource);
		return s?.categories ?? [];
	}

	async function handleDiscover() {
		if (!selectedSource || !selectedCategory) return;
		discoveredLoading = true;
		discoverError = "";
		discoveredTitles = [];

		const res = await fetch("/admin/api/crawl/discover", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ sourceId: selectedSource, categoryPath: selectedCategory }),
		});
		const data = await res.json();
		if (res.ok) {
			discoveredTitles = data.titles;
			activeTab = "discover";
		} else {
			discoverError = data.error || "Discovery failed";
		}
		discoveredLoading = false;
	}

	async function handleScrapeAll() {
		if (!discoveredTitles.length) return;
		scrapeLoading = true;
		scrapeResults = [];
		scrapeErrors = [];

		const res = await fetch("/admin/api/crawl/scrape", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ sourceId: selectedSource, pageTitles: discoveredTitles }),
		});
		const data = await res.json();
		if (res.ok) {
			scrapeResults = data.entries;
			scrapeErrors = data.errors;
			for (const entry of data.entries) {
				editable.set(entry.name, {
					description: entry.description,
					continuityId: entry.continuityId,
					factions: entry.factions.join(", "),
				});
			}
			activeTab = "scrape";
		} else {
			scrapeErrors = [{ title: "batch", error: data.error || "Scrape failed" }];
		}
		scrapeLoading = false;
	}

	function toggleSelectAll() {
		if (selectedForImport.size === scrapeResults.length) {
			selectedForImport = new Set();
		} else {
			selectedForImport = new Set(scrapeResults.map((e) => e.name));
		}
	}

	function toggleEntry(name: string) {
		const next = new Set(selectedForImport);
		if (next.has(name)) next.delete(name);
		else next.add(name);
		selectedForImport = next;
	}

	async function handleImport() {
		const toImport = scrapeResults.filter((e) => selectedForImport.has(e.name));
		if (!toImport.length) return;

		importLoading = true;
		const res = await fetch("/admin/api/crawl/import", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ entries: toImport }),
		});
		const data = await res.json();
		importResults = data.results ?? [];
		activeTab = "import";
		importLoading = false;
	}
</script>

<div class="mx-auto" style="max-width: 1000px">
	<div class="mb-8">
		<h2 class="font-heading text-3xl font-bold tracking-tight text-white">WIKI CRAWLER</h2>
		<p class="serial-tag mt-2">SCRAPE &amp; IMPORT FROM EXTERNAL DATABASES</p>
	</div>

	<!-- Source & Category Selection -->
	<div class="panel mb-6 p-6">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<div class="flex flex-col gap-1.5">
				<label for="source" class="label-mono">SOURCE</label>
				<select id="source" class="input" bind:value={selectedSource}>
					<option value="">-- SELECT SOURCE --</option>
					{#each sources as s}
						<option value={s.id}>{s.label}</option>
					{/each}
				</select>
			</div>

			<div class="flex flex-col gap-1.5">
				<label for="category" class="label-mono">CATEGORY</label>
				<select id="category" class="input" bind:value={selectedCategory}>
					<option value="">-- SELECT CATEGORY --</option>
					{#each getCategories() as c}
						<option value={c.path}>{c.label}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="mt-4 flex gap-3">
			<button class="btn btn-primary" disabled={!selectedSource || !selectedCategory || discoveredLoading} onclick={handleDiscover}>
				{discoveredLoading ? "DISCOVERING..." : "DISCOVER PAGES"}
			</button>

			{#if discoveredTitles.length > 0}
				<button class="btn btn-accent" disabled={scrapeLoading} onclick={handleScrapeAll}>
					{scrapeLoading ? "SCRAPING..." : "SCRAPE ALL ({discoveredTitles.length})"}
				</button>
			{/if}
		</div>

		{#if discoverError}
			<p class="mt-3 text-sm" style="color: var(--secondary)">{discoverError}</p>
		{/if}
	</div>

	<!-- Discovered Pages -->
	{#if discoveredTitles.length > 0}
		<div class="panel mb-6 p-6">
			<h3 class="font-heading mb-3 text-lg font-semibold text-white">DISCOVERED PAGES</h3>
			<p class="serial-tag mb-3">{discoveredTitles.length} PAGES FOUND</p>
			<div class="max-h-48 overflow-y-auto">
				{#each discoveredTitles as title}
					<div class="readout-row px-2 py-1 text-sm" style="color: var(--text)">{title}</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Scrape Results -->
	{#if scrapeResults.length > 0 || scrapeErrors.length > 0}
		<div class="panel mb-6 p-6">
			<h3 class="font-heading mb-3 text-lg font-semibold text-white">SCRAPED ENTRIES</h3>
			<p class="serial-tag mb-3">{scrapeResults.length} SUCCESSFUL, {scrapeErrors.length} FAILED</p>

			{#if scrapeErrors.length > 0}
				<div class="mb-4 p-3 text-sm" style="border: 1px solid var(--secondary-red); color: var(--secondary); background: color-mix(in srgb, var(--secondary-red) 10%, transparent)">
					{#each scrapeErrors as e}
						<p>{e.title}: {e.error}</p>
					{/each}
				</div>
			{/if}

			<div class="mb-3 flex items-center gap-3">
				<label class="flex items-center gap-2 text-sm" style="color: var(--text)">
					<input type="checkbox" checked={selectedForImport.size === scrapeResults.length} onchange={toggleSelectAll} />
					SELECT ALL
				</label>
				<button class="btn btn-accent btn-sm" disabled={selectedForImport.size === 0 || importLoading} onclick={handleImport}>
					{importLoading ? "IMPORTING..." : "IMPORT SELECTED ({selectedForImport.size})"}
				</button>
			</div>

			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead>
						<tr class="readout-row">
							<th class="readout-label px-2 py-2 w-8"></th>
							<th class="readout-label px-2 py-2">NAME</th>
							<th class="readout-label px-2 py-2">FACTIONS</th>
							<th class="readout-label px-2 py-2">CONTINUITY</th>
							<th class="readout-label px-2 py-2">SOURCE</th>
						</tr>
					</thead>
					<tbody>
						{#each scrapeResults as entry}
							<tr class="readout-row">
								<td class="px-2 py-2">
									<input type="checkbox" checked={selectedForImport.has(entry.name)} onchange={() => toggleEntry(entry.name)} />
								</td>
								<td class="readout-value px-2 py-2">{entry.name}</td>
								<td class="px-2 py-2" style="color: var(--muted)">{entry.factions.join(", ") || "--"}</td>
								<td class="px-2 py-2" style="color: var(--muted)">{entry.continuityId || "--"}</td>
								<td class="px-2 py-2" style="color: var(--muted)">
									<a href={entry.source.url} target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">
										{entry.source.wiki}
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}

	<!-- Import Results -->
	{#if importResults.length > 0}
		<div class="panel p-6">
			<h3 class="font-heading mb-3 text-lg font-semibold text-white">IMPORT RESULTS</h3>
			<div class="overflow-x-auto">
				<table class="w-full text-left text-sm">
					<thead>
						<tr class="readout-row">
							<th class="readout-label px-2 py-2">NAME</th>
							<th class="readout-label px-2 py-2">ACTION</th>
							<th class="readout-label px-2 py-2">DETAILS</th>
						</tr>
					</thead>
					<tbody>
						{#each importResults as r}
							<tr class="readout-row">
								<td class="readout-value px-2 py-2">{r.name}</td>
								<td class="px-2 py-2">
									{#if r.action === "new"}
										<span style="color: var(--accent)">NEW</span>
									{:else if r.action === "merged"}
										<span style="color: var(--primary)">MERGED</span>
									{:else if r.action === "error"}
										<span style="color: var(--secondary)">ERROR</span>
									{:else}
										<span style="color: var(--muted)">SKIPPED</span>
									{/if}
								</td>
								<td class="px-2 py-2" style="color: var(--muted)">
									{r.error || r.changes?.join(", ") || "--"}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
