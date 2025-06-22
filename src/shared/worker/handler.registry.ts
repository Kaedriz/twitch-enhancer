import type { Logger } from "$shared/logger/logger.ts";
import { AssetsFileHandler } from "$shared/worker/file/assets-file.handler.ts";
import type { MessageHandler } from "$shared/worker/message.handler.ts";
import { PingHandler } from "$shared/worker/ping/ping.handler.ts";
import { GetSettingsHandler } from "$shared/worker/settings/get-settings.handler.ts";
import type { SettingsService } from "$shared/worker/settings/settings-worker.service.ts";
import { UpdateSettingsHandler } from "$shared/worker/settings/update-settings.handler.ts";
import { AddWatchtimeHandler } from "$shared/worker/watchtime/add-watchtime.handler.ts";
import { GetWatchtimeHandler } from "$shared/worker/watchtime/get-watchtime.handler.ts";
import type { WatchtimeService } from "$shared/worker/watchtime/watchtime.service.ts";
import type { WorkerAction } from "$types/shared/worker/worker.types.ts";

export class HandlerRegistry {
	private handlers = new Map<WorkerAction, MessageHandler>();

	constructor(
		private readonly logger: Logger,
		private readonly watchtimeService: WatchtimeService,
		private readonly settingsService: SettingsService,
	) {
		this.registerHandlers();
	}

	private registerHandlers() {
		this.handlers.set("ping", new PingHandler(this.logger));
		this.handlers.set("getAssetsFile", new AssetsFileHandler(this.logger));
		this.handlers.set("addWatchtime", new AddWatchtimeHandler(this.logger, this.watchtimeService));
		this.handlers.set("getWatchtime", new GetWatchtimeHandler(this.logger, this.watchtimeService));
		this.handlers.set("getSettings", new GetSettingsHandler(this.logger, this.settingsService));
		this.handlers.set("updateSettings", new UpdateSettingsHandler(this.logger, this.settingsService));
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
