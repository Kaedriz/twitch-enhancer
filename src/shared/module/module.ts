import { Logger } from "$shared/logger/logger.ts";
import type UtilsRepository from "$shared/utils/utils.repository.ts";
import type { CommonEvents } from "$types/platforms/common.events.ts";
import type { ModuleConfig } from "$types/shared/module.types.ts";
import type { Emitter } from "nanoevents";

export default abstract class Module<Events extends CommonEvents> {
	abstract readonly config: ModuleConfig<Events>;
	protected logger!: Logger;

	protected constructor(
		protected readonly emitter: Emitter<Events>,
		private readonly utilsRepository: UtilsRepository,
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

	// Utils
	protected commonUtils() {
		return this.utilsRepository.commonUtils;
	}

	protected reactUtils() {
		return this.utilsRepository.reactUtils;
	}
}
