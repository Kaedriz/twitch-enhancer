import type { QueueConfig, QueueValue } from "types/shared/queue/queue.types.ts";
import Queue from "./queue.ts";

export default class QueueFactory<T extends QueueValue> {
	create(config: QueueConfig) {
		return new Queue<T>(config);
	}
}
