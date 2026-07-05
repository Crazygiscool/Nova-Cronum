import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { validateSession, isAdminConfigured } from "$lib/server/admin-auth";
import { listApiKeys } from "$lib/server/auth";

export const load: PageServerLoad = async ({ cookies }) => {
	const configured = await isAdminConfigured();
	if (!configured) {
		redirect(307, "/admin/setup");
	}

	const sessionId = cookies.get("admin_session");
	if (!sessionId || !(await validateSession(sessionId))) {
		redirect(307, "/admin/login");
	}

	const keys = await listApiKeys();
	const entryCount = 0; // TODO: count from repo

	return {
		entryCount,
		keys: keys.map((k) => ({
			id: k.id,
			label: k.label,
			createdAt: k.createdAt,
			lastUsedAt: k.lastUsedAt,
		})),
	};
};
