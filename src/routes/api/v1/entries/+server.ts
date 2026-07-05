import { json, type RequestEvent } from "@sveltejs/kit";
import { generateDynamicSchema } from "@crazygiscool/cap";
import { getRepo, type CharacterEntry } from "$lib/server/db";
import { getCustomFields } from "$lib/server/settings";

export async function GET({ url }: RequestEvent) {
	const repo = getRepo();
	const faction = url.searchParams.get("faction");
	const continuity = url.searchParams.get("continuity");
	const q = url.searchParams.get("q");

	let results: CharacterEntry[];

	if (q) {
		const match = await repo.findByName(q);
		return json(match ? [match] : []);
	}

	results = await repo.listAll();

	if (faction) {
		results = results.filter((e) => e.factions?.includes(faction));
	}
	if (continuity) {
		results = results.filter((e) => e.continuityId === continuity);
	}

	return json(results);
}

export async function POST({ request }: RequestEvent) {
	const body = await request.json();
	const customFields = getCustomFields();
	const schema = generateDynamicSchema(customFields);

	const parsed = schema.safeParse(body);
	if (!parsed.success) {
		return json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 });
	}

	const repo = getRepo();
	const entry = await repo.create(parsed.data as any);
	return json(entry, { status: 201 });
}
