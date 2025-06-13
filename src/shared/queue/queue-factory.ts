import {QueueConfig, QueueValue} from "$types/shared/queue.types.ts";
import Queue from "$shared/queue/queue.ts";

export default class QueueFactory<T extends QueueValue> {
	create(config: QueueConfig) {
		return new Queue<T>(config);
	}
}
