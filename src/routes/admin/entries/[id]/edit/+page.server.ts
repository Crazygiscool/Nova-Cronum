import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getRepo, type CharacterEntry } from "$lib/server/db";
import { getCustomFields } from "$lib/server/settings";
import { validateSession, isAdminConfigured } from "$lib/server/admin-auth";

export const load: PageServerLoad = async ({ params, cookies }) => {
	const configured = await isAdminConfigured();
	if (!configured) redirect(307, "/admin/setup");

	const sessionId = cookies.get("admin_session");
	if (!sessionId || !(await validateSession(sessionId))) redirect(307, "/admin/login");

	const entry = await getRepo().findById(params.id) as CharacterEntry | null;
	if (!entry) {
		throw new Error("Not found");
	}
	return {
		entry,
		customFields: getCustomFields(),
	};
};
