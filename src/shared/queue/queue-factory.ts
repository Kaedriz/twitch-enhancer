import type { QueueValue } from "$types/shared/queue/queue.types.ts";

interface QueueOptions {
	expire?: number;
}

interface Queue<T extends QueueValue> {
	addByValue(value: T): void;
	getAndRemove(key: string): T | undefined;
}

export default class QueueFactory<T extends QueueValue> {
	create(options: QueueOptions = {}): Queue<T> {
		const queue = new Map<string, { value: T; timestamp: number }>();
		const expire = options.expire ?? 0;

		return {
			addByValue(value: T) {
				const key = value.queueKey;
				queue.set(key, { value, timestamp: Date.now() });
			},

			getAndRemove(key: string): T | undefined {
				const item = queue.get(key);
				if (!item) return undefined;

				if (expire > 0 && Date.now() - item.timestamp > expire) {
					queue.delete(key);
					return undefined;
				}

				queue.delete(key);
				return item.value;
			},
		};
	}
} 