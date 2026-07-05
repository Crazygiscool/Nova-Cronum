import { MongoClient, type Db } from "mongodb";
import { CAPRepository, type ICAPBaseDocument, type CrawlSourceRecord } from "@crazygiscool/cap";
import { getSettings } from "./settings";

export type { CrawlSourceRecord };

export interface CharacterEntry extends ICAPBaseDocument {
	sparkId?: string;
	primaryFunction?: string;
	altMode?: string;
	motto?: string;
	colorScheme?: string;
	firepower?: number;
	strength?: number;
	intelligence?: number;
	speed?: number;
	isOnline?: boolean;
	activated?: string;
	sources?: CrawlSourceRecord[];
}

export class CharacterRepo extends CAPRepository<CharacterEntry> {
	constructor(db: Db) {
		super(db, "characters");
	}
}

let _client: MongoClient | null = null;
let _db: Db | null = null;
let _repo: CharacterRepo | null = null;

export function getDb(): Db {
	if (!_db) {
		const settings = getSettings();
		_client = new MongoClient(process.env.MONGODB_URI ?? "mongodb://localhost:27017");
		_db = _client.db(settings.databaseName);
	}
	return _db;
}

export function getRepo(): CharacterRepo {
	if (!_repo) {
		_repo = new CharacterRepo(getDb());
	}
	return _repo;
}
