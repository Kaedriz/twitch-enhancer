import type { EventEmitter } from "types/event/events.types.ts";
import type UtilsRepository from "utils/utils-repository.ts";
import type Logger from "../../shared/logger/logger.ts";
import type ApiRepository from "../api/api-repository.ts";
import type StorageRepository from "../storage/storage-repository.ts";
import type Module from "./module.ts";

export default abstract class ModuleRegisterer {
	abstract getModules(
		logger: Logger,
		eventEmitter: EventEmitter,
		storageRepository: StorageRepository,
		utilsRepository: UtilsRepository,
		apiRepository: ApiRepository,
	): Module[];
}
