import { MongoClient, type Db } from "mongodb";
import { CAPRepository, type ICAPBaseDocument, type CrawlSourceRecord } from "@crazygiscool/cap";
import { getSettings } from "./settings";
import { MONGODB_URI } from "$env/static/private";

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

	async listAll(): Promise<CharacterEntry[]> {
		return this.collection.find({}, { projection: { _id: 0 } }).toArray() as Promise<CharacterEntry[]>;
	}

	async findById(id: string): Promise<CharacterEntry | null> {
		return this.collection.findOne({ id } as any, { projection: { _id: 0 } }) as Promise<CharacterEntry | null>;
	}

	async findByName(name: string): Promise<CharacterEntry | null> {
		return this.collection.findOne(
			{ name: { $regex: name, $options: "i" } } as any,
			{ projection: { _id: 0 } },
		) as Promise<CharacterEntry | null>;
	}
}

let _client: MongoClient | null = null;
let _db: Db | null = null;
let _repo: CharacterRepo | null = null;

export function getDb(): Db {
	if (!_db) {
		const settings = getSettings();
		_client = new MongoClient(MONGODB_URI ?? "mongodb://localhost:27017");
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
