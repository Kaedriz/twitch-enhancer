import KickModule from "$kick/kick.module.ts";
import { KickChatMessage, type KickChatMessageEvent } from "$types/platforms/kick/kick.events.types.ts";
import type { KickModuleConfig } from "$types/shared/module/module.types.ts";
import type { ChatRoomComponent } from "$types/platforms/kick/kick.utils.types.ts";

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

	private observer: MutationObserver | undefined;

	private async run([chatRoom]: Element[]): Promise<void> {
		// TODO Join channel on enhancerApi
		this.createObserver(chatRoom);
	}

	private getMessageData(element: Element): Omit<KickChatMessageEvent, "isUsingNTV"> | null {
		const messageData = this.kickUtils().getMessageData(element);
		if (!messageData) return null;
		return {
			message: messageData,
			element,
		};
	}

	private async handleMessage(element: Element) {
		// TODO When chat is paused everything is broken...
		if (this.isChatPaused()) return;
		try {
			const messageData = this.getMessageData(element);
			if (!messageData) return;
			if (!element.matches("div[data-index]")) return;
			await this.commonUtils().delay(15); // Have to leave this delay, because NTV rendering can be disabled via NTV options
			const isUsingNTV = this.kickUtils().isUsingNTV(element);
			this.emitter.emit("kick:chatMessage", { ...messageData, isUsingNTV });
			this.logger.debug("Sending message");
		} catch (err) {
			this.logger.error("Failed to parse chat message", err);
		}
	}

	private createObserver(chatRoom: Element): void {
		this.observer?.disconnect();
		this.observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of mutation.addedNodes) {
					if (node instanceof HTMLElement) {
						this.handleMessage(node);
					}
				}
			}
		});
		this.observer.observe(chatRoom, { childList: true, subtree: true });
	}

	private isChatPaused() {
		return this.kickUtils().getChatRoomComponent()?.isPaused;
	}
}
