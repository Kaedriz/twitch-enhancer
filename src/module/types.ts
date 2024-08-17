import type { Platform } from "../types.ts";

export type ModuleType = "event" | "element";

export type ModuleConfig = ElementModuleConfig | EventModuleConfig;

export type TODOEventName = "chat";
//TODO Move it to events directory

export interface DefaultModuleConfig {
	platform: Platform;
	name: string;
	type: ModuleType;
}

export interface ElementModuleConfig extends DefaultModuleConfig {
	type: "element";
	elements: ModuleElement[];
}

export type ModuleElement = {
	selector: string;
	useParent?: boolean;
	once?: boolean;
	urlConfig?: ModuleElementUrlConfig;
};

export type ModuleElementUrlType = "include" | "exclude";

export type ModuleElementUrlConfig = {
	type: ModuleElementUrlType;
	regex?: RegExp;
	check?: (url: string) => boolean;
};

export interface EventModuleConfig extends DefaultModuleConfig {
	type: "event";
	eventName: TODOEventName;
}

export type ModuleEvent = {
	createdAt: number;
};

export interface ElementModuleEvent extends ModuleEvent {
	elements: Element[];
}

export interface EventModuleEvent extends ModuleEvent {}
