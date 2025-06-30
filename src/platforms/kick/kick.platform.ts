import type KickModule from "$kick/kick.module.ts";
import KickUtils from "$kick/kick.utils.ts";
import ChatAttachmentsModule from "$kick/modules/chat-attachments/chat-attachments.module.ts";
import ChatBadgesModule from "$kick/modules/chat-badges/chat-badges.module.tsx";
import ChatModule from "$kick/modules/chat/chat.module.ts";
import ExampleModule from "$kick/modules/example/example.module.ts";
import NicknameCustomizationModule from "$kick/modules/nickname-customization/nickname-customization.module.ts";
import RealVideoTimeModule from "$kick/modules/real-video-time/real-video-time.module.tsx";
import SettingsButtonModule from "$kick/modules/settings-button/settings-button.module.tsx";
import SettingsModule from "$kick/modules/settings/settings.module.tsx";
import Platform from "$shared/platform/platform.ts";
import type { KickEvents } from "$types/platforms/kick/kick.events.types.ts";
import type { KickSettings } from "$types/platforms/kick/kick.settings.types.ts";
import type { KickStorage } from "$types/platforms/kick/kick.storage.types.ts";

export default class KickPlatform extends Platform<KickModule, KickEvents, KickStorage, KickSettings> {
	constructor() {
		super({ type: "kick" });
	}

	protected readonly kickUtils = new KickUtils(this.utilsRepository.reactUtils);

	protected getModules(): KickModule[] {
		const dependencies = [
			this.emitter,
			this.storageRepository,
			this.settingsService,
			this.utilsRepository,
			this.enhancerApi,
			this.workerApi,
			this.kickUtils,
		] as const;
		return [
			new ExampleModule(...dependencies),
			new ChatModule(...dependencies),
			new ChatAttachmentsModule(...dependencies),
			new ChatBadgesModule(...dependencies),
			new SettingsButtonModule(...dependencies),
			new SettingsModule(...dependencies),
			new NicknameCustomizationModule(...dependencies),
			new RealVideoTimeModule(...dependencies),
		];
	}
}
