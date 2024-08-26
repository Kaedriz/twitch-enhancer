export default class Storage<Map> {
	async get<K extends keyof Map>(key: K): Promise<Map[K] | undefined> {
		throw new Error("Not implemented");
	}

	async set<K extends keyof Map>(key: K, value: Map[K]): Promise<void> {
		throw new Error("Not implemented");
	}
}
