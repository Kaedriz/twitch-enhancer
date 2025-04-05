import Logger from "logger";
import type { EventEmitter } from "types/event/events.types.ts";
import type { ExtensionConfig } from "types/extension.ts";
import UtilsRepository from "utils/utils-repository.ts";
import ApiRepository from "./api/api-repository.ts";
import { createEventsEmitter } from "./event/emitter.ts";
import ModuleLoader from "./module/module-loader.ts";
import StorageRepository from "../shared/storage/storage-repository.ts";

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
		this.apiRepository = new ApiRepository(this.logger, this.config.platform, this.utilsRepository);
	}

	async start() {
		await this.apiRepository.initialize();
		const moduleLoader = new ModuleLoader(this.logger);
		await moduleLoader.loadModules(
			this.config.platform,
			this.eventsEmitter,
			this.storageRepository,
			this.utilsRepository,
			this.apiRepository,
		);
		this.eventsEmitter.emit("extension:start");
		this.logger.info(`Started extension at ${this.config.platform}`);
	}
}
