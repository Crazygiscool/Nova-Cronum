import type { LayoutServerLoad } from "./$types";
import { getTheme } from "$lib/server/settings";

export const load: LayoutServerLoad = async () => {
	const theme = getTheme();
	return {
		theme,
		enabledPages: theme.pages.filter((p) => p.enabled),
	};
};
