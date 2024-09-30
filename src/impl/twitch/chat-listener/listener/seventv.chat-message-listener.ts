import ChatMessageListener from "modules/twitch/chat-listener/listener/chat-message-listener.ts";
import type { TwitchChatMessage } from "types/events/twitch/chat.events.d.ts";

export default class SevenTVChatMessageListener extends ChatMessageListener {
	inject() {
		const messageHandlerAPI =
			this.utils.twitch.getChatController()?.props.messageHandlerAPI;
		this.logger.debug("Injected 7TV message handler");
		const descriptor = Object.getOwnPropertyDescriptor(
			messageHandlerAPI,
			"handleMessage",
		);
		if (!descriptor || !descriptor.get || !descriptor.set) {
			this.logger.warn("Couldn't inject into 7TV chat");
			return;
		}
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
