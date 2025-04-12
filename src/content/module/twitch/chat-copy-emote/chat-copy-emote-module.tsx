import Module from "module/module.ts";
import type { TwitchChatMessageEvent } from "types/content/event/twitch-events.types.ts";
import type { ModuleConfig } from "types/content/module/module.types.ts";

export default class ChatCopyEmoteModule extends Module {
	config: ModuleConfig = {
		name: "chat-copy-emote",
		appliers: [
			{
				type: "event",
				key: "chat-copy-emote",
				event: "twitch:chatMessage",
				callback: this.handleMessage.bind(this),
			},
		],
	};

	private handleMessage({ element }: TwitchChatMessageEvent) {
		const emotes = element.querySelectorAll(".seventv-chat-emote, .chat-line__message--emote");
		if (emotes.length < 1) return;

		emotes.forEach((emote) => {
			emote.addEventListener("contextmenu", (event) => {
				event.preventDefault();
				const altValue = emote.getAttribute("alt");
				if (altValue) {
					const name = altValue.replace(/ /g, "");
					this.twitchUtils().addTextToChatInput(name);
				}
			});
		});
	}
}
