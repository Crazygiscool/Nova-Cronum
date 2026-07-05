import { json, type RequestEvent } from "@sveltejs/kit";
import { deleteApiKey, isAdminFromEvent } from "$lib/server/auth";

export async function DELETE(event: RequestEvent) {
	if (!(await isAdminFromEvent(event))) {
		return json({ error: "Unauthorized" }, { status: 401 });
	}

	const id = event.params.id;
	if (!id) return json({ error: "Not found" }, { status: 404 });
	const deleted = await deleteApiKey(id);
	if (!deleted) {
		return json({ error: "Not found" }, { status: 404 });
	}
	return new Response(null, { status: 204 });
}
