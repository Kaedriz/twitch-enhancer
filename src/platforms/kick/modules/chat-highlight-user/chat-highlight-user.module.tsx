import KickModule from "$kick/kick.module.ts";
import type { KickChatMessageEvent } from "$types/platforms/kick/kick.events.types.ts";
import type { KickModuleConfig } from "$types/shared/module/module.types.ts";

export default class ChatHighlightUserModule extends KickModule {
	static readonly HIGHLIGHT_COLORS = [
		"rgba(255, 107, 107, 0.1)",
		"rgba(78, 205, 196, 0.1)",
		"rgba(69, 183, 209, 0.1)",
		"rgba(150, 206, 180, 0.1)",
		"rgba(254, 202, 87, 0.1)",
		"rgba(255, 159, 243, 0.1)",
		"rgba(84, 160, 255, 0.1)",
		"rgba(95, 39, 205, 0.1)",
		"rgba(0, 210, 211, 0.1)",
		"rgba(255, 159, 67, 0.1)",
	];
	private currentColorIndex = 0;

	readonly config: KickModuleConfig = {
		name: "chat-highlight-user",
		appliers: [
			{
				type: "event",
				key: "chat-highlight-user",
				event: "kick:chatMessage",
				callback: this.handleMessage.bind(this),
			},
		],
	};

	private handleMessage({ message, element }: KickChatMessageEvent) {
		const mentionRegex = /@(\w+)/g;
		const mentions = [...message.content.matchAll(mentionRegex)];
		if (mentions.length === 0) return;

		const mentionedUsernames = mentions.map((match) => match[1].toLowerCase());
		this.logger.debug(`Highlighting ${mentionedUsernames.length} users: ${mentionedUsernames.join(", ")}`);

		const messageElement = element as HTMLElement;
		messageElement.addEventListener("mouseenter", () => this.highlightUserMentions(mentionedUsernames));
		messageElement.addEventListener("mouseleave", this.removeHighlightedUserMentions.bind(this));
	}

	private highlightUserMentions(usernames: string[]): void {
		const highlightedUsers = new Map<string, string>();
		usernames.forEach((username) => {
			if (!highlightedUsers.has(username)) {
				const color =
					ChatHighlightUserModule.HIGHLIGHT_COLORS[
						this.currentColorIndex % ChatHighlightUserModule.HIGHLIGHT_COLORS.length
					];
				highlightedUsers.set(username, color);
				this.currentColorIndex++;
			}
		});

		const chatMessages = document.querySelectorAll("#channel-chatroom .ntv__chat-message, div[data-index]");
		chatMessages.forEach((messageElement) => {
			const authorElement =
				messageElement.querySelector(".ntv__chat-message__username") || messageElement.querySelector("button[title]");
			if (!authorElement) return;

			const authorName = authorElement.textContent?.toLowerCase() || "";
			const title = (authorElement as HTMLElement).title?.toLowerCase() || "";
			const username = authorName || title;

			if (!usernames.includes(username)) return;
			const color = highlightedUsers.get(username);
			if (!color) return;
			(messageElement as HTMLElement).style.backgroundColor = color;
			messageElement.classList.add("enhancer-highlighted-user");
		});
	}

	private removeHighlightedUserMentions(): void {
		this.logger.debug("Removing highlighted messages");
		[...document.querySelectorAll(".enhancer-highlighted-user")].forEach((element) => {
			element.classList.remove("enhancer-highlighted-user");
			(element as HTMLElement).style.backgroundColor = "";
		});
		this.currentColorIndex = 0;
	}
}
