import { json, type RequestEvent } from "@sveltejs/kit";
import { createAdminUser } from "$lib/server/admin-auth";

export async function POST({ request }: RequestEvent) {
	const body = await request.json();
	const { username, password, adminKey } = body;

	if (!username || !password || !adminKey) {
		return json({ error: "Username, password, and admin key are required" }, { status: 400 });
	}

	if (password.length < 8) {
		return json({ error: "Password must be at least 8 characters" }, { status: 400 });
	}

	const result = await createAdminUser(username, password, adminKey);

	switch (result) {
		case "ok":
			return json({ ok: true }, { status: 201 });
		case "invalid-key":
			return json({ error: "Invalid admin key" }, { status: 401 });
		case "already-configured":
			return json({ error: "Admin is already configured" }, { status: 409 });
		case "missing-env":
			return json({ error: "ADMIN_KEY environment variable is not set" }, { status: 500 });
	}
}
