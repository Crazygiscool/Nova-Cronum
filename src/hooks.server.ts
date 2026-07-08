import type { Handle, RequestEvent } from "@sveltejs/kit";
import { validateApiKey } from "$lib/server/auth";

const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function handleError({ error, event, status, message }: { error: Error; event: RequestEvent; status: number; message: string }) {
	console.error(`[${status}] ${event.url.pathname}:`, error);
	return { message: error.message || message };
}

export const handle: Handle = async ({ event, resolve }) => {
	if (WRITE_METHODS.has(event.request.method)) {
		const url = new URL(event.request.url);

		// Admin routes manage their own auth (session or env key)
		if (url.pathname.startsWith("/api/v1/admin/") || url.pathname.startsWith("/admin/")) {
			return resolve(event);
		}

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
