import ChatMessageListener from "modules/twitch/chat-listener/listener/chat-message-listener.ts";

export default class TwitchChatMessageListener extends ChatMessageListener {
	inject() {
		const messageHandlerAPI =
			this.utils.twitch.getChatController()?.props.messageHandlerAPI;
		messageHandlerAPI?.addMessageHandler((message) => {
			this.emitter.emit("message", { ...message, createdAt: Date.now() });
		});
		this.emitter.emit("inject");
	}
}
