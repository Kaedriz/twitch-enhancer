import KickModule from "$kick/kick.module.ts";
import type { KickChatMessageEvent } from "$types/platforms/kick/kick.events.types.ts";
import type { KickModuleConfig } from "$types/shared/module/module.types.ts";

export default class NicknameCustomizationModule extends KickModule {
	config: KickModuleConfig = {
		name: "nickname-customization",
		appliers: [
			{
				type: "event",
				key: "nickname-customization",
				event: "kick:chatMessage",
				callback: this.handleMessage.bind(this),
			},
		],
	};

	private handleMessage({ messageData, element }: KickChatMessageEvent) {
		const usernameEl =
			element.querySelector(`[title='${messageData.sender.slug}']`) ??
			(element.querySelector(".ntv__chat-message__username") as HTMLElement | null);
		if (!usernameEl) return;
		const usernameElement = usernameEl as HTMLElement;

		const userCustom = this.enhancerApi().findUserNicknameForCurrentChannel(messageData.sender.id.toString());
		if (!userCustom) return;

		if (userCustom.customNickname) {
			usernameElement.innerText = userCustom.customNickname;
		}

		if (userCustom.hasGlow) {
			const glowTarget = usernameElement;
			const color =
				glowTarget.style.color ||
				(glowTarget.firstChild?.firstChild && (glowTarget.firstChild.firstChild as HTMLElement).style.color) ||
				messageData.sender.identity.color ||
				"white";
			glowTarget.style.textShadow = `${color} 0 0 10px`;
			glowTarget.style.color = color;
			glowTarget.style.fontWeight = "bold";
		}
	}
}
