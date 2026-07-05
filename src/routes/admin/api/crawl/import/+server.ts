import { json, type RequestEvent } from "@sveltejs/kit";
import { mergeEntry, defaultMergeRules } from "@crazygiscool/cap";
import type { CrawledEntry, MergeableDocument, CrawlSourceRecord } from "@crazygiscool/cap";
import { getRepo } from "$lib/server/db";
import { getMergeRules } from "$lib/server/settings";

export async function POST({ request }: RequestEvent) {
	const { entries } = await request.json() as { entries: CrawledEntry[] };

	if (!entries?.length) {
		return json({ error: "entries are required" }, { status: 400 });
	}

	const repo = getRepo();
	const rules = { ...defaultMergeRules(), ...getMergeRules() };
	const results: { name: string; action: string; changes?: string[]; error?: string }[] = [];

	for (const crawled of entries) {
		try {
			const existing = await repo.findByName(crawled.name) as MergeableDocument | null;
			const result = mergeEntry(existing, crawled, rules);

			if (result.action === "skipped") {
				results.push({ name: crawled.name, action: "skipped", changes: result.changes });
				continue;
			}

			if (result.action === "new") {
				await repo.create(result.doc as any);
				results.push({ name: crawled.name, action: "new", changes: result.changes });
			} else {
				const src = crawled.source as CrawlSourceRecord;
				const srcDoc = { url: src.url, wiki: src.wiki, fetchedAt: src.fetchedAt };
				const updated = await repo.update(existing!.id!, {
					...result.doc,
					sources: (result.doc as any).sources as CrawlSourceRecord[],
				} as any);
				if (updated) {
					results.push({ name: crawled.name, action: "merged", changes: result.changes });
				} else {
					results.push({ name: crawled.name, action: "error", error: "update failed" });
				}
			}
		} catch (err: unknown) {
			results.push({
				name: crawled.name,
				action: "error",
				error: err instanceof Error ? err.message : String(err),
			});
		}
	}

	return json({ results });
}
