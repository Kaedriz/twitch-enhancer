import KickModule from "$kick/kick.module.ts";
import type { KickChatMessage } from "$types/platforms/kick/kick.utils.types.ts";
import type { KickModuleConfig } from "$types/shared/module/module.types.ts";

interface ChatMessageElements {
	username: string;
	message: string;
	timestamp: string;
	element: Element;
}

export default class ChatModule extends KickModule {
	readonly config: KickModuleConfig = {
		name: "chat",
		appliers: [
			{
				type: "selector",
				selectors: ["#channel-chatroom"],
				callback: this.run.bind(this),
				key: "chat",
				once: true,
			},
		],
	};

	private observer?: MutationObserver;

	private extractMessageData(element: Element): ChatMessageElements | null {
		const username = element.querySelector("button[title]")?.getAttribute("title")?.trim();
		const message = element.querySelector("span.font-normal")?.textContent?.trim();
		const timestamp = element.querySelector("span.text-neutral")?.textContent?.trim();

		if (!username || !message || !timestamp) {
			this.logger.warn("Incomplete chat message data", { username, message, timestamp });
			return null;
		}

		return { username, message, timestamp, element };
	}

	private processMessage(element: Element): void {
		try {
			const messageData = this.extractMessageData(element);
			if (!messageData) return;

			const messageObj = messageData as unknown as KickChatMessage;
			this.emitter.emit("kick:chatMessage", messageObj);
		} catch (err) {
			this.logger.error("Failed to parse chat message", err);
		}
	}

	private setupMessageObserver(chatRoom: Element): void {
		this.observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (node instanceof HTMLElement && node.matches("div[data-index]")) {
						this.processMessage(node);
					}
				}
			}
		});

		this.observer.observe(chatRoom, { childList: true, subtree: true });
		this.logger.debug("Chat observer started");
	}

	private async run([chatRoom]: Element[]): Promise<void> {
		const messages = chatRoom.querySelectorAll("div[data-index]");
		messages.forEach(this.processMessage.bind(this));
		this.setupMessageObserver(chatRoom);
	}

	public unload(): void {
		if (this.observer) {
			this.observer.disconnect();
			this.logger.debug("Chat observer disconnected");
		}
	}
}
