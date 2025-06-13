import Queue from "$shared/queue/queue.ts";
import type { QueueConfig, QueueValue } from "$types/shared/queue.types.ts";

export default class QueueFactory<T extends QueueValue> {
	create(config: QueueConfig) {
		return new Queue<T>(config);
	}
}
