import type Logger from "logger";
import ModuleApplier from "module/core/applier/module-applier.ts";
import type Module from "module/core/module.ts";
import type { EventEmitter } from "types/event/events.types.ts";

export default class EventModuleApplier extends ModuleApplier {
	constructor(
		logger: Logger,
		protected readonly eventEmitter: EventEmitter,
	) {
		super(logger);
	}

	async apply(module: Module) {
		for (const applier of module.config.appliers) {
			if (applier.type === "event") {
				this.eventEmitter.on(applier.event, applier.callback);
			}
		}
	}
}
