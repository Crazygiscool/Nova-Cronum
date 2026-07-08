import { json, type RequestEvent } from "@sveltejs/kit";
import { generateDynamicSchema } from "@crazygiscool/cap";
import { getRepo } from "$lib/server/db";
import { getCustomFields } from "$lib/server/settings";
import { validateSession, isAdminConfigured } from "$lib/server/admin-auth";

export async function POST({ request, cookies }: RequestEvent) {
	const configured = await isAdminConfigured();
	if (!configured) return json({ error: "Admin not configured" }, { status: 401 });

	const sessionId = cookies.get("admin_session");
	if (!sessionId || !(await validateSession(sessionId))) {
		return json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	const customFields = getCustomFields();
	const schema = generateDynamicSchema(customFields);

	const parsed = schema.safeParse(body);
	if (!parsed.success) {
		return json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 });
	}

	const repo = getRepo();
	const entry = await repo.create(parsed.data as any);
	return json(entry, { status: 201 });
}
