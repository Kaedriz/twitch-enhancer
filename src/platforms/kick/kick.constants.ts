import type { KickSettings } from "$types/platforms/kick/kick.settings.types.ts";

export const KICK_DEFAULT_SETTINGS: KickSettings = {
	chatImagesEnabled: false,
	chatImagesOnHover: false,
	chatImagesSize: 15,
	quickAccessLinks: [{ title: "Streams Charts", url: "https://streamscharts.com/channels/%username%?platform=kick" }],
};

export const KICK_LIVE_VIDEO_DURATION = 1073741824;
