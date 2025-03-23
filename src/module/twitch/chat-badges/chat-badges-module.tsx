import Module from "module/core/module.ts";
import { render } from "preact";
import styled from "styled-components";
import type { TwitchChatMessageEvent } from "types/event/twitch-events.types.ts";
import type { ModuleConfig } from "types/module/module.types.ts";

export default class ChatBadgesModule extends Module {
	private TEST_BADGES = [
		{
			username: "igor_ovh",
			source: "https://utfs.io/f/9ee8b55a-a7e0-4eed-9f17-11e7a4e80619-kpkf64.png",
		},
		{
			username: "czestereq1669",
			source: "https://utfs.io/f/9ee8b55a-a7e0-4eed-9f17-11e7a4e80619-kpkf64.png",
		},
		{
			username: "h2p_zupaaaa_sigma_rizzler",
			source: "https://utfs.io/f/9ee8b55a-a7e0-4eed-9f17-11e7a4e80619-kpkf64.png",
		},
	];

	config: ModuleConfig = {
		name: "example-module",
		appliers: [
			{
				type: "event",
				key: "chatBadges",
				event: "twitch:chatMessage",
				callback: this.handleMessage.bind(this),
			},
		],
	};

	private handleMessage({ message, element }: TwitchChatMessageEvent) {
		const badge = this.TEST_BADGES.find((badge) => badge.username === message.user.userLogin);
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

		render(<Badge sourceUrl={badge.source} name={"Test"} />, badgeWrapper);
		//render(<Tooltip text={"skibidi test"} />, badgeWrapper);

		if (badgeList.children.length < 1) badgeList.appendChild(badgeWrapper);
		else badgeList.insertBefore(badgeWrapper, badgeList.firstChild);
	}
}

interface BadgeComponentProps {
	name: string;
	sourceUrl: string;
}

const Icon = styled.img`
	width: 18px;
	height: 18px;
`;

function Badge({ name, sourceUrl }: BadgeComponentProps) {
	return <Icon src={sourceUrl} alt={name} />;
}
