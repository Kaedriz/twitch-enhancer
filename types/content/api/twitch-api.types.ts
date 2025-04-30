export type ChattersResponse = {
	channel: {
		chatters: {
			count: number;
		};
	};
};

export type VideoCreatedAtResponse = {
	video: {
		createdAt: string;
	};
};
