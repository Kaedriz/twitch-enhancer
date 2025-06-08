import type { Logger } from "$shared/logger/logger.ts";
import type { CommonEvents } from "$types/platforms/common.events.ts";
import type Module from "../module.ts";

export default class ModuleApplier<Events extends CommonEvents> {
	constructor(protected readonly logger: Logger) {}

	async apply(module: Module<Events>) {
		throw new Error("Not implemented");
	}
}
