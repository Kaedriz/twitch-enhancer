import type { CommonEvents } from "$types/platforms/common.events.ts";
import type { KickChatMessage } from "$types/platforms/kick/kick.utils.types.ts";

export type KickEvents = {
	"kick:chatMessage": (message: KickChatMessage) => void | Promise<void>;
} & CommonEvents;
