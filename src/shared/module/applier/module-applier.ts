import type { Logger } from "$shared/logger/logger.ts";
import type { CommonEvents } from "$types/platforms/common.events.ts";
import type Module from "../module.ts";

export default class ModuleApplier<Events extends CommonEvents, Storage extends Record<string, any>> {
	constructor(protected readonly logger: Logger) {}

	async apply(module: Module<Events, Storage>) {
		throw new Error("Not implemented");
	}
}
