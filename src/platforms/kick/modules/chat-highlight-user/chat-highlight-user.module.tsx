import KickModule from "$kick/kick.module.ts";
import type { KickChatMessageEvent } from "$types/platforms/kick/kick.events.types.ts";
import type { KickModuleConfig } from "$types/shared/module/module.types.ts";

export default class ChatHighlightUserModule extends KickModule {
	private highlightedUsers = new Map<string, string>();
	private colorIndex = 0;
	private readonly colors = [
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

	async initialize(): Promise<void> {
		this.commonUtils().createGlobalStyle(`
			.enhancer-highlighted-user-message { 
				background-color: #444 !important; 
			}
		`);
	}

	private handleMessage({ message, element }: KickChatMessageEvent) {
		const mentionRegex = /@(\w+)/g;
		const matches = [...message.content.matchAll(mentionRegex)];
		if (matches.length === 0) return;

		const mentionedUsernames = matches.map((match) => match[1].toLowerCase());
		this.logger.debug(`Highlighting ${mentionedUsernames.length} users: ${mentionedUsernames.join(", ")}`);

		const messageElement = element as HTMLElement;
		messageElement.addEventListener("mouseenter", () => this.highlightUserMentions(mentionedUsernames));
		messageElement.addEventListener("mouseleave", this.removeHighlightedUserMentions.bind(this));
	}

	private highlightUserMentions(usernames: string[]): void {
		this.logger.debug(`Highlighting ${usernames.length} users: ${usernames.join(", ")}`);

		usernames.forEach((username) => {
			if (!this.highlightedUsers.has(username)) {
				const color = this.colors[this.colorIndex % this.colors.length];
				this.highlightedUsers.set(username, color);
				this.colorIndex++;

				this.commonUtils().createGlobalStyle(`
					.enhancer-highlighted-user-${username.replace(/[^a-zA-Z0-9]/g, "")} { 
						background-color: ${color} !important; 
					}
				`);
			}
		});

		const chatMessages = document.querySelectorAll(".ntv__chat-message, div[data-index]");
		chatMessages.forEach((messageElement) => {
			const authorElement =
				messageElement.querySelector(".ntv__chat-message__username") || messageElement.querySelector("button[title]");
			if (!authorElement) return;

			const authorName = authorElement.textContent?.toLowerCase() || "";
			const title = (authorElement as HTMLElement).title?.toLowerCase() || "";
			const username = authorName || title;

			if (usernames.includes(username)) {
				const color = this.highlightedUsers.get(username);
				if (color) {
					const safeUsername = username.replace(/[^a-zA-Z0-9]/g, "");
					messageElement.classList.add(`enhancer-highlighted-user-${safeUsername}`);
				}
			}
		});
	}

	private removeHighlightedUserMentions(): void {
		this.logger.debug("Removing highlighted messages");

		this.highlightedUsers.forEach((color, username) => {
			const safeUsername = username.replace(/[^a-zA-Z0-9]/g, "");
			document
				.querySelectorAll(`.enhancer-highlighted-user-${safeUsername}`)
				.forEach((message) => message.classList.remove(`enhancer-highlighted-user-${safeUsername}`));
		});

		this.highlightedUsers.clear();
		this.colorIndex = 0;
	}
}
