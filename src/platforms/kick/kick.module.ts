import type KickUtils from "$kick/kick.utils.ts";
import type EnhancerApi from "$shared/apis/enhancer.api.ts";
import Module from "$shared/module/module.ts";
import type StorageRepository from "$shared/storage/storage-repository.ts";
import type UtilsRepository from "$shared/utils/utils.repository.ts";
import type WorkerApi from "$shared/worker/worker.api.ts";
import type { KickEvents } from "$types/platforms/kick/kick.events.types.ts";
import type { KickStorage } from "$types/platforms/kick/kick.storage.types.ts";
import type { Emitter } from "nanoevents";

export default abstract class KickModule extends Module<KickEvents, KickStorage> {
	constructor(
		emitter: Emitter<KickEvents>,
		storageRepository: StorageRepository<KickStorage>,
		utilsRepository: UtilsRepository,
		enhancerApi: EnhancerApi,
		workerApi: WorkerApi,
		private readonly _kickUtils: KickUtils,
	) {
		super(emitter, storageRepository, utilsRepository, enhancerApi, workerApi);
	}

	protected kickUtils() {
		return this._kickUtils;
	}
}
