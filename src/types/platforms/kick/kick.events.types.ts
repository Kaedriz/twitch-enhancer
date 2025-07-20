import type { MessageMenuEvent } from "$shared/components/message-menu/message-menu.component.tsx";
import type { CommonEvents } from "$types/platforms/common.events.ts";
import type { KickSettingsEvents } from "$types/platforms/kick/kick.settings.types.ts";
import type { ChatMessagePopupEvent } from "$types/platforms/twitch/twitch.events.types.ts";

export type KickEvents = {
	"kick:chatMessage": (message: KickChatMessageEvent) => void | Promise<void>;
	"kick:chatPopupMessage": (message: ChatMessagePopupEvent) => void | Promise<void>;
	"kick:messageMenu": (message: MessageMenuEvent) => void | Promise<void>;
} & KickSettingsEvents &
	CommonEvents;

export type KickChatMessage = {
	timestamp: number;
	message: string;
	user: string;
	element: Element;
};
export type KickChatMessageData = {
	id: string;
	chat_id: number;
	user_id: number;
	content: string;
	type: string;
	metadata: {
		message_ref: string;
	};
	created_at: string;
	sender: {
		id: number;
		slug: string;
		username: string;
		identity: {
			color: string;
			badges: Array<{
				type: string;
				text: string;
			}>;
		};
	};
};
export type KickChatMessageEvent = {
	message: KickChatMessageData;
	element: Element;
	isUsingNTV: boolean;
};
