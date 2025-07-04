export type ChannelInfo = {
	slug: string;
	channelId: number;
};

export type IsoDateProps = {
	isoDate: string;
};

export type VideoProgressProps = {
	durationInMs: number;
	currentProgressInMs: number;
	loadedInMs: number;
};

export type StreamStatusProps = {
	isLive: boolean;
	isPlaying: boolean;
};

export type ChannelChatRoomInfo = {
	slug: string;
};

export type ChannelChatRoom = {
	isPaused: boolean;
	setIsPaused: (paused: boolean) => void;
};
