import Storage from "./storage.ts";

export default class LocalStorage<Map> extends Storage<Map> {
	async get<K extends keyof Map>(key: K): Promise<Map[K] | undefined> {
		if (!this.storage) return;
		return this.storage[key] as Map[K] | undefined;
	}

	async set<K extends keyof Map>(key: K, value: Map[K]): Promise<void> {
		if (!this.storage) return;
		this.storage[key] = value;
		await this.save();
	}

	protected async load() {
		this.storage = JSON.parse(
			localStorage.getItem(this.name) || "{}",
		) as Partial<Record<keyof Map, Map[keyof Map]>>;
	}

	protected async save() {
		localStorage.setItem(this.name, JSON.stringify(this.storage));
	}
}
