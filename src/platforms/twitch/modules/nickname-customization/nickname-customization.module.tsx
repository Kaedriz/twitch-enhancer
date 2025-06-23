import TwitchModule from "$twitch/twitch.module.ts";
import type { TwitchChatMessageEvent } from "$types/platforms/twitch/twitch.events.types.ts";
import type { TwitchModuleConfig } from "$types/shared/module/module.types.ts";
import { render } from "preact";
import styled, { css } from "styled-components";

export default class NicknameCustomizationModule extends TwitchModule {
	config: TwitchModuleConfig = {
		name: "nickname-customization",
		appliers: [
			{
				type: "event",
				key: "nickname-customization",
				event: "twitch:chatMessage",
				callback: this.handleMessage.bind(this),
			},
		],
	};

	private handleMessage({ message, element }: TwitchChatMessageEvent) {
		const usernameEl =
			(element.querySelector(".chat-author__display-name") as HTMLElement) ||
			(element.querySelector(".seventv-chat-user-username") as HTMLElement);
		if (!usernameEl) return;

		const userCustom = this.enhancerApi().findUserNicknameForCurrentChannel(message.user.userID);
		if (!userCustom) return;

		if (userCustom.customNickname) {
			usernameEl.textContent = userCustom.customNickname;
		}

		if (userCustom.hasGlow) {
			const color =
				usernameEl.style.color ||
				(usernameEl.firstChild?.firstChild && (usernameEl.firstChild.firstChild as HTMLElement).style.color) ||
				"" ||
				message.user.color ||
				"white";
			usernameEl.style.textShadow = `${color} 0 0 10px`;
			usernameEl.style.color = color;
			usernameEl.style.fontWeight = "bold";
		}
	}
}
