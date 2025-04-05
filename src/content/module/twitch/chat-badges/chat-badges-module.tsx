import { render } from "preact";
import styled from "styled-components";
import type { TwitchChatMessageEvent } from "types/event/twitch-events.types.ts";
import type { ModuleConfig } from "types/module/module.types.ts";
import Module from "../../module.ts";

export default class ChatBadgesModule extends Module {
	config: ModuleConfig = {
		name: "example-module",
		appliers: [
			{
				type: "event",
				key: "chatBadges",
				event: "twitch:chatMessage",
				callback: this.handleMessage.bind(this),
			},
			{
				type: "event",
				key: "chatBadges",
				event: "twitch:chatInitialized",
				callback: this.initializeChannel.bind(this),
			},
		],
	};

	private initializeChannel(channelId: string) {
		this.apiRepository.enhancerApi.state.joinChannel(channelId);
	}

	private handleMessage({ message, element }: TwitchChatMessageEvent) {
		const badgeList =
			element.querySelector(".seventv-chat-user-badge-list") ||
			element.querySelector(".chat-line__username-container")?.children[0] ||
			element.querySelector(".chat-line__message--badges");
		if (!badgeList) return;

		const userBadges = this.apiRepository.enhancerApi.findUserBadgesForCurrentChannel(message.user.userID);
		if (!userBadges) return;

		for (const badge of userBadges) {
			const badgeWrapper = document.createElement("div");
			badgeWrapper.classList.add("enhancer-badges");
			badgeWrapper.style.marginRight = ".25em";
			badgeWrapper.style.verticalAlign = "baseline";
			badgeWrapper.style.display = "inline-block";

			// todo should it be 4x?
			render(<Badge sourceUrl={badge.sources["4x"]} name={badge.name} />, badgeWrapper);
			//render(<Tooltip text={"skibidi test"} />, badgeWrapper);

			if (badgeList.children.length < 1) badgeList.appendChild(badgeWrapper);
			else badgeList.insertBefore(badgeWrapper, badgeList.firstChild);
		}
	}
}

interface BadgeComponentProps {
	name: string;
	sourceUrl: string;
}

const Icon = styled.img`
	width: 18px;
	height: 18px;
	margin-top: 1px;
`;

function Badge({ name, sourceUrl }: BadgeComponentProps) {
	return <Icon src={sourceUrl} alt={name} />;
}
