import type { Emitter } from "nanoevents";
import type { KickEvents } from "types/content/event/kick-events.types.ts";
import type { TwitchEvents } from "types/content/event/twitch-events.types.ts";

export type EventsMap = {
	"extension:start": () => void;
} & (TwitchEvents & KickEvents);

export type EventEmitter = Emitter<EventsMap>;
