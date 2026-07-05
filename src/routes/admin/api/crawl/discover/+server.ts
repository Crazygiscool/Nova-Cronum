import { json, type RequestEvent } from "@sveltejs/kit";
import { MediaWikiClient, type CrawlSourceConfig } from "@crazygiscool/cap";
import { getCrawlSources } from "$lib/server/settings";

export async function POST({ request }: RequestEvent) {
	const { sourceId, categoryPath } = await request.json() as { sourceId: string; categoryPath: string };

	if (!sourceId || !categoryPath) {
		return json({ error: "sourceId and categoryPath are required" }, { status: 400 });
	}

	const sources = getCrawlSources();
	const cfg = sources.find((s: CrawlSourceConfig) => s.id === sourceId);
	if (!cfg) {
		return json({ error: `Unknown source: ${sourceId}` }, { status: 404 });
	}

	const client = new MediaWikiClient(cfg);
	try {
		const titles = await client.listCategoryMembers(categoryPath);
		return json({ titles });
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : String(err);
		return json({ error: msg }, { status: 502 });
	}
}
