import ChatMessageListener from "modules/twitch/chat-listener/listener/chat-message-listener.ts";

export default class TwitchChatMessageListener extends ChatMessageListener {
	inject() {
		const messageHandlerAPI =
			this.utils.twitchUtils.getChatController()?.props.messageHandlerAPI;
		if (!messageHandlerAPI) throw new Error("Missing chat message handler");
		messageHandlerAPI.addMessageHandler((message) => {
			this.emitter.emit("message", { ...message, createdAt: Date.now() });
		});
		this.emitter.emit("inject");
	}
}
