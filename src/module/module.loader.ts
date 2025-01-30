import type Logger from "logger";
import type Module from "module/module.ts";
import Utils from "utils/utils.ts";

export default abstract class ModuleLoader {
	static readonly APPLIER_INTERVAL_TIME = 1000;

	constructor(private readonly logger: Logger) {}

	abstract getModules(logger: Logger, utils: Utils): Module[];

	async load() {
		const modules = this.getModules(this.logger, new Utils());
		this.logger.info(`Loaded ${modules.length} modules`);
		await this.initializeModules(modules);
	}

	private async initializeModules(modules: Module[]) {
		for (const module of modules) {
			await module.initialize();
			this.logger.info(`${module.name()} module has been initialized`);
		}
	}
}
