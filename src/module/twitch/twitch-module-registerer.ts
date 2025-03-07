import type Logger from "logger";
import ModuleRegisterer from "module/core/module-registerer.ts";
import ChattersModule from "module/twitch/chatters/chatters-module.tsx";
import ExampleModule from "module/twitch/example/example.module.ts";
import type { EventEmitter } from "types/event/events.types.ts";
import type UtilsRepository from "utils/utils-repository.ts";
import type ApiRepository from "../../api/api-repository.ts";
import type StorageRepository from "../../storage/storage-repository.ts";

export default class TwitchModuleRegisterer extends ModuleRegisterer {
	getModules(
		logger: Logger,
		eventEmitter: EventEmitter,
		storageRepository: StorageRepository,
		utilsRepository: UtilsRepository,
		apiRepository: ApiRepository,
	) {
		return [
			new ChattersModule(
				logger,
				eventEmitter,
				storageRepository,
				utilsRepository,
				apiRepository,
			),
		];
	}
}
