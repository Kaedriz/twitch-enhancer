import ChatMessageListener from "./chat-message-listener.ts";

export default class TwitchChatMessageListener extends ChatMessageListener {
	inject() {
		const messageHandlerAPI = this.utilsRepository.twitchUtils.getChatController()?.props.messageHandlerAPI;
		if (!messageHandlerAPI) throw new Error("Missing chat message handler");
		messageHandlerAPI.addMessageHandler((message) => {
			this.emitter.emit("message", { ...message, createdAt: Date.now() });
		});
		this.emitter.emit("inject");
	}
}
