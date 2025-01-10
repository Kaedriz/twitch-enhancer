import type { TwitchEvents } from "types/events/twitch/events";
import type { Platform } from "../twitch-react.d.ts";

export interface ModuleConfig {
	platform: Platform;
	name: string;
	elements?: ModuleElement[];
	listener?: ModuleEventListener[];
}

export type ModuleEventListener<T extends keyof TwitchEvents> = {
	name: T;
	handler: TwitchEvents[T];
};

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
