import QueueFactory from "$shared/queue/queue-factory.ts";
import type { TwitchEvents } from "$types/platforms/twitch/twitch.events.types.ts";
import type { TwitchChatMessage } from "$types/platforms/twitch/twitch.utils.types.ts";
import type { ModuleConfig } from "$types/shared/module.types.ts";
import type { QueueValue } from "$types/shared/queue/queue.types.ts";
import { createNanoEvents } from "nanoevents";
import TwitchModule from "../../twitch.module.ts";
import type ChatMessageListener from "./listener/chat-message-listener.ts";
import SevenTVChatMessageListener from "./listener/seventv-chat-message-listener.ts";
import TwitchChatMessageListener from "./listener/twitch-chat-message-listener.ts";

export default class ChatModule extends TwitchModule {
	static readonly TWITCHTV_CHAT_SELECTOR = ".chat-scrollable-area__message-container";
	static readonly SEVENTV_CHAT_SELECTOR = "main.seventv-chat-list";
	static readonly VALID_MESSAGE_TYPES = [0];
	static readonly LINK_MESSAGE_ID = 51;

	private listener = {} as ChatMessageListener;
	private observer: MutationObserver | undefined;
	private readonly queue = new QueueFactory<TwitchChatMessage & QueueValue>().create({ expire: 300 });
	private type: "TWITCH" | "7TV" = "TWITCH";

	readonly config: ModuleConfig<TwitchEvents> = {
		name: "chat",
		appliers: [
			{
				type: "selector",
				key: "chat",
				selectors: [ChatModule.TWITCHTV_CHAT_SELECTOR, ChatModule.SEVENTV_CHAT_SELECTOR],
				callback: this.run.bind(this),
				once: true,
			},
			{
				type: "event",
				key: "chat",
				event: "twitch:chatInitialized",
				callback: this.initializeChannel.bind(this),
			},
		],
	};

	private initializeChannel(channelId: string) {
		try {
			//TODO joinChannel should be called from enhancerApi, but it is not available in the content script
			//this.enhancerApi().state.joinChannel(channelId);
			this.logger.info(`Joined channel ${channelId}`);
		} catch (error) {
			this.logger.error("Failed to join channel", error);
		}
	}

	private run(elements: Element[]) {
		if (elements.length > 1) this.logger.warn("Found multiple chat elements");
		const element = elements[0];
		if (element.classList.contains(ChatModule.TWITCHTV_CHAT_SELECTOR.replace(".", ""))) {
			this.type = "TWITCH";
			this.listener = new TwitchChatMessageListener(this.logger, this.twitchUtils());
		} else if (element.className.includes("seventv")) {
			this.type = "7TV";
			this.listener = new SevenTVChatMessageListener(this.logger, this.twitchUtils());
		}
		this.listener.emitter.on("inject", () => this.logger.info(`Injected ${this.type} chat module`));
		this.listener.emitter.on("message", (message) => this.handleMessage(message));
		this.listener.inject();
		this.createObserver(elements);

		this.broadcastInitializeChannel();
	}

	async broadcastInitializeChannel() {
		await this.commonUtils()
			.waitFor<string>(
				() => {
					return this.twitchUtils().getChatController()?.props.channelID;
				},
				(channelId, attempt) => {
					this.emitter.emit("twitch:chatInitialized", channelId);
					this.logger.info(`Initialized chat (attempt: ${attempt})`);
				},
				{ delay: 100, maxRetries: 20 },
			)
			.catch(() => this.logger.warn("Failed to detect channelID for chat initialization after 20 attempts."));
	}

	private createObserver(elements: Element[]) {
		this.observer?.disconnect();
		this.observer = new MutationObserver(async (list) => {
			for (const mutation of list) {
				if (mutation.type === "childList" && mutation.addedNodes) {
					for (const node of mutation.addedNodes) {
						const element = node as Element;
						const seventvId = element.getAttribute("msg-id");
						const messageProps = this.twitchUtils().getChatMessage(element.children[0])?.props;
						const id = seventvId ?? messageProps?.message.id;
						if (!id) continue;
						let message = this.queue.getAndRemove(id);
						if (messageProps?.message.nonce && !message) message = this.queue.getAndRemove(messageProps?.message.nonce); // Handling re-rendering messages
						if (!message) continue;
						this.emitter.emit("twitch:chatMessage", {
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
		if (ChatModule.VALID_MESSAGE_TYPES.includes(message.type)) {
			this.queue.addByValue({
				...message,
				queueKey: message.id,
			});
			// Add backup message with nonce for paused chat in 7TV and re-rendering self messages in native chat
			this.queue.addByValue({
				...message,
				queueKey: message.nonce,
			});
		} else if (message.type === ChatModule.LINK_MESSAGE_ID) {
			const queueMessage = this.queue.getAndRemove(message.nonce);
			if (!queueMessage) return;
			this.queue.addByValue({
				...queueMessage,
				queueKey: message.id,
			});
		}
	}
}
