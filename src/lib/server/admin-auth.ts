import { randomUUID, randomBytes, pbkdf2Sync } from "node:crypto";
import { getDb } from "./db";
import { ADMIN_KEY } from "$env/static/private";

const SALT_LENGTH = 32;
const KEY_LENGTH = 64;
const ITERATIONS = 100_000;
const DIGEST = "sha512";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

interface AdminConfig {
	_id: string;
	username: string;
	passwordHash: string;
	salt: string;
	createdAt: Date;
}

interface AdminSession {
	sessionId: string;
	createdAt: Date;
	expiresAt: Date;
}

function hashPassword(password: string, salt: string): string {
	return pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
}

export async function getAdminConfig(): Promise<AdminConfig | null> {
	const db = getDb();
	return db.collection<AdminConfig>("admin_config").findOne({ _id: "admin" });
}

export async function isAdminConfigured(): Promise<boolean> {
	return (await getAdminConfig()) !== null;
}

export async function createAdminUser(
	username: string,
	password: string,
	adminKey: string,
): Promise<"ok" | "invalid-key" | "already-configured" | "missing-env"> {
	if (!ADMIN_KEY) return "missing-env";
	if (adminKey !== ADMIN_KEY) return "invalid-key";

	const existing = await getAdminConfig();
	if (existing) return "already-configured";

	const salt = randomBytes(SALT_LENGTH).toString("hex");
	const passwordHash = hashPassword(password, salt);

	const db = getDb();
	await db.collection<AdminConfig>("admin_config").insertOne({
		_id: "admin",
		username,
		passwordHash,
		salt,
		createdAt: new Date(),
	});

	return "ok";
}

export async function verifyAdminLogin(
	username: string,
	password: string,
): Promise<string | null> {
	const config = await getAdminConfig();
	if (!config) return null;
	if (config.username !== username) return null;

	const hash = hashPassword(password, config.salt);
	if (hash !== config.passwordHash) return null;

	const db = getDb();
	const sessionId = randomUUID();
	const now = new Date();

	await db.collection<AdminSession>("admin_sessions").insertOne({
		sessionId,
		createdAt: now,
		expiresAt: new Date(now.getTime() + SESSION_TTL_MS),
	});

	return sessionId;
}

export async function validateSession(sessionId: string): Promise<boolean> {
	if (!sessionId) return false;

	const db = getDb();
	const session = await db
		.collection<AdminSession>("admin_sessions")
		.findOne({ sessionId });

	if (!session) return false;
	if (session.expiresAt < new Date()) {
		await db.collection<AdminSession>("admin_sessions").deleteOne({ sessionId });
		return false;
	}

	return true;
}

export async function deleteSession(sessionId: string): Promise<void> {
	if (!sessionId) return;
	const db = getDb();
	await db.collection<AdminSession>("admin_sessions").deleteOne({ sessionId });
}

export async function changePassword(
	oldPassword: string,
	newPassword: string,
): Promise<boolean> {
	const config = await getAdminConfig();
	if (!config) return false;

	const hash = hashPassword(oldPassword, config.salt);
	if (hash !== config.passwordHash) return false;

	const newSalt = randomBytes(SALT_LENGTH).toString("hex");
	const newHash = hashPassword(newPassword, newSalt);

	const db = getDb();
	await db
		.collection<AdminConfig>("admin_config")
		.updateOne(
			{ _id: "admin" },
			{ $set: { passwordHash: newHash, salt: newSalt } },
		);

	await db.collection<AdminSession>("admin_sessions").deleteMany({});

	return true;
}
