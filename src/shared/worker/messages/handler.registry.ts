import type { WorkerAction } from "$types/shared/worker.types.ts";
import type { MessageHandler } from "$shared/worker/messages/message.handler.ts";
import { PingHandler } from "$shared/worker/messages/ping.handler.ts";
import { AssetsFileHandler } from "$shared/worker/messages/assets-file.handler.ts";
import type { Logger } from "$shared/logger/logger.ts";

export class HandlerRegistry {
	private handlers = new Map<WorkerAction, MessageHandler>();

	constructor(private readonly logger: Logger) {
		this.registerHandlers();
	}

	private registerHandlers() {
		this.handlers.set("ping", new PingHandler(this.logger));
		this.handlers.set("getAssetsFile", new AssetsFileHandler(this.logger));
	}

	getHandler(action: WorkerAction): MessageHandler {
		const handler = this.handlers.get(action);
		if (!handler) {
			throw new Error(`Unknown action: ${action}`);
		}
		return handler;
	}

	hasHandler(action: string): action is WorkerAction {
		return this.handlers.has(action as WorkerAction);
	}
}
