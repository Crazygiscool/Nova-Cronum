import { json, type RequestEvent } from "@sveltejs/kit";
import { getDb } from "$lib/server/db";

export async function GET(_: RequestEvent) {
	const db = getDb();
	const continuities = await db.collection("characters").distinct("continuityId") as string[];
	return json(continuities.sort());
}
