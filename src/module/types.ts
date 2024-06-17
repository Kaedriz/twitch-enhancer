import type { Platform } from "../platform/types.ts";

export type ModuleConfig = TimerModuleConfig | EventModuleConfig;

export interface TimerModuleConfig extends DefaultModuleConfig {
	type: "timer";
}

export interface EventModuleConfig extends DefaultModuleConfig {
	type: "timer";
}

export interface DefaultModuleConfig {
	type: ModuleType;
	platform: Platform;
}

type ModuleType = "timer" | "event";
