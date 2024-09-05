import type Logger from "logger";
import type Module from "module/module.ts";
import type { Emitter } from "nanoevents";
import type { TwitchEvents } from "types/events/twitch/events.d.ts";
import type CommonUtils from "utils/common.utils.ts";
import type StorageRepository from "../storage/storage-repository.ts";

export default abstract class ModuleLoader {
	abstract get(
		logger: Logger,
		utils: CommonUtils,
		emitter: Emitter<TwitchEvents>,
		storage: StorageRepository<any>,
	): Module<any, any>[];
}
