import type { PageServerLoad } from "./$types";
import { getRepo, type CharacterEntry } from "$lib/server/db";
import { getDb } from "$lib/server/db";

export const load: PageServerLoad = async () => {
	const [entries, factions] = await Promise.all([
		getRepo().listAll() as Promise<CharacterEntry[]>,
		getDb().collection("characters").distinct("factions") as Promise<string[]>,
	]);

	return {
		entries,
		factions: factions.sort(),
	};
};
