import type { CommonEvents } from "$types/platforms/common.events.ts";
import type { TwitchSettingsEvents } from "$types/platforms/kick/kick.settings.types.ts";

export type KickEvents = {
	"kick:chatMessage": (message: KickChatMessageEvent) => void | Promise<void>;
} & TwitchSettingsEvents &
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
	messageData: KickChatMessageData;
	element: Element;
};
