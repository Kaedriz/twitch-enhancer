export default class Storage<Map> {
	protected storage: Partial<Record<keyof Map, Map[keyof Map]>> | undefined;

	constructor(protected readonly name: string) {
		this.load();
	}

	async get<K extends keyof Map>(key: K): Promise<Map[K] | undefined> {
		throw new Error("Not implemented");
	}

	async set<K extends keyof Map>(key: K, value: Map[K]): Promise<void> {
		throw new Error("Not implemented");
	}

	protected load() {}

	protected async save() {}
}
