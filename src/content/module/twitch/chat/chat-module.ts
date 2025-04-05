import type { ChatType } from "types/content/event/twitch-events.types.ts";
import type { ModuleConfig } from "types/content/module/module.types.ts";
import type { QueueValue } from "types/shared/queue/queue.types.ts";
import type { TwitchChatMessage } from "types/content/utils/twitch-utils.types.ts";
import QueueFactory from "../../../../shared/queue/queue-factory.ts";
import Module from "../../module.ts";
import type ChatMessageListener from "./listener/chat-message-listener.ts";
import SevenTVChatMessageListener from "./listener/seventv-chat-message-listener.ts";
import TwitchChatMessageListener from "./listener/twitch-chat-message-listener.ts";

export default class ChatModule extends Module {
	static readonly TWITCHTV_CHAT_SELECTOR = ".chat-scrollable-area__message-container";
	static readonly SEVENTV_CHAT_SELECTOR = "main.seventv-chat-list";
	static readonly VALID_MESSAGES_TYPES = [0]; // 51 is rerendered self message

	private listener = {} as ChatMessageListener;
	private observer: MutationObserver | undefined;
	private readonly queue = new QueueFactory<TwitchChatMessage & QueueValue>().create({ expire: 300 });
	private type: ChatType = "TWITCH";

	config: ModuleConfig = {
		name: "example-module",
		appliers: [
			{
				type: "selector",
				key: "chat",
				selectors: [ChatModule.TWITCHTV_CHAT_SELECTOR, ChatModule.SEVENTV_CHAT_SELECTOR],
				callback: this.run.bind(this),
				once: true,
			},
		],
	};

	private run(elements: Element[]) {
		if (elements.length > 1) this.logger.warn("Found multiple chat element");
		const element = elements[0];
		if (element.classList.contains(ChatModule.TWITCHTV_CHAT_SELECTOR.replace(".", ""))) {
			this.type = "TWITCH";
			this.listener = new TwitchChatMessageListener(this.logger, this.utilsRepository);
		} else if (element.className.includes("seventv")) {
			this.type = "7TV";
			this.listener = new SevenTVChatMessageListener(this.logger, this.utilsRepository);
		}
		this.listener.emitter.on("inject", () => this.logger.info(`Injected ${this.type} chat module`));
		this.listener.emitter.on("message", (message) => this.handleMessage(message));
		this.listener.inject();
		this.createObserver(elements);

		setTimeout(() => {
			const channelId = this.utilsRepository.twitchUtils.getChatController()?.props.channelID;
			if (!channelId) throw new Error("Missing channelId");
			this.eventEmitter.emit("twitch:chatInitialized", channelId);
			// TODO Some better idea, maybe function waitFor?
		}, 1000);
	}

	private createObserver(elements: Element[]) {
		this.observer?.disconnect();
		this.observer = new MutationObserver(async (list) => {
			for (const mutation of list) {
				if (mutation.type === "childList" && mutation.addedNodes) {
					for (const node of mutation.addedNodes) {
						const element = node as Element;
						const seventvId = element.getAttribute("msg-id");
						const messageProps = this.utilsRepository.twitchUtils.getChatMessage(element.children[0])?.props;
						const id = seventvId ?? messageProps?.message.id;
						if (!id) return;

						let message = this.queue.getAndRemove(id);
						if (messageProps?.message.nonce && !message) message = this.queue.getAndRemove(messageProps?.message.nonce); // Handling rerenderig messages

						if (!message) return;
						this.eventEmitter.emit("twitch:chatMessage", {
							element,
							message,
							type: this.type,
						});
					}
				}
			}
		});
		elements.forEach((element) => this.observer?.observe(element, { attributes: true, childList: true }));
	}

	private async handleMessage(message: TwitchChatMessage) {
		if (!ChatModule.VALID_MESSAGES_TYPES.includes(message.type)) return;
		const id = message.id;
		this.queue.addByValue({
			...message,
			queueKey: id,
		});
		if (!this.utilsRepository.commonUtils.isUUID(id) && this.type === "TWITCH") {
			this.logger.debug("Recieved self message, adding backup message with nonce:", message.nonce);
			this.queue.addByValue({
				...message,
				queueKey: message.nonce,
			});
		}
	}
}
