import { json, type RequestEvent } from "@sveltejs/kit";
import { deleteApiKey, isAdminRequest } from "$lib/server/auth";

export async function DELETE({ request, params }: RequestEvent) {
	if (!isAdminRequest(request)) {
		return json({ error: "Unauthorized" }, { status: 401 });
	}

	const id = params.id;
	if (!id) return json({ error: "Not found" }, { status: 404 });
	const deleted = await deleteApiKey(id);
	if (!deleted) {
		return json({ error: "Not found" }, { status: 404 });
	}
	return new Response(null, { status: 204 });
}
