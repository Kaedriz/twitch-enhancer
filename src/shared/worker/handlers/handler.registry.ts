import type { Logger } from "$shared/logger/logger.ts";
import { AddWatchtimeHandler } from "$shared/worker/handlers/add-watchtime.handler.ts";
import { AssetsFileHandler } from "$shared/worker/handlers/assets-file.handler.ts";
import { GetWatchtimeHandler } from "$shared/worker/handlers/get-watchtime.handler.ts";
import type { MessageHandler } from "$shared/worker/handlers/message.handler.ts";
import { PingHandler } from "$shared/worker/handlers/ping.handler.ts";
import type { WatchtimeService } from "$shared/worker/watchtime/watchtime.service.ts";
import type { WorkerAction } from "$types/shared/worker.types.ts";

export class HandlerRegistry {
	private handlers = new Map<WorkerAction, MessageHandler>();

	constructor(
		private readonly logger: Logger,
		private readonly watchtimeService: WatchtimeService,
	) {
		this.registerHandlers();
	}

	private registerHandlers() {
		this.handlers.set("ping", new PingHandler(this.logger));
		this.handlers.set("getAssetsFile", new AssetsFileHandler(this.logger));
		this.handlers.set("addWatchtime", new AddWatchtimeHandler(this.logger, this.watchtimeService));
		this.handlers.set("getWatchtime", new GetWatchtimeHandler(this.logger, this.watchtimeService));
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
