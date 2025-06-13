import type { QueueConfig, QueueValue } from "$types/shared/queue.types.ts";

export default class Queue<Value extends QueueValue> {
	private queue = new Map<string, Value>();

	constructor(private readonly config: QueueConfig) {}

	add(key: string, value: Value) {
		this.clearExpired();
		this.queue.set(key, value);
	}

	addByValue(value: Value) {
		this.clearExpired();
		this.queue.set(value.queueKey, value);
	}

	get(key: string) {
		this.clearExpired();
		return this.queue.get(key);
	}

	getAndRemove(key: string) {
		this.clearExpired();
		const value = this.queue.get(key);
		this.queue.delete(key);
		return value;
	}

	remove(key: string) {
		this.queue.delete(key);
	}

	contains(key: string) {
		this.clearExpired();
		return this.queue.has(key);
	}

	values() {
		this.clearExpired();
		return [...this.queue.values()];
	}

	keys() {
		this.clearExpired();
		return [...this.queue.keys()];
	}

	private clearExpired() {
		if (!this.config.expire) return;

		const now = Date.now();
		const expire = this.config.expire * 1000;

		for (const value of this.queue.values()) {
			if (now > value.createdAt + expire) {
				this.queue.delete(value.queueKey);
			}
		}
	}
}
