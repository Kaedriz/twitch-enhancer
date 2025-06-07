import { Logger } from "$shared/logger/logger.ts";
import type { PlatformConfig } from "$types/shared/platform.types.ts";
import type { Emitter } from "nanoevents";
import type UtilsRepository from "$shared/utils/utils.repository.ts";
import type { CommonEvents } from "$types/platforms/common.events.ts";
import { EventEmitterFactory } from "$shared/event-emitter.factory.ts";
import type Module from "$shared/module/module.ts";

export default abstract class Platform<TModule extends Module, TEvents extends CommonEvents> {
	constructor(
		protected readonly config: PlatformConfig,
		protected readonly utilsRepository: UtilsRepository,
		protected readonly emitter: Emitter<TEvents> = new EventEmitterFactory<TEvents>().create(),
		protected readonly logger: Logger = new Logger({ context: `app-${config.type}` }),
	) {}

	async initialize(): Promise<void> {
		throw new Error("Not implemented");
	}

	async start() {
		await this.initialize();
		this.logger.info(`Started ${this.config.type} extension`);
	}

	protected abstract getModules(): TModule[];
}
