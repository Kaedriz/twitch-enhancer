import type { KickEvents } from "types/events/kick.events.ts";
import type { TwitchEvents } from "types/events/twitch.events.ts";

export interface EventsMap {
	start: () => void;
}
