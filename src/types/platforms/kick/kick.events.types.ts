import type { CommonEvents } from "$types/platforms/common.events.ts";

export type KickEvents = {
	"kick:chatMessage": (message: string) => void | Promise<void>;
} & CommonEvents;
