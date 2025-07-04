export type ChannelInfo = {
	slug: string;
	channelId: number;
};

export type ChannelChatRoomInfo = {
	slug: string;
};

export type ChannelChatRoom = {
	isPaused: boolean;
	setIsPaused: (paused: boolean) => void;
};
