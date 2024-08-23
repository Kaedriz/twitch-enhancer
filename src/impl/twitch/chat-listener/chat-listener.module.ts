import Module from "module/module.ts";
import type { ModuleConfig, ModuleEvent } from "module/types.ts";
import {
	SEVENTV_CHAT_SELECTOR,
	TWITCHTV_CHAT_SELECTOR,
} from "modules/twitch/chat-listener/chat.constatns.ts";
import type ChatMessageFormatter from "modules/twitch/chat-listener/formatter/chat-message-formatter.ts";
import SevenTVChatMessageFormatter from "modules/twitch/chat-listener/formatter/seventv-chat-message-formatter.ts";
import TwitchChatMessageFormatter from "modules/twitch/chat-listener/formatter/twitch-chat-message-formatter.ts";

export default class ChatListenerModule extends Module {
	private formatter = {} as ChatMessageFormatter;
	private observer: MutationObserver | undefined;

	private type: "twitch" | "seventv" = "twitch";

	protected config(): ModuleConfig {
		return {
			name: "chat-listener",
			elements: [
				{
					selector: TWITCHTV_CHAT_SELECTOR,
					once: true,
				},
				{
					selector: SEVENTV_CHAT_SELECTOR,
					once: true,
				},
			],
			platform: "twitch",
		};
	}

	protected async run(event: ModuleEvent) {
		const elements = event.elements;
		if (elements.length > 1) this.logger.warn("Found multiple chat element");
		const element = elements[0];
		if (element.classList.contains(TWITCHTV_CHAT_SELECTOR.replace(".", ""))) {
			this.type = "twitch";
			this.formatter = new TwitchChatMessageFormatter();
		} else if (element.className.includes("seventv")) {
			this.type = "seventv";
			this.formatter = new SevenTVChatMessageFormatter();
		}
		this.logger.info(`Using ${this.type} chat message formatter`);
		this.createObserver(event.elements);
	}

	protected initialize() {}

	private createObserver(elements: Element[]) {
		this.observer?.disconnect();
		this.observer = new MutationObserver((list) => {
			for (const mutation of list) {
				if (mutation.type === "childList" && mutation.addedNodes) {
					for (const message of mutation.addedNodes) {
						if (this.utils.isElementAlreadyUsed(message as Element, this.id()))
							return;
						this.utils.markElementAsUsed(message as Element, this.id());
						// TODO Think about handling double-rendering self sent message
						const data =
							this.type === "twitch"
								? this.utils.twitch.getChatMessage(message)
								: {};
						const formattedMessage = this.formatter.format(message as Element, {
							...data,
							sentAt: Date.now(),
						});
						if (!formattedMessage) return;
						this.emitter.emit("chatMessage", formattedMessage);
						this.logger.info(formattedMessage);
					}
				}
			}
		});
		elements.forEach((element) =>
			this.observer?.observe(element, { attributes: true, childList: true }),
		);
	}
}
