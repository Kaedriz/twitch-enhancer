import type { EventsMap } from "types/events/events.ts";

export type KickEvents = KickEventsMap & EventsMap;

export type KickEventsMap = {
	"kick:message": (message: KickMessage) => Promise<void> | void;
};

export type KickMessage = {
	name: string;
	content: string;
};
