export type EnhancerMetadata = {
	version: string;
};

export type ExtensionMode = "production" | "development";

export type Platform = "twitch" | "kick";

declare global {
	interface Window {
		enhancer: EnhancerMetadata;
	}
}
