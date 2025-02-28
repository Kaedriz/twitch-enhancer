import type Logger from "logger";
import type Module from "module/core/module.ts";

export default class ModuleApplier {
	constructor(protected readonly logger: Logger) {}

	async apply(module: Module) {
		throw new Error("Not implemented");
	}
}
