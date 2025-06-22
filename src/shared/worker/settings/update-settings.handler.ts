import type { Logger } from "$shared/logger/logger.ts";
import { MessageHandler } from "$shared/worker/message.handler.ts";
import type { SettingsService } from "$shared/worker/settings/settings-worker.service.ts";
import type { UpdateSettingsPayload, UpdateSettingsResponse } from "$types/shared/worker/worker.types.ts";

export class UpdateSettingsHandler extends MessageHandler {
	constructor(
		logger: Logger,
		private readonly settingsService: SettingsService,
	) {
		super(logger);
	}

	async handle(payload: UpdateSettingsPayload): Promise<UpdateSettingsResponse> {
		if (!payload || !payload.platform || !payload.settings) {
			throw new Error("Invalid payload for updateSettings action. 'platform' and 'settings' are required.");
		}

		if (!["kick", "twitch"].includes(payload.platform)) {
			throw new Error("Invalid platform. Must be 'kick' or 'twitch'.");
		}

		this.logger.debug(`Updating settings for platform: ${payload.platform}`);
		await this.settingsService.updateSettings(payload.platform, payload.settings);
		return { success: true };
	}
}
