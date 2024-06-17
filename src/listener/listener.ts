import type { Platform } from "../platform/types.ts";
import type { ListenerName } from "./listener.name.ts";

export default abstract class Listener<T> {
	constructor(
		readonly name: ListenerName,
		readonly platform: Platform,
		private readonly callbacks: ((data: T) => void)[],
	) {}

	registerCallback(callback: (data: T) => void) {
		this.callbacks.push(callback);
	}

	emit(data: T) {
		this.callbacks.forEach((callback) => callback(data));
	}
}
