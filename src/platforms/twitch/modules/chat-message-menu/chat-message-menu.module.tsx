import type { MessageMenuOption } from "$shared/components/message-menu/message-menu.component.tsx";
import type { TwitchChatMessage, TwitchChatMessageEvent } from "$types/platforms/twitch/twitch.events.types.ts";
import type { TwitchModuleConfig } from "$types/shared/module/module.types.ts";
import TwitchModule from "../../twitch.module.ts";

export default class ChatMessageMenuModule extends TwitchModule {
	readonly config: TwitchModuleConfig = {
		name: "chat-chat-message-menu",
		appliers: [
			{
				type: "event",
				key: "chat-chat-message-menu",
				event: "twitch:chatMessage",
				callback: this.handleMessage.bind(this),
			},
		],
		isModuleEnabledCallback: () => this.settingsService().getSettingsKey("chatMessageMenuEnabled"),
	};

	private static readonly BLOCKED_TAGS = ["a", "img"];

	private async handleMessage({ message, element: _element }: TwitchChatMessageEvent) {
		if (!(await this.isModuleEnabled())) return;
		const element = _element as HTMLElement;
		element.addEventListener("contextmenu", async (event) => {
			if (window.getSelection()?.toString()) return;
			const tag = (event.target as HTMLElement | null)?.tagName.toLowerCase();
			if (ChatMessageMenuModule.BLOCKED_TAGS.includes(tag || "")) return;
			event.preventDefault();
			this.emitter.emit("twitch:messageMenu", {
				options: this.getOptions(message),
				x: event.x,
				y: event.y,
			});
		});
	}

	private getOptions(message: TwitchChatMessage): MessageMenuOption[] {
		const text = message.message ?? message.messageBody;
		return [
			{
				key: "copy-message-to-text-area",
				label: "Copy message to text area",
				onClick: () => {
					if (!text) return;
					this.twitchUtils().setChatText(text, true);
				},
			},
			{
				key: "copy-username-to-text-area",
				label: "Copy username to text area",
				onClick: () => this.twitchUtils().setChatText(`@${message.user.userDisplayName}`, true),
			},
		];
	}
}
