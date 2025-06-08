import type { CommonEvents } from "$types/platforms/common.events.ts";
import type { ModuleApplierConfig } from "$types/shared/module-applier.types.ts";

export type ModuleConfig<Events extends CommonEvents> = {
	name: string;
	appliers: ModuleApplierConfig<Events>[];
};
