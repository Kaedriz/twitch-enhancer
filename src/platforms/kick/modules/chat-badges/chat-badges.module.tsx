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
		],
	};

	private handleMessage({ messageData, element }: KickChatMessageEvent) {
		const secondChild = element.firstElementChild?.firstElementChild;

		if (!secondChild || secondChild.children.length < 3) {
			return;
		}

		const userBadges = this.enhancerApi().findUserBadgesForCurrentChannel(messageData.sender.id.toString());

		if (!userBadges?.length) return;

		const children = secondChild.children;
		const targetElement = children[children.length - 3];

		for (const badge of userBadges) {
			const badgeWrapper = document.createElement("div");
			badgeWrapper.classList.add("enhancer-badges");
			badgeWrapper.style.marginRight = ".25em";
			badgeWrapper.style.marginLeft = ".25em";
			badgeWrapper.style.alignSelf = "center";

			render(<Badge sourceUrl={badge.sources["4x"]} name={badge.name} />, badgeWrapper);

			targetElement.insertBefore(badgeWrapper, targetElement.firstChild);
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
