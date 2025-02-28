import type Logger from "logger";
import EventModuleApplier from "module/core/applier/event-module-applier.ts";
import type ModuleApplier from "module/core/applier/module-applier.ts";
import SelectorModuleApplier from "module/core/applier/selector-module-applier.ts";
import type Module from "module/core/module.ts";
import TwitchModuleRegisterer from "module/twitch/twitch-module-registerer.ts";
import type { EventEmitter } from "types/event/events.types.ts";
import type { Platform } from "types/extension.ts";
import type UtilsRepository from "utils/utils-repository.ts";
import type StorageRepository from "../../storage/storage-repository.ts";

export default class ModuleLoader {
	private readonly moduleAppliers: ModuleApplier[] = [];

	constructor(protected readonly logger: Logger) {}

	private registerAppliers(eventEmitter: EventEmitter) {
		const moduleAppliers = [
			new SelectorModuleApplier(this.logger),
			new EventModuleApplier(this.logger, eventEmitter),
		];
		this.moduleAppliers.push(...moduleAppliers);
	}

	async registerModules(
		platform: Platform,
		eventEmitter: EventEmitter,
		storageRepository: StorageRepository,
		utilsRepository: UtilsRepository,
	) {
		this.registerAppliers(eventEmitter);
		const moduleRegisterer = this.getModuleRegisterer(platform);
		const modules = moduleRegisterer.getModules(
			this.logger,
			eventEmitter,
			storageRepository,
			utilsRepository,
		);
		await this.loadModules(modules);
	}

	private async loadModules(modules: Module[]) {
		for (const module of modules) {
			await module.init();
			for (const moduleAppliers of this.moduleAppliers) {
				await moduleAppliers.apply(module);
			}
			this.logger.debug(`${module.config.name} module has been loaded`);
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
