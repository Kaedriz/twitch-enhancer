import type { TwitchEvents } from "$types/platforms/twitch/twitch.events.types.ts";
import type { ModuleConfig } from "$types/shared/module.types.ts";
import TwitchModule from "../../twitch.module.ts";

export default class ChatCopyEmoteModule extends TwitchModule {
	readonly config: ModuleConfig<TwitchEvents> = {
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

	private handleMessage({ element }: { element: Element }) {
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
