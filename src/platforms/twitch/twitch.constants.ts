import type { TwitchSettings } from "$types/platforms/twitch/twitch.settings.types.ts";

export const TWITCH_DEFAULT_SETTINGS: TwitchSettings = {
	chatImagesEnabled: false,
	chatImagesOnHover: false,
	chatImagesSize: 15,
	chatBadgesEnabled: true,
	chatNicknameCustomizationEnabled: true,
	quickAccessLinks: [
		{ title: "TwitchTracker", url: "https://twitchtracker.com/%username%" },
		{ title: "Sullygnome", url: "https://sullygnome.com/channel/%username%" },
	],
};
