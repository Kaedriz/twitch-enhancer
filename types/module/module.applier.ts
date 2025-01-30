import type { EventsMap } from "types/events/events.ts";
import type { KickEvents } from "types/events/kick.events.ts";
import type { TwitchEvents } from "types/events/twitch.events.ts";

export type ModuleApplier = SelectorModuleApplier | EventModuleApplier;
export type RequiredModuleApplier = SelectorModuleApplier & EventModuleApplier;

export type EventModuleApplier =
	| TwitchEventModuleApplier
	| KickEventModuleApplier;
export type TwitchEventModuleApplier = CommonEventModuleApplier<TwitchEvents>;
export type KickEventModuleApplier = CommonEventModuleApplier<KickEvents>;

export type ModuleApplierType = "selector" | "event";
export type SelectorModuleApplier = {
	type: "selector";
	selectors: string[];
	callback: (elements: Element[], key: string) => Promise<void> | void;
	validateUrl?: (url: string) => boolean;
} & CommonModuleApplier;
export type CommonEventModuleApplier<T extends EventsMap> = {
	type: "event";
	event: keyof T;
	callback: T[keyof T];
} & Omit<CommonModuleApplier, "cooldown">;

export type CommonModuleApplier = {
	key: string;
	once?: string;
	cooldown?: number;
};

export type ModuleApplierResult<T> =
	| ModuleApplierResultSuccess<T>
	| ModuleApplierResultFailure;

export type ModuleApplierResultSuccess<T> = {
	applies: true;
	data: T;
};

export type ModuleApplierResultFailure = {
	applies: false;
};
