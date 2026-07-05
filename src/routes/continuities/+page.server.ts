import type { PageServerLoad } from "./$types";
import { getDb } from "$lib/server/db";
import { getRepo, type CharacterEntry } from "$lib/server/db";

export const load: PageServerLoad = async () => {
	const db = getDb();
	const entries = await getRepo().listAll() as CharacterEntry[];
	const continuities = await db.collection("characters").distinct("continuityId") as string[];

	const continuityMap: Record<string, CharacterEntry[]> = {};
	for (const c of continuities.sort()) {
		continuityMap[c] = entries.filter((e) => e.continuityId === c);
	}

	return { continuities: continuityMap };
};
