// TODO Use it on kick also

export interface ChatMessage {
	id: string | number;
	content: string;
	channel?: string;
	channelId?: string | number;
	element: Element;
}

export interface UserChatMessage extends ChatMessage {
	username?: string;
	userId?: string | number;
	color?: string;
	badges?: Record<string, string>;
}
