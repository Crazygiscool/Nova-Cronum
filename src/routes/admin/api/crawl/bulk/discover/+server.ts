import { json, type RequestEvent } from "@sveltejs/kit";
import { MediaWikiClient, type CrawlSourceConfig } from "@crazygiscool/cap";
import { getCrawlSources } from "$lib/server/settings";

export async function POST({ request }: RequestEvent) {
	const { sourceIds } = await request.json() as { sourceIds?: string[] };

	const sources = getCrawlSources();
	const filtered = sourceIds?.length
		? sources.filter((s: CrawlSourceConfig) => sourceIds.includes(s.id))
		: sources;

	const allPages: { sourceId: string; title: string }[] = [];
	const errors: { sourceId: string; category: string; error: string }[] = [];

	for (const cfg of filtered) {
		const client = new MediaWikiClient(cfg);
		for (const cat of cfg.categories) {
			try {
				const titles = await client.listCategoryMembers(cat.path, 50);
				for (const title of titles) {
					allPages.push({ sourceId: cfg.id, title });
				}
			} catch (err: unknown) {
				errors.push({
					sourceId: cfg.id,
					category: cat.path,
					error: err instanceof Error ? err.message : String(err),
				});
			}
		}
	}

	return json({ pages: allPages, errors });
}
