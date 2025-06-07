import type { ExtensionEnvironment } from "$types/shared/extension.types.ts";

declare global {
	const __version__: string;
	const __environment__: ExtensionEnvironment;
}
