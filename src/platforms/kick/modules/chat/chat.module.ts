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
	private nipahTvInstalled = false;

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
			if (this.kickUtils().isNTVInstalled()) {
				const messageData = this.getMessageData(element);
				if (!messageData) return;
				messageData.isNipahTv = true;
				setTimeout(() => {
					this.emitter.emit("kick:chatMessage", messageData);
				}, 30);
				return;
			}

			if (element.matches("div[data-index]")) {
				const messageData = this.getMessageData(element);
				if (!messageData) return;
				this.emitter.emit("kick:chatMessage", messageData);
			}
		} catch (err) {
			this.logger.error("Failed to parse chat message", err);
		}
	}

	private setupMessageObserver(chatRoom: Element): void {
		this.observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (node instanceof HTMLElement) {
						this.processMessage(node);
					}
				}
			}
		});

		this.observer.observe(chatRoom, { childList: true, subtree: true });
	}

	private async run([chatRoom]: Element[]): Promise<void> {
		this.nipahTvInstalled = this.kickUtils().isNTVInstalled();

		if (this.nipahTvInstalled) {
			const nipahMessages = chatRoom.querySelectorAll(".ntv__chat-message");
			nipahMessages.forEach(this.processMessage.bind(this));
		} else {
			const messages = chatRoom.querySelectorAll("div[data-index]");
			messages.forEach(this.processMessage.bind(this));
		}

		this.setupMessageObserver(chatRoom);
	}

	public unload(): void {
		if (this.observer) {
			this.observer.disconnect();
			this.logger.debug("Chat observer disconnected");
		}
	}
}
