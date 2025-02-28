import type { EventsMap } from "types/event/events.types.ts";

export type ModuleApplierConfig =
	| SelectorModuleApplierConfig
	| EventModuleApplierConfig;

export type CommonModuleApplierConfig = {
	key: string;
	cooldown?: number;
	once?: string;
};

export type SelectorModuleApplierConfig = {
	type: "selector";
	selectors: string[];
	callback: (elements: Element[], key: string) => Promise<void> | void;
	validateUrl?: (url: string) => boolean;
} & CommonModuleApplierConfig;

export type EventModuleApplierConfig = {
	type: "event";
	event: keyof EventsMap;
	callback: EventsMap[keyof EventsMap];
} & Omit<CommonModuleApplierConfig, "cooldown">;
