import type { ChatMessage, UserChatMessage } from "./chat.ts";

export interface TwitchEvents {
	start: () => void;
	chatMessage: (message: UserChatMessage | ChatMessage) => Promise<void>;
}
