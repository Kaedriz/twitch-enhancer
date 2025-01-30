import Logger from "logger";
import type ModuleLoader from "module/module.loader.ts";
import type { ExtensionConfig } from "types/extension.ts";

export default abstract class Extension {
	protected readonly logger = new Logger(true);
	protected abstract moduleLoader: ModuleLoader;

	constructor(private readonly config: ExtensionConfig) {}

	async start() {
		this.logger.info(`Started extension at ${this.config.platform}`);
		await this.loadModules();
	}

	async loadModules() {
		await this.moduleLoader.load();
	}
}
