import type EnhancerApi from "$shared/apis/enhancer.api.ts";
import { Logger } from "$shared/logger/logger.ts";
import type StorageRepository from "$shared/storage/storage-repository.ts";
import type UtilsRepository from "$shared/utils/utils.repository.ts";
import type WorkerApi from "$shared/worker/worker.api.ts";
import type { CommonEvents } from "$types/platforms/common.events.ts";
import type { ModuleConfig } from "$types/shared/module/module.types.ts";
import type { Emitter } from "nanoevents";

export default abstract class Module<Events extends CommonEvents, Storage extends Record<string, any>> {
	abstract readonly config: ModuleConfig<Events>;
	protected logger!: Logger;

	protected constructor(
		protected readonly emitter: Emitter<Events>,
		private readonly storageRepository: StorageRepository<Storage>,
		private readonly utilsRepository: UtilsRepository,
		private readonly _enhancerApi: EnhancerApi,
		private readonly _workerApi: WorkerApi,
	) {}

	setup() {
		// As abstract property values are not accessible during constructor execution,
		// the logger instance is initialized here using an alternative method.
		this.logger = new Logger({ context: `module:${this.config.name}` });
	}

	async initialize(): Promise<void> {}

	protected getId() {
		return `enhancer-${this.config.name}`;
	}

	protected commonUtils() {
		return this.utilsRepository.commonUtils;
	}

	protected reactUtils() {
		return this.utilsRepository.reactUtils;
	}

	protected enhancerApi() {
		return this._enhancerApi;
	}

	protected localStorage() {
		return this.storageRepository.localStorage;
	}

	protected workerApi() {
		return this._workerApi;
	}
}
