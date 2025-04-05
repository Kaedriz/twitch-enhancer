import type { ExtensionConfig, ExtensionEnvironment } from "types/content/extension.ts";
import Extension from "./extension.ts";

(async () => {
	if (window.enhancer) return;
	const version = __version__;
	const environment = __environment__;
	const config: ExtensionConfig = {
		version,
		environment,
		platform: "twitch",
	};
	window.enhancer = config;
	await new Extension(config).start();
})();

declare global {
	const __version__: string;
	const __environment__: ExtensionEnvironment;
}
