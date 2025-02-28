import type { CoreStorageMap } from "types/storage/storage.types.ts";
import Storage from "./storage.ts";

export default class LocalStorage extends Storage<CoreStorageMap> {
	private cache: CoreStorageMap | undefined;

	async save(
		key: keyof CoreStorageMap,
		value: CoreStorageMap[keyof CoreStorageMap],
	): Promise<void> {
		const storage = this.getStorage();
		storage[key] = value;
		this.cache = storage;
		localStorage.setItem(this.getId(), JSON.stringify(storage));
	}

	async get(key: keyof CoreStorageMap) {
		return this.getStorage()[key];
	}

	private getStorage() {
		if (this.cache) return this.cache;
		const rawStorage = localStorage.getItem(this.getId());
		if (rawStorage) {
			this.cache = JSON.parse(rawStorage) as CoreStorageMap;
			return this.cache;
		}
		this.cache = this.defaultValue ?? ({} as CoreStorageMap);
		return this.cache;
	}

	private getId() {
		return `enhancer:${this.storagePrefix}`;
	}
}
