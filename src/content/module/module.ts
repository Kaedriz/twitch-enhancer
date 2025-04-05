import type { EventEmitter } from "types/content/event/events.types.ts";
import type { ModuleConfig } from "types/content/module/module.types.ts";
import type Logger from "../../shared/logger/logger.ts";
import type StorageRepository from "../../shared/storage/storage-repository.ts";
import type ApiRepository from "../api/api-repository.ts";
import type UtilsRepository from "../utils/utils-repository.ts";

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
