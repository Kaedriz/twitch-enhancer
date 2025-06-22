export default abstract class Storage<T extends Record<string, any>> {
	constructor(protected readonly storageId = "enhancer") {}

	abstract save<K extends keyof T>(key: K, value: T[K]): Promise<void>;

	abstract get<K extends keyof T>(key: K): Promise<T[K] | undefined>;

	abstract getOrDefault<K extends keyof T>(key: K, defaultValue: T[K]): Promise<T[K]>;
}
