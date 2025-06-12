import type { TwitchChatMessage } from "$types/platforms/twitch/twitch.utils.types.ts";
import ChatMessageListener from "./chat-message-listener.ts";

export default class TwitchChatMessageListener extends ChatMessageListener {
	inject() {
		const messageHandlerAPI = this.twitchUtilsRepository.getChatController()?.props.messageHandlerAPI;
		if (!messageHandlerAPI) throw new Error("Missing chat message chat-attachments-handlers");
		messageHandlerAPI.addMessageHandler((message: TwitchChatMessage) => {
			this.emitter.emit("message", { ...message, createdAt: Date.now() });
		});
		this.emitter.emit("inject");
	}
}
