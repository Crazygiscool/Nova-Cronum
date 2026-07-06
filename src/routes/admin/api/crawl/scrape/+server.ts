import { json, type RequestEvent } from "@sveltejs/kit";
import { Crawler, type CrawlSourceConfig } from "@crazygiscool/cap";
import { getCrawlSources } from "$lib/server/settings";

export async function POST({ request }: RequestEvent) {
	const { sourceId, pageTitles } = await request.json() as { sourceId: string; pageTitles: string[] };

	if (!sourceId || !pageTitles?.length) {
		return json({ error: "sourceId and pageTitles are required" }, { status: 400 });
	}

	const sources = getCrawlSources();
	const cfg = sources.find((s: CrawlSourceConfig) => s.id === sourceId);
	if (!cfg) {
		return json({ error: `Unknown source: ${sourceId}` }, { status: 404 });
	}

	const crawler = new Crawler(cfg);
	const entries: unknown[] = [];
	const errors: { title: string; error: string }[] = [];

	for (const title of pageTitles) {
		try {
			const entry = await crawler.scrape(title);
			if (entry) {
				entries.push(entry);
			} else {
				errors.push({ title, error: "Parser returned null — no title extracted" });
			}
		} catch (err: unknown) {
			errors.push({ title, error: err instanceof Error ? err.message : String(err) });
		}
	}

	return json({ entries, errors });
}
