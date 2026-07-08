import { json, type RequestEvent } from "@sveltejs/kit";
import { verifyAdminLogin } from "$lib/server/admin-auth";
import { NODE_ENV } from "$env/static/private";

export async function POST({ request, cookies }: RequestEvent) {
	const body = await request.json();
	const { username, password } = body;

	if (!username || !password) {
		return json({ error: "Username and password are required" }, { status: 400 });
	}

	const sessionId = await verifyAdminLogin(username, password);

	if (!sessionId) {
		return json({ error: "Invalid credentials" }, { status: 401 });
	}

	cookies.set("admin_session", sessionId, {
		path: "/",
		httpOnly: true,
		sameSite: "strict",
		secure: NODE_ENV === "production",
		maxAge: 60 * 60 * 24,
	});

	return json({ ok: true });
}
