import type { KickSettings } from "$types/platforms/kick/kick.settings.types.ts";

export const KICK_DEFAULT_SETTINGS: KickSettings = {
	chatImagesEnabled: false,
	chatImagesOnHover: false,
	chatImagesSize: 15,
	quickAccessLinks: [
		{ title: "TwitchTracker", url: "https://twitchtracker.com/%username%" },
		{ title: "Sullygnome", url: "https://sullygnome.com/channel/%username%" },
	],
};
