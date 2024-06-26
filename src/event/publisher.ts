import { TypedEmitter } from "tiny-typed-emitter";
import type { ModuleEvent } from "./types.ts";

interface PublisherInterface {
	// biome-ignore lint/suspicious/noExplicitAny: idk
	"module:event": (name: ModuleEvent, event: any) => void;
}

export default class Publisher extends TypedEmitter<PublisherInterface> {
	run() {
		setInterval(() => this.emit("module:event", "seek", {}), 1000);
		return this;
	}
}
