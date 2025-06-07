import type Logger from "logger";

export default abstract class Storage<KeyMap> {
	constructor(
		protected readonly logger: Logger,
		protected readonly storagePrefix: string,
		protected readonly defaultValue?: KeyMap,
	) {}

	async save(key: keyof KeyMap, value: KeyMap[keyof KeyMap]) {
		throw new Error("Not implemented");
	}

	async get(key: keyof KeyMap): Promise<KeyMap[keyof KeyMap] | undefined> {
		throw new Error("Not implemented");
	}
}
