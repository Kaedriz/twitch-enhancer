import type Logger from "logger";
import type { ModuleConfig } from "types/module/module.ts";
import type Utils from "utils/utils.ts";

export default abstract class Module {
	abstract config: ModuleConfig;

	constructor(
		protected readonly logger: Logger,
		protected readonly utils: Utils,
	) {}

	async initialize() {}

	name() {
		return this.config.name;
	}
}
