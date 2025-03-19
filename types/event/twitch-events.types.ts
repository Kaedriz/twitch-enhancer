export type TwitchEvents = {
	"twitch:chatMessage": (message: TwitchChatMessageEvent) => void;
};

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
