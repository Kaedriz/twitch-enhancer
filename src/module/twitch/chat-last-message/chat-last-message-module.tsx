import Module from "module/core/module.ts";
import type { TwitchChatMessageEvent } from "types/event/twitch-events.types.ts";
import type { ModuleConfig } from "types/module/module.types.ts";

export default class ChatLastMessageModule extends Module {
	config: ModuleConfig = {
		name: "chat-last-message",
		appliers: [
			{
				type: "event",
				key: "chatLastMessage",
				event: "twitch:chatMessage",
				callback: this.handleMessage.bind(this),
			},
		],
	};

	async init(): Promise<void> {
		this.utilsRepository.commonUtils.createGlobalStyle(
			".enhancer-mention-messages { background-color: #444 !important; }",
		);
	}

	private handleMessage({ message, element }: TwitchChatMessageEvent) {
		setTimeout(() => {
			const mentions = [
				...Array.from(element.querySelectorAll(".chat-line__message-mention")),
				...Array.from(element.querySelectorAll(".mention-fragment")),
				...Array.from(element.querySelectorAll(".seventv-mention")),
			];

			if (mentions.length < 1) return;

			for (const mention of mentions) {
				const mentionElement = mention as HTMLElement;
				const username = mentionElement.textContent?.replace("@", "").toLowerCase() || "";
				mentionElement.setAttribute("mention-user", username);
				mentionElement.addEventListener("mouseover", this.hoverMention.bind(this));
				mentionElement.addEventListener("mouseout", this.unHoverMention.bind(this));
			}
		}, 25);
	}

	private hoverMention(event: MouseEvent): void {
		const target = event.target as HTMLElement;
		const username = target.getAttribute("mention-user") || "";

		document.querySelectorAll(".chat-line__message").forEach((messageElement) => {
			const authorElement = messageElement.querySelector(".chat-author__display-name");
			if (!authorElement) return;

			const authorName = authorElement.textContent?.toLowerCase() || "";
			if (authorName === username) {
				messageElement.classList.add("enhancer-mention-messages");
			}
		});
	}

	private unHoverMention(): void {
		document
			.querySelectorAll(".enhancer-mention-messages")
			.forEach((message) => message.classList.remove("enhancer-mention-messages"));
	}
}
