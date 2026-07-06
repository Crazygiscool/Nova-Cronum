import { json, type RequestEvent } from "@sveltejs/kit";
import { Crawler, type CrawlSourceConfig } from "@crazygiscool/cap";
import { getCrawlSources } from "$lib/server/settings";

export async function POST({ request }: RequestEvent) {
	const { sourceIds, maxPages, maxDepth } = await request.json() as {
		sourceIds?: string[];
		maxPages?: number;
		maxDepth?: number;
	};

	const sources = getCrawlSources();
	const filtered = sourceIds?.length
		? sources.filter((s: CrawlSourceConfig) => sourceIds.includes(s.id))
		: sources;

	const pagesPerCategory = maxPages ?? 500;
	const depth = maxDepth ?? 3;

	const allPages: { sourceId: string; title: string }[] = [];
	const perSource: Record<string, { category: string; count: number; error?: string }[]> = {};
	const errors: { sourceId: string; category: string; error: string }[] = [];

	for (const cfg of filtered) {
		perSource[cfg.id] = [];
		const crawler = new Crawler(cfg);
		for (const cat of cfg.categories) {
			try {
				const titles = await crawler.discoverAll(cat.path, pagesPerCategory, depth);
				perSource[cfg.id].push({ category: cat.path, count: titles.length });
				for (const title of titles) {
					allPages.push({ sourceId: cfg.id, title });
				}
			} catch (err: unknown) {
				const msg = err instanceof Error ? err.message : String(err);
				perSource[cfg.id].push({ category: cat.path, count: 0, error: msg });
				errors.push({
					sourceId: cfg.id,
					category: cat.path,
					error: msg,
				});
			}
		}
	}

	return json({ pages: allPages, perSource, errors });
}
