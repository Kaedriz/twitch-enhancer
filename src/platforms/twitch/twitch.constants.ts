import type { TwitchSettings } from "$types/platforms/twitch/twitch.settings.types.ts";

export const TWITCH_DEFAULT_SETTINGS: TwitchSettings = {
	chatImagesEnabled: false,
	chatImagesOnHover: false,
	chatImagesSize: 15,
	chatBadgesEnabled: true,
	chatNicknameCustomizationEnabled: true,
	chatMessageMenuEnabled: true,
	pinnedStreamers: [],
	quickAccessLinks: [
		{ title: "TwitchTracker", url: "https://twitchtracker.com/%username%" },
		{ title: "Sullygnome", url: "https://sullygnome.com/channel/%username%" },
		{ title: "Emotes", url: "https://emotes.enhancer.at/?username=%username%" },
	],
	streamLatencyEnabled: true,
	realVideoTimeEnabled: true,
	pinnedStreamersEnabled: true,
	xayoWatchtimeEnabled: true,
};
