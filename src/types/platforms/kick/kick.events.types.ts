import type { CommonEvents } from "$types/platforms/common.events.ts";
import type { ChatMessageElements } from "$types/platforms/kick/kick.utils.types.ts";

export type KickEvents = {
	"kick:chatMessage": (message: ChatMessageElements) => void | Promise<void>;
} & CommonEvents;
