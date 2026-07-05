import { json, type RequestEvent } from "@sveltejs/kit";
import { getDb } from "$lib/server/db";

export async function GET(_: RequestEvent) {
	const db = getDb();
	const factions = await db.collection("characters").distinct("factions") as string[];
	return json(factions.sort());
}
