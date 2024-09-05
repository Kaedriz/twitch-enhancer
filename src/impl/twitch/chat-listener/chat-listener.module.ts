import Module from "module/module.ts";
import {
	SEVENTV_CHAT_SELECTOR,
	TWITCHTV_CHAT_SELECTOR,
} from "modules/twitch/chat-listener/chat.constatns.ts";
import type ChatMessageListener from "modules/twitch/chat-listener/listener/chat-message-listener.ts";
import SevenTVChatMessageListener from "modules/twitch/chat-listener/listener/seventv.chat-message-listener.ts";
import TwitchChatMessageListener from "modules/twitch/chat-listener/listener/twitch.chat-message-listener.ts";
import type {
	ChatType,
	TwitchChatMessage,
} from "types/events/twitch/chat.events.d.ts";
import type { TwitchEvents } from "types/events/twitch/events.d.ts";
import type { ModuleConfig, ModuleEvent } from "types/module/module.d.ts";
import type { TwitchLocalStorageMap } from "types/storage/twitch/local.storage.d.ts";
import type { QueueValue } from "types/utils/queue.d.ts";

export default class ChatListenerModule extends Module<
	TwitchEvents,
	TwitchLocalStorageMap
> {
	private listener = {} as ChatMessageListener;
	private observer: MutationObserver | undefined;
	private queue = this.utils.createQueue<TwitchChatMessage & QueueValue>({
		expire: 300,
	});
	private type: ChatType = "TWITCH";
	private readonly validMessagesTypes = [0, 51];

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
			this.type = "TWITCH";
			this.listener = new TwitchChatMessageListener(this.logger, this.utils);
		} else if (element.className.includes("seventv")) {
			this.type = "7TV";
			this.listener = new SevenTVChatMessageListener(this.logger, this.utils);
		}
		this.listener.emitter.on("inject", () =>
			this.logger.info(`Injected ${this.type} chat module`),
		);
		this.listener.emitter.on("message", (message) => {
			this.handleMessage(message);
		});
		this.listener.inject();
		this.createObserver(event.elements);
	}

	private createObserver(elements: Element[]) {
		this.observer?.disconnect();
		this.observer = new MutationObserver((list) => {
			for (const mutation of list) {
				if (mutation.type === "childList" && mutation.addedNodes) {
					for (const node of mutation.addedNodes) {
						const element = node as Element;

						const seventvId = element.getAttribute("msg-id");
						const id =
							seventvId ??
							this.utils.twitch.getChatMessage(element)?.props.message.id;
						if (!id) return;

						const message = this.queue.getAndRemove(id);
						if (!message) return;
						this.emitter.emit("chatMessage", {
							element,
							message,
							type: this.type,
						});
					}
				}
			}
		});
		elements.forEach((element) =>
			this.observer?.observe(element, { attributes: true, childList: true }),
		);
	}

	private async handleMessage(message: TwitchChatMessage) {
		if (!this.validMessagesTypes.includes(message.type)) return;
		this.queue.addByValue({
			...message,
			queueKey: message.id,
		});
	}
}
