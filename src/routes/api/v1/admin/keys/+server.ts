import { json, type RequestEvent } from "@sveltejs/kit";
import { createApiKey, listApiKeys, isAdminRequest } from "$lib/server/auth";

export async function GET({ request }: RequestEvent) {
	if (!isAdminRequest(request)) {
		return json({ error: "Unauthorized" }, { status: 401 });
	}
	const keys = await listApiKeys();
	return json(keys.map((k) => ({ id: k.id, label: k.label, permissions: k.permissions, createdAt: k.createdAt, lastUsedAt: k.lastUsedAt })));
}

export async function POST({ request }: RequestEvent) {
	if (!isAdminRequest(request)) {
		return json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	if (!body.label) {
		return json({ error: "label is required" }, { status: 400 });
	}

	const key = await createApiKey(body.label);
	return json(key, { status: 201 });
}
