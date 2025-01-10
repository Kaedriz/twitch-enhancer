import Module from "module/module.ts";
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

	static readonly VALID_MESSAGES_TYPES = [0]; // 51 is rerendered self message
	static readonly TWITCHTV_CHAT_SELECTOR =
		".chat-scrollable-area__message-container";
	static readonly SEVENTV_CHAT_SELECTOR = "main.seventv-chat-list";

	protected config(): ModuleConfig {
		return {
			name: "chat-listener",
			elements: [
				{
					selector: ChatListenerModule.TWITCHTV_CHAT_SELECTOR,
					once: true,
				},
				{
					selector: ChatListenerModule.SEVENTV_CHAT_SELECTOR,
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
		if (
			element.classList.contains(
				ChatListenerModule.TWITCHTV_CHAT_SELECTOR.replace(".", ""),
			)
		) {
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
		this.observer = new MutationObserver(async (list) => {
			for (const mutation of list) {
				if (mutation.type === "childList" && mutation.addedNodes) {
					for (const node of mutation.addedNodes) {
						const element = node as Element;
						const seventvId = element.getAttribute("msg-id");
						const messageProps = this.utils.twitch.getChatMessage(
							element.children[0],
						)?.props;
						const id = seventvId ?? messageProps?.message.id;
						if (!id) return;

						let message = this.queue.getAndRemove(id);
						if (messageProps?.message.nonce && !message)
							message = this.queue.getAndRemove(messageProps?.message.nonce); // Handling rerenderig messages

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
		if (!ChatListenerModule.VALID_MESSAGES_TYPES.includes(message.type)) return;
		const id = message.id;
		this.queue.addByValue({
			...message,
			queueKey: id,
		});
		if (!this.utils.isUUID(id) && this.type === "TWITCH") {
			this.logger.debug(
				"Recieved self message, adding backup message as nonce:",
				message.nonce,
			);
			this.queue.addByValue({
				...message,
				queueKey: message.nonce,
			});
		}
	}
}
