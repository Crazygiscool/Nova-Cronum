import { json, type RequestEvent } from "@sveltejs/kit";
import { validateSession, changePassword } from "$lib/server/admin-auth";

export async function POST({ request, cookies }: RequestEvent) {
	const sessionId = cookies.get("admin_session");
	if (!sessionId || !(await validateSession(sessionId))) {
		return json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	const { oldPassword, newPassword } = body;

	if (!oldPassword || !newPassword) {
		return json({ error: "Old and new password are required" }, { status: 400 });
	}

	if (newPassword.length < 8) {
		return json({ error: "New password must be at least 8 characters" }, { status: 400 });
	}

	const ok = await changePassword(oldPassword, newPassword);
	if (!ok) {
		return json({ error: "Old password is incorrect" }, { status: 401 });
	}

	return json({ ok: true });
}
