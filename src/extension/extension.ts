import Logger from "logger";
import ModuleLoader from "module/core/module-loader.ts";
import type { EventEmitter } from "types/event/events.types.ts";
import type { ExtensionConfig } from "types/extension.ts";
import UtilsRepository from "utils/utils-repository.ts";
import ApiRepository from "../api/api-repository.ts";
import { createEventsEmitter } from "../event/emitter.ts";
import StorageRepository from "../storage/storage-repository.ts";

export default class Extension {
	private readonly logger = new Logger(true);
	private readonly eventsEmitter: EventEmitter;
	private readonly storageRepository: StorageRepository;
	private readonly utilsRepository: UtilsRepository;
	private readonly apiRepository: ApiRepository;

	constructor(private readonly config: ExtensionConfig) {
		this.eventsEmitter = createEventsEmitter();
		this.storageRepository = new StorageRepository(this.logger, this.config.platform);
		this.utilsRepository = new UtilsRepository(this.logger);
		this.apiRepository = new ApiRepository(this.logger);
	}

	async start() {
		this.logger.info(`Started extension at ${this.config.platform}`);
		const moduleLoader = new ModuleLoader(this.logger);
		await moduleLoader.loadModules(
			this.config.platform,
			this.eventsEmitter,
			this.storageRepository,
			this.utilsRepository,
			this.apiRepository,
		);
		this.eventsEmitter.emit("extension:start");
	}
}
