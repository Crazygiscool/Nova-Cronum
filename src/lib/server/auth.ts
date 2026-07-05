import { randomUUID } from "node:crypto";
import { getDb } from "./db";

export interface ApiKey {
	id: string;
	label: string;
	key: string;
	permissions: string[];
	createdAt: Date;
	lastUsedAt: Date | null;
}

const KEY_PREFIX = "nc_";

export function generateKey(): string {
	return `${KEY_PREFIX}${randomUUID().replace(/-/g, "")}`;
}

export async function createApiKey(label: string): Promise<ApiKey> {
	const db = getDb();
	const keys = db.collection<ApiKey>("api_keys");
	const doc: ApiKey = {
		id: randomUUID(),
		label,
		key: generateKey(),
		permissions: ["read", "write"],
		createdAt: new Date(),
		lastUsedAt: null,
	};
	await keys.insertOne(doc as any);
	return doc;
}

export async function validateApiKey(token: string): Promise<boolean> {
	if (!token) return false;
	const db = getDb();
	const keys = db.collection<ApiKey>("api_keys");
	const key = await keys.findOne({ key: token } as any);
	if (!key) return false;
	await keys.updateOne({ id: key.id } as any, {
		$set: { lastUsedAt: new Date() },
	} as any);
	return true;
}

export async function listApiKeys(): Promise<ApiKey[]> {
	const db = getDb();
	const keys = db.collection<ApiKey>("api_keys");
	return keys.find({}).toArray() as Promise<ApiKey[]>;
}

export async function deleteApiKey(id: string): Promise<boolean> {
	const db = getDb();
	const keys = db.collection<ApiKey>("api_keys");
	const result = await keys.deleteOne({ id } as any);
	return result.deletedCount > 0;
}

export function isAdminRequest(request: Request): boolean {
	const auth = request.headers.get("authorization") ?? "";
	return auth === `Bearer ${process.env.ADMIN_KEY}`;
}
