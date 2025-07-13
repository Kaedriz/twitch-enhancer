import { Logger } from "$shared/logger/logger.ts";
import { SettingsDatabase } from "$shared/worker/settings/settings.database.ts";
import type { PlatformType } from "$types/shared/platform.types.ts";
import type { PlatformSettings } from "$types/shared/worker/settings-worker.types.ts";

export class SettingsService {
	private readonly logger = new Logger({ context: "settings-service" });
	private readonly database = new SettingsDatabase();

	async initialize(): Promise<void> {
		await this.database.initialize();
		this.logger.info("Settings service initialized");
	}

	async getSettings(platform: PlatformType): Promise<PlatformSettings> {
		return await this.database.getSettings(platform);
	}

	async updateSettings(platform: PlatformType, settings: PlatformSettings): Promise<void> {
		await this.database.updateSettings(platform, settings);
		this.logger.debug(`Updated settings on ${platform} to`, settings);
	}
}
