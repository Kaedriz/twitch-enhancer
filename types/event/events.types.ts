import type { Emitter } from "nanoevents";

export type EventsMap = {
	"extension:start": () => void;
} & TwitchEvents &
	KickEvents;

type TwitchEvents = {
	"twitch:chatMessage": (message: string) => void;
};

type KickEvents = {
	"kick:chatMessage": (message: string) => void;
};

export type EventEmitter = Emitter<EventsMap>;
