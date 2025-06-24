import type SettingsService from "$shared/settings/settings.service.ts";
import type { PlatformSettings } from "$types/shared/worker/settings-worker.types.ts";
import { type Signal, signal } from "@preact/signals";

export class ImageChatAttachmentConfig {
	readonly maxFileSize: Signal<number> = signal(1);
	readonly imagesOnHover: Signal<boolean> = signal(true);
	readonly isEnabled: Signal<boolean> = signal(false);
	readonly callback: () => void;

	constructor(
		private settingsService: SettingsService<PlatformSettings>,
		callback: () => void,
	) {
		this.callback = callback;
	}

	async initialize() {
		this.maxFileSize.value = await this.settingsService.getSettingsKey("chatImagesSize");
		this.imagesOnHover.value = await this.settingsService.getSettingsKey("chatImagesOnHover");
		this.isEnabled.value = await this.settingsService.getSettingsKey("chatImagesEnabled");
	}

	updateMaxFileSize(size: number) {
		this.maxFileSize.value = size;
	}

	updateImagesOnHover(enabled: boolean) {
		this.imagesOnHover.value = enabled;
	}

	updateEnabled(enabled: boolean) {
		this.isEnabled.value = enabled;
	}
}
