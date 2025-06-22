import KickModule from "$kick/kick.module.ts";
import { KickChatMessage, type KickChatMessageEvent } from "$types/platforms/kick/kick.events.types.ts";
import type { KickModuleConfig } from "$types/shared/module/module.types.ts";

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

	private getMessageData(element: Element): KickChatMessageEvent | null {
		const messageData = this.kickUtils().getMessageData(element);
		if (!messageData) return null;
		return {
			messageData: messageData,
			element: element,
		};
	}

	private processMessage(element: Element): void {
		try {
			const messageData = this.getMessageData(element);
			if (!messageData) return;
			this.emitter.emit("kick:chatMessage", messageData);
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
