import type { EventsMap } from "types/events/events.ts";

export type TwitchEvents = TwitchEventsMap & EventsMap;

export type TwitchEventsMap = {
	"twitch:message": (message: string) => Promise<void> | void;
};
