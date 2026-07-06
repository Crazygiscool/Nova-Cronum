import { json, type RequestEvent } from "@sveltejs/kit";
import { Crawler, type CrawlSourceConfig } from "@crazygiscool/cap";
import { getCrawlSources } from "$lib/server/settings";

const CATEGORY_TIMEOUT = 8_000;

async function withTimeout<T>(
	promise: Promise<T>,
	label: string,
	ms: number,
): Promise<T> {
	let timer: ReturnType<typeof setTimeout>;
	const timeout = new Promise<never>((_, reject) => {
		timer = setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms);
	});
	return promise.finally(() => clearTimeout(timer!));
}

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

	const pagesPerCategory = maxPages ?? 200;
	const depth = maxDepth ?? 2;

	const allPages: { sourceId: string; title: string }[] = [];
	const perSource: Record<string, { category: string; count: number; error?: string }[]> = {};
	const errors: { sourceId: string; category: string; error: string }[] = [];

	for (const cfg of filtered) {
		perSource[cfg.id] = [];
		const crawler = new Crawler(cfg);
		for (const cat of cfg.categories) {
			try {
				const titles = await withTimeout(
					crawler.discoverAll(cat.path, pagesPerCategory, depth),
					`${cfg.id}/${cat.path}`,
					CATEGORY_TIMEOUT,
				);
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
