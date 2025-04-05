import type { CoreStorageMap } from "types/shared/storage/storage.types.ts";
import Storage from "./storage.ts";

export default class LocalStorage extends Storage<CoreStorageMap> {
	private cache: CoreStorageMap | undefined;

	async save<K extends keyof CoreStorageMap>(key: K, value: CoreStorageMap[K]): Promise<void> {
		const storage = this.getStorage();
		storage[key] = value;
		this.cache = storage;
		localStorage.setItem(this.getId(), JSON.stringify(storage));
	}

	async get<K extends keyof CoreStorageMap>(key: K): Promise<CoreStorageMap[K]> {
		return this.getStorage()[key] as CoreStorageMap[K];
	}

	private getStorage(): CoreStorageMap {
		if (this.cache) return this.cache;
		const rawStorage = localStorage.getItem(this.getId());
		if (rawStorage) {
			this.cache = JSON.parse(rawStorage) as CoreStorageMap;
			return this.cache;
		}
		this.cache = this.defaultValue ?? ({} as CoreStorageMap);
		return this.cache;
	}

	private getId(): string {
		return `enhancer:${this.storagePrefix}`;
	}
}
