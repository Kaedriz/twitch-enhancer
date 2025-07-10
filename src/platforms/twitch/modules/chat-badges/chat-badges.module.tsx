import TwitchModule from "$twitch/twitch.module.ts";
import type { TwitchChatMessageEvent } from "$types/platforms/twitch/twitch.events.types.ts";
import type { TwitchModuleConfig } from "$types/shared/module/module.types.ts";
import { render } from "preact";
import styled from "styled-components";

export default class ChatBadgesModule extends TwitchModule {
	config: TwitchModuleConfig = {
		name: "chat-badges",
		appliers: [
			{
				type: "event",
				key: "chat-badges",
				event: "twitch:chatMessage",
				callback: this.handleMessage.bind(this),
			},
			{
				type: "event",
				key: "settings-chat-images-enabled",
				event: "twitch:settings:chatBadgesEnabled",
				callback: (enabled) => {
					this.isModuleEnabled = enabled;
				},
			},
		],
		isModuleEnabledCallback: () => this.settingsService().getSettingsKey("chatBadgesEnabled"),
	};

	private handleMessage({ message, element }: TwitchChatMessageEvent) {
		if (!this.isModuleEnabled) return;

		const badgeList =
			element.querySelector(".seventv-chat-user-badge-list") ||
			element.querySelector(".chat-line__username-container")?.children[0] ||
			element.querySelector(".chat-line__message--badges");
		if (!badgeList) return;

		const userBadges = this.enhancerApi().findUserBadgesForCurrentChannel(message.user.userID);
		if (!userBadges) return;

		for (const badge of userBadges) {
			const badgeWrapper = document.createElement("div");
			badgeWrapper.classList.add("enhancer-badges");
			badgeWrapper.style.marginRight = ".25em";
			badgeWrapper.style.verticalAlign = "baseline";
			badgeWrapper.style.display = "inline-block";
			// TODO Make it Preact component?

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
