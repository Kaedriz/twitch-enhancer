import type { ChatMessage, UserChatMessage } from "events/twitch/chat.ts";

export default abstract class ChatMessageFormatter {
	abstract format(
		element: Element,
		raw: RawChatMessage | undefined,
	): UserChatMessage | ChatMessage | undefined;
}

export interface RawChatMessage {
	sentAt: number;
}
