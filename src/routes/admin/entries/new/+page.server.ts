import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getCustomFields } from "$lib/server/settings";
import { validateSession, isAdminConfigured } from "$lib/server/admin-auth";

export const load: PageServerLoad = async ({ cookies }) => {
	const configured = await isAdminConfigured();
	if (!configured) redirect(307, "/admin/setup");

	const sessionId = cookies.get("admin_session");
	if (!sessionId || !(await validateSession(sessionId))) redirect(307, "/admin/login");

	return {
		customFields: getCustomFields(),
	};
};
