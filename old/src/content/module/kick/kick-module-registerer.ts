import ExampleModule from "module/kick/example/example.module.ts";
import type { EventEmitter } from "types/content/event/events.types.ts";
import type Logger from "../../../shared/logger/logger.ts";
import type StorageRepository from "../../../../../src/shared/storage/storage-repository.ts";
import type ApiRepository from "../../api/api-repository.ts";
import type UtilsRepository from "../../utils/utils-repository.ts";
import ModuleRegisterer from "../module-registerer.ts";

export default class KickModuleRegisterer extends ModuleRegisterer {
	getModules(
		logger: Logger,
		eventEmitter: EventEmitter,
		storageRepository: StorageRepository,
		utilsRepository: UtilsRepository,
		apiRepository: ApiRepository,
	) {
		return [
			// new ExampleModule(logger, eventEmitter, storageRepository, utilsRepository, apiRepository)
		];
	}
}
