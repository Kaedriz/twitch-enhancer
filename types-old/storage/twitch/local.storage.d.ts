export type TwitchLocalStorageMap = {
	pinnedStreamers: PinnedStreamers;
};

type PinnedStreamers = {
	ids: string[];
};
