import type { PageServerLoad } from "./$types";
import { getCustomFields } from "$lib/server/settings";

export const load: PageServerLoad = async () => {
	return {
		customFields: getCustomFields(),
	};
};
