import type { ChatType, TwitchChatMessage } from "events/twitch/chat.ts";
import Module from "module/module.ts";
import type { ModuleConfig, ModuleEvent } from "module/types.ts";
import {
	SEVENTV_CHAT_SELECTOR,
	TWITCHTV_CHAT_SELECTOR,
} from "modules/twitch/chat-listener/chat.constatns.ts";
import type ChatMessageListener from "modules/twitch/chat-listener/listener/chat-message-listener.ts";
import SevenTVChatMessageListener from "modules/twitch/chat-listener/listener/seventv.chat-message-listener.ts";
import TwitchChatMessageListener from "modules/twitch/chat-listener/listener/twitch.chat-message-listener.ts";
import type { QueueValue } from "utils/queue/types.ts";

export default class ChatListenerModule extends Module {
	private listener = {} as ChatMessageListener;
	private observer: MutationObserver | undefined;
	private queue = this.utils.createQueue<TwitchChatMessage & QueueValue>({
		expire: 300,
	});
	private elementsQueue = this.utils.createQueue<
		{ element: Element } & QueueValue
	>({
		expire: 10,
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
						const uuid = crypto.randomUUID();
						const element = node as Element;
						this.elementsQueue.addByValue({
							element,
							queueKey: uuid,
							createdAt: Date.now(),
						});
						this.callMessages();
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
		let queueMessage = message;
		const isIdUuid = message.id.includes("-");
		const key = isIdUuid ? message.id : message.nonce;
		if (isIdUuid && this.queue.contains(message.nonce)) {
			// biome-ignore lint/style/noNonNullAssertion: Checking it above
			queueMessage = { ...this.queue.getAndRemove(message.nonce)!, id: key };
		}
		this.queue.addByValue({
			...queueMessage,
			queueKey: key,
			createdAt: Date.now(),
		});

		if (isIdUuid) this.callMessages();
	}

	private callMessages(retry = 0) {
		for (const value of this.elementsQueue.values()) {
			const element = value.element;
			const seventvId = element.getAttribute("msg-id");
			if (seventvId && !seventvId.includes("-") && retry < 5) {
				setTimeout(() => this.callMessages(retry + 1), 5);
				return;
			}
			const id =
				seventvId ??
				this.utils.twitch.getChatMessage(element)?.props.message.id;
			if (id && this.queue.contains(id)) {
				this.emitter.emit("chatMessage", {
					element,
					// biome-ignore lint/style/noNonNullAssertion: Checking it above
					message: this.queue.getAndRemove(id)!,
					type: this.type,
				});
				this.elementsQueue.remove(value.queueKey);
			}
		}
	}
}
