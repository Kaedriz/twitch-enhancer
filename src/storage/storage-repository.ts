import LocalStorage from "./local.storage.ts";

export default class StorageRepository {
	storage;

	constructor(name: string) {
		this.storage = new LocalStorage(`${name}`);
	}
}
