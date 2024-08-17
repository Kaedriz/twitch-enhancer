import Extension from "./extension.ts";
import type { ExtensionMode } from "./types.ts";

(() => {
	if (window.enhancer) return;
	const version = __version__;
	const mode = __mode__;
	window.enhancer = { version };
	const extension = new Extension("twitch", version, mode);
	extension.start();
})();

declare const __version__: string;
declare const __mode__: ExtensionMode;
