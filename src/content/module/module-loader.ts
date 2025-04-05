import type { EventEmitter } from "types/content/event/events.types.ts";
import type { Platform } from "types/content/extension.ts";
import type Logger from "../../shared/logger/logger.ts";
import type StorageRepository from "../../shared/storage/storage-repository.ts";
import type ApiRepository from "../api/api-repository.ts";
import type UtilsRepository from "../utils/utils-repository.ts";
import EventModuleApplier from "./applier/event-module-applier.ts";
import type ModuleApplier from "./applier/module-applier.ts";
import SelectorModuleApplier from "./applier/selector-module-applier.ts";
import type Module from "./module.ts";
import TwitchModuleRegisterer from "./twitch/twitch-module-registerer.ts";

export default class ModuleLoader {
	private readonly moduleAppliers: ModuleApplier[] = [];

	constructor(protected readonly logger: Logger) {}

	private registerAppliers(eventEmitter: EventEmitter) {
		const moduleAppliers = [new SelectorModuleApplier(this.logger), new EventModuleApplier(this.logger, eventEmitter)];
		this.moduleAppliers.push(...moduleAppliers);
	}

	async loadModules(
		platform: Platform,
		eventEmitter: EventEmitter,
		storageRepository: StorageRepository,
		utilsRepository: UtilsRepository,
		apiRepository: ApiRepository,
	) {
		this.registerAppliers(eventEmitter);
		const moduleRegisterer = this.getModuleRegisterer(platform);
		const modules = moduleRegisterer.getModules(
			this.logger,
			eventEmitter,
			storageRepository,
			utilsRepository,
			apiRepository,
		);
		await this.registerModules(modules);
		this.logger.info(`Loaded ${modules.length} modules`);
	}

	private async registerModules(modules: Module[]) {
		for (const module of modules) {
			try {
				await module.init();
				for (const moduleAppliers of this.moduleAppliers) {
					await moduleAppliers.apply(module);
				}
				this.logger.debug(`${module.config.name} module has been loaded`);
			} catch (error) {
				this.logger.error(`Failed to load ${module.config.name} module: ${error}`);
			}
		}
	}

	private getModuleRegisterer(platform: Platform) {
		switch (platform) {
			case "twitch":
				return new TwitchModuleRegisterer();
			default:
				throw new Error(`${platform} platform is not supported`);
		}
	}
}
