import { MessageHandler } from "$shared/worker/message.handler.ts";
import type { PingResponse } from "$types/shared/worker/worker.types.ts";

export class PingHandler extends MessageHandler {
	async handle(): Promise<PingResponse> {
		this.logger.debug("Received ping, sending pong.");
		return {
			status: "alive",
			timestamp: Date.now(),
			message: "Background worker is running",
		};
	}
}
