import LocalStorage from "./impl/local.storage.ts";

export default class StorageRepository<LocalStorageMap> {
	local: LocalStorage<LocalStorageMap>;

	constructor(name: string) {
		this.local = new LocalStorage<LocalStorageMap>(`${name}`);
	}
}
