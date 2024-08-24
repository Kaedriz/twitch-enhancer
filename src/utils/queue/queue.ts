import type { QueueConfig, QueueValue } from "utils/queue/types.ts";

export default class Queue<Value extends QueueValue> {
	private queue = new Map<string, Value>();
	private expireTimer: Timer | undefined;

	constructor(private readonly config: QueueConfig) {
		if (config.expire) {
			this.expireTimer = setInterval(() => this.clearExpired(), 1000);
		}
	}

	add(key: string, value: Value) {
		this.queue.set(key, value);
	}

	addByValue(value: Value) {
		this.queue.set(value.queueKey, value);
	}

	get(key: string) {
		return this.queue.get(key);
	}

	getAndRemove(key: string) {
		const value = this.queue.get(key);
		this.queue.delete(key);
		return value;
	}

	remove(key: string) {
		this.queue.delete(key);
	}

	contains(key: string) {
		return this.queue.has(key);
	}

	values() {
		return [...this.queue.values()];
	}

	keys() {
		return [...this.queue.keys()];
	}

	private clearExpired() {
		const now = Date.now();
		const expire = (this.config.expire ?? 60) * 1000;
		for (const value of this.queue.values()) {
			if (now > value.createdAt + expire) this.queue.delete(value.queueKey);
		}
	}
}
