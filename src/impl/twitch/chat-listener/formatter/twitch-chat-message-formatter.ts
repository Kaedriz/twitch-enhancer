import type { ChatMessage, UserChatMessage } from "events/twitch/chat.ts";
import ChatMessageFormatter from "modules/twitch/chat-listener/formatter/chat-message-formatter.ts";
import type { TwitchRawChatMessage } from "utils/twitch/react/types.ts";

export default class TwitchChatMessageFormatter extends ChatMessageFormatter {
	format(
		element: Element,
		raw: TwitchRawChatMessage | undefined,
	): UserChatMessage | ChatMessage | undefined {
		if (!raw?.props) return;
		return {
			id: raw.props.message.id,
			userId: raw.props.message.user.id,
			username: raw.props.message.user.displayName,
			color: raw.props.message.user.color,
			content: raw.props.message.message,
			channel: raw.props.channelLogin,
			channelId: raw.props.channelID,
			badges: raw.props.message.badges,
			element,
		};
	}
}
