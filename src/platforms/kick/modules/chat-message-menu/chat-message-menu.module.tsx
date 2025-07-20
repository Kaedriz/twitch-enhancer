import KickModule from "$kick/kick.module.ts";
import type { MessageMenuOption } from "$shared/components/message-menu/message-menu.component.tsx";
import type { KickChatMessageData, KickChatMessageEvent } from "$types/platforms/kick/kick.events.types.ts";
import type { KickModuleConfig } from "$types/shared/module/module.types.ts";

export default class ChatMessageMenuModule extends KickModule {
	readonly config: KickModuleConfig = {
		name: "chat-chat-message-menu",
		appliers: [
			{
				type: "event",
				key: "chat-chat-message-menu",
				event: "kick:chatMessage",
				callback: this.handleMessage.bind(this),
			},
		],
		isModuleEnabledCallback: () => this.settingsService().getSettingsKey("chatMessageMenuEnabled"),
	};

	private async handleMessage({ message, element }: KickChatMessageEvent) {
		if (!(await this.isModuleEnabled())) return;
		(element as HTMLElement).addEventListener("contextmenu", (e) => {
			e.preventDefault();
			this.emitter.emit("kick:messageMenu", {
				options: this.getOptions(message),
				x: e.x,
				y: e.y,
			});
		});
	}

	private getOptions(message: KickChatMessageData): MessageMenuOption[] {
		return [
			{
				key: "copy-message-to-text-area",
				label: "Copy message to text area",
				onClick: () => this.kickUtils().setChatInputContent(message.content, true),
			},
			{
				key: "copy-username-to-text-area",
				label: "Copy username to text area",
				onClick: () => this.kickUtils().setChatInputContent(`@${message.sender.slug}`, true),
			},
		];
	}
}
