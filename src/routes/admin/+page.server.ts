import type { PageServerLoad } from "./$types";
import { listApiKeys } from "$lib/server/auth";
import { getRepo, type CharacterEntry } from "$lib/server/db";

export const load: PageServerLoad = async () => {
	const [entries, keys] = await Promise.all([
		getRepo().listAll() as Promise<CharacterEntry[]>,
		listApiKeys(),
	]);

	return {
		entryCount: entries.length,
		keys: keys.map((k) => ({
			id: k.id,
			label: k.label,
			createdAt: k.createdAt,
			lastUsedAt: k.lastUsedAt,
		})),
	};
};
