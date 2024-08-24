import type { TwitchChatMessageEvent } from "events/twitch/chat.ts";

export interface TwitchEvents {
	start: () => void;
	chatMessage: (message: TwitchChatMessageEvent) => Promise<void> | void;
}
