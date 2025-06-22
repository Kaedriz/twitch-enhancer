export interface QueueValue {
	queueKey: string;
	createdAt: number;
}

export type QueueConfig = {
	expire?: number;
};
