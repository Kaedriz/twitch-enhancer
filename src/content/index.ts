import type { ExtensionConfig, ExtensionEnvironment, Platform } from "types/content/extension.ts";
import Extension from "./extension.ts";

(async () => {
	if (window.enhancer) return;
	const version = __version__;
	const environment = __environment__;
	const config: ExtensionConfig = {
		version,
		environment,
		platform: getPlatform(),
	};
	window.enhancer = config;
	await new Extension(config).start();
})();

declare global {
	const __version__: string;
	const __environment__: ExtensionEnvironment;
}

function getPlatform(): Platform {
	const hostname = window.location.hostname.toLowerCase();
	if (hostname.endsWith("twitch.tv")) return "twitch";
	if (hostname.endsWith("kick.com")) return "kick";
	throw Error(`Unsupported host name ${hostname} (${window.location.href})`);
}
