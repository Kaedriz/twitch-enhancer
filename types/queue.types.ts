/**
 * @property {number} expire - Expire time of object in seconds
 */
export type QueueConfig = {
	expire?: number;
};

export type QueueValue = {
	queueKey: string;
	createdAt: number;
};
