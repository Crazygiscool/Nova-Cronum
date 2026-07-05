import { json, type RequestEvent } from "@sveltejs/kit";
import { getCrawlSources, getMergeRules } from "$lib/server/settings";

export async function GET() {
	const sources = getCrawlSources();
	const mergeRules = getMergeRules();
	return json({ sources, mergeRules });
}
