import type { Handle } from "@sveltejs/kit";
import { validateApiKey } from "$lib/server/auth";

const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export const handle: Handle = async ({ event, resolve }) => {
	if (WRITE_METHODS.has(event.request.method)) {
		const authHeader = event.request.headers.get("authorization") ?? "";
		const token = authHeader.replace(/^Bearer\s+/i, "");

		if (!token || !(await validateApiKey(token))) {
			return new Response(JSON.stringify({ error: "Unauthorized" }), {
				status: 401,
				headers: { "content-type": "application/json" },
			});
		}
	}

	return resolve(event);
};
