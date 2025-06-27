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

	private handleMessage({ messageData, element, isNipahTv }: KickChatMessageEvent) {
		const userCustom = this.enhancerApi().findUserNicknameForCurrentChannel(messageData.sender.id.toString());
		if (!userCustom) return;

		const usernameElements: HTMLElement[] = isNipahTv
			? Array.from(element.querySelectorAll<HTMLElement>(".ntv__chat-message__username"))
			: Array.from(element.querySelectorAll<HTMLElement>(`[title='${messageData.sender.slug}']`));

		if (usernameElements.length === 0) return;

		usernameElements.forEach((usernameElement) => {
			if (userCustom.customNickname) {
				usernameElement.innerText = userCustom.customNickname;
			}

			if (userCustom.hasGlow) {
				this.applyGlowEffect(usernameElement, messageData);
			}
		});
	}

	private applyGlowEffect(usernameElement: HTMLElement, messageData: any) {
		const color =
			usernameElement.style.color ||
			(usernameElement.firstChild?.firstChild && (usernameElement.firstChild.firstChild as HTMLElement).style.color) ||
			messageData.sender.identity.color ||
			"white";

		usernameElement.style.textShadow = `${color} 0 0 10px`;
		usernameElement.style.color = color;
		usernameElement.style.fontWeight = "bold";
	}
}
