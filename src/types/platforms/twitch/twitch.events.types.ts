import type { CommonEvents } from "$types/platforms/common.events.ts";
import type { ComponentChildren } from "preact";

export type TwitchEvents = {
	"twitch:chatInitialized": (channelId: string) => void | Promise<void>;
	"twitch:chatMessage": (message: TwitchChatMessageEvent) => void | Promise<void>;
	"twitch:chatPopupMessage": (message: TwitchChatMessagePopup) => void | Promise<void>;
} & CommonEvents;

export type TwitchChatMessage = {
	badges: Record<string, string>;
	id: string;
	nonce: string;
	user: TwitchChatMessageUser;
	isVip: boolean | undefined;
	isFirstMsg: boolean | undefined;
	isHistorical: boolean | undefined;
	message: string;
	timestamp: number;
	type: number;
	createdAt: number;
};

export type TwitchChatMessageUser = {
	userID: string;
	userDisplayName: string;
	userLogin: string;
	color: string;
	isSubscriber: boolean;
};

export type ChatType = "TWITCH" | "7TV";

export type TwitchChatMessageEvent = {
	message: TwitchChatMessage;
	element: Element;
	type: ChatType;
};

export type TwitchChatMessagePopup = {
	title: string;
	content: ComponentChildren;
	autoclose?: number;
	onClose?: () => void;
};
