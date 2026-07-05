import type { PageServerLoad } from "./$types";
import { getRepo, type CharacterEntry } from "$lib/server/db";
import { getDb } from "$lib/server/db";

export const load: PageServerLoad = async ({ url }) => {
	const faction = url.searchParams.get("faction");
	const continuity = url.searchParams.get("continuity");

	let entries = await getRepo().listAll() as CharacterEntry[];

	if (faction) {
		entries = entries.filter((e) => e.factions?.includes(faction));
	}
	if (continuity) {
		entries = entries.filter((e) => e.continuityId === continuity);
	}

	const [factions, continuities] = await Promise.all([
		getDb().collection("characters").distinct("factions") as Promise<string[]>,
		getDb().collection("characters").distinct("continuityId") as Promise<string[]>,
	]);

	return {
		entries,
		factions: factions.sort(),
		continuities: continuities.sort(),
	};
};
