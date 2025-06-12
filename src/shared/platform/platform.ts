import EnhancerApi from "$shared/apis/enhancer.api.ts";
import { EventEmitterFactory } from "$shared/event/event-emitter.factory.ts";
import { Logger } from "$shared/logger/logger.ts";
import EventModuleApplier from "$shared/module/applier/event-module-applier.ts";
import SelectorModuleApplier from "$shared/module/applier/selector-module-applier.ts";
import type Module from "$shared/module/module.ts";
import UtilsRepository from "$shared/utils/utils.repository.ts";
import type { CommonEvents } from "$types/platforms/common.events.ts";
import type { PlatformConfig } from "$types/shared/platform.types.ts";
import type { Emitter } from "nanoevents";

export default abstract class Platform<TModule extends Module<TEvents>, TEvents extends CommonEvents> {
	protected readonly logger: Logger = new Logger({ context: "main" });
	protected readonly emitter: Emitter<TEvents> = new EventEmitterFactory<TEvents>().create();
	protected readonly utilsRepository: UtilsRepository = new UtilsRepository();
	protected readonly enhancerApi;

	protected constructor(protected readonly config: PlatformConfig) {
		this.enhancerApi = new EnhancerApi(config.type);
	}

	protected async initialize(): Promise<void> {}

	async start() {
		await this.initialize();
		await this.loadModules();
		this.logger.info(`Started ${this.config.type} extension`);
		// @ts-ignore tbh idk, it just works, typescript magic
		this.emitter.emit("extension:start");
	}

	private appliers = [
		new SelectorModuleApplier<TEvents>(this.logger),
		new EventModuleApplier<TEvents>(this.logger, this.emitter),
	];

	protected abstract getModules(): TModule[];

	async loadModules() {
		const modules = this.getModules();
		await this.registerModules(modules);
		this.logger.info(`Loaded ${modules.length} modules`);
	}

	private async registerModules(modules: Module<TEvents>[]) {
		for (const module of modules) {
			try {
				module.setup();
				await module.initialize();
				for (const moduleAppliers of this.appliers) {
					await moduleAppliers.apply(module);
				}
				this.logger.debug(`${module.config.name} module has been loaded`);
			} catch (error) {
				this.logger.error(`Failed to load ${module.config.name} module: ${error}`);
			}
		}
	}

	getPlatformType() {
		return this.config.type;
	}
}
