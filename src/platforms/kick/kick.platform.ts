import type KickModule from "$kick/kick.module.ts";
import KickUtils from "$kick/kick.utils.ts";
import ChatAttachmentsModule from "$kick/modules/chat-attachments/chat-attachments.module.ts";
import ChatModule from "$kick/modules/chat/chat.module.ts";
import ExampleModule from "$kick/modules/example/example.module.ts";
import Platform from "$shared/platform/platform.ts";
import type { KickEvents } from "$types/platforms/kick/kick.events.types.ts";
import type { KickStorage } from "$types/platforms/kick/kick.storage.types.ts";

export default class KickPlatform extends Platform<KickModule, KickEvents, KickStorage> {
	constructor() {
		super({ type: "kick" });
	}

	protected readonly kickUtils = new KickUtils(this.utilsRepository.reactUtils);

	protected getModules(): KickModule[] {
		const dependencies = [
			this.emitter,
			this.storageRepository,
			this.utilsRepository,
			this.enhancerApi,
			this.workerApi,
			this.kickUtils,
		] as const;
		return [
			new ExampleModule(...dependencies),
			new ChatModule(...dependencies),
			new ChatAttachmentsModule(...dependencies),
		];
	}
}
