import type { Logger } from "$shared/logger/logger.ts";
import { MessageHandler } from "$shared/worker/message.handler.ts";
import type { WatchtimeService } from "$shared/worker/watchtime/watchtime.service.ts";
import type { AddWatchtimePayload, WatchtimeResponse } from "$types/shared/worker/worker.types.ts";

export class AddWatchtimeHandler extends MessageHandler {
	constructor(
		logger: Logger,
		private readonly watchtimeService: WatchtimeService,
	) {
		super(logger);
	}

	async handle(payload: AddWatchtimePayload): Promise<WatchtimeResponse | null> {
		if (!payload || !payload.channel || !payload.platform) {
			throw new Error("Invalid payload for watchWatchtime action. 'platform' and 'channel' are required.");
		}
		if (!["kick", "twitch"].includes(payload.platform)) {
			throw new Error("Invalid platform. Must be 'kick' or 'twitch'.");
		}
		this.logger.debug(`Starting to watch ${payload.platform} channel: ${payload.channel}`);
		return await this.watchtimeService.watchChannel(payload.platform, payload.channel);
	}
}
