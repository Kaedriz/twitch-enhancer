export type ExtensionConfig = {
	version: string;
	mode: ExtensionMode;
	platform: Platform;
};

export type ExtensionMode = "production" | "development";
export type Platform = "twitch" | "kick";

declare global {
	interface Window {
		enhancer: ExtensionConfig;
	}
}
