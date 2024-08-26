import Storage from "./storage.ts";

export default class LocalStorage<Map> extends Storage<Map> {
	private readonly storage: Partial<Record<keyof Map, Map[keyof Map]>>;

	constructor(private readonly name: string) {
		super();
		this.storage = JSON.parse(localStorage.getItem(name) || "{}") as Partial<
			Record<keyof Map, Map[keyof Map]>
		>;
	}

	async get<K extends keyof Map>(key: K): Promise<Map[K] | undefined> {
		return this.storage[key] as Map[K] | undefined;
	}

	async set<K extends keyof Map>(key: K, value: Map[K]): Promise<void> {
		this.storage[key] = value;
		localStorage.setItem(this.name, JSON.stringify(this.storage));
	}
}
