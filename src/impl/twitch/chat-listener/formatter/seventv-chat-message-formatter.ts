import type { ChatMessage, UserChatMessage } from "events/twitch/chat.ts";
import ChatMessageFormatter from "modules/twitch/chat-listener/formatter/chat-message-formatter.ts";

export default class SevenTVChatMessageFormatter extends ChatMessageFormatter {
	format(element: Element): UserChatMessage | ChatMessage | undefined {
		const badges = 
		return {
			id: element.getAttribute("msg-id") || Date.now(),
			username:
				element.querySelector(".seventv-chat-user-username")?.textContent ??
				undefined,
		};
	}

	// {
	// 	id: raw.props.message.id,
	// 	username: raw.props.message.user.displayName,
	// 	color: raw.props.message.user.color,
	// 	content: raw.props.message.message,
	// 	channel: raw.props.channelLogin,
	// 	channelId: raw.props.channelID,
	// 	badges: raw.props.message.badges,
	// 	element,
	// };
}
