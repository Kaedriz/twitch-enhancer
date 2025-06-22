import type { TwitchSettings } from "$types/platforms/twitch/twitch.settings.types.ts";
import type { PlatformType } from "$types/shared/platform.types.ts";

export type PlatformSettings = TwitchSettings;

export interface SettingsRecord {
	id: string;
	platform: PlatformType;
	settings: PlatformSettings;
	lastUpdate: number;
}
