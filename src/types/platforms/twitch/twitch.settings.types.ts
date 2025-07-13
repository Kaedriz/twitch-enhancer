import type { QuickAccessLink } from "$types/shared/components/settings.component.types.ts";

export type TwitchSettings = {
	chatImagesEnabled: boolean;
	chatImagesOnHover: boolean;
	chatImagesSize: number;
	chatBadgesEnabled: boolean;
	chatNicknameCustomizationEnabled: boolean;
	quickAccessLinks: QuickAccessLink[];
	pinnedStreamers: string[];
};

export type TwitchSettingsEvents = {
	[K in keyof TwitchSettings as `twitch:settings:${K & string}`]: (value: TwitchSettings[K]) => void | Promise<void>;
};
