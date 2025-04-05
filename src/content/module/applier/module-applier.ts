import type Logger from "../../../shared/logger/logger.ts";
import type Module from "../module.ts";

export default class ModuleApplier {
	constructor(protected readonly logger: Logger) {}

	async apply(module: Module) {
		throw new Error("Not implemented");
	}
}
