import { json, type RequestEvent } from "@sveltejs/kit";
import { deleteSession } from "$lib/server/admin-auth";

export async function POST({ cookies }: RequestEvent) {
	const sessionId = cookies.get("admin_session");
	if (sessionId) {
		await deleteSession(sessionId);
	}
	cookies.delete("admin_session", { path: "/" });
	return json({ ok: true });
}
