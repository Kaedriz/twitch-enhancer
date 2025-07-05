import type { Logger } from "$shared/logger/logger.ts";
import type { CommonEvents } from "$types/platforms/common.events.ts";
import type Module from "../module.ts";
import type { PlatformSettings } from "$types/shared/worker/settings-worker.types.ts";

export default class ModuleApplier<
	Events extends CommonEvents,
	Storage extends Record<string, any>,
	Settings extends PlatformSettings,
> {
	constructor(protected readonly logger: Logger) {}

	async apply(module: Module<Events, Storage, Settings>) {
		throw new Error("Not implemented");
	}
}
