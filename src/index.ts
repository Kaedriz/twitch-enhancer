import type { ExtensionConfig, ExtensionMode } from "types/extension.ts";
import Extension from "./extension.ts";
import TwitchExtension from "./twitch/twitch-extension.ts";

(() => {
	if (window.enhancer) return;
	const version = __version__;
	const mode = __mode__;
	const config: ExtensionConfig = {
		version,
		mode,
		platform: "twitch",
	};
	window.enhancer = config;
	const extension = new TwitchExtension(config);
	extension.start();
})();

declare const __version__: string;
declare const __mode__: ExtensionMode;
