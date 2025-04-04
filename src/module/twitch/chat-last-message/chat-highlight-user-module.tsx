import Module from "module/core/module.ts";
import type { TwitchChatMessageEvent } from "types/event/twitch-events.types.ts";
import type { ModuleConfig } from "types/module/module.types.ts";

export default class ChatHighlightUserModule extends Module {
	config: ModuleConfig = {
		name: "chat-highlight-user",
		appliers: [
			{
				type: "event",
				key: "chatHighlightUser",
				event: "twitch:chatMessage",
				callback: this.handleMessage.bind(this),
			},
		],
	};

	async init(): Promise<void> {
		this.utilsRepository.commonUtils.createGlobalStyle(
			".enhancer-highlighted-user-message { background-color: #444 !important; }",
		);
	}

	private handleMessage({ element }: TwitchChatMessageEvent) {
		const mentions = [
			...Array.from(element.querySelectorAll(".chat-line__message-mention")),
			...Array.from(element.querySelectorAll(".mention-fragment")),
			...Array.from(element.querySelectorAll(".seventv-chat-message-body .mention-token")),
		].filter((mention) => !mention.hasAttribute("enhancer-mention-user"));
		if (mentions.length < 1) return;

		for (const mention of mentions) {
			const mentionElement = mention as HTMLElement;
			this.logger.debug("xd", mentionElement);
			const username = mentionElement.textContent?.replace("@", "").toLowerCase() || "";
			mentionElement.setAttribute("enhancer-mention-user", username);
			mentionElement.addEventListener("mouseover", this.hoverMention.bind(this));
			mentionElement.addEventListener("mouseout", this.unHoverMention.bind(this));
		}
	}

	private hoverMention(event: MouseEvent): void {
		const target = event.target as HTMLElement;
		this.logger.debug("xd2", event.target);
		const username =
			target.getAttribute("enhancer-mention-user") ?? target.parentElement?.getAttribute("enhancer-mention-user"); // why the fuck 7tv needs parentElement here?
		if (!username) return;
		this.logger.debug(`Highlighting ${username} messages`);

		[...document.querySelectorAll(".chat-line__message"), ...document.querySelectorAll(".seventv-message")].forEach(
			(messageElement) => {
				const authorElement =
					messageElement.querySelector(".chat-author__display-name") ??
					messageElement.querySelector(".seventv-chat-user-username");
				if (!authorElement) return;

				// todo still not working perfect on 7tv

				const authorName = authorElement.textContent?.toLowerCase() || "";
				if (authorName === username) {
					messageElement.classList.add("enhancer-highlighted-user-message");
				}
			},
		);
	}

	private unHoverMention(): void {
		this.logger.debug("Removing highlighted messages");
		document
			.querySelectorAll(".enhancer-highlighted-user-message")
			.forEach((message) => message.classList.remove("enhancer-highlighted-user-message"));
	}
}
