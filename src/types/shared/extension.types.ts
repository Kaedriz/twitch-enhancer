import type { PlatformType } from "$types/shared/platform.types.ts";

export type ExtensionEnvironment = "production" | "development";

export type ExtensionMetadata = {
	version: string;
	environment: ExtensionEnvironment;
	platform: PlatformType;
};
