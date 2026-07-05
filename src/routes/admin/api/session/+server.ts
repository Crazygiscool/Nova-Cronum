import { json, type RequestEvent } from "@sveltejs/kit";
import { validateSession, isAdminConfigured } from "$lib/server/admin-auth";

export async function GET({ cookies }: RequestEvent) {
	const configured = await isAdminConfigured();
	if (!configured) {
		return json({ authed: false, reason: "not-configured" });
	}

	const sessionId = cookies.get("admin_session");
	if (!sessionId) {
		return json({ authed: false, reason: "no-session" });
	}

	const valid = await validateSession(sessionId);
	return json({ authed: valid, reason: valid ? null : "expired" });
}
