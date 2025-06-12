import LocalStorage from "$shared/storage/local-storage.ts";

export default class StorageRepository<T extends Record<string, any>> {
	readonly localStorage: LocalStorage<T>;

	constructor() {
		this.localStorage = new LocalStorage<T>();
	}
}
