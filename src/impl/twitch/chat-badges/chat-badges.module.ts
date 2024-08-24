import type { TwitchChatMessageEvent } from "events/twitch/chat.ts";
import Module from "module/module.ts";
import type { ModuleConfig } from "module/types.ts";

export default class ChatBadgesModule extends Module {
	private TEST_BADGES = [
		{
			username: "igor_ovh",
			source:
				"https://utfs.io/f/9ee8b55a-a7e0-4eed-9f17-11e7a4e80619-kpkf64.png",
		},
		{
			username: "h2p_zupaaaa_sigma_rizzler",
			source: "https://i.imgur.com/FiXTNS2.png",
		},
	];

	protected config(): ModuleConfig {
		return {
			name: "chat-badges",
			platform: "twitch",
		};
	}

	protected initialize() {
		this.emitter.on("chatMessage", (message) => this.handleMessage(message));
	}

	private handleMessage({ message, element }: TwitchChatMessageEvent) {
		const badge = this.TEST_BADGES.find(
			(badge) => badge.username === message.user.userLogin,
		);
		if (!badge) return;

		const badgeList =
			element.querySelector(".seventv-chat-user-badge-list") ||
			element.querySelector(".chat-line__username-container")?.children[0] ||
			element.querySelector(".chat-line__message--badges");
		if (!badgeList) return;

		const badgeWrapper = document.createElement("div");
		badgeWrapper.classList.add("enhancer-badges");
		badgeWrapper.style.marginRight = ".25em";
		badgeWrapper.style.verticalAlign = "baseline";
		badgeWrapper.style.display = "inline-block";

		const badgeImage = new Image();
		badgeWrapper.append(badgeImage);

		badgeImage.style.width = "18px";
		badgeImage.style.height = "18px";
		badgeImage.alt = "Test Badge";
		badgeImage.src = badge.source;

		if (badgeList.children.length < 1) badgeList.appendChild(badgeWrapper);
		else badgeList.insertBefore(badgeWrapper, badgeList.firstChild);
	}
}
