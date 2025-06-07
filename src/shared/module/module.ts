import { Logger } from "$shared/logger/logger.ts";
import type { ModuleConfig } from "$types/shared/module.types.ts";
import type { Emitter } from "nanoevents";
import type { CommonEvents } from "$types/platforms/common.events.ts";
import type UtilsRepository from "$shared/utils/utils.repository.ts";

export default abstract class Module {
	protected abstract readonly config: ModuleConfig;
	protected logger!: Logger;

	protected constructor(
		protected readonly emitter: Emitter<CommonEvents>,
		private readonly utilsRepository: UtilsRepository,
	) {
		this.setup();
	}

	private setup() {
		// As abstract property values are not accessible during constructor execution,
		// the logger instance is initialized here using an alternative method.
		this.logger = new Logger({ context: `module:${this.config.name}` });
	}

	async initialize(): Promise<void> {
		throw new Error("Not implemented");
	}

	protected getId() {
		return `enhancer-${this.config.name}`;
	}

	// Ungrouped Utils
	protected commonUtils() {
		return this.utilsRepository.commonUtils;
	}

	protected reactUtils() {
		return this.utilsRepository.reactUtils;
	}
}
