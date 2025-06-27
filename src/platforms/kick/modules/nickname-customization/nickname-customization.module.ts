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
		const userCustom = this.enhancerApi().findUserNicknameForCurrentChannel(messageData.sender.id.toString());
		if (!userCustom) return;

		if (this.kickUtils().isNTVInstalled()) {
			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if (userCustom.hasGlow) {
						if (mutation.target instanceof HTMLElement && mutation.target.matches(".ntv__chat-message__username")) {
							this.applyGlowEffect(mutation.target, messageData);
						}

						mutation.addedNodes.forEach((node) => {
							if (node instanceof HTMLElement) {
								const usernameElements = node.querySelectorAll<HTMLElement>(".ntv__chat-message__username");
								usernameElements.forEach((usernameElement) => {
									this.applyGlowEffect(usernameElement, messageData);
								});
							}
						});
					}
				});
			});

			observer.observe(element, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeOldValue: true,
				characterData: true,
				characterDataOldValue: true,
			});

			(element as any)._nicknameObserver = observer;
		}

		const usernameElements: HTMLElement[] = Array.from(
			element.querySelectorAll<HTMLElement>(`[title='${messageData.sender.slug}'], .ntv__chat-message__username`),
		);

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
