import type { Platform } from "../types.ts";

export interface ModuleConfig {
	platform: Platform;
	name: string;
	elements?: ModuleElement[];
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
