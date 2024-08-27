export type GQLResponse<T> = {
	data: T;
};

export type MediaPlayer = {
	core: { state: { liveLatency: number; ingestLatency: number } };
	seekTo: (time: number) => void;
	getPosition(): number;
};
