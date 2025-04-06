import type { EventEmitter } from "types/content/event/events.types.ts";
import type Logger from "../../../shared/logger/logger.ts";
import type Module from "../module.ts";
import ModuleApplier from "./module-applier.ts";

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
				try {
					// TODO This throw will never work, because error will throw inside callback, not here when we are creating listener for this event
					this.eventEmitter.on(applier.event, applier.callback);
				} catch (error) {
					this.logger.error("Error occurred when running module", error);
				}
			}
		}
	}
}
