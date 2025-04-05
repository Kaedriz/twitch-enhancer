import type { Platform } from "types/extension.ts";
import type Logger from "logger";
import LocalStorage from "./local-storage.ts";

export default class StorageRepository {
	readonly localStorage: LocalStorage;

	constructor(
		private readonly logger: Logger,
		platform: Platform,
	) {
		this.localStorage = new LocalStorage(this.logger, platform);
	}
}
