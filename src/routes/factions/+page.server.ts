import type { PageServerLoad } from "./$types";
import { getDb } from "$lib/server/db";
import { getRepo, type CharacterEntry } from "$lib/server/db";

export const load: PageServerLoad = async () => {
	const db = getDb();
	const entries = await getRepo().listAll() as CharacterEntry[];
	const factions = await db.collection("characters").distinct("factions") as string[];

	const factionMap: Record<string, CharacterEntry[]> = {};
	for (const faction of factions.sort()) {
		factionMap[faction] = entries.filter((e) => e.factions?.includes(faction));
	}

	return { factions: factionMap };
};
