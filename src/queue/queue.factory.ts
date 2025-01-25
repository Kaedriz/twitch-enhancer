import type { QueueConfig, QueueValue } from "types/utils/queue";
import Queue from "./queue.ts";

export default class QueueFactory<T extends QueueValue> {
	create(config: QueueConfig) {
		return new Queue<T>(config);
	}
}
