export type getChannelSectionInfoComponent = {
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
