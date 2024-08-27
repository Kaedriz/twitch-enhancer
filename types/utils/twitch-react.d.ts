import type { TwitchChatMessage } from "types/events/twitch/chat.events.d.ts";

export type ReactComponent<T> = {
	stateNode: T;
	pendingProps: any;
};

export type PersistentPlayerComponent = {
	props: { content: { type: "live"; channelLogin: string } };
};

export type ChatControllerMessage = {
	id: number;
	type: number;
	msgid: number;
	message: string;
	channel: string;
};

export type ChatControllerComponent = {
	pushMessage: (message: ChatControllerMessage) => void;
	props: {
		channelLogin: string;
		messageHandlerAPI: {
			addMessageHandler: (
				callback: (message: TwitchChatMessage) => void,
			) => void;
		};
	};
};

export interface TwitchChatMessageComponent {
	props: {
		channelLogin: string;
		channelID: string;
		message: {
			badges: Record<string, string>;
			id: string;
			message: string;
			user: {
				color: string;
				id: string;
				displayName: string;
				login: string;
			};
		};
	};
}
