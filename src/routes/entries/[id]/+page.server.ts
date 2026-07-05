import type { PageServerLoad } from "./$types";
import { getRepo, type CharacterEntry } from "$lib/server/db";
import { getCustomFields } from "$lib/server/settings";

export const load: PageServerLoad = async ({ params }) => {
	const entry = await getRepo().findById(params.id) as CharacterEntry | null;
	if (!entry) {
		throw new Error("Not found");
	}
	return {
		entry,
		customFields: getCustomFields(),
	};
};
