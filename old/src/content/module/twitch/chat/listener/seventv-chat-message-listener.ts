import type { TwitchChatMessage } from "types/content/utils/twitch-utils.types.ts";
import ChatMessageListener from "./chat-message-listener.ts";

export default class SevenTVChatMessageListener extends ChatMessageListener {
	inject() {
		const messageHandlerAPI = this.utilsRepository.twitchUtils.getChatController()?.props.messageHandlerAPI;
		if (!messageHandlerAPI) throw new Error("Missing chat message handler");
		this.logger.debug("Injected 7TV message handler");
		const descriptor = Object.getOwnPropertyDescriptor(messageHandlerAPI, "handleMessage");
		if (!descriptor || !descriptor.get || !descriptor.set) throw new Error("Couldn't inject into 7TV chat");
		const callbackWrapper = (messages: TwitchChatMessage[]) =>
			messages.forEach((message) => {
				this.emitter.emit("message", { ...message, createdAt: Date.now() });
			});
		Object.defineProperty(messageHandlerAPI, "handleMessage", {
			get() {
				// biome-ignore lint/style/noNonNullAssertion: Checking it above
				const originalFunction = descriptor!.get!.call(this);
				return (...messages: TwitchChatMessage[]) => {
					callbackWrapper(messages);
					return originalFunction.apply(this, messages);
				};
			},
			set: descriptor.set,
			configurable: true,
			enumerable: true,
		});
		this.emitter.emit("inject");
	}
}
