import { json, type RequestEvent } from "@sveltejs/kit";
import { generateDynamicSchema } from "@crazygiscool/cap";
import { getRepo } from "$lib/server/db";
import { getCustomFields } from "$lib/server/settings";
import { validateSession, isAdminConfigured } from "$lib/server/admin-auth";

async function requireAdmin({ cookies }: RequestEvent) {
	const configured = await isAdminConfigured();
	if (!configured) return false;
	const sessionId = cookies.get("admin_session");
	if (!sessionId || !(await validateSession(sessionId))) return false;
	return true;
}

export async function PUT({ params, request, cookies }: RequestEvent) {
	if (!(await requireAdmin({ request, cookies } as RequestEvent))) {
		return json({ error: "Unauthorized" }, { status: 401 });
	}

	const id = params.id;
	if (!id) return json({ error: "Not found" }, { status: 404 });
	const body = await request.json();
	const customFields = getCustomFields();
	const schema = generateDynamicSchema(customFields);

	const parsed = schema.partial().safeParse(body);
	if (!parsed.success) {
		return json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 });
	}

	const repo = getRepo();
	const entry = await repo.update(id, parsed.data as any);
	if (!entry) {
		return json({ error: "Not found" }, { status: 404 });
	}
	return json(entry);
}

export async function DELETE({ params, cookies }: RequestEvent) {
	if (!(await requireAdmin({ cookies } as unknown as RequestEvent))) {
		return json({ error: "Unauthorized" }, { status: 401 });
	}

	const id = params.id;
	if (!id) return json({ error: "Not found" }, { status: 404 });
	const repo = getRepo();
	const deleted = await repo.delete(id);
	if (!deleted) {
		return json({ error: "Not found" }, { status: 404 });
	}
	return new Response(null, { status: 204 });
}
