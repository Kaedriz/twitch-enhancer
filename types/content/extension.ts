export type ExtensionConfig = {
	version: string;
	environment: ExtensionEnvironment;
	platform: Platform;
};

export type ExtensionEnvironment = "production" | "development";
export type Platform = "twitch" | "kick";

declare global {
	interface Window {
		enhancer: ExtensionConfig;
	}
}
