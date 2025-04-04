import type Logger from "logger";
import type Module from "module/core/module.ts";
import type { EventEmitter } from "types/event/events.types.ts";
import type UtilsRepository from "utils/utils-repository.ts";
import type ApiRepository from "../../api/api-repository.ts";
import type StorageRepository from "../../storage/storage-repository.ts";

export default abstract class ModuleRegisterer {
	abstract getModules(
		logger: Logger,
		eventEmitter: EventEmitter,
		storageRepository: StorageRepository,
		utilsRepository: UtilsRepository,
		apiRepository: ApiRepository,
	): Module[];
}
