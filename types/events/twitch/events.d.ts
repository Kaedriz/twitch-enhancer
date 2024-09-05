import type { TwitchChatMessageEvent } from "types/events/twitch/chat.events.d.ts";

export interface TwitchEvents {
	start: () => void;
	chatMessage: (message: TwitchChatMessageEvent) => Promise<void> | void;
}
