import type { CommonEvents } from "$types/platforms/common.events.ts";
import type { TwitchEvents } from "$types/platforms/twitch/twitch.events.types.ts";
import type { ModuleApplierConfig } from "$types/shared/module/module-applier.types.ts";

export type ModuleConfig<Events extends CommonEvents> = {
	name: string;
	appliers: ModuleApplierConfig<Events>[];
};

export type TwitchModuleConfig = ModuleConfig<TwitchEvents>;
