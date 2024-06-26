import type { ModuleEvent } from "../event/types.ts";
import type { Platform } from "../platform/types.ts";

export interface ModuleConfig {
	event: ModuleEvent;
	platform: Platform;
	priority?: number;
}
