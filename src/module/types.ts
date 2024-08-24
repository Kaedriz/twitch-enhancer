import type { Platform } from "../types.ts";

export type ModuleType = "event" | "element";

export interface DefaultModuleConfig {
	platform: Platform;
	name: string;
}

export interface ModuleConfig extends DefaultModuleConfig {
	elements: ModuleElement[];
}

export type ModuleElement = {
	selector: string;
	useParent?: boolean;
	once?: boolean;
	urlConfig?: ModuleUrlConfig;
};

export type ModuleUrlType = "include" | "exclude";

export type ModuleUrlConfig = {
	type: ModuleUrlType;
	regex?: RegExp;
	check?: (url: string) => boolean;
};

export type ModuleEvent = {
	elements: Element[];
	createdAt: number;
};
