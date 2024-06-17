import Logger from "./logger/logger.ts";
import getModules from "./module/twitch/modules.ts";
import type { EnhancerMetadata } from "./types.ts";

(() => {
	if (window.enhancerMetadata) return;
	window.enhancerMetadata = { version: "4.0.0" };

	const logger = new Logger();
	logger.info("Enhancer has been loaded");

	setInterval(() => {
		getModules(logger).forEach(async (module) => {
			if (await module.canRun()) {
				logger.info(`Running: ${module.name}`);
				await module.run();
			}
		});
	}, 1000);
})();

declare global {
	interface Window {
		enhancerMetadata: EnhancerMetadata;
	}
}
