import { redirect, type RequestEvent } from "@sveltejs/kit";
import { getRepo, type CharacterEntry } from "$lib/server/db";

export async function GET({ params }: RequestEvent) {
	const id = params.id;
	if (!id) return new Response("Not found", { status: 404 });
	const entry = await getRepo().findById(id) as CharacterEntry | null;
	if (!entry) {
		return new Response("Not found", { status: 404 });
	}

	const { id: _id, createdAt, updatedAt, ...rest } = entry;
	const newEntry = await getRepo().create(rest as any);

	redirect(303, `/admin/entries/${newEntry.id}/edit`);
}
