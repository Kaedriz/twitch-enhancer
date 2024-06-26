import Publisher from "./event/publisher.ts";
import Logger from "./logger/logger.ts";
import getModules from "./module/twitch/modules.ts";
import type { EnhancerMetadata } from "./types.ts";

(() => {
	if (window.enhancerMetadata) return;
	window.enhancerMetadata = { version: __version__ };

	const logger = new Logger();
	logger.info(`Initialized v${__version__}`);

	const publisher = new Publisher().run();

	const modules = getModules(logger);

	publisher.on("module:event", (name, event) => {
		//TODO Create record for it
		logger.debug(name);
		modules
			.filter((module) => module.config.event === name)
			.forEach(async (module) => {
				try {
					if (await module.canRun(event)) {
						logger.info(`Running module ${module.getId()}`);
						await module.run(event);
					}
				} catch (error) {
					logger.info(`Module ${module.getId()} thrown an error:`, error);
				}
			});
	});
})();

declare global {
	interface Window {
		enhancerMetadata: EnhancerMetadata;
	}
}

declare const __version__: string;
