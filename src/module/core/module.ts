import type Logger from "logger";
import type { EventEmitter } from "types/event/events.types.ts";
import type { ModuleConfig } from "types/module/module.types.ts";
import type UtilsRepository from "utils/utils-repository.ts";
import type ApiRepository from "../../api/api-repository.ts";
import type StorageRepository from "../../storage/storage-repository.ts";

export default abstract class Module {
	abstract config: ModuleConfig;

	constructor(
		protected readonly logger: Logger,
		protected readonly eventEmitter: EventEmitter,
		protected readonly storageRepository: StorageRepository,
		protected readonly utilsRepository: UtilsRepository,
		protected readonly apiRepository: ApiRepository,
	) {}

	async init() {}

	protected getId() {
		return `enhancer-${this.config.name}`;
	}
}
