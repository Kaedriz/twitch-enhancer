import KickModule from "$kick/kick.module.ts";
import type { KickChatMessageEvent } from "$types/platforms/kick/kick.events.types.ts";
import type { KickModuleConfig } from "$types/shared/module/module.types.ts";
import { render } from "preact";
import styled from "styled-components";

export default class ChatBadgesModule extends KickModule {
	config: KickModuleConfig = {
		name: "chat-badges",
		appliers: [
			{
				type: "event",
				key: "chat-badges",
				event: "kick:chatMessage",
				callback: this.handleMessage.bind(this),
			},
			{
				type: "event",
				key: "settings-chat-images-enabled",
				event: "kick:settings:chatBadgesEnabled",
				callback: (enabled) => {
					this.isModuleEnabled = enabled;
				},
			},
		],
		isModuleEnabledCallback: () => this.settingsService().getSettingsKey("chatBadgesEnabled"),
	};

	private handleMessage({ message, element, isUsingNTV }: KickChatMessageEvent) {
		if (!this.isModuleEnabled) return;
		const userBadges = this.enhancerApi().findUserBadgesForCurrentChannel(message.sender.id.toString());
		if (!userBadges?.length) return;

		const badgesContainer = isUsingNTV
			? element.querySelector(".ntv__chat-message__badges")
			: element.querySelector(`button[title="${message.sender.username}"]`)?.parentElement;
		if (!badgesContainer) return;

		for (const badge of userBadges) {
			const badgeWrapper = document.createElement("div");
			badgeWrapper.classList.add("enhancer-badges");
			badgeWrapper.style.marginRight = ".25em";
			badgeWrapper.style.marginLeft = ".25em";
			badgeWrapper.style.alignSelf = "center";
			// TODO Make it Preact component?

			render(<Badge sourceUrl={badge.sources["4x"]} name={badge.name} />, badgeWrapper);

			badgesContainer.insertBefore(badgeWrapper, badgesContainer.firstChild);
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
`;

function Badge({ name, sourceUrl }: BadgeComponentProps) {
	return <Icon src={sourceUrl} alt={name} />;
}
